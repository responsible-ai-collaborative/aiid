const path = require('path');

const { MongoClient } = require('mongodb');

const AlgoliaUpdater = require('../src/utils/AlgoliaUpdater');

const algoliasearch = require('algoliasearch');

const languagesConfig = require('../i18n/config.json');

const config = require('../config');

const createDownloadIndexPage = async (_, createPage) => {
  const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

  const languages = languagesConfig.map((l) => l.code);

  const algoliaClient = algoliasearch(
    config.header.search.algoliaAppId,
    config.header.search.algoliaAdminKey
  );

  const reporter = { log: console.log };

  const algoliaUpdater = new AlgoliaUpdater({ languages, mongoClient, algoliaClient, reporter });

  const data = await algoliaUpdater.generateIndex({ language: 'en' });

  createPage({
    path: '/downloadIndex',
    component: path.resolve('./src/templates/downloadIndex.js'),
    context: {
      data,
    },
  });
};

module.exports = createDownloadIndexPage;
