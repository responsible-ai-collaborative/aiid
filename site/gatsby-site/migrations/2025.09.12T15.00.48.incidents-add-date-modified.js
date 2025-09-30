/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const db = client.db('aiidprod');

  const incidentsCollection = db.collection('incidents');

  // First, add date_modified field with converted dates
  const addDateModifiedResult = await incidentsCollection.updateMany(
    { epoch_date_modified: { $exists: true } },
    [
      {
        $set: {
          date_modified: { $toDate: { $multiply: ['$epoch_date_modified', 1000] } },
        },
      },
    ]
  );

  console.log(`Added date_modified field to ${addDateModifiedResult.modifiedCount} incidents.`);
};
