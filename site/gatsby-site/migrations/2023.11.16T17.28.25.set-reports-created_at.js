const config = require('../config');
/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  // New created_at field on reports collection
  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  const reportsHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('reports');

  const reportsCursor = reportsCollection.find({});

  const reportsHistoryCursor = reportsHistoryCollection.find({});

  while (await reportsCursor.hasNext()) {
    const report = await reportsCursor.next();

    const created_at = new Date(report.date_submitted);

    console.log(`Updating report ${report._id} with created_at "${created_at}"`);

    await reportsCollection.updateOne(
      { _id: report._id },
      {
        $set: {
          created_at: created_at,
        },
      }
    );

    report.created_at = created_at;
  }

  while (await reportsHistoryCursor.hasNext()) {
    const report = await reportsHistoryCursor.next();

    const created_at = new Date(report.date_submitted);

    console.log(`Updating report ${report._id} with created_at "${created_at}"`);

    await reportsHistoryCollection.updateOne(
      { _id: report._id },
      {
        $set: {
          created_at: created_at,
        },
      }
    );

    report.created_at = created_at;
  }
};
