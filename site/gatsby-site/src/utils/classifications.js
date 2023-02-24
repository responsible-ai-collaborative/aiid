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
