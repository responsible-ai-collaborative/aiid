const config = require('../config');

const { readFile } = require('fs/promises');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  let gmfDescriptionText = await readFile('./taxa/descriptions/gmf.md', 'utf8');

  await taxaCollection.updateOne(
    { namespace: 'GMF' },
    { $set: { description: gmfDescriptionText } }
  );
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
