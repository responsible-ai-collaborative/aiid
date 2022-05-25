const config = require('../config');

/**
 * @type {import('umzug').MigrationFn<any>}
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
  const collection = client.db(config.realm.production_db.db_name).collection('incidents');

  await collection.updateMany(
    { editors: { $exists: false } },
    { $set: { editors: ['Sean McGregor'] } }
  );
};

/**
 * @type {import('umzug').MigrationFn<any>}
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.down = async ({ context: { client } }) => {
  const collection = client.db(config.realm.production_db.db_name).collection('incidents');

  await collection.updateMany({ editors: ['Sean McGregor'] }, { $unset: { editors: [] } });
};
