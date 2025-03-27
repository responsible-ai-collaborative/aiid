import { test } from '../utils';
import { testPages } from '../shared/pages-tests';
import config from '../../config';

test.describe('Pages 4', () => {

  const paths = [];

  if (config.IS_EMPTY_ENVIRONMENT == 'false') {
    paths.push('/apps/classifications/');
    paths.push('/reports/2302/');
    paths.push('/cite/1/');
    paths.push('/entities/facebook/');
    paths.push('/blog/incident-report-2023-january/');
    paths.push('/taxonomy/csetv0/');
    paths.push('/taxonomy/csetv1/');
  }

  testPages(paths);
});