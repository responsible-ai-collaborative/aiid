import { test, query, fillAutoComplete } from '../utils';
import { expect } from '@playwright/test';
import { init } from '../memory-mongo';
import gql from 'graphql-tag';

test.describe('Entity Merge Page', () => {
  const url = '/entities/merge';

  test.beforeEach(async () => {
    await init();
  });

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should require authentication', async ({ page }) => {
    await page.goto(url);

    await expect(
      page.getByText('Not enough permissions').or(page.locator('a[href*="/login"]'))
    ).toBeVisible();
  });

  test('AnyMerge displays warning when entities selected', async ({ page, login }) => {

    await login();

    await page.goto(url);

    await expect(page.getByText('Merge Any Two Entities')).toBeVisible();
    await expect(page.getByText(/Select two entities to merge/)).toBeVisible();

    await expect(page.locator('.text-red-600')).not.toBeVisible();

    await fillAutoComplete(page, '#entity1-input', 'Entity', 'Entity 1');
    await fillAutoComplete(page, '#entity2-input', 'Entity', 'Entity 2');

    await expect(page.locator('.text-red-600').first()).toBeVisible();

    await expect(page.locator('.text-red-600').first()).toContainText(`delete entity “Entity 2”`);
    await expect(page.locator('.text-red-600').first()).toContainText(`to use “Entity 1”`);
  });

  test('Confirm button should be disabled when entities are not selected', async ({ page, login }) => {
    await login();

    await page.goto(url);


    await expect(page.getByRole('button', { name: 'Merge' })).toBeDisabled();

    await fillAutoComplete(page, '#entity1-input', 'Entity', 'Entity 1');


    await expect(page.getByRole('button', { name: 'Merge' })).toBeDisabled();

    await fillAutoComplete(page, '#entity2-input', 'Entity', 'Entity 2');

    await expect(page.getByRole('button', { name: 'Merge' })).toBeEnabled();
  });

  test('AnyMerge component successfully merges entities', async ({ page, login }) => {
    await login();

    await page.goto(url);

    const { data: entitiesBeforeMerge } = await query({
      query: gql`
        query {
          entities {
            entity_id
            name
          }
        }
      `
    });

    expect(entitiesBeforeMerge.entities.length).toBeGreaterThanOrEqual(2);

    const primaryEntity = entitiesBeforeMerge.entities[0];
    const secondaryEntity = entitiesBeforeMerge.entities[1];

    await fillAutoComplete(page, '#entity1-input', primaryEntity.name.substring(0, 5), primaryEntity.name);
    await fillAutoComplete(page, '#entity2-input', secondaryEntity.name.substring(0, 5), secondaryEntity.name);

    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Merge' }).click();

    await expect(page.locator('[data-cy="toast"]')).toContainText('Merged successfully');


    const { data: entitiesAfterMerge } = await query({
      query: gql`
        query {
          entities {
            entity_id
            name
          }
        }
      `
    });


    const secondaryEntityExists = entitiesAfterMerge.entities.some(
      e => e.entity_id === secondaryEntity.entity_id
    );

    expect(secondaryEntityExists).toBe(false);
    expect(entitiesAfterMerge.entities.length).toBe(entitiesBeforeMerge.entities.length - 1);

    const primaryEntityExists = entitiesAfterMerge.entities.some(
      e => e.entity_id === primaryEntity.entity_id
    );

    expect(primaryEntityExists).toBe(true);
  });

  test('Similar entities list updates when threshold is changed', async ({ page, login }) => {
    await login();
    await page.goto(url);

    await expect(
      page.getByText('No matching entities found at current threshold')
    ).toBeVisible();


    await page.locator('input[type="number"]').fill('80');
    await page.getByRole('button', { name: 'Update' }).click();


    await expect(
      page.getByText('Entity 1 ↔ Entity 3 (85.7%)')
    ).toBeVisible();
  });

  test('SimilarMergeModal shows options and removes pair on merge', async ({ page, login }) => {
    await login();
    await page.goto(url);

    await page.locator('input[type="number"]').fill('0');
    await page.getByRole('button', { name: 'Update' }).click();

    const { data: entities } = await query({ query: gql`query { entities { entity_id name } }` });
    expect(entities.entities.length).toBeGreaterThanOrEqual(2);

    const primary = entities.entities[0];
    const secondary = entities.entities[1];
    const pairLocator = page.locator('div.flex.justify-between.items-center', { hasText: `${primary.name} ↔ ${secondary.name}` });
    await pairLocator.getByRole('button', { name: 'Merge' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await expect(dialog.getByRole('heading', { name: 'Merge Duplicate Entities' })).toBeVisible();

    const radioPrimary = dialog.getByLabel(primary.name);
    const radioSecondary = dialog.getByLabel(secondary.name);
    await expect(radioPrimary).toBeChecked();
    await expect(radioSecondary).not.toBeChecked();

    await expect(dialog.getByText(`Warning: This will delete entity “${secondary.name}” and update all references to use “${primary.name}”.`)).toBeVisible();

    page.on('dialog', dlg => dlg.accept());
    await dialog.getByRole('button', { name: 'Merge' }).click();

    await expect(page.locator('[data-cy="toast"]')).toContainText(`Merged ${secondary.name} into ${primary.name}`);

    await expect(page.locator('div.flex.justify-between.items-center', { hasText: `${primary.name} ↔ ${secondary.name}` })).not.toBeVisible();
  });

  test('SimilarMergeModal shows error toast on merge error', async ({ page, login }) => {

    await login();
    await page.goto(url);

    await page.locator('input[type="number"]').fill('0');
    await page.getByRole('button', { name: 'Update' }).click();

    const { data: entities } = await query({ query: gql`query { entities { entity_id name } }` });

    expect(entities.entities.length).toBeGreaterThanOrEqual(2);

    const primary = entities.entities[0];
    const secondary = entities.entities[1];

    const pairLocator = page.locator('div.flex.justify-between.items-center', { hasText: `${primary.name} ↔ ${secondary.name}` });
    await pairLocator.getByRole('button', { name: 'Merge' }).click();
    const dialog = page.getByRole('dialog');

    await expect(dialog).toBeVisible();

    await page.route('**/graphql', async route => {
      const req = route.request();
      const body = await req.postDataJSON();
      if (body.operationName === 'MergeEntities') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ errors: [{ message: 'Test merge error' }] }),
        });
      } else {
        await route.continue();
      }
    });

    page.on('dialog', dlg => dlg.accept());
    await dialog.getByRole('button', { name: 'Merge' }).click();

    await expect(page.locator('[data-cy="toast"]')).toContainText('Error merging entities:Test merge error');
  });
});