/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const db = client.db('aiidprod');

  const incidentsCollection = db.collection('incidents');

  // Remove the old epoch_date_modified field
  const removeResult = await incidentsCollection.updateMany(
    { epoch_date_modified: { $exists: true } },
    { $unset: { epoch_date_modified: '' } }
  );

  console.log(`Removed epoch_date_modified field from ${removeResult.modifiedCount} incidents.`);
};
