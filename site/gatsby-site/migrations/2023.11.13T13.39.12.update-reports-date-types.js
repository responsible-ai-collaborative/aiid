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

  let docs = await reports.find({}).toArray();

  let docsHistory = await reportsHistory.find({}).toArray();

  await Promise.all(
    docs.map((doc) => {
      // Convert epoch timestamps (in seconds) to milliseconds, and then to MongoDB's Date type
      const date_downloaded = new Date(doc.epoch_date_downloaded * 1000);

      const date_modified = new Date(doc.epoch_date_modified * 1000);

      const date_published = new Date(doc.epoch_date_published * 1000);

      const date_submitted = new Date(doc.epoch_date_submitted * 1000);

      // Update the collection with the new Date type values
      return reports.updateOne(
        { _id: doc._id },
        {
          $set: {
            date_downloaded: date_downloaded,
            date_modified: date_modified,
            date_published: date_published,
            date_submitted: date_submitted,
          },
        }
      );
    })
  );

  await Promise.all(
    docsHistory.map((doc) => {
      // Convert epoch timestamps (in seconds) to milliseconds, and then to MongoDB's Date type
      const date_downloaded = new Date(doc.epoch_date_downloaded * 1000);

      const date_modified = new Date(doc.epoch_date_modified * 1000);

      const date_published = new Date(doc.epoch_date_published * 1000);

      const date_submitted = new Date(doc.epoch_date_submitted * 1000);

      // Update the collection with the new Date type values
      return reports.updateOne(
        { _id: doc._id },
        {
          $set: {
            date_downloaded: date_downloaded,
            date_modified: date_modified,
            date_published: date_published,
            date_submitted: date_submitted,
          },
        }
      );
    })
  );

  console.log('Migration completed!');
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
