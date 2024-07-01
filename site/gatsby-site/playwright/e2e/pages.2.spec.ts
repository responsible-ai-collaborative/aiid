import { test } from '../utils';
import { testPages } from './pages-tests';

test.describe('Pages 2', () => {

  const paths = [
    '/apps/submit/',
    '/apps/submitted/',
    '/apps/variants/',
    '/blog/',
    '/summaries/flagged/',
  ];

  testPages(paths);
});