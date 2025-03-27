
import { test } from '../utils';
import { expect } from '@playwright/test';

test.describe('The Word Counts Page', () => {
  const url = '/summaries/wordcounts';

  test('successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display a message if no data is presented', async ({ page }) => {
    await page.goto(url);
    const wordlistContainer = page.locator('[data-cy=wordlist-container]');
    await expect(wordlistContainer).not.toBeVisible();
    await expect(page.getByText('There are no reports or incidents to process')).toBeVisible();
  });
});
