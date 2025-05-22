import { expect } from '@playwright/test';
import { test } from '../utils';

test.describe('The Landing page', () => {

  test('Renders commit sha in the footer', async ({ page }) => {
  await page.goto('/');

    const shaElement = page.locator('[data-cy="commit-sha"]');

    await expect(shaElement).toBeVisible();

    const expectedSha = process.env.GATSBY_COMMIT_SHA.toString().substring(0, 7);
    const displayedSha = await shaElement.textContent();

    expect(displayedSha?.trim()).toBe(expectedSha);
  });
});
