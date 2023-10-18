exports = async function (input) {
  // TODO: This should add documents to the notifications collection
  // for each subscription to a checklist that has a query
  // matched by the updated value.
  return input;
};

if (typeof module === 'object') {
  module.exports = exports;
}
