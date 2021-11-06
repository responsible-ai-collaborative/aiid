import React, { useState } from 'react';
import { StringParam, QueryParams, useQueryParams } from 'use-query-params';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import styled from 'styled-components';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import Helmet from 'react-helmet';
import { useModal, CustomModal } from 'components/useModal';

import config from '../../../config';
import Hits from 'components/discover/Hits';
import SearchBox from 'components/discover/SearchBox';
import Pagination from 'components/discover/Pagination';
import Filters from 'components/discover/Filters';
import FiltersModal from 'components/discover/FiltersModal';

const indexName = 'instant_search';

const searchClient = algoliasearch(
  config.header.search.algoliaAppId,
  config.header.search.algoliaSearchKey
);

const HitsContainer = styled.div`
  max-width: 1400px;
  display: grid;
  grid-gap: 6px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const FiltersContainer = styled.div`
  max-width: 1400px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;

  @media (max-width: 767px) {
    .fa-BARS {
      display: none;
    }
  }
`;

const removeUndefinedAttributes = (obj) => {
  for (const attr in obj) {
    if (obj[attr] === undefined) {
      delete obj[attr];
    }
  }
  return { ...obj };
};

const removeEmptyAttributes = (obj) => {
  for (const attr in obj) {
    if (obj[attr] === '' || obj[attr].length === 0) {
      delete obj[attr];
    }
  }
  return { ...obj };
};

const convertArrayToString = (obj) => {
  for (const attr in obj) {
    if (obj[attr].length > 0) {
      obj[attr] = obj[attr].join('||');
    }
  }
  return { ...obj };
};

const convertStringToArray = (obj) => {
  const stringKeys = [
    'source_domain',
    'authors',
    'submitters',
    'incident_id',
    'flag',
    'classifications',
  ];

  let newObj = {};

  for (const attr in obj) {
    if (stringKeys.includes(attr) && obj[attr] !== undefined) {
      if (obj[attr].indexOf('CSET') >= 0) {
        // The facet separator is double pipe sign - "||"
        newObj[attr] = obj[attr].split('||CSET').map((i) => 'CSET' + i);
        newObj[attr][0] = newObj[attr][0].substr(4);
      } else {
        newObj[attr] = obj[attr].split('||');
      }
    }
  }
  return newObj;
};

const convertRangeToQueryString = (rangeObj) => {
  let rangeQueryObj = {};

  for (const attr in rangeObj) {
    if (rangeObj[attr] !== undefined && rangeObj[attr].min) {
      rangeQueryObj[`${attr}_min`] = rangeObj[attr].min;
    }
    if (rangeObj[attr] !== undefined && rangeObj[attr].max) {
      rangeQueryObj[`${attr}_max`] = rangeObj[attr].max;
    }
  }

  return rangeQueryObj;
};

const convertStringToRange = (query) => {
  const rangeKeys = [
    'epoch_incident_date_min',
    'epoch_incident_date_max',
    'epoch_date_published_min',
    'epoch_date_published_max',
  ];

  let resultObj = {};

  for (const attr in query) {
    if (rangeKeys.includes(attr)) {
      if (attr.includes('_min') && !isNaN(parseInt(query[attr]))) {
        resultObj[attr.split('_min')[0]] = {
          ...resultObj[attr.split('_min')[0]],
          min: parseInt(query[attr]),
        };
      }

      if (attr.includes('_max') && !isNaN(parseInt(query[attr]))) {
        resultObj[attr.split('_max')[0]] = {
          ...resultObj[attr.split('_max')[0]],
          max: parseInt(query[attr]),
        };
      }
    }
  }

  return resultObj;
};

const generateSearchState = ({ query }) => {
  const searchState = {
    configure: {
      hitsPerPage: 30,
    },
    page: 1,
    query: '',
    refinementList: {},
    range: {},
  };

  const cleanQuery = removeUndefinedAttributes(query);

  const querySearch = cleanQuery.s || '';

  delete cleanQuery.s;

  return {
    ...searchState,
    query: querySearch,
    refinementList: {
      ...convertStringToArray(cleanQuery),
    },
    range: {
      ...convertStringToRange(cleanQuery),
    },
  };
};

const DiscoverApp = React.memo((props) => {
  const [query, setQuery] = useQueryParams({
    s: StringParam,
    source_domain: StringParam,
    authors: StringParam,
    submitters: StringParam,
    incident_id: StringParam,
    flag: StringParam,
    classifications: StringParam,
    epoch_incident_date_min: StringParam,
    epoch_incident_date_max: StringParam,
    epoch_date_published_min: StringParam,
    epoch_date_published_max: StringParam,
  });

  const [searchState, setSearchState] = useState(generateSearchState({ query }));

  const queryConfig = {
    s: StringParam,
    source_domain: StringParam,
    authors: StringParam,
    submitters: StringParam,
    incident_id: StringParam,
    flag: StringParam,
    classifications: StringParam,
    epoch_incident_date_min: StringParam,
    epoch_incident_date_max: StringParam,
    epoch_date_published_min: StringParam,
    epoch_date_published_max: StringParam,
  };

  const getQueryFromState = (searchState) => {
    let query = {};

    if (searchState && searchState.query !== '') {
      query.s = searchState.query;
    }

    if (searchState && searchState.refinementList !== {}) {
      query = {
        ...query,
        ...convertArrayToString(removeEmptyAttributes(searchState.refinementList)),
      };
    }

    if (searchState && searchState.range !== {}) {
      query = {
        ...query,
        ...convertRangeToQueryString(removeEmptyAttributes(searchState.range)),
      };
    }

    return query;
  };

  const toggleFilterByIncidentId = (incidentId) => {
    const incident_id = [];

    if (
      !searchState.refinementList ||
      !searchState.refinementList.incident_id ||
      searchState.refinementList.incident_id.length === 0
    ) {
      incident_id.push(incidentId);
    }

    const newSearchState = {
      ...searchState,
      refinementList: {
        ...searchState.refinementList,
        incident_id,
      },
    };

    setSearchState(newSearchState);
    setQuery(getQueryFromState(newSearchState), 'push');
  };

  const onSearchStateChange = (searchState) => {
    setSearchState({ ...searchState });
    setQuery(getQueryFromState(searchState), 'push');
  };

  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  return (
    <LayoutHideSidebar {...props}>
      <Helmet>
        <title>Artificial Intelligence Incident Database</title>
      </Helmet>
      <QueryParams config={queryConfig}>
        {() => (
          <InstantSearch
            indexName={indexName}
            searchClient={searchClient}
            searchState={searchState}
            onSearchStateChange={onSearchStateChange}
          >
            <FiltersContainer className="container container-fluid mt-4">
              <Header>
                <SearchBox defaultRefinement={query.s} />
              </Header>

              <Filters />

              <FiltersModal
                searchClient={searchClient}
                indexName={indexName}
                searchState={searchState}
                onSearchStateChange={onSearchStateChange}
              />
            </FiltersContainer>

            <HitsContainer className="container container-fluid mt-4">
              <Hits
                toggleFilterByIncidentId={toggleFilterByIncidentId}
                authorsModal={authorsModal}
                submittersModal={submittersModal}
                flagReportModal={flagReportModal}
              />
            </HitsContainer>

            <CustomModal {...authorsModal} />
            <CustomModal {...submittersModal} />
            <CustomModal {...flagReportModal} />

            <Pagination />
          </InstantSearch>
        )}
      </QueryParams>
    </LayoutHideSidebar>
  );
});

export default DiscoverApp;
