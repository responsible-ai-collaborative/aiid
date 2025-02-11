const path = require('path');

const fs = require('fs');

const util = require('util');

const readFile = util.promisify(fs.readFile);

const readdir = util.promisify(fs.readdir);

const Parser = require('i18next-scanner').Parser;

const createMissingTranslationsPage = async (graphql, createPage) => {
  // Find translation keys with i18next-scanner
  const parser = new Parser();

  const files = await readdir('src', { recursive: true });

  const jsFiles = [...files].filter((f) => f.endsWith('.js'));

  const scannerEntries = [];

  for (const file of jsFiles) {
    try {
      const handler = (key, { defaultValue, fallbackKey, ns }) => {
        scannerEntries.push({ key, defaultValue, fallbackKey, ns, file });
      };

      const content = fs.readFileSync('src' + path.sep + file, 'utf-8');

      // Parse Translation Function
      parser.parseFuncFromString(content, handler); // use default options and handler

      // Parse Trans component
      parser.parseTransFromString(content, handler); // use default options and handler
    } catch (error) {
      console.log(error);
    }
  }

  // Find the translations in our localization files
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
    context: { allLocales, translationEntries, scannerEntries },
  });
};

module.exports = createMissingTranslationsPage;
