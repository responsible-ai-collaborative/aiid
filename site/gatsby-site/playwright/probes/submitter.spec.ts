import { expect } from '@playwright/test';
import { test } from '../utils';

test.describe('Submitter Selection', () => {
  let url = '/';

  test('Should select the first submitter if there is one and load the discover page with a pre-selected submitter in the URL', async ({ page, skipOnEmptyEnvironment }) => {

    await page.goto(url);

    await page.locator('text=Incident Report Submission Leaderboards').scrollIntoViewIfNeeded();

    const leaderboardItems = await page.locator('[data-cy="leaderboard-item"] a').count();
    expect(leaderboardItems).toBeGreaterThan(1);

    await page.locator('[data-cy="leaderboard-item"] a').first().click();

    await page.waitForURL(/.*\/discover\/\?.*submitters=.*/);

  });

  test('Should have the submitter pre-selected on the dropdown', async ({ page, skipOnEmptyEnvironment }) => {

    url = '/apps/discover/?submitters=Anonymous';

    await page.goto(url);

    await page.locator('text=Submitters').locator('span.badge').first().click();

    await page.locator('.shadow-lg.card .list-group-item.active').first().waitFor();
    const activeText = await page.locator('.shadow-lg.card .list-group-item.active').first().textContent();
    expect(activeText).toContain('Anonymous');
  });

  test('Should display an empty state if there are no submitters', async ({ page, runOnlyOnEmptyEnvironment }) => {

    await page.goto(url);

    await page.locator('text=Incident Report Submission Leaderboards').scrollIntoViewIfNeeded();

    const leaderboardItems = await page.locator('[data-cy="leaderboard-item"]').count();
    expect(leaderboardItems).toBe(0);

    const emptyItems = await page.locator('[data-cy="leaderboard-empty-item"]').count();
    expect(emptyItems).toBe(3);
  });
});
