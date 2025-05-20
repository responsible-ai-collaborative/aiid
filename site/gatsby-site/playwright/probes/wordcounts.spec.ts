
import { test } from '../utils';
import { expect } from '@playwright/test';

test.describe('The Word Counts Page', () => {
  const url = '/summaries/wordcounts';

  test('successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display a message if no data is presented', async ({ page, runOnlyOnEmptyEnvironment }) => {
    await page.goto(url);
    const wordlistContainer = page.locator('[data-cy=wordlist-container]');
    await expect(wordlistContainer).not.toBeVisible();
    await expect(page.getByText('There are no reports or incidents to process')).toBeVisible();
  });

  test('Word count table should exist', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    const wordlistContainers = page.locator('[data-cy=wordlist-container]');
    const containerCount = await wordlistContainers.count();
    for (let i = 0; i < containerCount; i++) {
      await expect(wordlistContainers.nth(i)).toBeVisible();
    }
    const itemCount = await wordlistContainers.first().locator('> * > *').count();
    expect(itemCount).toBeGreaterThan(1);
  });

  test('Word cloud should exist', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    const wordclouds = page.locator('[data-cy=wordcloud]').first();
    await expect(wordclouds).toBeVisible();

    const wordcloudCount = await wordclouds.count();
    for (let i = 0; i < wordcloudCount; i++) {
      await expect(wordclouds.nth(i)).toBeVisible();
    }
    const textCount = await wordclouds.locator('text').count();
    expect(textCount).toBeGreaterThan(1);
  });

  test('Words should have length > 2 and count > 10', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);

    const counts: number[] = [];
    const words: string[] = [];

    const rows = page.locator('[data-cy=wordlist-container] > * > *');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const word = await row.textContent().then((text) => text.trim());
      words.push(word);

      const countText = await row.locator('span').textContent().then((text) => text.trim());
      const spanIsNumeric = /\d+/.test(countText);
      let count = 0;

      if (spanIsNumeric) {
        count = parseInt(countText);
      }
      counts.push(count);
    }

    const ascending = (a, b) => a - b;
    expect(words.map((word) => word.length).sort(ascending)[0] > 2).toBe(true);
    expect(counts.sort(ascending)[0] > 9).toBe(true);
  });
});
