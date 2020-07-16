var api = {};

api.dbInterface = undefined; // This will be set internally
api.db = undefined; // This will be set internally

api.isAdmin = false; // This will be changed on login if there are admin credentials

/**
 * Open a connection to the database for the API to work more quickly on subsequent requests.
 */
api.initializeDatabase = function() {
  var urlQuery = lib.parseQuery(window.location.search);
  const mongoDBClient = stitch.Stitch.initializeDefaultAppClient('aiidstitch2-fuwyv');
  api.db = mongoDBClient.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('aiidprod');
  if(urlQuery["admin_key"] !== undefined) {
    api.isAdmin = true;
    var credential = new stitch.UserApiKeyCredential(urlQuery["admin_key"]);
  } else {
    credential = new stitch.AnonymousCredential(); // Anonymous user doesn't have update permissions
  }
  dbInterface = stitch.Stitch.defaultAppClient.auth.loginWithCredential(credential);
  dbInterface
    .then(authedId => {
       console.log(`successfully logged in with id: ${authedId}`);
    }).catch(err => console.error(`login failed with error: ${err}`));
}

/**
 * Get all the distinct author collections across all the docs.
 */
api.getAuthors = function(callback) {
  const options = { "projection": {"authors": 1} };
  dbInterface
    .then(() =>
      api.db.collection('incidents').aggregate([{$group: {_id: null, uniqueValues: {$addToSet: "$authors"}}}]).asArray()
    )
    .then(docs => {
      callback(docs);
    }
    ).catch(err => console.error(`Callback error: ${err}`));
}

/**
 * Get all the incidents records from the MongoDB instance with a matching incident reference.
 */
api.getIncidentReferences = function(incidentID, callback) {
  var incident_id = incidentID;
  const query = {incident_id: incident_id};

  dbInterface
    .then(() =>
        api.db.collection('incidents').find(query, {limit: 2000}).asArray()
    )
    .then(docs => {
      callback(docs);
    }
    ).catch(err => console.error(`Callback error: ${err}`));
}

/**
 * Delete a report.
 */
api.deleteReport = function(ref_number, report_number) {
  var query = {ref_number:ref_number, report_number:report_number};
  if( !(ref_number >= 0) || !(report_number > 0)){
    console.log("Could not delete: " + ref_number + " and " + report_number);
    return;
  }
  api.db.collection('incidents').deleteOne(query)
    .then(result => console.log(`Deleted ${result.deletedCount} item(s).`))
    .catch(err => console.error(`Delete failed with error: ${err}`))
}

/**
 * Update an incident record in the MongoDB database
 */
api.updateRecord = function(obj) {

  var listAttributes = ["authors", "submitters"];

  if(! api.isAdmin ) {
    console.log("This is for admins!")
    return;
  } 

  var up = {};
  var elems = $(".db-text-area");
  for(var i = 0; i < elems.length; i++) {
    var databaseKey = elems[i].getAttribute('data-database-key');
    if(listAttributes.indexOf(databaseKey) >= 0) {
      var listVals = elems[i].value.split(",").map($.trim);
      up[databaseKey] = listVals;
    } else {
      up[databaseKey] = $.trim(elems[i].value);
    }
  }
  var incident_id = parseInt(up["incident_id"]);
  var ref_number = parseInt(up["ref_number"]);
  up["incident_id"] = incident_id;
  up["ref_number"] = ref_number;
  console.log("UPDATING");
  console.log(up);
  const query = {ref_number: ref_number, incident_id: incident_id};
  const update = {
    "$set": up
  };
  const options = { "upsert": false };

  api.db.collection('incidents').updateOne(query, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated reference.`)
      }
    })
    .catch(err => console.error(`Failed to update: ${err}`));
}

/**
 * All renferences to the author will be removed from reports. This is used to clean incidents.
 */
api.pullAuthor = function(authorString) {

  if(! api.isAdmin ) {
    console.log("This is for admins!")
    return;
  }

  if( authorString.length < 1 ) {
    console.log("pulled authors must be at least 2 characters long");
    return;
  }

  api.db.collection('incidents').updateOne(
      { authors: { $in: [authorString] } },
      { $pull: { authors: { $in: [ authorString ] } } },
      { multi: true }
  ).then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated ${modifiedCount} references.`)
      }
    })
    .catch(err => console.error(`Failed to update: ${err}`));
}

/**
 * Assign incident records associated with a specific incident ID to have the values
 * associated with a key.
 */
api.assignByButton = function() {
  // data-key="incident_date" data-value="${item["incident_date"]}" data-incident-id="${incident_id}"
  var button = $(this);
  var k = button.data("key");
  var v = button.data("value");
  var incident_id = button.data("incident-id");
  console.log(`Setting ${k} to ${v} for all reports on incident ${incident_id}`);
  
  var up = {};
  up[k] = v;
  const query = {incident_id: incident_id};
  const update = {
    "$set": up
  };
  const options = { "upsert": false };

  api.db.collection('incidents').updateMany(query, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated reference.`)
      }
    })
    .catch(err => console.error(`Failed to update: ${err}`));
}

// This returns the Index for loading to Algolia
api.downloadIndex  = function() {

  if(! api.isAdmin ) {
    console.log("This is for admins!")
    return;
  }

  console.log("Downloading index...");
  dbInterface
      .then(() =>
          api.db.collection('incidents').find({}, {limit: 2000}).asArray()
      )
      .then(docs => {
        function truncate(doc) {
          for (const [key, value] of Object.entries(doc)) {
            if(typeof(value) == "string") {
              if(value.length > 8000) {
                doc[key] = value.substring(0, 8000);
              }
            }
          }
          return doc;
        }
        docs.map(truncate);
        console.log("Downloaded up to 2k documents, total downloaded:");
        console.log(docs.length);
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(docs)], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = "new_index.json";
        a.click();
      }
      ).catch(err => console.error(`login failed with error: ${err}`));
}

api.flagReport = function(reportNumber) {
  var up = {};
  up["flag"] = true;
  const query = {report_number: reportNumber};
  const update = {
    "$set": up
  };
  const options = { "upsert": false };

  api.db.collection('incidents').updateOne(query, update, options)
    .then(result => {
      const { matchedCount, modifiedCount } = result;
      if(matchedCount && modifiedCount) {
        console.log(`Successfully updated reference.`)
      }
    })
    .catch(err => console.error(`Failed to update: ${err}`));
}

$( document ).ready(api.initializeDatabase);
