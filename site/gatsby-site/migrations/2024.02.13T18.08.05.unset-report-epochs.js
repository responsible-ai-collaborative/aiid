const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const db = client.db(config.realm.production_db.db_name);

  const dbHistory = client.db(config.realm.production_db.db_name_history);

  const reports = db.collection('reports');

  const reportsHistory = dbHistory.collection('reports');

  const result = await reports.updateMany(
    {}, // Filter for all documents
    {
      $unset: {
        epoch_date_downloaded: '',
        epoch_date_modified: '',
        epoch_date_published: '',
        epoch_date_submitted: '',
      }, // Unset the epoch_date_downloaded, epoch_date_modified, epoch_date_published and epoch_date_submitted fields
    }
  );

  const historyResult = await reportsHistory.updateMany(
    {}, // Filter for all documents
    {
      $unset: {
        epoch_date_downloaded: '',
        epoch_date_modified: '',
        epoch_date_published: '',
        epoch_date_submitted: '',
      }, // Unset the epoch_date_downloaded, epoch_date_modified, epoch_date_published and epoch_date_submitted fields
    }
  );

  console.log(
    `Migration completed. Modified ${result.modifiedCount} documents on reports collection and ${historyResult.modifiedCount} documents on history reports collection.`
  );

  console.log('Migration completed!');
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
