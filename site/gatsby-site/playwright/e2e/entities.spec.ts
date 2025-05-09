import { expect } from '@playwright/test';
import { query, test } from '../utils';
import { gql } from '@apollo/client';
import { init } from '../memory-mongo';

test.describe('Entities page', () => {
  const url = '/entities';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
    await page.locator('[data-cy="entities"]').isVisible();
  });

  test('Displays a list of entities', async ({ page, skipOnEmptyEnvironment }) => {
    await init();
    await page.goto(url);
    const { data: { entities } } = await query({
      query: gql`
        query {
          entities {
            entity_id
          }
        }
      `,
    });
    await page.locator('[data-cy="entities"]').isVisible();
    await page.locator('[data-cy="entities"] tr').count().then(count => {
      expect(count).toBeGreaterThanOrEqual(entities.length);
    });
  });

  test('Filter entities by name', async ({ page, skipOnEmptyEnvironment }) => {
    await init();
    await page.goto(url);
    await page.locator('[data-cy="input-filter-Entity"]').fill('Entity 1');
    await page.locator('[data-cy="entities"] tr').count().then(count => {
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test('Filter entities by incident title', async ({ page, skipOnEmptyEnvironment }) => {
    await init();
    await page.goto(url);
    await page.locator('[data-cy="input-filter-As Deployer"]').fill('incid');
    await page.locator('[data-cy="entities"] tr').count().then(count => {
      expect(count).toBeGreaterThanOrEqual(1);
    });
    await page.locator('[data-cy="row"]:has-text("Entity 1")').isVisible();
  });

  test('Entities row should be expandable', async ({ page, skipOnEmptyEnvironment }) => {
    await init();
    await page.goto(url);
    await page.locator('[data-cy="input-filter-Entity"]').fill('Entity 1');
    const row = await page.locator('[data-cy="row"]').filter({ hasText: 'Entity 1' }).first();
    await row.locator('[title="Toggle Row Expanded"]').first().click();
    const cell = await row.locator('[data-cy="cell-incidentsAsDeployer"]');
    await cell.locator('ul').isVisible();
    await cell.locator('ul > li').count().then(count => {
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });

  test('Should display Entity responses', async ({ page, skipOnEmptyEnvironment }) => {
    await init();
    await page.goto(url);
    await expect(page.locator('[data-cy="header-responses"]')).toBeVisible();
    await page.locator('[data-cy="cell-responses"]').count().then(count => {
      expect(count).toBeGreaterThanOrEqual(1);
    });
    await page.locator('[data-cy="input-filter-Entity"]').fill('Entity 1');
    await expect(page.locator('[data-cy="cell-responses"]').first()).toHaveText('1 Incident responses');
  });

  test('Should be able to sort', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    await page.locator('[data-cy="row"]').first().locator('a:has-text("Facebook")').isVisible();
  });

  test.skip('Should display Edit button only for Admin users', async ({ page, login, skipOnEmptyEnvironment }) => {
    await page.goto(url);
    expect(await page.locator('[data-cy="edit-entity-btn"]').count()).toBe(0);

    await login();
    const editButton = page.locator('[data-cy="edit-entity-btn"]').first();
    expect(await editButton.getAttribute('href')).toBe('/entities/edit?entity_id=facebook');
    await editButton.click();
    await page.waitForURL(url => !url.toString().includes('/entities/edit?entity_id=facebook'));
  });
});
