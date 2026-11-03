import { MongoClient } from 'mongodb';
import MitClassificationsSync, { fetchArcolaExport } from './mitClassificationsSync';

/**
 * Entry point of the MIT classification sync; see `mitClassificationsSync.ts` for the rules.
 *
 * Environment:
 * - `API_MONGODB_CONNECTION_STRING`: read/write connection to the database holding `aiidprod`
 * - `ARCOLA_API_KEY`: the Arcola platform API key
 * - `ARCOLA_EXPORT_URL`: optional, replaces the export URL
 * - `MIT_SYNC_DRY_RUN`: anything but `false` reports the plan without writing it
 * - `MIT_SYNC_MAX_FIELD_UPDATES`: field values above which a run refuses to write
 */
export const syncMitClassifications = async () => {
  if (!process.env.API_MONGODB_CONNECTION_STRING) {
    throw new Error('API_MONGODB_CONNECTION_STRING must hold the database connection string');
  }

  const mongoClient = new MongoClient(process.env.API_MONGODB_CONNECTION_STRING);

  const sync = new MitClassificationsSync({
    mongoClient,
    fetchExport: () =>
      fetchArcolaExport({
        apiKey: process.env.ARCOLA_API_KEY,
        url: process.env.ARCOLA_EXPORT_URL || undefined,
      }),
    reporter: {
      log: console.log,
      error: console.error,
      warn: console.warn,
    },
  });

  await sync.run();
};

export const run = async () => {
  try {
    await syncMitClassifications();
    console.log('MIT classification sync completed successfully.');
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  run();
}
