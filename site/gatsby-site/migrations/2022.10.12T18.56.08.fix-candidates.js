const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const collection = client.db(config.realm.production_db.db_name).collection('candidates');

  const result = await collection.deleteMany({ date_published: { $exists: true, $eq: null } });

  console.log(`Removed  ${result.deletedCount} records.`);
};
