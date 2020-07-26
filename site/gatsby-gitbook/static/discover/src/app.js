/* global algoliasearch instantsearch renderBig */

// Should the big or the small cards be rendered?
var renderBig = false;

// Modal popups giving details about the specific card
function showFlagModal(ev) {
  const reportNumber = $( ev ).data("report-number");
  const modal = $('#flagmodal');
  $(".flag-button").click(function(){api.flagReport(reportNumber);});
  modal.modal();
}
function showAuthorModal(ev) {
    var modal = $('#authormodal');
    modal.find("#author-modal").text($( ev ).children().text());
    modal.modal();
}
function showSubmitterModal(ev) {
    var modal = $('#submittermodal');
    modal.find("#submitter-modal").text($( ev ).children().text());
    modal.modal();
}

// Switch to single column and display long articles
// function filterToIncident(ev) {
//     var incident_id = parseInt(ev.getAttribute("data-incident-id"));
//     var incidentForm = document.getElementById("incident-text-input");
//     renderBig = true;
//     incidentForm.value = incident_id;
//     incidentForm.dispatchEvent(new Event("input"));
// }

// A modal that appears when the user clicks the magnifying glass on a card.
// This gives the complete record detail
function showDetailModal(ev) {
  var modal = $('#detailmodal');
  var ref_number = parseInt(ev.getAttribute("data-ref-number"));
  var incident_id = parseInt(ev.getAttribute("data-incident-id"));
  if(!api.isAdmin) {
      modal.find("#detail-modal").html("<p>You must specify an Admin Key to have access to this.</p>");
      modal.modal();
      return;
  }
  dbInterface
    .then(() =>
      api.db.collection('incidents').find({ref_number: ref_number, incident_id: incident_id}, {limit: 1}).asArray()
    ).then(docs => {
        json = docs[0];
        var renderKeys = ["title", "description", "text", "date_published", "image_url", "incident_id", "ref_number", "is_incident", "incident_date", "submitters", "authors", "language", "url"];
        var textForms = "";
        if( typeof json["is bad"] === "undefined" ) {
            json["is bad"] = "";
        }
        for(var i = 0; i < renderKeys.length; i++) {
            textForms += `
                <h3>${renderKeys[i]}</h3>
                <textarea class="form-control db-text-area" data-database-key="${renderKeys[i]}" onkeyup="lib.autoGrow(this)" onclick="lib.autoGrow(this)">${json[renderKeys[i]]}</textarea>`;
        }

        var rendered = `
            <div class="card_pad col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <div class="card">
                <div class="card-header">
                  <h1 class="article-header">${json.title}</h1>
                </div>
                <div class="card-body">
                  <article>
                    <div class="form-group col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <form>
                            ${textForms}
                            <textarea style="display:none" class="form-control db-text-area" data-database-key="incident_id">${incident_id}</textarea>
                            <textarea style="display:none" class="form-control db-text-area" data-database-key="ref_number">${ref_number}</textarea>
                        </form>
                        <button type="button" class="btn btn-warning" onclick="api.updateRecord(this)">Submit</button>
                    </div>
                    <h2>Read Only</h2>

                        <h3>Database ID</h3>
                        ${json["_id"]}

                        <h3>Report Number</h3>
                        ${json["report_number"]}

                        <h3>Date Downloaded</h3>
                        ${json["date_downloaded"]}

                        <h3>Date Modified</h3>
                        ${json["date_modified"]}

                        <h3>Source Domain</h3>
                        ${json["source_domain"]}

                        <button type="button" class="btn btn-danger btn-sm btn-block" onclick="api.deleteReport(${ json.ref_number }, ${ json.report_number })">Delete Ref ${json.ref_number}, Rep #${ json.report_number }</button>
                  </article>
                </div>
                <div class="align-bottom">
                  <p><img class="image-preview" onerror="this.style.display='none';this.onerror=null;this.parentElement.className='fas fa-robot fa-5x';" src='${json.image_url}'></p>
                </div>
                <div class="card-footer text-muted">
                  <p>
                    <a href=${ json.url }><i class="far fa-newspaper" title="Read the Source"></i></a>
                    <i class="pointer far fa-id-card"  title="Authors" onclick="showAuthorModal(this)" data-toggle="modal" data-target="#authormodal"><span style="display:none;">${ json.authors }</span></i>
                    <i class="pointer fas fa-user-shield"  title="Submitters" onclick="showSubmitterModal(this)" data-toggle="modal" data-target="#submittermodal"><span style="display:none;">${ json.Submitter }</span></i>
                    <i class="fas fa-hashtag" title="Incident ID"></i>${ json.incident_id }
                  </p>
                </div>
              </div>
            </div>`
        modal.find("#detail-modal").html(rendered);
        modal.modal();
    }).catch(err => console.error(`login failed with error: ${err}`));
}

