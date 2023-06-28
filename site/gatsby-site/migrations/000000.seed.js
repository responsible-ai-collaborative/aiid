const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const collections = [
    'candidates',
    'classifications',
    'duplicates',
    'incidents',
    'mitigations',
    'quickadd',
    'reports',
    'submissions',
    'taxa',
  ];

  for (let i = 0; i < collections.length; i++) {
    const collectionName = collections[i];

    // Check if the collection exists
    const existingCollections = await client
      .db(config.realm.production_db.db_name)
      .listCollections({ name: collectionName })
      .toArray();

    if (existingCollections.length > 0) {
      console.log(`Collection ${collectionName} already exists.`);
      continue;
    }

    // If the collection does not exist, create it
    await client.db(config.realm.production_db.db_name).createCollection(collectionName);
    console.log(`Collection ${collectionName} created.`);
  }
};
