const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const collection = client.db(config.realm.production_db.db_name).collection('classifications');

  // unset the Notes classification, since it is not used

  await collection.updateMany({}, { $unset: { 'classifications.Notes': '' } });
};
