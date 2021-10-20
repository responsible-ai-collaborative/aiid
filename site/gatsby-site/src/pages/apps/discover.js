import React, { useState, useEffect, useRef } from 'react';
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
import FiltersBar from 'components/discover/FiltersBar';
import Filters from 'components/discover/Filters';

const indexName = 'instant_search';

const searchClient = algoliasearch(
  config.header.search.algoliaAppId,
  config.header.search.algoliaSearchKey
);

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 767px) {
    padding: 0;
  }
`;

const SidesContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 100%;
  padding-top: 2rem;

  @media (max-width: 1440px) {
    padding-top: 1em;
  }

  @media (max-width: 570px) {
    flex-direction: column-reverse;
  }
`;

const HitsContainer = styled.div`
  display: grid;
  max-width: 100%;
  grid-gap: 13px;
  grid-template-columns: 1fr 1fr 1fr;

  ${({ showDetails }) =>
    showDetails === true &&
    `
    grid-template-columns: auto;i
  `};

  @media (max-width: 1240px) {
    grid-template-columns: 1fr 1fr;
    ${({ showDetails }) =>
      showDetails === true &&
      `
      grid-template-columns: auto;
    `};
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;

    ${({ showDetails }) =>
      showDetails === true &&
      `
      grid-template-columns: auto;
    `};
  }
`;

const FacetsSide = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 300px;

  @media (max-width: 1440px) {
    max-width: 300px;
  }

  @media (max-width: 570px) {
    max-width: unset;
  }
`;

const ResultsSide = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 85%;
  padding-right: 2rem;

  @media (max-width: 1440px) {
    padding-right: 1rem;
  }

  @media (max-width: 570px) {
    width: 100%;
    padding: 0;
  }
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

const DiscoverApp = React.memo((props) => {
  const searchInput = useRef(null);

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

  const [searchState, setSearchState] = useState({
    configure: {
      hitsPerPage: 30,
    },
    page: 1,
    query: '',
    refinementList: {},
    range: {},
  });

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

  // const showDetails = searchState.refinementList?.incident_id?.length === 1;

  useEffect(() => {
    const cleanQuery = removeUndefinedAttributes(query);

    const querySearch = cleanQuery.s || '';

    delete cleanQuery.s;

    searchInput.current.value = querySearch;

    setSearchState({
      ...searchState,
      query: querySearch,
      refinementList: {
        ...convertStringToArray(cleanQuery),
      },
      range: {
        ...convertStringToRange(cleanQuery),
      },
    });
  }, [query]);

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

  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  return (
    <LayoutHideSidebar {...props}>
      <Helmet>
        <title>Artifical Intelligence Incident Database</title>
      </Helmet>
      <QueryParams config={queryConfig}>
        {({ query, setQuery }) => (
          <>
            <Container>
              <InstantSearch
                indexName={indexName}
                searchClient={searchClient}
                searchState={searchState}
                onSearchStateChange={(searchState) => {
                  setSearchState({ ...searchState });
                  setQuery(getQueryFromState(searchState), 'push');
                }}
              >
                <Header>
                  <SearchBox customRef={searchInput} defaultRefinement={query.s} />
                  <FiltersBar
                    filters={searchState}
                    updateFilters={setSearchState}
                    updateQuery={(newFilters) => setQuery(getQueryFromState(newFilters), 'push')}
                  />
                </Header>
                <SidesContainer>
                  <ResultsSide>
                    <HitsContainer>
                      <Hits
                        toggleFilterByIncidentId={toggleFilterByIncidentId}
                        authorsModal={authorsModal}
                        submittersModal={submittersModal}
                        flagReportModal={flagReportModal}
                      />
                      <CustomModal {...authorsModal} />
                      <CustomModal {...submittersModal} />
                      <CustomModal {...flagReportModal} />
                    </HitsContainer>
                    <Pagination />
                  </ResultsSide>
                  <FacetsSide>
                    <Filters />
                  </FacetsSide>
                </SidesContainer>
              </InstantSearch>
            </Container>
          </>
        )}
      </QueryParams>
    </LayoutHideSidebar>
  );
});

export default DiscoverApp;
