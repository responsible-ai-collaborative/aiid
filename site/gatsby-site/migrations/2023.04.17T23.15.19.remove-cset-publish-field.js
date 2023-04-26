const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  // We're getting duplicate publish fields because
  // publish was a field of the CSET taxonomy,
  // but it has been upgraded to a top-level member of all taxonomies.
  // To remove the duplicate we need to delete the original publish field
  // from the CSET taxonomy and use only the new method.
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  const csetTaxonomy = await taxaCollection.findOne({ namespace: 'CSET' });

  csetTaxonomy.field_list = csetTaxonomy.field_list.filter((f) => f.short_name != 'Publish');

  delete csetTaxonomy._id;

  await taxaCollection.updateOne({ namespace: 'CSET' }, { $set: { ...csetTaxonomy } });

  // Then we need to remove all the publish attributes from the classifications,
  // ensuring that the publish status remains the same.
  const classificationsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const classifications = await classificationsCollection.find({ namespace: 'CSET' });

  while (await classifications.hasNext()) {
    const classification = await classifications.next();

    const attributePublish = classification.attributes.find(
      (attribute) => attribute.short_name == 'Publish'
    );

    const attributePublishValue =
      attributePublish?.value_json && JSON.parse(attributePublish.value_json);

    const noMatch =
      `CSET classification for incident ${classification.incident_id} ` +
      `has member value 'publish' with value '${classification.publish}' ` +
      `that does not match its attribute value ${JSON.stringify(attributePublish)}.`;

    // Ensure that we don't have a situation where one is explicitly set to true
    // and the other explicitly set to false.
    if (Boolean(classification.publish) != Boolean(attributePublishValue)) {
      throw noMatch;
    }

    classification.publish = classification.publish || attributePublishValue || false;
    classification.attributes = classification.attributes.filter(
      (attribute) => attribute.short_name != 'Publish'
    );

    const setValue = { $set: { ...classification } };

    delete setValue.$set._id;

    await classificationsCollection.updateOne({ _id: classification._id }, setValue);
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
