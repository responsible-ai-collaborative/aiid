const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  await client.db(config.realm.production_db.db_name).createCollection('entity_relationships');
};
/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.down = async ({ context: { client } }) => {
  await client.connect();

  try {
    await client.db(config.realm.production_db.db_name).dropCollection('entity_relationships');
  } catch (e) {
    console.log(e.message);
  }
};
