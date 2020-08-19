// A class for managing the database. This is only for database admins.
var migrations = {};

migrations.getIncidents = function(query, callback) {
  dbInterface
    .then(() =>
        api.db.collection('incidents').find(query, {limit: 2000}).asArray()
    )
    .then(docs => {
      console.log(docs);
      callback(docs);
    }
    ).catch(err => console.error(`Callback error: ${err}`));
}

migrations.m12_updateDescription = function() {
  function callback(docs) {
    var doc = docs[0];

    if(typeof doc["text"] !== "string" || doc["text"].length < 400) {
      console.log("!!!Skipping short or empty text!!!")
      docs.shift();
      callback(docs);
      return
    }

    if(typeof doc["description"] === "string" && doc["description"].length > 0) {
      console.log("Skipping, has description already")
      docs.shift();
      callback(docs);
      return
    }
    console.log(doc["text"].substr(0, 400) + "...")

    var up = {};
    up["description"] = doc["text"].substr(0, 400) + "...";

    const update = {
      "$set": up
    };
    const query = {ref_number: doc["ref_number"], incident_id: doc["incident_id"]};

    const options = { "upsert": false };

    api.db.collection('incidents').updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated reference.`);
        } else {
          console.log('nothing updated');
        }
        docs.shift();
        callback(docs);
      })
      .catch(err => console.error(`Failed to update: ${err}`));
    console.log("------------");
  }
  migrations.getIncidents({}, callback);
}

migrations.m11_removeIsIncident = function() {
  var reportNumber = 0;
  function callback(docs) {

    var doc = docs[0];

    const query = {ref_number: doc["ref_number"], incident_id: doc["incident_id"]};
    var unset = {
      "is_incident": "",
    }
    const update = {
      "$set": query,
      "$unset": unset
    };

    const options = { "upsert": false };

    api.db.collection('incidents').updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated reference.`);
        } else {
          console.log('nothing updated');
        }
        docs.shift();
        callback(docs);
      })
      .catch(err => console.error(`Failed to update: ${err}`));
    console.log("------------");
  }
  migrations.getIncidents({}, callback);
}

migrations.m10_addSubmitter = function() {
  var reportNumber = 0;
  function callback(docs) {

    var doc = docs[0];

    const query = {ref_number: doc["ref_number"], incident_id: doc["incident_id"], submitters: []};
    
    const update = {
      "$set": {submitters: ["Anonymous"]}
    };

    const options = { "upsert": false };

    api.db.collection('incidents').updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated reference.`);
        } else {
          console.log('nothing updated');
        }
        docs.shift();
        callback(docs);
      })
      .catch(err => console.error(`Failed to update: ${err}`));
    console.log("------------");
  }
  migrations.getIncidents({}, callback);
}

migrations.m9_removeIsBad = function() {
  var reportNumber = 0;
  function callback(docs) {

    var doc = docs[0];

    const query = {ref_number: doc["ref_number"], incident_id: doc["incident_id"]};
    var unset = {
      "is bad": "",
    }
    const update = {
      "$set": query,
      "$unset": unset
    };

    const options = { "upsert": false };

    api.db.collection('incidents').updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated reference.`);
        } else {
          console.log('nothing updated');
        }
        docs.shift();
        callback(docs);
      })
      .catch(err => console.error(`Failed to update: ${err}`));
    console.log("------------");
  }
  migrations.getIncidents({}, callback);
}

migrations.m8_removeEndDate = function() {
  var reportNumber = 0;
  function callback(docs) {

    var doc = docs[0];

    const query = {ref_number: doc["ref_number"], incident_id: doc["incident_id"]};
    var unset = {
      "End Date": "",
    }
    const update = {
      "$set": query,
      "$unset": unset
    };

    const options = { "upsert": false };

    api.db.collection('incidents').updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated reference.`);
        } else {
          console.log('nothing updated');
        }
        docs.shift();
        callback(docs);
      })
      .catch(err => console.error(`Failed to update: ${err}`));
    console.log("------------");
  }
  migrations.getIncidents({}, callback);
}

migrations.m7_addReportNumber = function() {
  var reportNumber = 0;
  function callback(docs) {

    var doc = docs[0];

    var up = {};
    up["report_number"] = (reportNumber += 1);

    const update = {
      "$set": up
    };
    const query = {ref_number: doc["ref_number"], incident_id: doc["incident_id"]};
    
    const options = { "upsert": false };

    api.db.collection('incidents').updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated reference.`);
        } else {
          console.log('nothing updated');
        }
        docs.shift();
        callback(docs);
      })
      .catch(err => console.error(`Failed to update: ${err}`));
    console.log("------------");
  }
  migrations.getIncidents({}, callback);
}


