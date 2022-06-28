const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  await submissionsCollection.updateMany(
    { editor_notes: { $exists: false } },
    { $set: { editor_notes: '' } }
  );

  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  await reportsCollection.updateMany(
    { editor_notes: { $exists: false } },
    { $set: { editor_notes: '' } }
  );
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  await submissionsCollection.updateMany({ editor_notes: '' }, { $unset: { editor_notes: '' } });

  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  await reportsCollection.updateMany({ editor_notes: '' }, { $unset: { editor_notes: '' } });
};
