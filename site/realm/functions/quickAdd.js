exports = function(arg){
  // IN REQUEST
  //url: ""
  
  let url = new URL(arg["url"]);
  
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  date_modified = yyyy + '-' + mm + '-' + dd ; 
  
  var record = {
    incident_id: 0,
    url: arg["url"],
    date_submitted: date_modified,
    source_domain: url.hostname
  }

  var collection = context.services.get("mongodb-atlas").db("aiidprod").collection("quickadd");
  var doc = collection.insertOne(record);
  return record;
};
