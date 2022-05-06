const config = require('../config');

const { isString, isArray, toString } = require('lodash');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const collection = client.db(config.realm.production_db.db_name).collection('taxa');

  const taxa = await collection.find({}).toArray();

  for (const taxonomy of taxa) {
    for (const field of taxonomy.field_list) {
      // make sure if placeholder is set, that it is a string
      if ('placeholder' in field && !isString(field.placeholder)) {
        console.log(`Update [${field.short_name}].placeholder from ${field.placeholder} to ''`);

        await collection.updateOne(
          { 'field_list.short_name': field.short_name },
          { $set: { 'field_list.$.placeholder': '' } }
        );
      }

      // if permitted_values can't be null, set it to empty array
      if ('permitted_values' in field && !isArray(field.permitted_values)) {
        console.log(
          `Update [${field.short_name}].permitted_values from ${field.permitted_values} to []`
        );

        await collection.updateOne(
          { 'field_list.short_name': field.short_name },
          { $set: { 'field_list.$.permitted_values': [] } }
        );
      }

      // default needs to ne a string, Realm's graphQL doesn't support mixed typeÎ
      if ('default' in field && !isString(field.default)) {
        console.log(
          `Update [${field.short_name}].default from ${field.default} to '${toString(
            field.default
          )}'`
        );

        await collection.updateOne(
          { 'field_list.short_name': field.short_name },
          { $set: { 'field_list.$.default': toString(field.default) } }
        );
      }
    }
  }
};
