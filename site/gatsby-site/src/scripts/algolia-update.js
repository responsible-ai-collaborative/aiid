/**
 * Updates Algolia indexes without Gatsby build
 * Run with `node ./src/scripts/algolia-update.js`
 */

require('dotenv').config();

const config = require('../../config');

const algoliasearch = require('algoliasearch');

const AlgoliaUpdater = require('../utils/AlgoliaUpdater');

const { MongoClient } = require('mongodb');

const { getLanguages } = require('../../i18n');

const reporter = { log: console.log };

(async () => {
  console.log('Updating Algolia indexes...');

  const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

  const languages = getLanguages();

  const algoliaClient = algoliasearch(
    config.header.search.algoliaAppId,
    config.header.search.algoliaAdminKey
  );

  const algoliaUpdater = new AlgoliaUpdater({ languages, mongoClient, algoliaClient, reporter });

  await algoliaUpdater.run();

  console.log('Done');

  process.exit(0);
})();
