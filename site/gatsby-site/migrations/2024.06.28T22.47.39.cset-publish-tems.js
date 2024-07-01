/** @type {import('umzug').MigrationFn<any>} */
const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const annotationStatusesToPublish = [
    '"2. Initial annotation complete"',
    '"3. In peer review"',
    '"4. Peer review complete"',
    '"5. In quality control"',
    '"6. Complete and final"',
  ];

  const classifications = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const csetV1Classifications = await classifications.find({ namespace: 'CSETv1', publish: false });

  let counter = 0;

  while (await csetV1Classifications.hasNext()) {
    const csetV1Classification = await csetV1Classifications.next();

    const attributes = csetV1Classification.attributes;

    const annotationStatusAttribute = attributes.find(
      (attr) =>
        attr.short_name == 'Annotation Status' &&
        annotationStatusesToPublish.includes(attr.value_json)
    );

    if (annotationStatusAttribute) {
      await classifications.updateOne(
        { _id: csetV1Classification._id },
        { $set: { publish: true } }
      );
      counter++;
    }
  }

  console.log('Annotations published:', counter);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
