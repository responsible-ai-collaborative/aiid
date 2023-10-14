import React, { useState, useEffect } from 'react';
import { encodeQueryParams, decodeQueryParams } from 'use-query-params';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch';
import AiidHelmet from 'components/AiidHelmet';

import config from '../../../config';
import Hits from 'components/discover/Hits';
import SearchBox from 'components/discover/SearchBox';
import Pagination from 'components/discover/Pagination';
import OptionsModal from 'components/discover/OptionsModal';
import { queryConfig } from 'components/discover/queryParams';
import Controls from 'components/discover/Controls';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import Container from 'elements/Container';
import Row from 'elements/Row';
import Col from 'elements/Col';
import { VIEW_TYPES } from 'utils/discover';
import SORTING_LIST from 'components/discover/SORTING_LISTS';
import { history } from 'instantsearch.js/es/lib/routers';
import { navigate } from 'gatsby';
import { stringify, parse } from 'query-string';

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
    'is_incident_report',
    'tags',
    'language',
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
  const cleanQuery = removeUndefinedAttributes(query);

  const querySearch = cleanQuery.s || '';

  delete cleanQuery.s;

  return {
    page: query.page,
    query: querySearch,
    refinementList: {
      ...convertStringToArray(cleanQuery),
    },
    range: {
      ...convertStringToRange(cleanQuery),
    },
    sortBy: cleanQuery.sortBy,
    configure: {
      hitsPerPage: 28,
      distinct: true,
    },
  };
};

const getQueryFromState = (searchState, locale) => {
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

  if (searchState && searchState.sortBy) {
    query.sortBy =
      SORTING_LIST.find((s) => s[`value_${locale}`] === searchState.sortBy)?.name ||
      searchState.sortBy;
  }

  query.page = searchState.page;

  return query;
};

function DiscoverApp(props) {
  const { locale } = useLocalization();

  const [viewType] = useState(VIEW_TYPES.INCIDENTS);

  const [indexName] = useState(`instant_search-${locale}`);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { location } = props;

  return (
    <div {...props} className="w-full">
      <AiidHelmet path={props.location.pathname}>
        <title>Artificial Intelligence Incident Database</title>
      </AiidHelmet>
      {mounted && (
        <InstantSearch
          searchClient={searchClient}
          indexName={indexName}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
          routing={{
            router: history({
              getLocation: () => {
                return location;
              },
              parseURL({ location }) {
                const object = parse(location.search);

                const query = decodeQueryParams(queryConfig, object);

                const searchState = generateSearchState({ query });

                return { [indexName]: searchState };
              },
              createURL: ({ routeState }) => {
                const state = routeState[indexName];

                const query = getQueryFromState(state, locale);

                const encoded = encodeQueryParams(queryConfig, query);

                const stringified = stringify(encoded);

                return stringified;
              },
              push: (url) => {
                navigate(`?${url}`);
              },
            }),
          }}
        >
          <Container className="ml-auto mr-auto pl-3 pr-3 w-full lg:max-w-6xl xl:max-w-7xl mt-6">
            <Row className="px-0 mx-0">
              <Col className="px-0 mx-0">
                <SearchBox />
              </Col>
            </Row>

            <Controls />

            <OptionsModal />

            <Hits viewType={viewType} />

            <Pagination />
          </Container>
        </InstantSearch>
      )}
    </div>
  );
}

export default DiscoverApp;
