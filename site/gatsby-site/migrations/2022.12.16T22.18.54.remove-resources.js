const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const resourcesCollection = client.db(config.realm.production_db.db_name).collection('resources');

  resourcesCollection.drop();
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
