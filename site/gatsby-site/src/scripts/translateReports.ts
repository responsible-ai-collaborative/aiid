import 'dotenv/config';
import config from '../../config';
import { MongoClient } from 'mongodb';
import { Translate } from '@google-cloud/translate/build/src/v2';
import Translator from './Translator';
import { getLanguages } from '../../i18n';

const reporter = { log: console.log, error: console.error, warn: console.warn };

(async () => {
  console.log('Translating incident reports...');

  let mongoClient: MongoClient | null = null;

  try {
    // MongoDB client setup
    mongoClient = new MongoClient(config.mongodb.translationsConnectionString);
    try {
      await mongoClient.connect();
    } catch (mongoError: any) {
      throw new Error(`Error connecting to MongoDB: ${mongoError.message}`);
    }

    // Google Translate client setup
    if (!config.i18n.translateApikey) {
      throw new Error('Google Translate API (GOOGLE_TRANSLATE_API_KEY) key is missing.');
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
  } catch (error: any) {
    console.error('Error during the translation process:', error.message);
    process.exit(1);
  } finally {
    if (mongoClient) {
      try {
        await mongoClient.close();
        console.log('MongoDB connection closed gracefully.');
      } catch (closeError: any) {
        console.error('Error closing MongoDB connection:', closeError.message);
      }
    }
  }
})();