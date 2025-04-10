/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const db = client.db('translations');

  // Verificar si la colección ya existe
  const collections = await db.listCollections().toArray();

  const collectionExists = collections.some((collection) => collection.name === 'incidents');

  if (!collectionExists) {
    await db.createCollection('incidents');
  } else {
    console.log('translations.incidents collection already exists');
  }

  const incidentsTranslationsCollection = db.collection('incidents');

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
