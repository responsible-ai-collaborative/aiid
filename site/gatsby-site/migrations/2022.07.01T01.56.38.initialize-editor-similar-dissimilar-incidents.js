const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  await submissionsCollection.updateMany(
    { editor_similar_incidents: { $exists: false } },
    { $set: { editor_similar_incidents: [] } }
  );
  await submissionsCollection.updateMany(
    { editor_dissimilar_incidents: { $exists: false } },
    { $set: { editor_dissimilar_incidents: [] } }
  );

  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  await incidentsCollection.updateMany(
    { editor_similar_incidents: { $exists: false } },
    { $set: { editor_similar_incidents: [] } }
  );
  await incidentsCollection.updateMany(
    { editor_dissimilar_incidents: { $exists: false } },
    { $set: { editor_dissimilar_incidents: [] } }
  );
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  await submissionsCollection.updateMany(
    { editor_similar_incidents: { $exists: true } },
    { $unset: { editor_similar_incidents: '' } }
  );
  await submissionsCollection.updateMany(
    { editor_dissimilar_incidents: { $exists: true } },
    { $unset: { editor_dissimilar_incidents: '' } }
  );

  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  await incidentsCollection.updateMany(
    { editor_similar_incidents: { $exists: true } },
    { $unset: { editor_similar_incidents: '' } }
  );
  await incidentsCollection.updateMany(
    { editor_dissimilar_incidents: { $exists: true } },
    { $unset: { editor_dissimilar_incidents: '' } }
  );
};
