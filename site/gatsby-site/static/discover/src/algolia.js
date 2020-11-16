// The instant search index
var index = {}

// How many reports are currently matched (initialized to placeholder)
index.currentCount = 999;

// Initialize the search client
index.searchClient = algoliasearch(
  'JD5JCVZEVS',
  'c5e99d93261645721a1765fe4414389c'
);
const search = instantsearch({
  indexName: 'dev_aiid',
  searchClient: index.searchClient,
});

// All the facets that will be displayed on the left side
const facetList = ["incident_id", "source_domain", "authors", "submitters", "flag"];

// Function for clearing refinements will be initialized later
index.clearRefinements = undefined;
index.clearSearch = undefined;
index.clearAll = function() {
  // var incidentForm = document.getElementById("incident-text-input");
 //  incidentForm.value = "";
  renderBig = false;
  index.clearRefinements();
  index.clearSearch();
}

//
//
// Render search box elements
//
//

// Create a render function
const renderSearchBox = (renderOptions, isFirstRender) => {
  const { query, refine, clear, isSearchStalled, widgetParams } = renderOptions;

  index.clearSearch = clear;

  if (isFirstRender) {
    const input = document.createElement('input');

    const clearButton = document.createElement('span');
    clearButton.textContent = '';
    clearButton.classList.add("searchclear");
    clearButton.classList.add("far");
    clearButton.classList.add("fa-times-circle");
    $(clearButton).click(index.clearSearch);

    input.addEventListener('input', event => {
      refine(event.target.value);
    });

    input.classList.add("form-control");
    input.classList.add("full-text-search");

    input.placeholder = "Search full text of incident reports";

    widgetParams.container.appendChild(input);
    widgetParams.container.appendChild(clearButton);
  }

  var startingQuery = lib.parseQuery(window.location.search)["s"];
  if(startingQuery !== undefined && isFirstRender) {
    widgetParams.container.querySelector('input').value = startingQuery;
    refine(startingQuery);
  } else {
    widgetParams.container.querySelector('input').value = query;
  }
};

// create custom widget
const customSearchBox = instantsearch.connectors.connectSearchBox(
  renderSearchBox
);

// instantiate custom widget
search.addWidgets([
  customSearchBox({
    container: document.querySelector('#searchbox'),
    placeholder: 'Search full text',
    autofocus: true,
    searchAsYouType: true,
  })
]);


//
//
// Render refinement (faceted search) elements in the left side of the page
//
//

// Using a closure to gain access to the attribute that is currently being filtered
function renderRefinementWithAttribute(attribute) {
  const renderRefinementList = (renderOptions, isFirstRender) => {
    const {
      items,
      isFromSearch,
      refine,
      createURL,
      isShowingMore,
      canToggleShowMore,
      searchForItems,
      toggleShowMore,
      widgetParams,
    } = renderOptions;

    if (isFirstRender) {
      const input = document.createElement('input');
      input.placeholder = renderOptions["widgetParams"]["inputText"];
      input.size = "25";
      input.classList.add("form-control");

      const ul = document.createElement('ul');
      ul.classList.add("list-group");

      input.addEventListener('input', event => {
        searchForItems(event.currentTarget.value);
      });

      widgetParams.container.appendChild(ul);
      widgetParams.container.appendChild(input);
    }

    const input = widgetParams.container.querySelector('input');

    if(renderOptions["widgetParams"]["inputText"] === "none") {
      input.style = "display:none;";
    } else if(items.length < 1) {
      input.style = "color:red;";
    } else {
      input.style = "";
    }

    if (!isFromSearch && input.value) {
      input.value = '';
    }

    widgetParams.container.querySelector('ul').innerHTML = items
      .map(
        item => `
            <button
              class="d-flex justify-content-between align-items-center btn btn-sm btn-block ${item.isRefined ? 'btn-primary' : 'btn-outline-primary'} btn-no-margin"
              href="${createURL(item.value)}"
              data-value="${item.value}"
            >
              ${item.label} <span class="badge ${item.isRefined ? 'badge-secondary' : 'badge-secondary'} badge-pill"> ${item.count}</span>
            </button>
        `
      )
      .join('');
    if(items.length < 1) {
      widgetParams.container.querySelector('ul').innerHTML = "<div class='d-flex justify-content-center'>no results</div>";
    }

    [...widgetParams.container.querySelectorAll('button')].forEach(element => {
      element.addEventListener('click', event => {
        if( attribute === "incident_id" ) {
          var facetedCount = 0;
          function addFacetCount(item) {
            facetedCount += (item["isRefined"] ? 1 : 0);
            if(item["value"] == event.currentTarget.dataset.value) {
              item["isRefined"] ? facetedCount -= 1 : facetedCount += 1;
            }
          }
          items.forEach(addFacetCount);
          facetedCount == 1 ? renderBig = true : renderBig = false;
        }
        event.preventDefault();
        refine(event.currentTarget.dataset.value);
      });
    });
  };
  return renderRefinementList;
}

