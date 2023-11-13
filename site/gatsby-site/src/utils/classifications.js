/*
 * @param classification - The document from the `classifications` collection.
 */
export function getClassificationValue(classification, short_name) {
  const attribute =
    classification.attributes &&
    classification.attributes.find((attribute) => attribute.short_name == short_name);

  if (attribute) {
    return JSON.parse(attribute.value_json);
  }
}

export function serializeClassification(
  values,
  allTaxonomyFields,
  deletedSubClassificationIds = []
) {
  const attributes = [];

  const subfields = [];

  const superfieldKeys = [];

  Object.keys(values)
    .filter((key) => !['notes', 'publish'].includes(key))
    .map((key) => {
      const taxonomyField = allTaxonomyFields.find(
        (field) => field.short_name == key.replace(/.*___/g, '')
      );

      const mongo_type = taxonomyField.mongo_type;

      let value = values[key];

      if (mongo_type == 'bool') value = value === 'false' ? false : Boolean(value);
      if (mongo_type == 'int') value = Number(value);
      if (mongo_type == 'object') value = {};
      return {
        short_name: key,
        value_json: JSON.stringify(value),
      };
    })
    .forEach((attribute) => {
      // E.g. {short_name: 'Entities___0___Entity', value_json: '"Google"'}
      if (attribute.short_name.split('___').length > 1) {
        subfields.push(attribute);
        superfieldKeys.push(attribute.short_name.split('___')[0]);
      } else {
        attributes.push(attribute);
      }
    });

  const superfields = attributes.filter((attribute) =>
    superfieldKeys.includes(attribute.short_name)
  );

  for (const superfield of superfields) {
    // E.g. { short_name: "Entities", value_json: "{}" }

    // E.g. [{short_name: 'Entities___0___Entity',      value_json: '"Google"'                 },
    //       {short_name: 'Entities___0___Entity Type', value_json: '"for-profit organization"'},
    //       {short_name: 'Entities___1___Entity',      value_json: '"Google Users"'           },
    //       {short_name: 'Entities___1___Entity Type', value_json: '"Group"'                  } ]
    const superfieldSubfields = subfields.filter(
      (subfield) => subfield.short_name.split('___')[0] == superfield.short_name
    );

    // E.g. ["0", "1"]
    const subClassificationIds = Array.from(
      new Set(superfieldSubfields.map((subfield) => subfield.short_name.split('___')[1]))
    );

    const subClassifications = [];

    for (const subClassificationId of subClassificationIds) {
      // E.g. "0"

      if (deletedSubClassificationIds.includes(subClassificationId)) continue;

      // E.g. [{short_name: 'Entity',      value_json: '"Google"'                 },
      //       {short_name: 'Entity Type', value_json: '"for-profit organization"'} ]
      const subClassificationAttributes = superfieldSubfields
        .filter((subfield) => subfield.short_name.split('___')[1] == subClassificationId)
        .map((subfield) => ({ ...subfield, short_name: subfield.short_name.split('___')[2] }));

      const subClassification = { attributes: subClassificationAttributes };

      subClassifications.push(subClassification);
    }

    superfield.value_json = JSON.stringify(
      // E.g.
      // [ { attributes: [
      //       {short_name: 'Entities___0___Entity',      value_json: '"Google"'                 },
      //       {short_name: 'Entities___0___Entity Type', value_json: '"for-profit organization"'}
      //     ]
      //   },
      //   { attributes: [
      //        {short_name: 'Entities___1___Entity',      value_json: '"Google Users"'           },
      //        {short_name: 'Entities___1___Entity Type', value_json: '"Group"'                  }
      //     ]
      //   }
      // ]
      subClassifications
    );
  }

  return attributes;
}
