const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const taxa = client.db(config.realm.production_db.db_name).collection('taxa');

  const csetTaxonomy = await taxa.findOne({ namespace: 'CSET' });

  const classifications = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const csetClassifications = await classifications.find({ namespace: 'CSET' });

  while (await csetClassifications.hasNext()) {
    const csetClassification = await csetClassifications.next();

    const attributes = [];

    for (const short_name of Object.keys(csetClassification.classifications)) {
      const bareValue = csetClassification.classifications[short_name];

      const mongo_type = csetTaxonomy.field_list.find(
        (f) => f.short_name == short_name
      )?.mongo_type;

      const value = {};

      const value_json = JSON.stringify(bareValue);

      // `notes` is in the `classifications` object
      // of some documents in `classifications`,
      // but it is not in the CSET taxa document,
      // so no mongo_type is found for it
      // and the value is not found.
      // In every case where the the
      // classification.classifications.notes
      // is not the empty string,
      // it's the same as classification.notes,
      // so we can just skip over it.
      if (mongo_type) {
        value[mongo_type] = bareValue;

        attributes.push({ short_name, mongo_type, value, value_json });
      }
    }
    classifications.updateOne(
      { namespace: 'CSET', incident_id: csetClassification.incident_id },
      { $set: { attributes } }
    );
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const classifications = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const csetClassifications = await classifications.find({ namespace: 'CSET' });

  while (await csetClassifications.hasNext()) {
    const csetClassification = await csetClassifications.next();

    classifications.updateOne(
      { namespace: 'CSET', incident_id: csetClassification.incident_id },
      { $unset: { attributes: null } }
    );
  }
};
