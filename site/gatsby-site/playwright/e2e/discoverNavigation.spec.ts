import { test } from '../utils';
import { expect } from '@playwright/test';

test.describe('Leaving Discover', () => {
  test('the browser back button returns to the previous page without crashing it', async ({
    page,
  }) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/summaries/leaderboard', { waitUntil: 'networkidle' });

    // wait until React has hydrated the page (its fiber is attached to the heading);
    // navigating away mid-hydration would raise hydration errors of its own
    await page.waitForFunction(() => {
      const heading = document.querySelector('h1');

      return heading && Object.keys(heading).some((key) => key.startsWith('__reactFiber$'));
    });

    // a client-side navigation, as a link from the leaderboard would do
    await expect(async () => {
      await page.evaluate(() => {
        // @ts-ignore Gatsby's client-side router, exposed on window
        window.___navigate('/apps/discover?source_domain=example.com');
      });
      await expect(page).toHaveURL(/apps\/discover/, { timeout: 2000 });
    }).toPass();

    // Discover mounts its search controls a second after arrival (a debounced width
    // measurement); the crash needs them mounted, as they are for anyone reading the page
    await expect(page.locator('[data-cy="display-options"]')).toBeVisible();
    await page.waitForLoadState('networkidle');

    // Discover rewrites its URL on arrival, so going back can take two steps; each step is a
    // same-document navigation that Gatsby renders on its own, so give it a moment to settle
    for (let step = 0; step < 3; step++) {
      await page.goBack();
      await page.waitForTimeout(1500);
      if (/summaries\/leaderboard/.test(page.url())) break;
    }

    await expect(page).toHaveURL(/summaries\/leaderboard/);
    await expect(page.locator('h1')).toBeVisible();

    // React's hydration warnings (#418, #423) are recoverable and not what this is about;
    // the crash was an uncaught TypeError that unmounted the whole page
    expect(errors.filter((message) => !/Minified React error #4(18|23)/.test(message))).toEqual([]);
  });
});
