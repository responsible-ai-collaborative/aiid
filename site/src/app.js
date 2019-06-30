/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'JD5JCVZEVS',
  'c5e99d93261645721a1765fe4414389c'
);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'Search full text',
    autofocus: true,
    searchAsYouType: true,
  })
);

/**
 * Refinement lists
 */
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
      container: '#incident-refine',
      attribute: 'incident_id',
    })
);

function showAuthorModal(ev) {
    var modal = $('#authormodal');
    modal.find(".modal-body").text($( ev ).children().text());
    modal.modal();
}




// Create the render function
const renderHits = (renderOptions, isFirstRender) => {
  const { hits, widgetParams } = renderOptions;

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
            <p>${instantsearch.highlight({ attribute: 'description', hit: item })}</p>
          </article>
        </div>
        <div class="align-bottom">
          <p><img class="image-preview" onerror="this.style.display='none'" src='${item.image_url}'></p>
        </div>
        <div class="card-footer text-muted">
          <p>
            <a href=${ item.url }><i class="far fa-newspaper" title="Read the Source"></i></a>
            <i class="pointer far fa-id-card"  title="Authors" onclick="showAuthorModal(this)" data-toggle="modal" data-target="#authormodal"><span style="display:none;">${ item.authors }</span></i>
            <i class="fas fa-hashtag" title="Incident ID"></i>${ item.incident_id }
          </p>
        </div>
      </div>
    </div>`
        )
        .join('')}
  `;
};

// Create the custom widget
const customHits = instantsearch.connectors.connectHits(renderHits);

// Instantiate the custom widget
search.addWidget(
  customHits({
    container: document.querySelector('#hits'),
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
  })
);

/**
 * Search result counter
 */
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

// Create the custom widget
const customStats = instantsearch.connectors.connectStats(renderStats);

// Instantiate the custom widget
search.addWidget(
  customStats({
    container: document.querySelector('#stats'),
  })
);

search.start();
