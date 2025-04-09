/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  await client.db('translations').createCollection('incidents');

  const incidentsTranslationsCollection = client.db('translations').collection('incidents');

  incidentsTranslationsCollection.createIndex({ incident_id: 1 });
};

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.down = async ({ context: { client } }) => {
  await client.connect();

  try {
    await client.db('translations').dropCollection('incidents');
  } catch (e) {
    console.log(e.message);
  }
};
