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
          date_modified: {
            $dateToString: {
              format: '%Y-%m-%d HH:mm:ss',
              date: { $toDate: { $multiply: ['$epoch_date_modified', 1000] } },
            },
          },
        },
      },
    ]
  );

  console.log(`Added date_modified field to ${addDateModifiedResult.modifiedCount} incidents.`);

  // Then remove the old epoch_date_modified field
  const removeResult = await incidentsCollection.updateMany(
    { epoch_date_modified: { $exists: true } },
    { $unset: { epoch_date_modified: '' } }
  );

  console.log(`Removed epoch_date_modified field from ${removeResult.modifiedCount} incidents.`);
};
