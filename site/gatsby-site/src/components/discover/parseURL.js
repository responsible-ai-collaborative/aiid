import { parse } from 'query-string';
import { decodeQueryParams } from 'use-query-params';
import SORTING_LIST from './SORTING_LISTS';

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

const generateSearchState = ({ query, locale }) => {
  return {
    page: query.page,
    query: query.s ?? '',
    refinementList: {
      ...parseRefinements({ query }),
    },
    range: {
      ...convertStringToRange(query),
    },
    // The URL stores the sorting option's short name, but instantsearch expects
    // the index name and discards values it can't match against the sortBy items.
    sortBy: SORTING_LIST.find((s) => s.name === query.sortBy)?.[`value_${locale}`] ?? query.sortBy,
    configure: {
      hitsPerPage: 28,
      distinct: query.hideDuplicates ? true : false,
    },
  };
};

export default function ({ location, indexName, queryConfig, locale = 'en' }) {
  const object = parse(location.search);

  const query = decodeQueryParams(queryConfig, object);

  const searchState = generateSearchState({ query, locale });

  return { [indexName]: searchState };
}
