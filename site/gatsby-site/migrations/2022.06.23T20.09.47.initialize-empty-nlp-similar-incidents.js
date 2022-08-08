const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  await submissionsCollection.updateMany(
    { nlp_similar_incidents: { $exists: false } },
    { $set: { nlp_similar_incidents: [] } }
  );

  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  await incidentsCollection.updateMany(
    { nlp_similar_incidents: { $exists: false } },
    { $set: { nlp_similar_incidents: [] } }
  );
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  await submissionsCollection.updateMany(
    { nlp_similar_incidents: [] },
    { $unset: { nlp_similar_incidents: '' } }
  );

  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  await incidentsCollection.updateMany(
    { nlp_similar_incidents: [] },
    { $unset: { nlp_similar_incidents: '' } }
  );
};
