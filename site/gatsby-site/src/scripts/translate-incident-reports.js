/**
 * Invokes translation process without Gatsby build
 * Run with `node ./src/scripts/translate-incident-reports.js`
 */

require('dotenv').config();

const config = require('../../config');

const { MongoClient } = require('mongodb');

const { Translate } = require('@google-cloud/translate').v2;

const Translator = require('../utils/Translator');

const languagesConfig = require('../../i18n/config.json');

const reporter = { log: console.log };

(async () => {
  console.log('Translating incident reports...');

  const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

  const translateClient = new Translate({ key: config.i18n.translateApikey });

  const languages = languagesConfig.map((l) => l.code);

  const translator = new Translator({
    mongoClient,
    translateClient,
    languages,
    reporter,
  });

  await translator.run();

  console.log('Done');

  process.exit(0);
})();
