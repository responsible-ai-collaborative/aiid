
import parseURL from '../../../../../gatsby-site/src/components/discover/parseURL';
import createURL from '../../../../../gatsby-site/src/components/discover/createURL';
import { queryConfig } from '../../../../../gatsby-site/src/components/discover/queryParams';
import { test } from '../../../utils';
import { expect } from '@playwright/test';

test('Should parse back and forth a discover URL', async () => {
  const indexName = 'instant_search-en';

  const location = {
    search:
      '?authors=Christopher%20Knaus%7C%7CSam%20Levin&classifications=CSETv0%3AIntent%3AAccident&epoch_date_published_max=1670371200&hideDuplicates=1&is_incident_report=true&page=1&s=tesla&sortBy=published-date-asc&source_domain=theguardian.com',
  };

  const result = parseURL({ location, indexName, queryConfig });

  const state = result[indexName];

  expect(state.query).toBe('tesla');
  expect(state.page).toBe(1);
  expect(state.sortBy).toBe('published-date-asc');
  expect(state.refinementList).toEqual({
    source_domain: ['theguardian.com'],
    authors: ['Christopher Knaus', 'Sam Levin'],
    'CSETv0.Intent': ['Accident'],
    is_incident_report: ['true'],
  });
  expect(state.range).toEqual({
    epoch_date_published: `:1670371200`,
  });

  expect(state.configure).toEqual({
    distinct: true,
    hitsPerPage: 28,
  });

  const resultURL = createURL({
    routeState: { [indexName]: state },
    indexName,
    locale: 'en',
    queryConfig,
    taxa: ['CSETv0', 'CSETv1'],
  });

  expect('?' + resultURL).toBe(location.search);
});
