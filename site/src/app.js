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

/**
 * Results Body
 **/
search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
<div class="card">
  <div class="card-header">
    <h1 class="article-header">{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</h1>
  </div>
  <div class="card-body">
        <article>
          <p>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
        </article>
        
  </div>
        <div class="align-bottom">
          <p><img class="image-preview" onerror="this.style.display='none'" src='{{image_url}}'></p>
        </div>
  <div class="card-footer text-muted">
          <p>
            <a href={{ url }}><i class="far fa-newspaper" title="Read the Source"></i></a>
            <i class="pointer far fa-id-card"  title="Authors" onclick="showAuthorModal(this)" data-toggle="modal" data-target="#authormodal"><span style="display:none;">{{ authors }}</span></i>
            <i class="fas fa-hashtag" title="Incident ID"></i> {{ incident_id }}
          </p>
  </div>
</div>
      `,
    },
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
