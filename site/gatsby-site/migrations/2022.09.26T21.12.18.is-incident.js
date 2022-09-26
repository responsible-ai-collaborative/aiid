const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  await submissionsCollection.updateMany({}, { $set: { is_incident_report: true } });
};
