const { isArray } = require('lodash');

const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const fixValueJsonOptions = (value_json) => {
    const value = JSON.parse(value_json);

    const newValue = value.map((v) => v.label);

    return newValue;
  };

  const classificationsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const classifications = classificationsCollection.find({
    'attributes.value_json': { $regex: 'customOption' },
  });

  while (await classifications.hasNext()) {
    const classification = await classifications.next();

    const attributes = classification.attributes.map((attribute) => {
      if (attribute.value_json && attribute.value_json.includes('customOption')) {
        try {
          const value = JSON.parse(attribute.value_json);

          if (isArray(value) && value?.[0]?.attributes) {
            // seems to be only with entities

            const updated = value.map((v) => {
              const { attributes } = v;

              return {
                ...v,
                attributes: attributes.map((a) => {
                  if (a.value_json.includes('customOption')) {
                    const options = fixValueJsonOptions(a.value_json);

                    const value_json = JSON.stringify(options);

                    return { ...a, value_json };
                  }

                  return a;
                }),
              };
            });

            return { ...attribute, value_json: updated };
          } else {
            const options = fixValueJsonOptions(attribute.value_json);

            const updated = JSON.stringify(options);

            return { ...attribute, value_json: updated };
          }
        } catch (e) {
          console.log(
            `Error parsing classification ${classification.namespace} ${classification.incident_id}, value: ${attribute.value_json}`
          );

          throw e; // we want to stop the migration
        }
      }

      return attribute;
    });

    const result = await classificationsCollection.updateOne(
      { _id: classification._id },
      { $set: { attributes } }
    );

    console.log(`Updated ${classification._id} : ${result.modifiedCount}`);
  }
};
