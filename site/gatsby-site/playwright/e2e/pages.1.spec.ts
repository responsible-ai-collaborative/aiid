import { test } from '../utils';
import { testPages } from './pages-tests';

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