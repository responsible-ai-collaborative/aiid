/* global algoliasearch instantsearch current_hits */

var current_hits = {};

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

// A modal that appears when the user clicks the magnifying glass on a card.
// This gives the complete record detail
function showDetailModal(ev) {
    var modal = $('#detailmodal');
    var json = current_hits[parseInt($( ev ).data("detail-number"))-1];
    var rendered = `
<div class="card_pad col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
  <div class="card">
    <div class="card-header">
      <h1 class="article-header">${json.title}</h1>
    </div>
    <div class="card-body">
      <article>
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

        <h3>Date</h3>
        ${json["Start Date"]}

        <h3>Submitter</h3>
        ${json["Submitter"]}

        <h3>Uncertain</h3>
        ${json["Uncertain"]}

        <h3>authors</h3>
        ${json["authors"]}

        <h3>date_download</h3>
        ${json["date_download"]}

        <h3>date_modify</h3>
        ${json["date_modify"]}

        <h3>date_publish</h3>
        ${json["date_publish"]}

        <h3>description</h3>
        ${json["description"]}

        <h3>filename</h3>
        ${json["filename"]}

        <h3>for_render</h3>
        ${json["for_render"]}

        <h3>image_url</h3>
        ${json["image_url"]}

        <h3>incident_id</h3>
        ${json["incident_id"]}

        <h3>language</h3>
        ${json["language"]}

        <h3>localpath</h3>
        ${json["localpath"]}

        <h3>objectID</h3>
        ${json["objectID"]}

        <h3>ref_number</h3>
        ${json["ref_number"]}

        <h3>source_domain</h3>
        ${json["source_domain"]}

        <h3>text</h3>
        ${json["text"].replace(/(\r\n|\n|\r)/g,"<br /><br />")}

        <h3>title</h3>
        ${json["title"]}

        <h3>title_page</h3>
        ${json["title_page"]}

        <h3>title_rss</h3>
        ${json["title_rss"]}

        <h3>URL</h3>
        ${json["url"]}
      </article>
    </div>
    <div class="align-bottom">
      <p><img class="image-preview" onerror="this.style.display='none'" src='${json.image_url}'></p>
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
}

// Render each search result as a card
const renderHits = (renderOptions, isFirstRender) => {
  const { hits, widgetParams } = renderOptions;
  current_hits = hits;
  hits.forEach(function(element) {
      element.for_render = "<p>";
      if (typeof element._snippetResult.description !== 'undefined') {
          element.for_render += element._snippetResult.description.value;
      }
      if (typeof element._snippetResult.text !== 'undefined' && element._snippetResult.text.matchLevel === 'full') {
          element.for_render += "</p><blockquote class='blockquote'><p>&hellip;" + element._snippetResult.text.value + "&hellip;</blockquote>";
      }
      element.for_render += "</p>";
  });
  widgetParams.container.innerHTML = `
      ${hits
        .map(
          item =>
            `
    <div class="card_pad col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
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
          <p><img class="image-preview" onerror="this.style.display='none'" src='${item.image_url}'></p>
        </div>
        <div class="card-footer text-muted">
          <p>
            <a href=${ item.url }><i class="far fa-newspaper" title="Read the Source"></i></a>
            <i class="pointer far fa-id-card"  title="Authors" onclick="showAuthorModal(this)" data-toggle="modal" data-target="#authormodal"><span style="display:none;">${ item.authors }</span></i>
            <i class="pointer fas fa-user-shield"  title="Submitters" onclick="showSubmitterModal(this)" data-toggle="modal" data-target="#submittermodal"><span style="display:none;">${ item.Submitter }</span></i>
            <i class="pointer fas fa-search-plus" title="Complete Information" onclick="showDetailModal(this)" data-toggle="modal" data-target="#detailmodal" data-detail-number="${ item.__position }"></i>
            <i class="fas fa-hashtag" title="Incident ID"></i>${ item.incident_id }
          </p>
        </div>
      </div>
    </div>`
        )
        .join('')}
  `;
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
