const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const db = client.db(config.realm.production_db.db_name).collection('incidents');

  // If the incident has "editor_notes" field and it is null, set it to empty string
  const editor_notes_results = await db.updateMany(
    { editor_notes: null },
    { $set: { editor_notes: '' } }
  );

  console.log(
    `Updated ${editor_notes_results.modifiedCount} incidents with null editor_notes field`
  );

  // If the incident has the "flagged_dissimilar_incidents" field and it is null, set it to empty array
  const flagged_dissimilar_incidents_results = await db.updateMany(
    { flagged_dissimilar_incidents: null },
    { $set: { flagged_dissimilar_incidents: [] } }
  );

  console.log(
    `Updated ${flagged_dissimilar_incidents_results.modifiedCount} incidents with null flagged_dissimilar_incidents field`
  );
};
