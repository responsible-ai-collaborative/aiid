exports = function(arg){
  // IN REQUEST
  //authors: ""
  //date_downloaded: ""
  //date_published: ""
  //image_url: ""
  //cloudinary_id: ""
  //incident_date: ""
  //incident_id: ""
  //submitters: "Anonymous"
  //text: ""
  //title: ""
  //url: ""
  
  let url = new URL(arg["url"]);
  
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  date_modified = yyyy + '-' + mm + '-' + dd ; 
  
  var authors = arg["authors"]
  if( typeof authors === 'string' ) {
    authors = arg["authors"].split(",").map(function(item){return item.trim()});
  }

  var submitters = arg["submitters"]
  if( typeof submitters === 'string' ) {
    submitters = arg["submitters"].split(",").map(function(item){return item.trim()});
  }
  
  var record = {
    authors: authors,
    date_downloaded: arg["date_downloaded"],
    date_published: arg["date_published"],
    image_url: arg["image_url"],
    cloudinary_id: arg["cloudinary_id"],
    incident_date: arg["incident_date"],
    incident_id: 0,
    submitters: submitters,
    text: arg["text"],
    title: arg["title"],
    url: arg["url"],
    date_submitted: date_modified,
    date_modified: date_modified,
    description: arg["text"].substring(0, 200),
    language: "en",
    source_domain: url.hostname
  }
  if(arg["incident_id"].length > 0 || typeof arg["incident_id"] === 'number') {
    record["incident_id"] = parseInt(arg["incident_id"]);
  }

  var collection = context.services.get("mongodb-atlas").db("aiidprod").collection("submissions");
  var doc = collection.insertOne(record);
  return record;
};