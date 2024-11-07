require('dotenv').config();

const config = require('../../config');

const { MongoClient } = require('mongodb');

const { Translate } = require('@google-cloud/translate').v2;

const Translator = require('./Translator');

const { getLanguages } = require('../../i18n');

const reporter = { log: console.log };

(async () => {
  let mongoClient;

  try {
    console.log('Translating incident reports...');

    // MongoDB client setup
    mongoClient = new MongoClient(config.mongodb.translationsConnectionString);
    try {
      await mongoClient.connect();
    } catch (mongoError) {
      console.error('Error connecting to MongoDB:', mongoError.message);
      return;
    }

    // Google Translate client setup
    if (!config.i18n.translateApikey) {
      console.error('Error: Google Translate API key is missing.');
      return;
    }
    const translateClient = new Translate({ key: config.i18n.translateApikey });

    // Create Translator instance
    const translator = new Translator({
      mongoClient,
      translateClient,
      languages: getLanguages(),
      reporter,
    });

    // Run the translation process
    await translator.run();

    console.log('Translation completed successfully.');
  } catch (error) {
    console.error('Error during the translation process:', error.message);
  } finally {
    if (mongoClient) {
      try {
        await mongoClient.close();
        console.log('MongoDB connection closed gracefully.');
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError.message);
      }
    }
  }
})();
