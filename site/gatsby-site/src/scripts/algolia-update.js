/**
 * Updates Algolia indexes without Gatsby build
 * Run with `node ./src/scripts/algolia-update.js`
 */

require('dotenv').config();

const config = require('../../config');

const algoliasearch = require('algoliasearch');

const AlgoliaUpdater = require('../utils/AlgoliaUpdater');

const { MongoClient } = require('mongodb');

const languagesConfig = require('../../i18n/config.json');

const reporter = { log: console.log };

(async () => {
  console.log('Updating Algolia indexes...');

  const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

  const languages = languagesConfig.map((l) => l.code);

  const algoliaClient = algoliasearch(
    config.header.search.algoliaAppId,
    config.header.search.algoliaAdminKey
  );

  const algoliaUpdater = new AlgoliaUpdater({ languages, mongoClient, algoliaClient, reporter });

  await algoliaUpdater.run();

  console.log('Done');

  process.exit(0);
})();
