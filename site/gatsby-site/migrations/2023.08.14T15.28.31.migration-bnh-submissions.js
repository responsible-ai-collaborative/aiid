const config = require('../config');

const submittersMap = {
  'Daniel Atherton (BNH.ai)': 'Daniel Atherton',
  'Patrick Hall (BNH.ai)': 'Patrick Hall',
};

/**
 * @type {import('umzug').MigrationFn<any>}
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  // Select reports where target submitter name is present.
  const targetReports = reportsCollection.find({
    submitters: { $elemMatch: { $in: Object.keys(submittersMap) } },
  });

  for await (const report of targetReports) {
    const originalSubmitters = report.submitters;

    // Map target submitter names to new versions and maintain non-target names.
    const updatedSubmitters = originalSubmitters.map((s) =>
      s in submittersMap ? submittersMap[s] : s
    );

    const updateResult = await reportsCollection.updateOne(
      { _id: report._id },
      { $set: { submitters: updatedSubmitters } }
    );

    console.log(
      `${report.report_number}: ${originalSubmitters} -> ${updatedSubmitters}, ${updateResult.modifiedCount}`
    );
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
