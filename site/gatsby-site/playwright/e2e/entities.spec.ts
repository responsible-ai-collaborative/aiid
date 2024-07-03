import { expect } from '@playwright/test';
import config from '../config';
import { test } from '../utils';

test.describe('Entities page', () => {
  const url = '/entities';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
    await page.locator('[data-cy="entities"]').isVisible();
  });

  test('Displays a list of entities', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    await page.locator('[data-cy="entities"]').isVisible();
    await page.locator('[data-cy="entities"] tr').count().then(count => {
      expect(count).toBeGreaterThanOrEqual(10);
    });
  });

  test('Filter entities by name', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    await page.locator('[data-cy="input-filter-Entity"]').fill('Amazon');
    await page.locator('[data-cy="entities"] tr').count().then(count => {
      expect(count).toBeGreaterThanOrEqual(11);
    });
  });

  test('Filter entities by incident title', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    await page.locator('[data-cy="input-filter-As Deployer and Developer"]').fill('taxi');
    await page.locator('[data-cy="entities"] tr').count().then(count => {
      expect(count).toBeGreaterThanOrEqual(1);
    });
    await page.locator('[data-cy="row"]:has-text("Cruise")').isVisible();
  });

  test('Entities row should be expandable', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    await page.locator('[data-cy="input-filter-Entity"]').fill('Amazon');
    const row = await page.locator('[data-cy="row"]').filter({ hasText: 'Amazon' }).first();
    await row.locator('[title="Toggle Row Expanded"]').first().click();
    const cell = await row.locator('[data-cy="cell-incidentsAsBoth"]');
    await cell.locator('ul').isVisible();
    await cell.locator('ul > li').count().then(count => {
      expect(count).toBeGreaterThanOrEqual(14);
    });
  });

  test('Should display Entity responses', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    await expect(page.locator('[data-cy="header-responses"]')).toBeVisible();
    await page.locator('[data-cy="cell-responses"]').count().then(count => {
      expect(count).toBeGreaterThanOrEqual(10);
    });
    await page.locator('[data-cy="input-filter-Entity"]').fill('microsoft');
    await expect(page.locator('[data-cy="cell-responses"]').first()).toHaveText('3 Incident responses');
  });

  test('Should be able to sort', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    await page.locator('[data-cy="row"]').first().locator('a:has-text("Facebook")').isVisible();
  });

  test.skip('Should display Edit button only for Admin users', async ({ page, login, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    expect(await page.locator('[data-cy="edit-entity-btn"]').count()).toBe(0);

    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);
    await page.goto(url);
    const editButton = page.locator('[data-cy="edit-entity-btn"]').first();
    expect(await editButton.getAttribute('href')).toBe('/entities/edit?entity_id=facebook');
    await editButton.click();
    await page.waitForURL(url => !url.toString().includes('/entities/edit?entity_id=facebook'));
  });
});
