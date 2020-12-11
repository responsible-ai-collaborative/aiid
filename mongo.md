# "Serverless" Database

The AIID is stored on MongoDB as document collections and hosted in [MongoDB Realm](https://www.mongodb.com/realm). MongoDB is responsible for managing the availability and backups of the database, as well as presenting web-accessible APIs for the content. This document details the database structure as is present on the MongoDB servers. Database exports are available upon request to `aiid.export@incidentdatabase.ai`, but for most database development needs you should be able to interface with the production database.

# Administering Data

Administering data requires administrative access to the database. This access is presently limited, but through additional functionality that can protect data from vandalism, we may open it to less privileged parties.

# Collections

* `incidents`: this is the main incident database
* `quickadd`: A collection of links without their associated content. This is to make it easier to capture lots of data that needs to subsequently get processed into full records.
* `submissions`: Prospective full incidents before they are rotated into the `incidents` collection. These should have the complete `incidents` schema minus the elements that are granted when promoted to incident reports.

# Incidents Collection Details

Systems

* _id: 5534b8c29cfd494a0103d45a # MongoDB database hash
* incident_id: 1 # (int) The incrementing primary key for incidents, which are a collection of reports.
* ref_number: 25 # (int) The reference number scoped to the incident ID.
* report_number: 2379 # (int) the incrementing primary key for the report. This is a global resource identifier.

Dates

* incident_date: `2019-07-25` # (Date) Date the incident occurred. Defaults to the article date.
* date_downloaded:`2019-07-25` # (Date) Date the report was downloaded.
* date_submitted:`2019-07-25` # (Date) Date the report was submitted to the AIID. This determines citation order.
* date_modified: `2019-07-25` # (Date or null) Date the report was edited.
* date_published: `2019-07-25` # (Date or null) The publication date of the report.

People

* submitters: Array(string) # People that submitted the incident report
* authors: Array(string) # People that wrote the incident report

Text

* title: "title of the report" # (string) The title of the report that is indexed.
* description: "Short text for the report"
* text: "Long text for the report" # (string) This is the complete text for the report in the MongoDB instance, and a shortened subset in the Algolia index

Media

* language: "en" # (string) The language identifier of the report.
* image_url: "http://si.wsj.net/public/resources/images/BN-IM269_YouTub_P_2015051817" # (string) The URL for the image that is indexed. This will be stored on the server as a hash of the URL.
* source_domain: "blogs.wsj.com" # (string) The domain name hosting the report.
* url: "https://blogs.wsj.com/digits/2015/05/19/googles-youtube-kids-app-criti" # The fully qualified URL to the report as hosted on the web.

```
{
  "title": "incident",
  "properties": {
    "_id": {
      "bsonType": "objectId"
    },
    "authors": {
      "bsonType": "array",
      "items": {
        "bsonType": "string"
      }
    },
    "date_downloaded": {
      "bsonType": "string"
    },
    "date_modified": {
      "bsonType": "string"
    },
    "date_published": {
      "bsonType": "string"
    },
    "date_submitted": {
      "bsonType": "string"
    },
    "description": {
      "bsonType": "string"
    },
    "flag": {
      "bsonType": "bool"
    },
    "image_url": {
      "bsonType": "string"
    },
    "incident_date": {
      "bsonType": "string"
    },
    "incident_id": {
      "bsonType": "int"
    },
    "language": {
      "bsonType": "string"
    },
    "ref_number": {
      "bsonType": "int"
    },
    "report_number": {
      "bsonType": "int"
    },
    "source_domain": {
      "bsonType": "string"
    },
    "submitters": {
      "bsonType": "array",
      "items": {
        "bsonType": "string"
      }
    },
    "text": {
      "bsonType": "string"
    },
    "title": {
      "bsonType": "string"
    },
    "url": {
      "bsonType": "string"
    }
  }
}
```

# QuickAdd Collection

```
{
  "title": "quickadd",
  "properties": {
    "_id": {
      "bsonType": "objectId"
    },
    "date_submitted": {
      "bsonType": "string"
    },
    "incident_id": {
      "bsonType": "long"
    },
    "source_domain": {
      "bsonType": "string"
    },
    "url": {
      "bsonType": "string"
    }
  }
}
```

# Submissions Collection

```
{
  "title": "submission",
  "properties": {
    "_id": {
      "bsonType": "objectId"
    },
    "authors": {
      "bsonType": "array",
      "items": {
        "bsonType": "string"
      }
    },
    "date_downloaded": {
      "bsonType": "string"
    },
    "date_modified": {
      "bsonType": "string"
    },
    "date_published": {
      "bsonType": "string"
    },
    "date_submitted": {
      "bsonType": "string"
    },
    "description": {
      "bsonType": "string"
    },
    "image_url": {
      "bsonType": "string"
    },
    "incident_date": {
      "bsonType": "string"
    },
    "incident_id": {
      "bsonType": "long"
    },
    "language": {
      "bsonType": "string"
    },
    "source_domain": {
      "bsonType": "string"
    },
    "submitters": {
      "bsonType": "array",
      "items": {
        "bsonType": "string"
      }
    },
    "text": {
      "bsonType": "string"
    },
    "title": {
      "bsonType": "string"
    },
    "url": {
      "bsonType": "string"
    }
  }
}
```

# Server-side functions

These functions are defined in the MongoDB UI and are restated here so they will be in version control.


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
  
  var record = {
    authors: arg["authors"].split(","),
    date_downloaded: arg["date_downloaded"],
    date_published: arg["date_published"],
    image_url: arg["image_url"],
    incident_date: arg["incident_date"],
    incident_id: 0,
    submitters: arg["submitters"].split(","),
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
        newRefNumber = res["ref_number"] + 1;
        create(submittedDoc, newIncidentID, newReportNumber, newRefNumber);
      });
    } else {
        incidentCollection.find().sort({"incident_id":-1}).limit(1).next().then(res => {
          newIncidentID = res["incident_id"] + 1;
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