migrations.m6_updateDateModified = function() {
  
  // M0 Free Tier and M2/M5 shared starter clusters don’t support read or write operations on the admin database,
  // which means this will time out if we do not do it iteratively with smaller updates.
  function innerLoop(incidentID) {
    var up = {};
    up["date_modified"] = "2020-06-14";
    const query = {"incident_id": incidentID};
    const update = {
      "$set": up
    };
    const options = {
      "upsert": false,
      "writeConcern": {"wtimeout": 120000}
    };
    api.db.collection('incidents').updateMany(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated ${modifiedCount} reference.`);
        } else {
          console.log('nothing updated');
        }
      })
      .catch(err => console.error(`Failed to update: ${err}`));
  }
  for(var i = 1; i < 90; i++){
    innerLoop(i);
  }
}

migrations.m5_addDateSubmitted = function() {
  // M0 Free Tier and M2/M5 shared starter clusters don’t support read or write operations on the admin database,
  // which means this will time out if we do not do it iteratively with smaller updates.
  function innerLoop(incidentID) {
    var up = {};
    up["date_submitted"] = "2019-06-01";
    const query = {"incident_id": incidentID};
    const update = {
      "$set": up
    };
    const options = {
      "upsert": false,
      "wtimeout": 120000
    };
    api.db.collection('incidents').updateMany(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated ${modifiedCount} reference.`);
        } else {
          console.log('nothing updated');
        }
      })
      .catch(err => console.error(`Failed to update: ${err}`));
  }
  for(var i = 1; i < 90; i++){
    innerLoop(i);
  }
}

/**
 * Set the incident date to:
 * -- the earliest date of incident_dates among the reports; or
 * -- the earliest date of the published_dates among the reports
 * -- AND ensure that all the incident dates are shared
 */
migrations.m4_setDates = function() {
  function callback(docs) {
    if(docs.length < 1) {
      console.log("No incidents attached to incident ID");
      return;
    }
    var minDate = "z";
    for(var i = 0; i < docs.length; i++) {
      if( minDate > docs[i]["date_published"] ) {
        minDate = docs[i]["date_published"];
      }
      if( minDate > docs[i]["incident_date"] ) {
        minDate = docs[i]["incident_date"];
      }
    }
    if(minDate === "z") {
      console.log(`Incident ${docs[0]["incident_id"]} has no incident date`);
      if( docs[0]["incident_id"] < 90 )
        migrations.getIncidents({"incident_id": docs[0]["incident_id"] + 1}, callback);
      return;
    }
    console.log("minDate: " + minDate);

    var up = {};
    up["incident_date"] = minDate;
    
    const query = {incident_id: docs[0]["incident_id"]};
    const update = {
      "$set": up
    };
    const options = { "upsert": false };
    api.db.collection('incidents').updateMany(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated ${modifiedCount} reference.`);
        } else {
          console.log('nothing updated');
        }
        if( docs[0]["incident_id"] < 90 )
          migrations.getIncidents({"incident_id": docs[0]["incident_id"] + 1}, callback);
      })
      .catch(err => console.error(`Failed to update: ${err}`));
    
  }
  migrations.getIncidents({"incident_id": 1}, callback);
}

migrations.m3_fixLanguage = function() {
  function callback(docs) {

    var doc = docs[0];

    var up = {};
    up["language"] = "en";
    
    var unset = {
      "End Date": ""
    }
    
    const update = {
      "$set": up,
      "$unset": unset
    };
    const query = {ref_number: doc["ref_number"], incident_id: doc["incident_id"]};
    
    const options = { "upsert": false };

    api.db.collection('incidents').updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated reference.`);
        } else {
          console.log('nothing updated');
        }
        docs.shift();
        callback(docs);
      })
      .catch(err => console.error(`Failed to update: ${err}`));
    console.log("------------");
  }
  migrations.getIncidents({"language": {$ne: "en"}}, callback);
}

