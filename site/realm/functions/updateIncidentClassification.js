exports = function(arg){
  // IN REQUEST
  // incident_id: ""
  // namespace: ""
  // notes: ""
  // newClassifications: { ...taxonomy fields with values }
  var collection = context.services.get("mongodb-atlas").db("aiidprod").collection("classifications");
  function update(filter, doc, arg) {
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        ...doc,
        classifications: {
          ...arg["newClassifications"]
        },
        notes: arg["notes"]
      },
    };
    var updatedDoc = collection.updateOne(filter, updateDoc, options);
    return updatedDoc;
  }
  // Find what we want to update
  const incidentId = arg["incident_id"];
  const namespace = arg["namespace"];
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