const customRefinementList = function(config){
  return instantsearch.connectors.connectRefinementList(renderRefinementWithAttribute(config.attribute))(config);
};
search.addWidgets([
  customRefinementList({
    container: document.querySelector('#source-refine'),
    attribute: 'source_domain',
    inputText: "Filter Domains ('bbc.com')"
  })
]);
search.addWidgets([
  customRefinementList({
    container: document.querySelector('#author-refine'),
    attribute: 'authors',
    inputText: "Filter Authors ('Helen...')"
  })
]);
search.addWidgets([
  customRefinementList({
    container: document.querySelector('#Submitter-refine'),
    attribute: 'submitters',
    inputText: "Filter Submitters ('Helen...')"
  })
]);
search.addWidgets([
  customRefinementList({
    container: document.querySelector('#incident-refine'),
    attribute: 'incident_id',
    inputText: "Filter incident number ('42')"
  })
]);
search.addWidgets([
  customRefinementList({
    container: document.querySelector('#flag-refine'),
    attribute: 'flag',
    inputText: "none"
  })
]);

//
//
// Render search results
//
//

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
      element["image_url_hash"] = "/large_media/report_banners/" + md5(element.image_url);
  });
  var cardCSS = "col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12";
  var rendered = "<div id='incident_detail' class='w-100'></div>";
  if(renderBig) {
      cardCSS = "col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12";
  }

  console.log(hits);
  rendered += `${hits
    .map(
      item =>
        `
          <div class="card_detail card_pad ${cardCSS}">
            <div class="card">
              <div class="card-header">
                <h1 class="article-header">${instantsearch.highlight({ attribute: 'title', hit: item })}</h1>
                <p class="subhead">${item.source_domain} &middot; ${item.date_published ? item.date_published.substring(0, 4) : "Needs publish date"}${renderBig ? " &middot; " + item.authors.join(', '):""}</p>
              </div>
              <div class="card-body">
                <article>
                  ${item.for_render}
                </article>
              </div>
              <div class="align-bottom">
                <p><img class="image-preview" onerror="this.style.display='none';this.onerror=null;this.parentElement.className='fas fa-robot fa-5x';" src='${item.image_url_hash}'></p>
                <button style="display:${renderBig ? 'none' : 'inherit'}" type="button" class="btn btn-secondary btn-sm btn-block assignment-button" data-incident-id="${ item.incident_id }" onclick="index.filterToIncident(${ item.incident_id })">Show Details on Incident #${ item.incident_id }</button>
                <button style="display:${api.isAdmin ? 'inherit' : 'none'}" type="button" class="btn btn-danger btn-sm btn-block" onclick="api.deleteReport(${ item.ref_number }, ${ item.report_number })">Delete Ref ${item.ref_number}, Rep #${ item.report_number }</button>
              </div>
              <div class="card-footer text-muted">
                <p>
                  <a href=${ item.url }><i class="far fa-newspaper" title="Read the Source"></i></a>
                  <i class="pointer far fa-id-card"  title="Authors" onclick="showAuthorModal(this)" data-toggle="modal" data-target="#authormodal"><span style="display:none;">${ item.authors }</span></i>
                  <i class="pointer fas fa-user-shield"  title="Submitters" onclick="showSubmitterModal(this)" data-toggle="modal" data-target="#submittermodal"><span style="display:none;">${ item.submitters }</span></i>
                  ${(typeof api !== "undefined" && api.isAdmin) ?  `<i class="pointer fas fa-search-plus" title="Complete Information" onclick="showDetailModal(this)" data-target="#detailmodal" data-detail-number="${ item.__position }" data-ref-number="${ item.ref_number }" data-incident-id="${ item.incident_id }" data-report-number=${ item.report_number }></i>` : ''}
                  <i class="pointer far fa-flag" title="Flag Report" onclick="showFlagModal(this)" data-toggle="modal" data-target="#flagmodal" data-incident-id="${ item.incident_id }" data-report-number="${ item.report_number }"></i>
                  <span class="pointer" data-incident-id="${ item.incident_id }" onclick="index.filterToIncident(${ item.incident_id })"><i class="fas fa-hashtag" title="Incident ID" ></i>${ item.incident_id }</span>
                </p>
              </div>
            </div>
          </div>`
    )
    .join('')}`;

  widgetParams.container.innerHTML = rendered;
  if(renderBig) {
      renderIncidentDetailCard(hits, cardCSS);
  }
};
const customHits = instantsearch.connectors.connectHits(renderHits);
search.addWidget(
  customHits({
    container: document.querySelector('#hits'),
  })
);

