const path = require('path');

const fs = require('fs');

const util = require('util');

const readFile = util.promisify(fs.readFile);

const readdir = util.promisify(fs.readdir);

const createMissingTranslationsPage = async (graphql, createPage) => {
  let allLocales = [];

  const locales = await readdir('./i18n/locales/');

  allLocales = locales;

  const translationEntries = [];

  for (const locale of locales) {
    const files = await readdir('./i18n/locales/' + locale);

    for (const file of files) {
      const json = await readFile(`./i18n/locales/${locale}/${file}`, 'utf8');

      const data = JSON.parse(json);

      for (const key of Object.keys(data)) {
        const translation = data[key];

        translationEntries.push({ locale, file, key, translation });
      }
    }
  }

  createPage({
    path: '/meta/i18n',
    component: path.resolve('./src/templates/missingTranslations.js'),
    context: { allLocales, translationEntries },
  });
};

module.exports = createMissingTranslationsPage;
