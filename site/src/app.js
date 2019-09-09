/* global algoliasearch instantsearch renderBig */

// Should the big or the small cards be rendered?
var renderBig = false;

// Initialize the search client
const searchClient = algoliasearch(
  'JD5JCVZEVS',
  'c5e99d93261645721a1765fe4414389c'
);
const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
});

// Add the search box
search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'Search full text',
    autofocus: true,
    searchAsYouType: true,
  })
);

// Refinement lists that appear to the left of the results
search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#source-refine',
      attribute: 'source_domain',
    })
);
search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#author-refine',
      attribute: 'authors',
    })
);
search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#Submitter-refine',
      attribute: 'Submitter',
    })
);
search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#incident-refine',
      attribute: 'incident_id',
    })
);

// Modal popups giving details about the specific card
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
function filterToIncident(ev) {
    var incident_id = parseInt(ev.getAttribute("data-incident-id"));
    var incidentForm = document.getElementById("incident-text-input");
    renderBig = true;
    incidentForm.value = incident_id;
    incidentForm.dispatchEvent(new Event("input"));
}

// A modal that appears when the user clicks the magnifying glass on a card.
// This gives the complete record detail
function showDetailModal(ev) {
  var modal = $('#detailmodal');
  var ref_number = parseInt(ev.getAttribute("data-ref-number"));
  var incident_id = parseInt(ev.getAttribute("data-incident-id"));
  if(typeof adminMongoInterface === "undefined") {
      modal.find("#detail-modal").html("<p>You must specify an Admin Key to have access to this.</p>");
      modal.modal();
      return;
  }
  adminMongoInterface
    .then(() =>
      db.collection('incidents').find({ref_number: ref_number, incident_id: incident_id}, {limit: 1}).asArray()
    ).then(docs => {
        json = docs[0];
        var renderKeys = ["title", "description", "text", "date_publish", "image_url", "is bad"];
        var textForms = "";
        if( typeof json["is bad"] === "undefined" ) {
            json["is bad"] = "";
        }
        for(var i = 0; i < renderKeys.length; i++) {
            textForms += `
                <h3>${renderKeys[i]}</h3>
                <textarea class="form-control db-text-area" data-database-key="${renderKeys[i]}" onkeyup="autoGrow(this)" onclick="autoGrow(this)">${json[renderKeys[i]]}</textarea>`;
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
                        <button type="button" class="btn btn-warning" onclick="updateRecord(this)">Submit</button>
                    </div>
                    <h2>Historical Data</h2>
                    <p>!!!!!!!!!!!!!!!!!!!!Notes that will remain pre-normalization.!!!!!!!!!!!!!!!!!!!!</p>
                    <p>!!!!!!!!!!!!!!!!!!!!Notes that will remain pre-normalization.!!!!!!!!!!!!!!!!!!!!</p>
                    <p>!!!!!!!!!!!!!!!!!!!!Notes that will remain pre-normalization.!!!!!!!!!!!!!!!!!!!!</p>


                        <h3>Start Date</h3>
                        ${json["Start Date"]}

                        <h3>incident_id</h3>
                        ${json["incident_id"]}

                        <h3>ref_number</h3>
                        ${json["ref_number"]}

                        <h3>source_domain</h3>
                        ${json["source_domain"]}

                        <h3>Submitter</h3>
                        ${json["Submitter"]}

                        <h3>localpath</h3>
                        ${json["localpath"]}

                        <h3>authors</h3>
                        ${json["authors"]}

                        <h3>date_download</h3>
                        ${json["date_download"]}

                        <h3>date_modify</h3>
                        ${json["date_modify"]}

                        <h3>Uncertain</h3>
                        ${json["Uncertain"]}

                        <h3>End Date</h3>
                        ${json["End Date"]}

                        <h3>Meets Preliminary Definition</h3>
                        ${json["Meets Preliminary Definition"]}

                        <h3>Sam Yoon Assessed Harm Caused</h3>
                        ${json["Sam Yoon Assessed Harm Caused"]}

                        <h3>Sam Yoon Assessed Harmed Party</h3>
                        ${json["Sam Yoon Assessed Harmed Party"]}

                        <h3>Sam Yoon Assessed Response or Mitigation</h3>
                        ${json["Sam Yoon Assessed Response or Mitigation"]}

                        <h3>Sam Yoon Description</h3>
                        ${json["Sam Yoon Description"]}

                        <h3>Sam Yoon Estimated Scale of Harm</h3>
                        ${json["Sam Yoon Estimated Scale of Harm"]}

                        <h3>Sam Yoon Search Words</h3>
                        ${json["Sam Yoon Search Words"]}

                        <h3>language</h3>
                        ${json["language"]}

                        <h3>description</h3>
                        ${json["description"]}

                        <h3>objectID</h3>
                        ${json["objectID"]}

                        <h3>title_page</h3>
                        ${json["title_page"]}

                        <h3>title_rss</h3>
                        ${json["title_rss"]}

                        <h3>filename</h3>
                        ${json["filename"]}

                        <h3>url</h3>
                        ${json["url"]}
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

// Render each search result as a card
const renderHits = (renderOptions, isFirstRender) => {
  const { hits, widgetParams } = renderOptions;
  hits.forEach(function(element) {
      element.for_render = "<p>";
      if (typeof element._snippetResult === 'undefined') {
          element.for_render += "</p>";
          return;
      }
      if (typeof element._snippetResult.description !== 'undefined') {
          element.for_render += element._snippetResult.description.value;
      }
      if (typeof element._snippetResult.text !== 'undefined' && element._snippetResult.text.matchLevel === 'full') {
          element.for_render += "</p><blockquote class='blockquote'><p>&hellip;" + element._snippetResult.text.value + "&hellip;</blockquote>";
      }
      element.for_render += "</p>";
      if (typeof element.text === 'string') {
          var shortText = element.text.substr(0, 400) + "...";
          if(renderBig) {
              element.for_render += "<div class='card_full_text'><p>" + element.text.replace(/\n/g, "</p><p>") + "</p></div>";
          } else {
              element.for_render += "<div class='card_short_text'><p>" + shortText.replace(/\n/g, "</p><p>") + "</p></div>";
          }
      }
      element["image_url_hash"] = "//aiid.partnershiponai.org/protected/images/incident_banners/" + md5(element.image_url);
  });
  var cardCSS = "col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12";
  if(renderBig) {
      cardCSS = "col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12";
  }

  rendered = `${hits
    .map(
      item =>
        `
<div class="card_detail card_pad ${cardCSS}">
  <div class="card">
    <div class="card-header">
      <h1 class="article-header">${instantsearch.highlight({ attribute: 'title', hit: item })}</h1>
    </div>
    <div class="card-body">
      <article>
        ${item.for_render}
      </article>
    </div>
    <div class="align-bottom">
      <p><img class="image-preview" onerror="this.style.display='none';this.onerror=null;this.parentElement.className='fas fa-robot fa-5x';" src='${item.image_url_hash}'></p>
    </div>
    <div class="card-footer text-muted">
      <p>
        <a href=${ item.url }><i class="far fa-newspaper" title="Read the Source"></i></a>
        <i class="pointer far fa-id-card"  title="Authors" onclick="showAuthorModal(this)" data-toggle="modal" data-target="#authormodal"><span style="display:none;">${ item.authors }</span></i>
        <i class="pointer fas fa-user-shield"  title="Submitters" onclick="showSubmitterModal(this)" data-toggle="modal" data-target="#submittermodal"><span style="display:none;">${ item.Submitter }</span></i>
        ${(typeof isAdmin !== "undefined" && isAdmin) ?  `<i class="pointer fas fa-search-plus" title="Complete Information" onclick="showDetailModal(this)" data-target="#detailmodal" data-detail-number="${ item.__position }" data-ref-number="${ item.ref_number }" data-incident-id="${ item.incident_id }"></i>` : ''}
        <span class="pointer" data-incident-id="${ item.incident_id }" onclick="filterToIncident(this)"><i class="fas fa-hashtag" title="Incident ID" ></i>${ item.incident_id }</span>
      </p>
    </div>
  </div>
</div>`
    )
    .join('')}`;

  widgetParams.container.innerHTML = rendered;
};
const customHits = instantsearch.connectors.connectHits(renderHits);
search.addWidget(
  customHits({
    container: document.querySelector('#hits'),
  })
);

// Add pagination
search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
  })
);

// Render search result statistics, like how many results are returned
const renderStats = (renderOptions, isFirstRender) => {
  const { nbHits, processingTimeMS, query, widgetParams } = renderOptions;

  if (isFirstRender) {
    return;
  }
  let count = '';
  if (nbHits > 1) {
    count += `${nbHits} results`;
  } else if (nbHits === 1) {
    count += `1 result`;
  } else {
    count += `no result`;
  }
  widgetParams.container.innerHTML = `
    ${count} found
  `;
};
const customStats = instantsearch.connectors.connectStats(renderStats);
search.addWidget(
  customStats({
    container: document.querySelector('#stats'),
  })
);

// Make a text form for jumping directly to a specific incident ID
search.addWidget({
  init(opts) {
    const helper = opts.helper;
    const input = document.querySelector('#incident-text-input');
    renderBig = false;
    input.addEventListener('input', ({currentTarget}) => {
        helper.clearRefinements('incident_id');
        if(currentTarget.value.length > 0) {
            helper.toggleRefinement('incident_id', currentTarget.value);
        }
        search.refresh();
        helper.search();
    });
  }
});
search.start();

// Clear the text entry when the check boxes are manipulated.
const container = document.querySelector("#incident-refine");
container.addEventListener("click", event => {
    renderBig = false;
    var incidentForm = document.getElementById("incident-text-input");
    incidentForm.value = "";
});
