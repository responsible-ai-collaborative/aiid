const config = require('../config');

/**
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  try {
    await client.db(config.realm.production_db.db_name).createCollection('checklists');
  } catch (e) {
    console.log(e.message);
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  await client.connect();

  try {
    await client.db(config.realm.production_db.db_name).collection('checklists').drop();
  } catch (e) {
    console.log(e.message);
  }
};
