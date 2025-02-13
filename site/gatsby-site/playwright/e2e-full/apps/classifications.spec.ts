import { expect } from '@playwright/test';
import { test } from '../../utils';

const url = '/apps/classifications/';


test.describe('Classifications App', () => {
    test('Should successfully load', async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test('Should successfully load the table', async ({ page }) => {
        await page.goto(url);

        await page.waitForSelector('[data-cy="row"]');
        await expect(page.locator('[data-cy="row"]')).toHaveCount(1);
    });

    test('Successfully edit a CSET classification', async ({ page, login }) => {

        await login();

        await page.goto(url);

        await page.selectOption('select[data-cy="taxonomy"]', 'CSETv1');

        const newTabPromise = page.waitForEvent('popup');

        await page.locator('a[href="/cite/3/?edit_taxonomy=CSETv1"]').click()

        const newTab = await newTabPromise;

        await newTab.waitForLoadState();

        await expect(newTab.locator('[data-cy="taxonomy-form"]')).toBeVisible();
    });

    test('Should switch taxonomies', async ({ page }) => {

        await page.goto(url);
        await page.waitForSelector('select[data-cy="taxonomy"]');

        await page.selectOption('select[data-cy="taxonomy"]', 'CSETv1');
        await page.waitForSelector('select[data-cy="taxonomy"]');

        await page.selectOption('select[data-cy="taxonomy"]', 'GMF');
        await page.waitForSelector('[role="columnheader"]');

        await expect(page.locator('[role="columnheader"]').getByText('Known AI Goal', { exact: true })).toBeVisible();
    });
});