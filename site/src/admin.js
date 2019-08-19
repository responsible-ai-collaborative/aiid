var isAdmin = false;
var adminMongoInterface;
var db;

// Automatically grow a text area for the size of the input.
function autoGrow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function serializeQuery(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return "?" + str.join("&");
}

function updateRecord(obj) {
    var up = {};
    var elems = $(".db-text-area");
    for(var i = 0; i < elems.length; i++) {
        up[elems[i].getAttribute('data-database-key')] = $.trim(elems[i].value);
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

    db.collection('incidents').updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated reference.`)
        }
      })
      .catch(err => console.error(`Failed to update: ${err}`));
}

// Add the admin script the page if the API key is defined
var urlQuery = parseQuery(window.location.search);
if(urlQuery["admin_key"] !== undefined) {
    isAdmin = true;
    const mongoDBClient = stitch.Stitch.initializeDefaultAppClient('aiidstitch2-fuwyv');
    db = mongoDBClient.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('aiidprod');
    const credential = new stitch.UserApiKeyCredential(urlQuery["admin_key"]);

    adminMongoInterface = stitch.Stitch.defaultAppClient.auth.loginWithCredential(credential);
    adminMongoInterface
      .then(authedId => {
         console.log(`successfully logged in with id: ${authedId}`);
      }).catch(err => console.error(`login failed with error: ${err}`));
}
