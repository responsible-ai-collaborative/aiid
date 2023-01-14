const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const taxa = client.db(config.realm.production_db.db_name).collection('taxa');

  const csetTaxonomy = await taxa.findOne({ namespace: 'CSET' });

  console.log(`csetTaxonomy`, csetTaxonomy);

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

      // TODO: This condition isn't met for "notes".
      // Find out why and fix it if necessary.
      if (mongo_type && bareValue) {
        value[mongo_type] = bareValue;

        attributes.push({ short_name, mongo_type, value });
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
