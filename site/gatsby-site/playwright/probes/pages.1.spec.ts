import { test } from '../utils';
import { testPages } from '../shared/pages-tests';

test.describe('Pages 1', () => {

  const paths = [
    '/',
    '/taxonomies/',
    '/apps/discover/',
    '/apps/incidents/',
    '/apps/newsdigest/',
  ];

  testPages(paths);
});