migrations.m2_fix1970 = function() {
  function updateDateString(dateString) {
    if(dateString == "1970-01-01") {
      return undefined;
    }
    if(dateString == null) {
      return undefined;
    }
    if(dateString.length < 7) {
      return undefined;
    }
    const unixTimeZero = new Date(dateString);
    return unixTimeZero.toISOString().split('T')[0];
  }

  function iterativeUpdate (docs) {
    var doc = docs[0];

    var unset = {
      "End Date": "",
    }

    var up = {};
    up["incident_date"] = updateDateString(doc["incident_date"]);
    up["date_downloaded"] = updateDateString(doc["date_downloaded"]);
    up["date_modified"] = updateDateString(doc["date_modified"]);
    up["date_published"] = updateDateString(doc["date_published"]);

    console.log(doc);
    if( doc["incident_date"] == up["incident_date"] && doc["date_downloaded"] == up["date_downloaded"] && doc["date_modified"] == up["date_modified"] && doc["date_published"] == up["date_published"]) {
      console.log("no date changes");
    } else {
      console.log("Updating dates");
    }
    const update = {
      "$set": up,
      "$unset": unset
    };
    const query = {ref_number: doc["ref_number"], incident_id: doc["incident_id"]};
    
    const options = { "upsert": false };

    api.db.collection('incidents').updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated reference.`);
        } else {
          console.log('nothing updated');
        }
        docs.shift();
        iterativeUpdate(docs);
      })
      .catch(err => console.error(`Failed to update: ${err}`));
    console.log("------------");
  }
  migrations.getIncidents({"date_modified": "1970-01-01"}, iterativeUpdate);
}

// Clean up the MongoDB Database
migrations.m1_migrateToV2 = function() {

  function updateDateString(dateString) {
    if(dateString == null) {
      return undefined;
    }
    if(dateString.length < 7) {
      return undefined;
    }
    const unixTimeZero = new Date(dateString);
    return unixTimeZero.toISOString().split('T')[0];
  }

  function iterativeUpdate (docs) {
    var doc = docs[0];

    while (!('date_download' in doc)) {
      console.log("Skipping already migrated:");
      console.log(doc);
      docs.shift();
      doc = docs[0];
    }

    var up = {};
    up["incident_id"] = doc["incident_id"];
    up["ref_number"] = doc["ref_number"];

    up["is_incident"] = (doc["v1_incident"] != true || doc["Meets Preliminary Definition"] == "Y");

    up["incident_date"] = updateDateString(doc["Start Date"]);
    up["date_downloaded"] = updateDateString(doc["date_download"]);
    up["date_modified"] = updateDateString(doc["date_modify"]);
    up["date_published"] = updateDateString(doc["date_publish"]);

    up["submitters"] = [doc["Submitter"]];

    var unset = {
      "Start Date": "",
      "date_download": "",
      "date_modify": "",
      "date_publish": "",
      "Submitter": "",
      
      "Meets Preliminary Definition": "",
      
      "Sam Yoon Assessed Harm Caused": "",
      "Sam Yoon Assessed Harmed Party": "",

      "Sam Yoon Assessed Response or Mitigation": "",
      "Sam Yoon Description": "",
      "Sam Yoon Estimated Scale of Harm": "",
      "Sam Yoon Search Words": "",
      
      "Uncertain": "",
      "filename": "",
      "localpath": "",
      "title_page": "",
      "title_rss": "",
      "v1_incident": ""
    }

    console.log("UPDATING");
    console.log(up);
    const query = {ref_number: up["ref_number"], incident_id: up["incident_id"]};
    const update = {
      "$set": up,
      "$unset": unset
    };
    const options = { "upsert": false };

    api.db.collection('incidents').updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated reference.`);
          docs.shift();
          iterativeUpdate(docs);
        }
      })
      .catch(err => console.error(`Failed to update: ${err}`));
  }

  // Get the 
  dbInterface
      .then(() =>
          api.db.collection('incidents').find({}, {limit: 2000}).asArray()
      )
      .then(docs => {
        iterativeUpdate(docs);
        console.log(docs);
      }
      ).catch(err => console.error(`login failed with error: ${err}`));
}