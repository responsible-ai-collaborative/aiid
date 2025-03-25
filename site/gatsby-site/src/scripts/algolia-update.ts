/**
 * Updates Algolia indexes
 * Run with `npx tsx --env-file=.env src/scripts/algolia-update.ts`
 */

import { MongoClient } from 'mongodb';
import algoliasearch from 'algoliasearch';
import { differenceWith } from 'lodash';

import config from '../../config';
import AlgoliaUpdater from '../utils/AlgoliaUpdater';
import { getLanguages } from '../../i18n';

const main = async (): Promise<void> => {
  console.log(`Updating Algolia indexes of algolia app ID ${config.header.search.algoliaAppId}...`);
  
  console.log('Starting Algolia Update...');
  
  // Validate languages configuration
  const configuredLanguages = getLanguages();
  
  const unavailableLanguages = differenceWith(
    config.i18n.availableLanguages,
    configuredLanguages,
    (aLang, cLang) => {
      return cLang.code === aLang;
    }
  );
  
  if (unavailableLanguages.length > 0) {
    throw new Error(`Language config error. Review your GATSBY_AVAILABLE_LANGUAGES variable. You've included a language that hasn't been configured yet: ${unavailableLanguages
      .map((l) => l)
      .join(', ')}`);
  }

  if (
    !config.mongodb.translationsConnectionString ||
    !config.i18n.availableLanguages ||
    !config.header.search.algoliaAdminKey ||
    !config.header.search.algoliaAppId
  ) {
    throw new Error(`Missing environment variable, can't run Algolia update process.`);
  }

  const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

  const languages = getLanguages();

  try {
    const algoliaClient = algoliasearch(
      config.header.search.algoliaAppId,
      config.header.search.algoliaAdminKey
    );

    const algoliaUpdater = new AlgoliaUpdater({
      languages,
      mongoClient,
      algoliaClient,
      reporter: { log: console.log },
    });

    console.log('Updating Algolia incidents indexes...');
    await algoliaUpdater.run();
  } catch (e) {
    console.error('Error updating Algolia index:', e);
    process.exit(1);
  }

  console.log('Algolia Update completed');
  console.log('Done');
  process.exit(0);
};

if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
} 