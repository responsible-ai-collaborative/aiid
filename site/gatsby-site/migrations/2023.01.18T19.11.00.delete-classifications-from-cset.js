const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const classifications = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const csetClassifications = await classifications.find({ namespace: 'CSET' });

  while (await csetClassifications.hasNext()) {
    const csetClassification = await csetClassifications.next();

    await classifications.updateOne(
      { namespace: 'CSET', incident_id: csetClassification.incident_id },
      { $unset: { classifications: null } }
    );
  }
};
