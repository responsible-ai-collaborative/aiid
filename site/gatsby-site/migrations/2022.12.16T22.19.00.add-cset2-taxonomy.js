const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  const csetV1TaxaEntry = await taxaCollection.findOne({ namespace: 'CSET' });

  // TODO: Update with changes in CSET v2
  const csetV2TaxaEntry = JSON.parse(
    JSON.stringify({
      ...csetV1TaxaEntry,
      _id: undefined,
      namespace: 'CSET2',
    })
  );

  await taxaCollection.insertOne(csetV2TaxaEntry);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  await taxaCollection.deleteOne({ namespace: 'CSET2' });
};
