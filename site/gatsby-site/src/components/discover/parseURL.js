import { parse } from 'query-string';
import { decodeQueryParams } from 'use-query-params';

const convertStringToRefinement = (obj, taxas) => {
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

  const namespaceStrings = taxas.map((ns) => ns.namespace);

  for (const attr in obj) {
    if (stringKeys.includes(attr) && obj[attr] !== undefined) {
      const foundNamespace = namespaceStrings.find(
        (namespace) => obj[attr].indexOf(namespace) >= 0
      );

      if (foundNamespace) {
        // The facet separator is double pipe sign - "||"
        newObj[attr] = obj[attr].split('||' + foundNamespace).map((i) => foundNamespace + i);
        newObj[attr][0] = newObj[attr][0].substr(foundNamespace.length);
      } else {
        newObj[attr] = obj[attr].split('||');
      }
    }
  }
  return newObj;
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

const generateSearchState = ({ query, taxas }) => {
  return {
    page: query.page,
    query: query.s ?? '',
    refinementList: {
      ...convertStringToRefinement(query, taxas),
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

export default function ({ location, indexName, queryConfig, taxas = [] }) {
  const object = parse(location.search);

  const query = decodeQueryParams(queryConfig, object);

  const searchState = generateSearchState({ query, taxas });

  return { [indexName]: searchState };
}
