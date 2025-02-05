import { test } from '../utils';

test.describe('Login', () => {
  const url = '/login';

  test('Should successfully load login page', async ({ page }) => {
    await page.goto(url);
  });
});
