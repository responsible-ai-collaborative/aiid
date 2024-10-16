const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  // If the incident has "epoch_date_modified" field and it is null, unset it
  const incidents_collection = client
    .db(config.realm.production_db.db_name)
    .collection('incidents');

  const incidents_epoch_date_modified_results = await incidents_collection.updateMany(
    { epoch_date_modified: null },
    { $unset: { epoch_date_modified: '' } }
  );

  console.log(
    `Updated ${incidents_epoch_date_modified_results.modifiedCount} incidents with null epoch_date_modified field`
  );

  // If the report has "epoch_date_modified" field and it is null, unset it
  const reports_collection = client.db(config.realm.production_db.db_name).collection('reports');

  const reports_epoch_date_modified_results = await reports_collection.updateMany(
    { epoch_date_modified: null },
    { $unset: { epoch_date_modified: '' } }
  );

  console.log(
    `Updated ${reports_epoch_date_modified_results.modifiedCount} reports with null epoch_date_modified field`
  );
};
