import { parse } from 'query-string';
import { decodeQueryParams } from 'use-query-params';

const convertStringToRefinement = (obj) => {
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
      // TODO: we have to make the other namespaces available here too
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
      ...convertStringToRefinement(query),
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
