const config = require('../config');

const mappings = {
  'Report, Test, or Study': 'Report, Test, or Study of data',
  Reviewer: 'Peer Reviewer',
  'Harm Level Notes': 'AI Tangible Harm Level Notes',
  City: 'Location City',
  'State or Province': 'Location State/Province (two letters)',
  'Possibly Identifiable Harmed Entity': 'Harmed Class of Entities',
  'Harm Level': 'AI Harm Level',
  Region: 'Location Region',
  'Property Damage Cost': null,
  'Financial Cost': null,
  'Clear Link to AI': 'Clear link to technology',
  'AI Linked to Special Interest Intangible Harm': 'Clear link to Technology',
};

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const classificationsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  const taxa = await taxaCollection.find({}).toArray();

  const classifications = await classificationsCollection.find({}).toArray();

  for (const classification of classifications) {
    const taxonomy = taxa.find((t) => t.namespace === classification.namespace);

    const updatedAttributes = [];

    let changed = false;

    for (const attribute of classification.attributes) {
      const field = taxonomy.field_list.find((f) => f.short_name === attribute.short_name);

      if (field) {
        updatedAttributes.push({ ...attribute });
      } else {
        if (attribute.short_name in mappings) {
          changed = true;

          if (mappings[attribute.short_name] != null) {
            const updated = {
              short_name: mappings[attribute.short_name],
            };

            if (attribute.value_json !== 'null' && attribute.value_json !== undefined) {
              updated.value_json = attribute.value_json;
            }

            updatedAttributes.push(updated);

            console.log(`[${attribute.short_name}] updated to [${mappings[attribute.short_name]}]`);
          }
        } else {
          throw new Error(
            `[${attribute.short_name}] not found in taxonomy [${taxonomy.namespace}], and no mapping found`
          );
        }
      }
    }

    if (changed) {
      console.log(`Updated ${classification._id}`);

      const result = await classificationsCollection.updateOne(
        { _id: classification._id },
        { $set: { attributes: updatedAttributes } }
      );

      console.log(`Updated ${result.modifiedCount} : ${classification._id}`);
    } else {
      console.log(`Skipped ${classification._id}`);
    }
  }
};
