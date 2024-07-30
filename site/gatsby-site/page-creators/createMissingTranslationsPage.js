const path = require('path');

const fs = require('fs');

const util = require('util');

const readFile = util.promisify(fs.readFile);

const readdir = util.promisify(fs.readdir);

const createMissingTranslationsPage = async (graphql, createPage) => {
  const translations = {};

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
        translations[file] ||= {};
        translations[file][key] ||= {};
        translations[file][key][locale] = data[key];
      }
    }
  }

  const duplicateTranslations = {};


  for (const file of Object.keys(translations)) {
    for (const key of Object.keys(translations[file])) {

    }
  }


  const missingTranslations = {};

  for (const file of Object.keys(translations)) {
    for (const key of Object.keys(translations[file])) {
      const localesWithTranslations = Object.keys(translations[file][key]);

      if (localesWithTranslations.length < allLocales.length) {
        missingTranslations[file] ||= {};
        missingTranslations[file][key] ||= translations[file][key];
      }
    }
  }

  // TODO: Check if missing translation is in some other file

  createPage({
    path: '/meta/i18n',
    component: path.resolve('./src/templates/missingTranslations.js'),
    context: { missingTranslations, allLocales },
  });
};

module.exports = createMissingTranslationsPage;
