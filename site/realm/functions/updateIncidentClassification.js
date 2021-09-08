exports = function(arg){
  // IN REQUEST
  // incident_id: ""
  // namespace: ""
  // newClassifications: { ...taxonomy fields with values }
  var collection = context.services.get("mongodb-atlas").db("aiidprod").collection("classifications");
  function update(filter, doc, arg) {
    const options = { upsert: false };
    const updateDoc = {
      $set: {
        ...doc,
        classifications: {
          ...arg["newClassifications"]
        }
      },
    };
    var updatedDoc = collection.updateOne(filter, updateDoc, options);
    return updatedDoc;
  }
  // Find what we want to update
  const incidentId = arg["incident_id"];
  const taxonomy = arg["namespace"]
  var foundDoc;
  var filter = {
    $and: [
      {'incident_id': incidentId},
      {'namespace': namespace}
    ]
  }
  collection.findOne(filter).then(res => {
    foundDoc = res;
  }).then(() => {
    return update(filter, foundDoc, arg);
  });
};
