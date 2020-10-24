// A pile of helpful functions.

var lib = {};

/**
 * Update the URL of the page to contain the current query.
 **/
lib.pushURL = function(facets, search) {
  var urlQueryObj = {};
  for (const [key, value] of Object.entries(facets)) {
    urlQueryObj[key] = value;
  }
  urlQueryObj["s"] = search;
  const state = {};
  const title = '';
  const currentQueryObject = lib.parseQuery(window.location.search);
  for(var i = 0; i < facetList.length; i++) {
    if(facetList[i] in currentQueryObject) {
      delete currentQueryObject[facetList[i]];
    }
  }
  const mergedquery = { ...currentQueryObject, ...urlQueryObj };
  const url = 'index.html' + lib.serializeQuery(mergedquery);
  history.pushState(state, title, url);
}

/**
 * Automatically grow a text area for the size of the input.
 **/
lib.autoGrow = function(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

/**
 * Serialize additional query parameters with the current query by
 * intersecting the new query parameters with the ones currently
 * on the parameter string.
 */
lib.mergeQuery = function(queryObject) {
  const currentQueryObject = lib.parseQuery(window.location.search);
  const mergedquery = { ...currentQueryObject, ...queryObject };
  return `${lib.serializeQuery(mergedquery)}`;
}

/**
 * Parse the query on the URL into a dictionary.
 **/
lib.parseQuery = function(queryString) {
  if(queryString.length < 1) {
    return {};
  }
  var query = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

/**
 * Convert a dictionary to a URL query string.
 **/
lib.serializeQuery = function(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return "?" + str.join("&");
}


lib.isValidHttpUrl = function(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * Checks that docs conform to expectations
 **/
lib.validations = {};

lib.validations.incidentDatesAreConsistent = function(docs) {
  var incidentDate = docs[0]["incident_date"];
  var consistent = true;
  docs.forEach(doc => consistent = consistent && incidentDate == doc["incident_date"]);
  if(consistent) {
    return "";
  } else {
    return `<div class="alert alert-danger" role="alert">
    Data Consistency Issue: Incident Dates are not consistent.
    ${docs.map(item =>
      `<li>${ item.ref_number }: <button type="button" class="btn btn-warning btn-sm assignment-button" data-key="incident_date" data-value="${item["incident_date"]}" data-incident-id="${item["incident_id"]}">Assign Date</button>${item["incident_date"]}</li>`
    ).join('')}</div>`;
  }
}

lib.validations.linksAreWellformed = function(docs) {
  var consistent = true;
  var badDocs = [];
  function collectBad(doc) {
    if(! lib.isValidHttpUrl(doc["url"])) {
      consistent = false;
      badDocs.push(doc)
    }
  }
  docs.forEach(collectBad);
  if(consistent) {
    return "";
  } else {
    return `<div class="alert alert-danger" role="alert">
    Data Issue: Some URLs are not well-formed.
    ${badDocs.map(item =>
      `<li>${ item.ref_number }: <i class="pointer fas fa-search-plus" title="Complete Information" onclick="showDetailModal(this)" data-target="#detailmodal" data-ref-number="${ item.ref_number }" data-incident-id="${ item.incident_id }"></i> ${item["url"]}</li>`
    ).join('')}</div>`;
  }
}

lib.validations.datesAreWellFormedOrBlank = function(docs, dateField) {
  var consistent = true;
  var badDocs = [];
  function collectBad(doc) {
    if(! Date.parse(doc[dateField]) > 0) {
      consistent = false;
      badDocs.push(doc);
    }
  }
  docs.forEach(collectBad);
  if(consistent) {
    return "";
  } else {
    return `<div class="alert alert-danger" role="alert">
    Date Issue: Bad ${dateField}
    ${badDocs.map(item =>
      `<li>${ item.ref_number }: <i class="pointer fas fa-search-plus" title="Complete Information" onclick="showDetailModal(this);var windowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';window.open('${item.url}', 'Review Window', windowFeatures);" data-target="#detailmodal" data-ref-number="${ item.ref_number }" data-incident-id="${ item.incident_id }"></i> ${item[dateField]}</li>`
    ).join('')}</div>`;
  }
}

lib.validations.isListField = function(docs, field) {
  var consistent = true;
  var badDocs = [];
  function collectBad(doc) {
    if(! doc[field].length > 0) {
      consistent = false;
      badDocs.push(doc);
    }
  }
  docs.forEach(collectBad);
  if(consistent) {
    return "";
  } else {
    return `<div class="alert alert-danger" role="alert">
    Date Issue: Bad ${field}
    ${badDocs.map(item =>
      `<li>${ item.ref_number }: <i class="pointer fas fa-search-plus" title="Complete Information" onclick="showDetailModal(this)" data-target="#detailmodal" data-ref-number="${ item.ref_number }" data-incident-id="${ item.incident_id }"></i> ${item[field]}</li>`
    ).join('')}</div>`;
  }
}

lib.validations.hasContent = function(docs, field) {
  var consistent = true;
  var badDocs = [];
  function collectBad(doc) {
    if(!doc[field] || !doc[field].length > 0) {
      consistent = false;
      badDocs.push(doc);
    }
  }
  docs.forEach(collectBad);
  if(consistent) {
    return "";
  } else {
    return `<div class="alert alert-danger" role="alert">
    Data Issue: Bad ${field}
    ${badDocs.map(item =>
      `<li>${ item.ref_number }: <i class="pointer fas fa-search-plus" title="Complete Information" onclick="showDetailModal(this)" data-target="#detailmodal" data-ref-number="${ item.ref_number }" data-incident-id="${ item.incident_id }"></i> ${item[field]}</li>`
    ).join('')}</div>`;
  }
}

lib.validations.isInteger = function(docs, field) {
  var consistent = true;
  var badDocs = [];
  function collectBad(doc) {
    if(!Number.isInteger(doc[field])) {
      consistent = false;
      badDocs.push(doc);
    }
  }
  docs.forEach(collectBad);
  if(consistent) {
    return "";
  } else {
    return `<div class="alert alert-danger" role="alert">
    Data Issue: ${field} is not an integer
    ${badDocs.map(item =>
      `<li>${ item.ref_number }: <i class="pointer fas fa-search-plus" title="Complete Information" onclick="showDetailModal(this)" data-target="#detailmodal" data-ref-number="${ item.ref_number }" data-incident-id="${ item.incident_id }"></i> ${item[field]}</li>`
    ).join('')}</div>`;
  }
}
