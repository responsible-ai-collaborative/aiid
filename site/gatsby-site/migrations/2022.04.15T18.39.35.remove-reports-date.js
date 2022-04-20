const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const collection = client.db(config.realm.production_db.db_name).collection('reports');

  const result = await collection.updateMany(
    {},
    { $unset: { incident_date: 1, epoch_incident_date: 1 } }
  );

  console.log(`Removed from legacy date fields from ${result.modifiedCount} records.`);
};
