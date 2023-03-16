const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  const csetV1Taxonomy = await taxaCollection.findOne({ namespace: 'CSETv1' });

  for (let i = 1; i < 4; i++) {
    await taxaCollection.insertOne({
      ...csetV1Taxonomy,
      _id: undefined,
      namespace: 'CSETv1_Annotator-' + i,
    });
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  for (let i = 1; i < 4; i++) {
    await taxaCollection.deleteOne({ namespace: 'CSETv1_Annotator-' + i });
  }
};
