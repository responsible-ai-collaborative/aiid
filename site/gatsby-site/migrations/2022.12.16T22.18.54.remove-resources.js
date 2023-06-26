const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const collections = await client
    .db(config.realm.production_db.db_name)
    .listCollections({ name: 'resources' })
    .toArray();

  if (collections.length === 0) {
    console.log('Collection resources does not exist.');
  } else {
    const resourcesCollection = client
      .db(config.realm.production_db.db_name)
      .collection('resources');

    await resourcesCollection.drop();
  }

  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  await taxaCollection.deleteOne({ namespace: 'resources' });
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
