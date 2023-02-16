const fs = require(`fs`);

const path = require(`path`);

const mkdirp = require(`mkdirp`);

const { withDefaults } = require(`./utils/default-options`);

const { localizedPath, getLanguages, getDefaultLanguage } = require(`./src/helpers`);

function writeFile(filePath, data, reporter) {
  // Check if config file already exists
  if (!fs.existsSync(filePath)) {
    // Create the necessary folders for the default config file
    mkdirp(path.dirname(filePath), (err) => {
      if (err) {
        reporter.panicOnBuild(
          `[gatsby-theme-i18n]: Failing to create the directory for the default config file\n\n${err}`
        );
        return;
      }

      // Create the default config file
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          reporter.panicOnBuild(
            `[gatsby-theme-i18n]: Failing to create a default config file\n\n${err}`
          );
          return;
        }

        reporter.info(`[gatsby-theme-i18n]: Created a default config file at ${filePath}`);
      });
    });
  }
}

exports.onPreBootstrap = ({ reporter, store }, themeOptions) => {
  const defaultContent = [
    {
      code: `en`,
      hrefLang: `en-US`,
      name: `English`,
      localName: `English`,
      langDir: `ltr`,
      dateFormat: `MM/DD/YYYY`,
    },
  ];

  const data = JSON.stringify(defaultContent);

  const { program } = store.getState();

  const defaultConfigPath = path.join(program.directory, `src/i18n/config.json`);

  if (themeOptions.configPath) {
    if (!fs.existsSync(themeOptions.configPath)) {
      reporter.panicOnBuild(
        `[gatsby-theme-i18n]: Couldn't find the file at ${themeOptions.configPath}`
      );
    }
    reporter.info(`[gatsby-theme-i18n]: Config file found at ${themeOptions.configPath}`);
  } else {
    writeFile(defaultConfigPath, data, reporter);
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type ThemeI18n implements Node {
      defaultLang: String
      prefixDefault: Boolean
      configPath: String
      config: [Locale]
    }
    
    type Locale {
      code: String
      hrefLang: String
      dateFormat: String
      langDir: String
      localName: String
      name: String
    }
  `);
};

exports.sourceNodes = ({ actions, createContentDigest, createNodeId }, themeOptions) => {
  const { createNode } = actions;

  const options = withDefaults(themeOptions);

  const config = require(options.configPath);

  const configNode = {
    ...options,
    config,
  };

  createNode({
    ...configNode,
    id: createNodeId(`gatsby-theme-i18n-config`),
    parent: null,
    children: [],
    internal: {
      type: `ThemeI18n`,
      contentDigest: createContentDigest(configNode),
      content: JSON.stringify(configNode),
      description: `Options for gatsby-theme-i18n`,
    },
  });
};

exports.onCreateNode = ({ node, actions }, themeOptions) => {
  const { createNodeField } = actions;

  const { defaultLang } = withDefaults(themeOptions);

  if (node.internal.type === `Mdx`) {
    const name = path.basename(node.fileAbsolutePath, `.mdx`);

    const isDefault = name === `index`;

    const lang = isDefault ? defaultLang : name.split(`.`)[1];

    createNodeField({ node, name: `locale`, value: lang });
    createNodeField({ node, name: `isDefault`, value: isDefault });
  }
};

exports.onCreatePage = ({ page, actions }, themeOptions) => {
  const { createPage, deletePage } = actions;

  const { configPath, defaultLang, locales, prefixDefault } = withDefaults(themeOptions);

  // Check if originalPath was already set and bail early as otherwise an infinite loop could occur
  // as other plugins like gatsby-plugin-mdx could modify this
  if (page.context.originalPath) {
    return;
  }

  const originalPath = page.path;

  deletePage(page);

  const configLocales = require(configPath);

  const languages = getLanguages({ locales: configLocales, localeStr: locales });

  const defaultLocale = getDefaultLanguage({
    locales: configLocales,
    defaultLang,
  });

  languages.forEach((locale) => {
    const newPage = {
      ...page,
      path: localizedPath({
        defaultLang,
        prefixDefault,
        locale: locale.code,
        path: originalPath,
      }),
      matchPath: page.matchPath
        ? localizedPath({
            defaultLang,
            prefixDefault,
            locale: locale.code,
            path: page.matchPath,
          })
        : page.matchPath,
      context: {
        ...page.context,
        locale: locale.code,
        hrefLang: locale.hrefLang,
        originalPath,
        dateFormat: locale.dateFormat,
      },
    };

    // Check if the page is a localized 404
    if (newPage.path.match(/^\/[a-z]{2}\/404\/$/)) {
      // Match all paths starting with this code (apart from other valid paths)
      newPage.matchPath = `/${locale.code}/*`;
    }

    createPage(newPage);
  });

  // When prefixDefault is set the default development & production 404 pages
  // will be deleted but not re-created in the above `languages.forEach` segment
  // Thus we'll re-create them manually here

  const notFoundPages = [`/404/`, `/404.html`, `/dev-404-page/`];

  if (prefixDefault) {
    if (notFoundPages.includes(originalPath)) {
      const newPage = {
        ...page,
        context: {
          ...page.context,
          locale: defaultLocale.code,
          hrefLang: defaultLocale.hrefLang,
          originalPath,
          dateFormat: defaultLocale.dateFormat,
        },
      };

      createPage(newPage);
    }
  }
};
