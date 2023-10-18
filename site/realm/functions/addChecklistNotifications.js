exports = async function (input) {
  // TODO: This should add documents to the notifications collection
  // for each subscription to a checklist that has a query
  // matched by the updated value.
  //
  const changedAttributes = [];

  for (const newAttribute of input.new_attributes) {
    const matchingOldAttribute = input.old_attributes?.find(
      (oldAttribute) => oldAttribute.short_name == newAttribute.short_name
    );

    if (
      newAttribute?.value_json != matchingOldAttribute?.value_json &&
      newAttribute?.value_json != '""' &&
      newAttribute?.value_json != null
    ) {
      changedAttributes.push(newAttribute);
    }
  }
  return { ...input, changedAttributes };
};

if (typeof module === 'object') {
  module.exports = exports;
}
