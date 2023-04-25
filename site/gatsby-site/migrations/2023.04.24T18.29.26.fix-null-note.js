const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const classifications = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  classifications.updateMany({ notes: null }, { $set: { notes: '' } });
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
