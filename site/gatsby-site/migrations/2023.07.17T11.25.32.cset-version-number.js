const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const classificationsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  const renameNamespace = async (oldNamespace, newNamespace) => {
    await taxaCollection.updateOne(
      { namespace: oldNamespace },
      { $set: { namespace: newNamespace } }
    );
    classificationsCollection.updateMany(
      { namespace: oldNamespace },
      { $set: { namespace: newNamespace } }
    );
  };

  await renameNamespace('CSET', 'CSETv0');
  await renameNamespace('CSETv1', 'CSETv2');
  await renameNamespace('CSETv0', 'CSETv1');
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
