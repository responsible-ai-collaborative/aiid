exports = function(arg){
  // IN REQUEST
  // (optional) incident_id: ""
  // (optional) namespace: ""
  var collection = context.services.get("mongodb-atlas").db("aiidprod").collection("classifications");

  var filter = {
    $and: []
  }
  if ( "incident_id" in arg ) {
    filter["$and"].push({'incident_id': arg["incident_id"]})
  }
  if ( "namespace" in arg ) {
    filter["$and"].push({'namespace': arg["namespace"]})
  }
  collection.find(filter).then(res => {
    return res;
  });
};
