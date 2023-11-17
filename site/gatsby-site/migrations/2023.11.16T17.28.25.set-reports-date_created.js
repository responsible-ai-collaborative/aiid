const config = require('../config');
/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  // New epoch_date_modified field on submissions collection
  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  const reportsCursor = reportsCollection.find({});

  while (await reportsCursor.hasNext()) {
    const report = await reportsCursor.next();

    const date_created = new Date(report.date_submitted);

    console.log(`Updating report ${report._id} with date_created "${date_created}"`);

    await reportsCollection.updateOne(
      { _id: report._id },
      {
        $set: {
          date_created: date_created,
        },
      }
    );

    report.date_created = date_created;
  }
};
