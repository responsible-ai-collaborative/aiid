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

const getQueryFromState = ({ state, locale, taxa }) => {
  let query = {};

  if (state.query !== '') {
    query.s = state.query;
  }

  if (state.refinementList) {
    const classifications = [];

    const other = {};

    for (const [key, values] of Object.entries(state.refinementList)) {
      const [namespace, ...attribute] = key.split('.');

      if (taxa.includes(namespace)) {
        for (const value of values) {
          classifications.push(`${namespace}:${attribute}:${value}`);
        }
      } else {
        other[key] = values;
      }
    }

    query = {
      ...query,
      ...convertArrayToString(removeEmptyAttributes({ classifications, ...other })),
    };
  }

  if (state.range) {
    query = {
      ...query,
      ...convertRangeToQueryString(removeEmptyAttributes(state.range)),
    };
  }

  if (state.sortBy) {
    query.sortBy =
      SORTING_LIST.find((s) => s[`value_${locale}`] === state.sortBy)?.name || state.sortBy;
  }

  if (state.configure?.distinct === true) {
    query.hideDuplicates = 1;
  }

  if (state.page) {
    query.page = state.page;
  }

  return query;
};

export default function ({ routeState, indexName, locale, queryConfig, taxa, display }) {
  const state = routeState[indexName] || {};

  const query = getQueryFromState({ state, locale, taxa });

  const encoded = encodeQueryParams(queryConfig, query);

  let stringified = stringify(encoded);

  if (display) {
    stringified += `&display=${display}`;
  }

  return stringified;
}
