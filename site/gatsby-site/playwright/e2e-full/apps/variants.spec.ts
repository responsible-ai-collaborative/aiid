import { expect } from '@playwright/test';
import { getVariantStatusText, VARIANT_STATUS } from '../../../src/utils/variants';
import { test } from '../../utils'
import { init } from '../../memory-mongo';

test.describe('Variants App', () => {
    const url = '/apps/variants';

    test('Successfully loads', async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(`${url}/`);
    });

    test('Should display a list of Unreviewed Variants and their values - Unauthenticated user', async ({ page }) => {

        await page.goto(url);

        await expect(page.locator('[data-cy=input-filter-Status]')).toHaveValue('Unreviewed');

        const firstRow = page.locator('[data-cy="row"]').nth(0);
        await expect(firstRow.locator('[data-cy="cell"]')).toHaveCount(5);

        await expect(firstRow.locator('[data-cy="cell"]').nth(0)).toHaveText(`Incident 3`);
        await expect(firstRow.locator(`[data-cy="cell"] >> a[href="/cite/3"]`)).toBeVisible();
        await expect(firstRow.locator('[data-cy="cell"]').nth(1)).toHaveText('Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees');
        await expect(firstRow.locator('[data-cy="cell"]').nth(2)).toHaveText(getVariantStatusText(VARIANT_STATUS.unreviewed));
        await expect(firstRow.locator('[data-cy="cell"]').nth(3)).toHaveText('This is a test variant that\'s unreviewed');
        await expect(firstRow.locator('[data-cy="cell"]').nth(4).locator('div').nth(1)).toHaveText('Input 1 longer than 80 characters. This is some extra text to achieve the requirement.');
        await expect(firstRow.locator('[data-cy="cell"]').nth(4).locator('div').nth(2)).toHaveText('Output 1 longer than 80 characters. This is some extra text to achieve the requirement.');
    });

    test('Should display a list of all Variants and their values - Unauthenticated user', async ({ page }) => {

        await page.goto(url);

        await expect(page.locator('[data-cy=input-filter-Status]')).toHaveValue('Unreviewed');

        await page.locator('[data-cy=input-filter-Status]').clear();

        // TODO: Add more tests for the other filters
    });

    test('Should Delete a Variant - Incident Editor user', async ({ page, login }) => {

        await login({ customData: { roles: ['incident_editor'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);

        const firstRow = page.locator('[data-cy="row"]').nth(0);

        page.once('dialog', async dialog => { await dialog.accept(); });

        await firstRow.locator('[data-cy=delete-variant-btn]').click();

        await expect(page.locator('[data-cy="toast"]').locator('text=Variant successfully deleted. Your changes will be live within 24 hours.')).toBeVisible();

        // TODO: check db state using api
    });

    test('Should Approve a Variant - Incident Editor user', async ({ page, login }) => {

        await init();

        await login({ customData: { roles: ['incident_editor'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);

        const firstRow = page.locator('[data-cy="row"]').nth(0);
        await firstRow.locator('[data-cy=approve-variant-btn]').click();

        await expect(page.locator('[data-cy="toast"]').locator('text=Variant successfully updated. Your edits will be live within 24 hours.')).toBeVisible();

        // TODO: check db state using api
    });

    test('Should Reject a Variant - Incident Editor user', async ({ page, login }) => {

        await init();

        await login({ customData: { roles: ['incident_editor'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);

        const firstRow = page.locator('[data-cy="row"]').nth(0);
        await firstRow.locator('[data-cy=reject-variant-btn]').click();

        await expect(page.locator('[data-cy="toast"]').locator('text=Variant successfully updated. Your edits will be live within 24 hours.')).toBeVisible();

        // TODO: check db state using api
    });

    test('Should Edit a Variant - Incident Editor user', async ({ page, login }) => {

        await init();
        
        await login({ customData: { roles: ['incident_editor'], first_name: 'John', last_name: 'Doe' } });

        const newDatePublished = '2000-01-01';
        const newText = 'New text example with more than 80 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        const newInputOutput1 = 'New Input text';
        const newSubmitter = 'New Submitter';

        await page.goto(url);

        const firstRow = page.locator('[data-cy="row"]').nth(0);
        await firstRow.locator('[data-cy=edit-variant-btn]').click();

        await expect(page.locator('[data-cy=edit-variant-modal]')).toBeVisible();

        // TODO: fix broken selectors

        // await page.locator('[data-cy="variant-form-date-published"]').fill(newDatePublished);
        // await page.locator('[data-cy="variant-form-submitters"]').fill(newSubmitter);
        await page.locator('[data-cy="variant-form-text"]').fill(newText);
        // await page.locator('[data-cy="variant-form-inputs-outputs"]').first().fill(newInputOutput1);
        await page.locator('[data-cy="delete-text-row-btn"]').click();

        await page.locator('[data-cy=edit-variant-modal]').locator('[data-cy=approve-variant-btn]').click();

        await expect(page.locator('[data-cy="toast"]').locator('text=Variant successfully updated. Your edits will be live within 24 hours.')).toBeVisible();
    });
});