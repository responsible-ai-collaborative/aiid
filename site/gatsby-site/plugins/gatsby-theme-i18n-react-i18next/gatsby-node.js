const path = require(`path`);

let didRunAlready = false;

let absoluteLocalesDirectory;

exports.onPreInit = ({ store }, { locales }) => {
  // locales must be defined, no default option will be defined
  if (!locales) {
    throw new Error(`
      Please define the 'locales' option of gatsby-theme-i18n-react-i18next
    `);
  }

  if (didRunAlready) {
    throw new Error(
      `You can only have single instance of gatsby-theme-i18n-react-i18next in your gatsby-config.js`
    );
  }

  didRunAlready = true;
  absoluteLocalesDirectory = path.join(store.getState().program.directory, locales);
};

exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        GATSBY_THEME_I18N_REACT_I18NEXT: JSON.stringify(absoluteLocalesDirectory),
      }),
    ],
  });
};