//
//
// Pagination
//
//

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
  })
);

//
//
// Render Statistics
//
//

// Render search result statistics, like how many results are returned
const renderStats = (renderOptions, isFirstRender) => {
  const { nbHits, processingTimeMS, query, widgetParams, instantSearchInstance } = renderOptions;
  index.currentCount = nbHits;
  if (isFirstRender) {
    return;
  }
  lib.pushURL(instantSearchInstance.helper.state.disjunctiveFacetsRefinements, $(".full-text-search")[0].value);
  let count = '';
  if (nbHits > 1) {
    count += `${nbHits} reports`;
  } else if (nbHits === 1) {
    count += `1 report`;
  } else {
    $("#no-results").show();
    count += `no matches`;
  }
  widgetParams.container.innerHTML = `${count} found`;
};
const customStats = instantsearch.connectors.connectStats(renderStats);
search.addWidget(
  customStats({
    container: document.querySelector('#stats'),
  })
);

//
//
// Custom incident navigation functionality
//
//

// Make a text form for jumping directly to a specific incident ID
search.addWidget({
  init(opts) {
    const helper = opts.helper;
    const query = lib.parseQuery(window.location.search);
    index.filterToUrl = function() {
      function updateFacet(facet) {
        helper.clearRefinements(facet);
        if(facet in query) {
          var facetString = query[facet];
          facetString.split("&").forEach(function(f){
            f.split(",").forEach(function(fv){
              helper.toggleRefinement(facet, fv);
            });
          });
        }
      }
      facetList.forEach(updateFacet);
      search.refresh();
      helper.search();
    }
    index.filterToIncident = function(incident_id) {
      renderBig = true;
      helper.clearRefinements('incident_id');
      helper.toggleRefinement('incident_id', incident_id);
      search.refresh();
      helper.search();
    }
    index.filterToAuthor = function(author) {
      renderBig = false;
      helper.clearRefinements('authors');
      helper.toggleRefinement('authors', author);
      search.refresh();
      helper.search();
    }
    index.filterToUrl();
  }
});


function algoliaInit() {
  search.start()

  // Render function for clearing refinements
  const renderClearRefinements = (renderOptions, isFirstRender) => {
    const { hasRefinements, refine } = renderOptions;
    index.clearRefinements = refine;
    if(index.currentCount < 1 && !isFirstRender) {
      $('#no-results').show();
    } else {
      $('#no-results').hide();;
    };
  };
  // Widget for clearing refinements
  const customClearRefinements = instantsearch.connectors.connectClearRefinements(
    renderClearRefinements
  );
  // Instantiate clearing of refinements
  search.addWidgets([
    customClearRefinements({
      container: document.querySelector('#no-results')
    })
  ]);
  // var query = lib.parseQuery(window.location.search);
  // if("authors" in query) {
  //   index.filterToAuthor(query["authors"]);
  // }
}

$( document ).ready(algoliaInit);
