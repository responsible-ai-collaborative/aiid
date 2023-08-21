const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('reports');

  const updateResult = await reportHistoryCollection.updateMany(
    {
      user: undefined,
    },
    { $unset: { user: '' } }
  );

  console.log('Update result:', updateResult);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
