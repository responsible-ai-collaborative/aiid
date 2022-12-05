const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  let result = await reportsCollection.updateMany(
    { tags: { $eq: undefined } },
    { $set: { tags: [] } }
  );

  console.log(`Updated ${result.modifiedCount} reports`);

  result = await submissionsCollection.updateMany(
    { tags: { $eq: undefined } },
    { $set: { tags: [] } }
  );

  console.log(`Updated ${result.modifiedCount} submissions`);

  await client.close();
};
