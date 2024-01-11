import { parse } from 'query-string';
import { decodeQueryParams } from 'use-query-params';

const parseRefinements = ({ query }) => {
  const refinementKeys = [
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

  const result = {};

  for (const [key, value] of Object.entries(query)) {
    if (value) {
      if (refinementKeys.includes(key)) {
        if (key == 'classifications') {
          const facets = value.split('||');

          for (const facet of facets) {
            const [namespace, attribute, ...value] = facet.split(':');

            const refinementKey = `${namespace}.${attribute}`;

            if (!result[refinementKey]) {
              result[refinementKey] = [];
            }

            result[refinementKey].push(...value);
          }
        } else {
          result[key] = value.split('||');
        }
      }
    }
  }

  return result;
};

const convertStringToRange = (query) => {
  const rangeKeys = ['epoch_incident_date', 'epoch_date_published'];

  const result = {};

  for (const key of rangeKeys) {
    if (query[key + '_min'] || query[key + '_max']) {
      result[key] = `${query[key + '_min'] || ''}:${query[key + '_max'] || ''}`;
    }
  }

  return result;
};

const generateSearchState = ({ query }) => {
  return {
    page: query.page,
    query: query.s ?? '',
    refinementList: {
      ...parseRefinements({ query }),
    },
    range: {
      ...convertStringToRange(query),
    },
    sortBy: query.sortBy,
    configure: {
      hitsPerPage: 28,
      distinct: query.hideDuplicates ? true : false,
    },
  };
};

export default function ({ location, indexName, queryConfig }) {
  const object = parse(location.search);

  const query = decodeQueryParams(queryConfig, object);

  const searchState = generateSearchState({ query });

  return { [indexName]: searchState };
}
