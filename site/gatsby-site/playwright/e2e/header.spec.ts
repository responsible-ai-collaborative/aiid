import { test, expect } from '@playwright/test';

test.describe('Header', () => {

    test('Global search input appears on hover', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('#header-search-bar')).toBeHidden();

        await page.locator('#header-search-focus').hover();

        await expect(page.locator('#header-search-bar')).toBeVisible();
    });

    test('Global search input appears on click', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('#header-search-bar')).toBeHidden();

        await page.locator('#header-search-focus').click();

        await expect(page.locator('#header-search-bar')).toBeVisible();
    });

    test('Can initiate search by clicking button', async ({ page }) => {
        await page.goto('/');

        await page.locator('#header-search-focus').click();

        await page.locator('#header-search-bar').fill('something');

        await page.locator('#header-search-submit').click();

        await expect(page).toHaveURL(/.*s=something.*/);
    });

    test('Can initiate search by pressing enter', async ({ page }) => {
        await page.goto('/');

        await page.locator('#header-search-focus').click();

        await page.locator('#header-search-bar').fill('something');

        await page.locator('#header-search-bar').press('Enter');

        await expect(page).toHaveURL(/.*s=something.*/);
    });

    test('Global search works on discover page', async ({ page }) => {
        await page.goto('/apps/discover/');

        await page.locator('#header-search-focus').click();

        await page.locator('#header-search-bar').fill('something');

        await page.locator('#header-search-bar').press('Enter');

        await expect(page).toHaveURL(/.*s=something.*/);
    });
})
