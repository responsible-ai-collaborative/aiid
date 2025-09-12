/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const db = client.db('aiidprod');

  const reportsCollection = db.collection('reports');

  await reportsCollection.updateMany(
    { snippet_max_characters: { $exists: false } },
    { $set: { snippet_max_characters: 1000000 } }
  );

  const submissionsCollection = db.collection('submissions');

  await submissionsCollection.updateMany(
    { snippet_max_characters: { $exists: false } },
    { $set: { snippet_max_characters: 1000000 } }
  );
};
