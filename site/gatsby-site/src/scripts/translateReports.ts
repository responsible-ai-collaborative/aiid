import config from '../../server/config';
import { MongoClient } from 'mongodb';
import { Translate } from '@google-cloud/translate/build/src/v2';
import ReportTranslator from './reportTranslator';
import { getLanguages } from '../../i18n';

const reporter = { log: console.log, error: console.error, warn: console.warn };

(async () => {
  console.log('Translating incident reports...');

  let mongoClient: MongoClient | undefined;

  try {
    // MongoDB client setup
    mongoClient = new MongoClient(config.MONGODB_TRANSLATIONS_CONNECTION_STRING);
    try {
      await mongoClient.connect();
    } catch (mongoError) {
      throw new Error(`Error connecting to MongoDB: ${mongoError instanceof Error ? mongoError.message : String(mongoError)}`);
    }

    // Google Translate client setup
    if (!config.GOOGLE_TRANSLATE_API_KEY) {
      throw new Error('Google Translate API (GOOGLE_TRANSLATE_API_KEY) key is missing.');
    }
    const translateClient = new Translate({ key: config.GOOGLE_TRANSLATE_API_KEY });

    // Create Translator instance
    const translator = new ReportTranslator({
      mongoClient,
      translateClient,
      languages: getLanguages(),
      reporter,
    });

    // Run the translation process
    await translator.run();

    console.log('Translation completed successfully.');
  } catch (error) {
    console.error('Error during the translation process:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    if (mongoClient) {
      try {
        await mongoClient.close();
        console.log('MongoDB connection closed gracefully.');
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError instanceof Error ? closeError.message : String(closeError));
      }
    }
  }
})(); 