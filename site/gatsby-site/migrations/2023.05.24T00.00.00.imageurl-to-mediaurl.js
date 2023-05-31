const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  // grab the report collections
  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  // grab the submission collection
  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  // Update the documents in the reports collection
  await reportsCollection.updateMany({}, { $rename: { image_url: 'media_url' } });

  // Update the documents in the submissions collection
  await submissionsCollection.updateMany({}, { $rename: { image_url: 'media_url' } });

  await client.close();
};
