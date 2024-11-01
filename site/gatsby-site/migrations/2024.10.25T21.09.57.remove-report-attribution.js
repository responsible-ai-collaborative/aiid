const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  // Change "AIAAIC" to "Anonymous" if it is the only element in the `submitters` array
  const result1 = await reportsCollection.updateMany(
    { submitters: ['AIAAIC'] },
    { $set: { submitters: ['Anonymous'] } }
  );

  console.log(`Modified ${result1.modifiedCount} documents where "AIAAIC" was the only submitter`);

  // Remove "AIAAIC" from the `submitters` array if there are multiple elements
  const result2 = await reportsCollection.updateMany(
    { submitters: 'AIAAIC' },
    { $pull: { submitters: 'AIAAIC' } }
  );

  console.log(
    `Modified ${result2.modifiedCount} documents where "AIAAIC" was one of the submitters`
  );
};
