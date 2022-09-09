const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  client.db(config.realm.production_db.db_name).createCollection('candidates');
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  client.db(config.realm.production_db.db_name).collection('candidates').drop();
};
