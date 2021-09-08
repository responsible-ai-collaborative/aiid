exports = function(arg){

  var submissionCollection = context.services.get("mongodb-atlas").db("aiidprod").collection("submissions");
  var incidentCollection = context.services.get("mongodb-atlas").db("aiidprod").collection("incidents");

  function stringToEpoch(dateString) {
    let someDate = new Date(dateString);
    let epoch = Math.floor(someDate.getTime()/1000);
    return epoch;
  }

  function getCloudinaryPublicID(url) {
    // https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_files
    const publicID = `reports/${url.replace(/^https?:\/\//, '')}`;
    return publicID;
  }

  function create(submittedReport, incident_id, report_number, ref_number) {


    // Provided by the submitted report
    var newReport = {
      description: submittedReport["description"],
      authors: submittedReport["authors"],
      image_url: submittedReport["image_url"],
      cloudinary_id: submittedReport["cloudinary_id"] || getCloudinaryPublicID(submittedReport["image_url"]),
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