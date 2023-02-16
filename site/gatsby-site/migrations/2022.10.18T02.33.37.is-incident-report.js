const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  await reportsCollection.updateMany(
    { is_incident_report: { $exists: false } },
    { $set: { is_incident_report: true } }
  );
};
