exports = function(arg){
  // IN REQUEST
  // (optional) incident_id: ""
  var collection = context.services.get("mongodb-atlas").db("aiidprod").collection("incidents");

  var filter = {
    $and: []
  }
  if ( "incident_id" in arg ) {
    filter["$and"].push({'incident_id': incidentId})
  }
  collection.find(filter).then(res => {
    return res;
  });
};
