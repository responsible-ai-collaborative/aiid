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

    // if the mdxFile path possesses a language, let's strip the language to it
    // ex: index.de.mdx ==> index.mdx
    if (mdxFile) {
      //split the filename in three parts split by the dot.
      let [thePath /* lang */, , ext] = mdxFile.split(`.`);

      if (ext === `mdx`) {
        //if there's data in the third part, just keep the first and last part, removing the language
        theFilePath = `${thePath}.${ext}`;
      } else {
        //if there's no content in the third part, it means that there's no language part. No need to remove the language
        theFilePath = mdxFile;
      }

      //if we use a non-default language, and the language file is on the disk, then use it
      [thePath, ext] = theFilePath.split(`.`);
      if (ext === `mdx` && locale.code !== defaultLang) {
        if (fs.existsSync(`${thePath}.${locale.code}.${ext}`)) {
          theFilePath = `${thePath}.${locale.code}.${ext}`;
        } else {
          //nothing to render if file doen't exist
          theFilePath = '';
        }
      }

      theFilePath = `${template}?__contentFilePath=${theFilePath}`;
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
