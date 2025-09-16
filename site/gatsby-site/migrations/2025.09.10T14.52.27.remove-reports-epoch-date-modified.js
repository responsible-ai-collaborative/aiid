/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const db = client.db('aiidprod');

  const reportsCollection = db.collection('reports');

  const result = await reportsCollection.updateMany(
    { epoch_date_modified: { $exists: true } },
    { $unset: { epoch_date_modified: '' } }
  );

  console.log(`Removed epoch_date_modified field from ${result.modifiedCount} reports.`);
};
