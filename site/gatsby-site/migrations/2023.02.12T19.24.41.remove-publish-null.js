/** @type {import('umzug').MigrationFn<any>} */
const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const classifications = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const csetClassifications = await classifications.find({ namespace: 'CSET' });

  while (await csetClassifications.hasNext()) {
    const csetClassification = await csetClassifications.next();

    const attributes = csetClassification.attributes;

    const publishAttribute = attributes.find((a) => a.short_name == 'Publish');

    if (publishAttribute.value_json === null) {
      publishAttribute.value_json = 'false';
      await classifications.updateOne(
        { namespace: 'CSET', incident_id: csetClassification.incident_id },
        { $set: { attributes } }
      );
    }
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
