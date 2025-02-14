import { test } from '../utils';
import { testPages } from '../shared/pages-tests';

test.describe('Pages 3', () => {

  const paths = [
    '/summaries/incidents/',
    '/summaries/incidentsOverTime/',
    '/summaries/leaderboard/',
    '/summaries/spatial/',
    '/research/snapshots/',
  ];

  testPages(paths);
});