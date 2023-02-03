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

    for (const field of csetTaxonomy.field_list) {
      const short_name = field.short_name;

      const value = csetClassification.classifications[short_name];

      const value_json = JSON.stringify(value);

      attributes.push({ short_name, value_json });
    }
    await classifications.updateOne(
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

    await classifications.updateOne(
      { namespace: 'CSET', incident_id: csetClassification.incident_id },
      { $unset: { attributes: null } }
    );
  }
};