/**
 * A function that renders additional content when an individual incident is viewed in detail.
 * This will be prepended to #incident_detail.
 */
function renderIncidentDetailCard(hits, cardCSS) {

  if( hits.length < 1 ) {
    $("#incident_detail").html("");
    return;
  }

  var incident_id = hits[0]['incident_id'];
  console.log(incident_id);
  console.log("+++++++");

  function collectErrors(docs) {
    var errors = "";
    errors += lib.validations.incidentDatesAreConsistent(docs);
    errors += lib.validations.linksAreWellformed(docs);
    var dateFields = ["date_downloaded", "date_modified", "date_published", "date_submitted", "incident_date"];
    dateFields.forEach(field => errors += lib.validations.datesAreWellFormedOrBlank(docs, field));
    var listFields = ["authors", "submitters"];
    listFields.forEach(field => errors += lib.validations.isListField(docs, field));
    var textFields = ["description", "text", "title"];
    textFields.forEach(field => errors += lib.validations.hasContent(docs, field));
    var integerFields = ["ref_number", "report_number", "incident_id"];
    integerFields.forEach(field => errors += lib.validations.isInteger(docs, field));
    errors += lib.validations.isIncident(docs);
    if(errors !== "") {
      errors = "<h2>Incident Validation Failures</h2>" + errors;
    }
    return errors;
  }

  function getCitation(docs) {

    // Sort the docs according to their submit date
    docs.sort(function(a, b){
      return a["submission_date"] > b["submission_date"];
    });

    // Return the submitters across all docs that are distinct
    var submitters = [];
    docs.forEach(element => submitters.push(element["submitters"][0]));//Only supporting the first submitter on the doc
    let submitterCite = [...new Set(submitters)];

    var incidentDate = docs[0]["incident_date"];
    var submissionDate = docs[0]["submission_date"];
    return `${submitterCite}. (${incidentDate}) Incident Number ${docs[0]['incident_id']}. in McGregor, S. (ed.) <em>Artificial Intelligence Incident Database.</em> Partnership on AI.`;
  }

  function getBibtex(docs) {
    // Sort the docs according to their submit date
    docs.sort(function(a, b){
      return a["submission_date"] > b["submission_date"];
    });

    // Return the submitters across all docs that are distinct
    var submitters = [];
    docs.forEach(element => submitters.push(element["submitters"][0]));//Only supporting the first submitter on the doc
    let submitterCite = [...new Set(submitters)];

    var incidentDate = docs[0]["incident_date"];
    var submissionDate = docs[0]["submission_date"];
    return `
    @article{aiid:${docs[0]['incident_id']},
      author = {${submitterCite}},
      editor = {Sean McGregor}
      title = {Incident Number ${docs[0]['incident_id']}},
      year = {${incidentDate.substring(0, 4)}}
    }`;
  }

  function callback(docs) {
    console.log(docs);
    var errors = collectErrors(docs);

    var submitters = "";
    var incidentDate = docs[0]["incident_date"];
    var submissionDate = docs[0]["submission_date"];
    docs.forEach(element => submitters += `${element["submitters"]}, `);
    var rendered = `
                <div class="card_detail card_pad ${cardCSS}">
                  <div class="card">
                    <div class="card-header">
                      <h1 class="article-header">Incident Stats</h1>
                    </div>
                    <div class="card-body">
                      <article>
                        ${errors}
                        <dl class="row">
                          <dt class="col-sm-3">Is Incident</dt>
                          <dd class="col-sm-9">
                            <p>${docs[0]["is_incident"] ? "yes" : "no"}</p>
                          </dd>
                          <dt class="col-sm-3">Incident ID</dt>
                          <dd class="col-sm-9">
                            <p>${docs[0]["incident_id"]}</p>
                          </dd>
                          <dt class="col-sm-3">Report Count</dt>
                          <dd class="col-sm-9">
                            <p>${docs.length}</p>
                          </dd>
                          <dt class="col-sm-3">Incident Date</dt>
                          <dd class="col-sm-9">
                            <p>${docs[0]["incident_date"]}</p>
                          </dd>
                          <dt class="col-sm-3">Citation</dt>
                          <dd class="col-sm-9">
                            <p>${getCitation(docs)}</p>
                          </dd>
                          <dt class="col-sm-3">Bibtex</dt>
                          <dd class="col-sm-9">
                            <p>${getBibtex(docs)}</p>
                          </dd>
                        </dl>
                        <button type="button" class="btn btn-secondary btn-sm btn-block" onclick="index.clearAll()">Clear Incident Selection and Search</button>
                      </article>
                    </div>
                  </div>
                </div>`;
    $("#incident_detail").html(rendered);
    $(".assignment-button").click(api.assignByButton);
  }
  api.getIncidentReferences(incident_id, callback);
  return "";
}
