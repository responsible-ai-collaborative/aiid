exports = function(arg){
  var collection = context.services.get("mongodb-atlas").db("aiidprod").collection("submissions");
  const objectId = arg["_id"];
  const query = {"_id": objectId};
  collection.deleteOne(query);
  return;
};
