# Server-side functions

These functions are defined in the MongoDB UI and are restated here so they will be in version control.


`updateIncidentClassification()`: Override incident classification for a given taxonomy.

```
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
```

`createReportForReview()`: Create a record for the `submissions` collection.

```
exports = function(arg){
  // IN REQUEST
  //authors: ""
  //date_downloaded: ""
  //date_published: ""
  //image_url: ""
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
```

`promoteReport()`: Promote a report from the `submissions` collection to the `incidents` collection.

```
exports = function(arg){

  var submissionCollection = context.services.get("mongodb-atlas").db("aiidprod").collection("submissions");
  var incidentCollection = context.services.get("mongodb-atlas").db("aiidprod").collection("incidents");

  function stringToEpoch(dateString) {
    let someDate = new Date(dateString);
    let epoch = Math.floor(someDate.getTime()/1000);
    return epoch;
  }

  function create(submittedReport, incident_id, report_number, ref_number) {


    // Provided by the submitted report
    var newReport = {
      description: submittedReport["description"],
      authors: submittedReport["authors"],
      image_url: submittedReport["image_url"],
      language: submittedReport["language"],
      source_domain: submittedReport["source_domain"],
      text: submittedReport["text"],
      title: submittedReport["title"],
      url: submittedReport["url"],

      date_downloaded: submittedReport["date_downloaded"],
      date_modified: submittedReport["date_modified"],
      date_published: submittedReport["date_published"],
      incident_date: submittedReport["incident_date"],

      epoch_date_downloaded: stringToEpoch(submittedReport["date_downloaded"]),
      epoch_date_modified: stringToEpoch(submittedReport["date_modified"]),
      epoch_date_published: stringToEpoch(submittedReport["date_published"]),
      epoch_incident_date: stringToEpoch(submittedReport["incident_date"]),
      epoch_date_submitted: stringToEpoch(submittedReport["date_submitted"]),

      submitters: submittedReport["submitters"],
      date_submitted: submittedReport["date_submitted"],
      report_number: submittedReport["report_number"]
    }

    // Provided by submitted incident or by finding the next ID
    newReport["incident_id"] = incident_id;

    // Derived from the database
    newReport["ref_number"] = ref_number;
    newReport["report_number"] = report_number;

    incidentCollection.insertOne(
      newReport
    ).then(()=>{
      submissionCollection.deleteOne( { "_id": objectId } )
    });
    return newReport;
  }

  // Test data REMOVE
  //const objectId = new BSON.ObjectId("5f7e8bde67a56464500eb211");
  //arg["_id"] = objectId;
  //incident_id = 1;
  // END REMOVE

  // UNCOMMENT
  //const objectId = new BSON.ObjectId(arg["_id"]);
  const objectId = arg["_id"];

  var incident_id, submittedDoc, newReportNumber, newIncidentID, newRefNumber;

  // Get the report number, which is global, then find the incident number, if needed, then get the ref number local to the incident
  submissionCollection.findOne({"_id": objectId}).then(res => {
    submittedDoc = res;
    incident_id = submittedDoc["incident_id"];
  }).then(() => {
    incidentCollection.find({}).sort({"report_number":-1}).limit(1).next().then(res => {
      newReportNumber = res["report_number"];
  }).then(() => {
    if(incident_id > 0) {
      newIncidentID = incident_id;
      var currentIncidentReports = incidentCollection.find({"incident_id": incident_id}).sort({"ref_number":-1}).limit(1).next().then(res => {
        newRefNumber = parseInt(res["ref_number"] + 1);
        create(submittedDoc, newIncidentID, newReportNumber, newRefNumber);
      });
    } else {
        incidentCollection.find().sort({"incident_id":-1}).limit(1).next().then(res => {
          newIncidentID = parseInt(res["incident_id"] + 1);
          newRefNumber = 1;
          create(submittedDoc, newIncidentID, newReportNumber, newRefNumber);
        });
    }
  });
  })

  return newIncidentID;
};
```

`quickAdd()`: Add a document to the `quickadd` collection.

```
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
```

`deleteSubmittedDocument()`: Delete a document that is sitting in the review queue.

```
exports = function(arg){
  var collection = context.services.get("mongodb-atlas").db("aiidprod").collection("submissions");
  const objectId = arg["_id"];
  const query = {"_id": objectId};
  collection.deleteOne(query);
  return;
};
```

`updateSubmissionReport`: Update an existing doc in the submissions collection.

```
exports = function(arg){

  // IN REQUEST
  //authors: ""
  //date_downloaded: ""
  //date_published: ""
  //image_url: ""
  //incident_date: ""
  //incident_id: ""
  //submitters: "Anonymous"
  //text: ""
  //title: ""
  //url: ""

  var submissionCollection = context.services.get("mongodb-atlas").db("aiidprod").collection("submissions");

  function update(arg, doc) {
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
      if(arg["incident_id"].length > 0) {
        record["incident_id"] = arg["incident_id"];
      }

      var collection = context.services.get("mongodb-atlas").db("aiidprod").collection("submissions");

      const options = { upsert: false };
      const filter = doc;
      const updateDoc = {
            $set: record,
      };
      var updatedDoc = collection.updateOne(filter, updateDoc, options);
      return updatedDoc;
  }

  const objectId = arg["_id"];

  var submittedDoc;

  submissionCollection.findOne({"_id": objectId}).then(res => {
    submittedDoc = res;
  }).then(() => {
    return update(arg, submittedDoc);
  });
};
```