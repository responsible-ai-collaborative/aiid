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

        await expect(page.locator('.text-red-600')).toBeVisible();


        await expect(page.locator('.text-red-600')).toBeVisible();
        await expect(page.locator('.text-red-600')).toContainText(`delete entity "Entity 2"`);
        await expect(page.locator('.text-red-600')).toContainText(`use "Entity 1"`);
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
});