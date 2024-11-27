import { expect } from '@playwright/test';
import { test } from '../../utils';

test.describe('The Database Snapshots Page', () => {
  const url = '/research/snapshots';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test(
    'Should display a list of snapshots to download',
    async ({ page, skipOnEmptyEnvironment }) => {
      await page.goto(url);

      const snapshotListItems = page.locator('[data-cy="snapshots-list"] li');
      await snapshotListItems.first().waitFor();

      const count = await snapshotListItems.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const item = snapshotListItems.nth(i);
        const textContent = await item.textContent();
        expect(textContent).toMatch(
          /^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2} (AM|PM) · \d+(\.\d{2})? MB · backup-\d{14}\.tar\.bz2$/
        );

        const href = await item.locator('a').getAttribute('href');
        expect(href).toMatch(/^https:\/\/.*\/backup-\d{14}\.tar\.bz2$/);
      }
    }
  );
});
