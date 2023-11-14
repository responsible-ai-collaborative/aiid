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

const convertRangeToQueryString = (range) => {
  const result = {};

  for (const [key, value] of Object.entries(range)) {
    const [min, max] = value.split(':');

    if (min) {
      result[`${key}_min`] = min;
    }

    if (max) {
      result[`${key}_max`] = max;
    }
  }

  return result;
};

const getQueryFromState = (searchState, locale) => {
  let query = {};

  if (searchState.query !== '') {
    query.s = searchState.query;
  }

  if (searchState.refinementList) {
    query = {
      ...query,
      ...convertArrayToString(removeEmptyAttributes(searchState.refinementList)),
    };
  }

  if (searchState.range) {
    query = {
      ...query,
      ...convertRangeToQueryString(removeEmptyAttributes(searchState.range)),
    };
  }

  if (searchState.sortBy) {
    query.sortBy =
      SORTING_LIST.find((s) => s[`value_${locale}`] === searchState.sortBy)?.name ||
      searchState.sortBy;
  }

  if (searchState.configure.distinct === true) {
    query.hideDuplicates = 1;
  }

  if (searchState.page) {
    query.page = searchState.page;
  }

  return query;
};

export default function ({ routeState, indexName, locale, queryConfig }) {
  const state = routeState[indexName];

  const query = getQueryFromState(state, locale);

  const encoded = encodeQueryParams(queryConfig, query);

  const stringified = stringify(encoded);

  return stringified;
}
