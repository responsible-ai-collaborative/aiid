import { expect } from '@playwright/test';
import { test } from '../utils';
import { init } from '../memory-mongo';

async function ensureBodyOverflowNotHidden(page) {
  const overflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
  expect(overflow).not.toBe('hidden');
}

test.describe('Modals should not leave body overflow hidden', () => {
  test('landing sponsor modal', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-cy="Waking Up Foundation-image"]').scrollIntoViewIfNeeded();
    await expect(async () => {
      await page.locator('[data-cy="Waking Up Foundation-image"]').click();
      await page.locator('[data-cy="sponsor-modal"]').first().waitFor({ timeout: 2000 });
    }).toPass();
    await page.locator('[data-cy="close-modal"]').first().click();
    await page.locator('[data-cy="sponsor-modal"]').first().waitFor({ state: 'hidden' });
    await ensureBodyOverflowNotHidden(page);
  });

  test('citation info modal', async ({ page }) => {
    await page.goto('/cite/1');
    await page.locator('button:has-text("Citation Info")').click();
    const modal = page.locator('[data-cy="citation-info-modal"]');
    await modal.waitFor();
    await modal.getByText('Close').click();
    await modal.waitFor({ state: 'hidden' });
    await ensureBodyOverflowNotHidden(page);
  });

  test('edit user modal', async ({ page, login }) => {
    await login();
    await page.goto('/account?askToCompleteProfile=1');
    const modal = page.getByTestId('edit-user-modal');
    await modal.waitFor();
    await page.locator('[aria-label="Close"]').click();
    await modal.waitFor({ state: 'hidden' });
    await ensureBodyOverflowNotHidden(page);
  });

  test('incident version modal', async ({ page, login }) => {
    await init();
    await login();
    await page.goto('/incidents/history/?incident_id=1');
    await page.locator('[data-cy="history-row"]').first().locator('[data-cy="view-full-version-button"]').click();
    const modal = page.locator('[data-cy="version-view-modal"]');
    await modal.waitFor();
    await modal.locator('button').getByText('Close').click();
    await modal.waitFor({ state: 'hidden' });
    await ensureBodyOverflowNotHidden(page);
  });

  test('flag report modal', async ({ page }) => {
    await init();
    await page.goto('/cite/1#1');
    await page.locator('[id="r1"] [data-cy="expand-report-button"]').click();
    await page.locator('[id="r1"] [data-cy="flag-button"]').click();
    const modal = page.locator('[data-cy="flag-report-1"]');
    await modal.waitFor();
    await modal.locator('[aria-label="Close"]').first().click();
    await modal.waitFor({ state: 'hidden' });
    await ensureBodyOverflowNotHidden(page);
  });

  test('authors modal', async ({ page }) => {
    await page.goto('/cite/1#1');
    await page.locator('[id="r1"] [data-cy="expand-report-button"]').click();
    await page.getByRole('button', { name: 'Authors' }).click();
    const modal = page.getByRole('dialog').filter({ hasText: 'Authors' });
    await modal.waitFor();
    await modal.locator('[aria-label="Close"]').first().click();
    await modal.waitFor({ state: 'hidden' });
    await ensureBodyOverflowNotHidden(page);
  });

  test('submitters modal', async ({ page }) => {
    await page.goto('/cite/1#1');
    await page.locator('[id="r1"] [data-cy="expand-report-button"]').click();
    await page.getByRole('button', { name: 'Submitters' }).click();
    const modal = page.getByRole('dialog').filter({ hasText: 'Submitters' });
    await modal.waitFor();
    await modal.locator('[aria-label="Close"]').first().click();
    await modal.waitFor({ state: 'hidden' });
    await ensureBodyOverflowNotHidden(page);
  });
});
