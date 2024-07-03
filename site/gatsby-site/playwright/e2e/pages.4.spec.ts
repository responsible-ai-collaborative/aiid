import { test } from '../utils';
import { testPages } from './pages-tests';

test.describe('Pages 4', () => {

  const paths = [
    '/entities/',
    '/account/',
    '/summaries/wordcounts/',
    '/about/', // doc template
    '/api-spec/',
  ];

  testPages(paths);
});