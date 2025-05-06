import { test, query } from '../utils';
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

    test('AnyMerge component loads with entity list', async ({ page, login }) => {

        await login();

        await page.goto(url);

        await expect(page.getByText('Merge Any Two Entities')).toBeVisible();
        await expect(page.getByText(/Select two entities to merge/)).toBeVisible();

        await expect(page.locator('#entity1')).toBeVisible();
        await expect(page.locator('#entity2')).toBeVisible();

        await expect(page.locator('#entity1 option')).not.toHaveCount(1); // Should have more than just the placeholder option
        await expect(page.locator('#entity2 option')).not.toHaveCount(1);
    });

    test('AnyMerge component displays warning when entities selected', async ({ page, login }) => {
        await login();

        await page.goto(url);

        await expect(page.locator('.text-red-600')).not.toBeVisible();

        await page.locator('#entity1').selectOption({ index: 1 });
        await page.locator('#entity2').selectOption({ index: 2 });

        const primaryEntityName = await page.locator('#entity1 option:checked').textContent();
        const secondaryEntityName = await page.locator('#entity2 option:checked').textContent();

        await expect(page.locator('.text-red-600')).toBeVisible();
        await expect(page.locator('.text-red-600')).toContainText(`delete entity "${secondaryEntityName}"`);
        await expect(page.locator('.text-red-600')).toContainText(`use "${primaryEntityName}"`);
    });

    test('Confirm button should be disabled when entities are not selected', async ({ page, login }) => {
        await login();

        await page.goto(url);


        await expect(page.getByRole('button', { name: 'Confirm Merge' })).toBeDisabled();

        await page.locator('#entity1').selectOption({ index: 1 });

        await expect(page.getByRole('button', { name: 'Confirm Merge' })).toBeDisabled();

        await page.locator('#entity2').selectOption({ index: 2 });

        await expect(page.getByRole('button', { name: 'Confirm Merge' })).toBeEnabled();
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

        await page.locator('#entity1').selectOption({ value: primaryEntity.entity_id });
        await page.locator('#entity2').selectOption({ value: secondaryEntity.entity_id });

        await page.getByRole('button', { name: 'Confirm Merge' }).click();

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