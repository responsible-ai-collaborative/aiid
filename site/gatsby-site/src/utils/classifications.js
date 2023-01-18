/*
 * @param classification - The document from the `classifications` collection.
 */
export function getClassificationValue(classification, short_name, config) {
  config ||= {};

  const attribute =
    classification.attributes &&
    classification.attributes.find((attribute) => attribute.short_name == short_name);

  if (attribute) {
    return JSON.parse(attribute.value_json); //attribute.value[attribute.type]
  }
  if (classification.classifications) {
    return classification.classifications[
      config.spaceToUnderScore ? short_name.split(' ').join('_') : short_name
    ];
  }
}
