const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const resourcesCollection = client.db(config.realm.production_db.db_name).collection('resources');

  resourcesCollection.drop();

  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  taxaCollection.deleteOne({ namespace: 'resources' });
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
