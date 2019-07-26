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

// Add the admin script the page if the API key is defined
var urlQuery = parseQuery(window.location.search);
if(urlQuery["admin_key"] !== undefined) {
    const mongoDBClient = stitch.Stitch.initializeDefaultAppClient('aiidstitch-xudhz');
    db = mongoDBClient.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-stitch-atlas').db('aiidprod');
    const credential = new stitch.UserApiKeyCredential(urlQuery["admin_key"]);

    adminMongoInterface = stitch.Stitch.defaultAppClient.auth.loginWithCredential(credential);
    adminMongoInterface
      .then(authedId => {
         console.log(`successfully logged in with id: ${authedId}`);
      }).catch(err => console.error(`login failed with error: ${err}`));
}
