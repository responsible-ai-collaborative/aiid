/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db('aiidprod').collection('reports');

  const reportsCursor = reportsCollection.find({ submitters: [] });

  while (await reportsCursor.hasNext()) {
    const report = await reportsCursor.next();

    if (report.submitters.length === 0) {
      await reportsCollection.updateOne(
        { _id: report._id },
        {
          $set: {
            submitters: ['Anonymous'],
          },
        }
      );
    }
  }
};
