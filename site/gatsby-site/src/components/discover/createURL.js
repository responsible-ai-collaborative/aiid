import { encodeQueryParams } from 'use-query-params';
import SORTING_LIST from './SORTING_LISTS';
import { stringify } from 'query-string';

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

  query.page = searchState?.page;

  return query;
};

export default function ({ routeState, indexName, locale, queryConfig }) {
  const state = routeState[indexName];

  const query = getQueryFromState(state, locale);

  const encoded = encodeQueryParams(queryConfig, query);

  const stringified = stringify(encoded);

  console.log('bue createurl');

  return stringified;
}
