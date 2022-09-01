import React, { useState, useEffect } from 'react';
import { useQueryParams } from 'use-query-params';
import algoliasearch from 'algoliasearch/lite';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import AiidHelmet from 'components/AiidHelmet';
import { useModal, CustomModal } from 'hooks/useModal';

import config from '../../../config';
import Hits from 'components/discover/Hits';
import SearchBox from 'components/discover/SearchBox';
import Pagination from 'components/discover/Pagination';
import OptionsModal from 'components/discover/OptionsModal';
import { SearchContext } from 'components/discover/useSearch';
import { queryConfig } from 'components/discover/queryParams';
import VirtualFilters from 'components/discover/VirtualFilters';
import Controls from 'components/discover/Controls';
import { useLocalization } from 'gatsby-theme-i18n';
import Container from 'elements/Container';
import Row from 'elements/Row';
import Col from 'elements/Col';

const searchClient = algoliasearch(
  config.header.search.algoliaAppId,
  config.header.search.algoliaSearchKey
);

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
    if (Array.isArray(obj[attr])) {
      if (obj[attr].length > 0) {
        obj[attr] = obj[attr].join('||');
      }
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
    } else {
      if (obj[attr]) {
        newObj[attr] = obj[attr];
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
    query: '',
    refinementList: {},
    range: {},
  };

  const cleanQuery = removeUndefinedAttributes(query);

  const querySearch = cleanQuery.s || '';

  delete cleanQuery.s;

  return {
    ...searchState,
    page: query.page,
    query: querySearch,
    refinementList: {
      ...convertStringToArray(cleanQuery),
    },
    range: {
      ...convertStringToRange(cleanQuery),
    },
  };
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

  query.page = searchState.page;

  return query;
};

function DiscoverApp(props) {
  const [query, setQuery] = useQueryParams(queryConfig);

  const { locale } = useLocalization();

  const indexName = `instant_search-${locale}`;

  const [searchState, setSearchState] = useState(generateSearchState({ query }));

  const onSearchStateChange = (searchState) => {
    setSearchState({ ...searchState });
  };

  useEffect(() => {
    const searchQuery = getQueryFromState(searchState);

    const extraQuery = { display: query.display };

    setQuery({ ...searchQuery, ...extraQuery }, 'push');
  }, [searchState]);

  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  return (
    <LayoutHideSidebar {...props}>
      <AiidHelmet>
        <title>Artificial Intelligence Incident Database</title>
      </AiidHelmet>
      <SearchContext.Provider value={{ searchState, indexName, searchClient, onSearchStateChange }}>
        <InstantSearch
          indexName={
            indexName +
            (searchState.query == '' && Object.keys(searchState.refinementList).length == 0
              ? '-featured'
              : '')
          }
          searchClient={searchClient}
          searchState={searchState}
          onSearchStateChange={onSearchStateChange}
        >
          <Configure hitsPerPage={28} distinct={searchState.refinementList.hideDuplicates} />

          <VirtualFilters />

          <Container className="tw-container-xl tw-mt-6">
            <Row className="tw-px-0 tw-mx-0">
              <Col className="tw-px-0 tw-mx-0">
                <SearchBox defaultRefinement={query.s} />
              </Col>
            </Row>

            <Controls query={query} searchState={searchState} setSearchState={setSearchState} />

            <OptionsModal
              className="hiddenDesktop"
              searchState={searchState}
              setSearchState={setSearchState}
            />
          </Container>

          <Hits
            authorsModal={authorsModal}
            submittersModal={submittersModal}
            flagReportModal={flagReportModal}
          />

          <CustomModal {...authorsModal} />
          <CustomModal {...submittersModal} />
          <CustomModal {...flagReportModal} />

          <Pagination />
        </InstantSearch>
      </SearchContext.Provider>
    </LayoutHideSidebar>
  );
}

export default DiscoverApp;
