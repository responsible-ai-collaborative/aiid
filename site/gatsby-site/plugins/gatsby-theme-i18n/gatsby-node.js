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
    const name = path.basename(node.fileAbsolutePath ?? node.internal.contentFilePath, `.mdx`);

    const isDefault = name === `index`;

    const lang = isDefault ? defaultLang : name.split(`.`)[1] ?? defaultLang;

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

  let originalPath = page.path;

  deletePage(page);

  const configLocales = require(configPath);

  const languages = getLanguages({ locales: configLocales, localeStr: locales });

  const defaultLocale = getDefaultLanguage({
    locales: configLocales,
    defaultLang,
  });

  if (
    page.component.toLowerCase().endsWith(`.mdx`) &&
    !page.component.includes('?__contentFilePath=')
  ) {
    const name = path.basename(page.component, `.mdx`);

    const parts = name.split(`.`);

    let code = defaultLang;

    // if a non-default language, (ex: "page.fr.mdx")
    // then delete the .fr part, so it becomes "page.mdx"
    // (later below, we will rename this to "fr/page.mdx")
    if (parts.length > 1) {
      code = parts.at(-1);
      originalPath = originalPath.replace(`.${code}`, ``);
      if (originalPath.endsWith('index/')) {
        originalPath = originalPath.replace('index/', '');
      }
    }

    //
    //if not a supported language, just return.
    //the page will not be exposed
    let locale = languages.find((lang) => lang.code === code);

    if (!locale) {
      return;
    }

    const newPage = {
      component: page.component,
      path: localizedPath({
        defaultLang,
        prefixDefault,
        locale: code,
        path: originalPath,
      }),
      matchPath: page.matchPath
        ? localizedPath({
            defaultLang,
            prefixDefault,
            locale: code,
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

    createPage(newPage);
    //mdx exits here.  all other pages will be handled next

    return;
  }

  languages.forEach((locale) => {
    let theFilePath = page.component;

    const [template, mdxFile] = page.component.split(`?__contentFilePath=`);

    // Process the mdxFile if it exists
    if (mdxFile) {
      const directory = path.dirname(mdxFile); // Get the directory path

      const fileName = path.basename(mdxFile, `.mdx`); // Extract the file name without `.mdx`

      const ext = path.extname(mdxFile); // Get the file extension

      if (ext !== `.mdx`) {
        throw new Error(`Unexpected file extension in MDX path parsing: ${mdxFile}`);
      }

      // Extract the locale from the file name if present (e.g., "index.es" → "es")
      const nameParts = fileName.split(`.`);

      let baseName = nameParts[0]; // Default to the base name without locale

      // If it's a non-default language and the file exists, use the localized file
      if (locale.code !== defaultLang) {
        const localizedFile = path.join(directory, `${baseName}.${locale.code}${ext}`);

        if (fs.existsSync(localizedFile)) {
          theFilePath = `${template}?__contentFilePath=${localizedFile}`;
        } else {
          // If no localized file exists, use the default file
          theFilePath = `${template}?__contentFilePath=${path.join(
            directory,
            `${baseName}${ext}`
          )}`;
        }
      } else {
        // For the default language, strip the locale from the path if present
        theFilePath = `${template}?__contentFilePath=${path.join(directory, `${baseName}${ext}`)}`;
      }
    }

    const newPage = {
      component: theFilePath,
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
