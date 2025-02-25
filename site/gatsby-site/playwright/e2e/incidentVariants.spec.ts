import { expect } from '@playwright/test';
import { getVariantStatus, getVariantStatusText, isCompleteReport, VARIANT_STATUS } from '../../src/utils/variants';
import { query, test } from '../utils';
import gql from 'graphql-tag';
import { init } from '../memory-mongo';

const incidentId = 3;

async function getVariants() {

    const { data: { incident } } = await query({
        query: gql`
            query {
                incident(filter: { incident_id: { EQ: ${incidentId} } }) {
                    reports {
                        report_number
                        title
                        date_published
                        tags
                        url
                        source_domain
                        submitters
                        text
                        inputs_outputs
                    }
                }
            }
        `});

    const variants = incident.reports
        .filter((r) => !isCompleteReport(r))
        .sort((a, b) => a.report_number - b.report_number);

    return variants;
}

const new_date_published = '2000-01-01';
const new_text = 'New text example with more than 80 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const new_inputs_outputs_1 = 'New Input text';
const new_inputs_outputs_2 = 'New Output text';
const new_submitter = 'New Submitter';

test.describe('Variants pages', () => {
    const url = `/cite/${incidentId}`;

    test('Successfully loads', async ({ page }) => {
        await page.goto(url);
    });

    test('Should display Variant list', async ({ page }) => {
        await page.goto(url);
        await expect(page.getByText('Variants', { exact: true })).toBeVisible();


        const variants = await getVariants();

        const variantCards = await page.locator('[data-cy=variant-card]');
        await expect(variantCards).toHaveCount(variants.length);

        for (let index = 0; index < variants.length; index++) {
            const variant = variants[index];

            const variantCard = await page.locator(`[data-cy=variant-card][id="r${variant.report_number}"]`);
            const variantStatus = getVariantStatus(variant);
            const variantStatusText = getVariantStatusText(variantStatus);

            await expect(variantCard.locator('[data-cy=variant-status-badge]')).toHaveText(variantStatusText);
            await expect(variantCard.locator('[data-cy=variant-text]')).toHaveText(variant.text);
            await expect(variantCard.locator('[data-cy=variant-inputs-outputs]').nth(0)).toHaveText(variant.inputs_outputs[0]);
            await expect(variantCard.locator('[data-cy=variant-inputs-outputs]').nth(1)).toHaveText(variant.inputs_outputs[1]);
        }
    });

    test('Should add a new Variant - Unauthenticated user', async ({ page }) => {

        await init();

        await page.goto(url);

        await expect(page.getByText('Variants', { exact: true })).toBeVisible();

        await expect(page.locator('[data-cy=variant-form]')).not.toBeVisible();

        await expect(async () => {
            await page.locator('[data-cy=add-variant-btn]').click();
            await page.waitForSelector('[data-cy=variant-form]', { timeout: 1000 });
        }).toPass();

        await page.locator('[data-cy="variant-form-date-published"]').fill(new_date_published);
        await page.locator('[data-cy="variant-form-submitters"] input').first().fill(new_submitter);
        await page.locator('[data-cy="variant-form-text"]').fill(new_text);
        await page.locator('[data-cy="variant-form-inputs-outputs"]').nth(0).fill(new_inputs_outputs_1);
        await page.locator('[data-cy="add-text-row-btn"]').click();
        await page.locator('[data-cy="variant-form-inputs-outputs"]').nth(1).fill(new_inputs_outputs_2);

        await page.locator('[data-cy=add-variant-submit-btn]').click();

        await expect(page.locator('[data-cy=success-message]')).toContainText(
            "Your variant has been added to the review queue and will appear on this page within 12 hours"
        );
        await expect(page.locator('[data-cy="toast"]')).toContainText(
            'Your variant has been added to the review queue and will appear on this page within 12 hours.'
        );
    });

    test("Shouldn't edit a Variant - Unauthenticated user", async ({ page }) => {
        await page.goto(url);
        await expect(page.locator('[data-cy=edit-variant-btn]')).not.toBeVisible();
    });

    test('Should Approve Variant - Incident Editor user', async ({ page, login }) => {

        await login({ customData: { first_name: 'John', last_name: 'Doe', roles: ['incident_editor'] } });

        await page.goto(url);

        const variants = await getVariants();

        if (variants.length > 0) {
            await page.locator('[data-cy=variant-card]').nth(0).locator('[data-cy=edit-variant-btn]').click();
            await page.waitForSelector('[data-cy=edit-variant-modal]');

            await page.locator('[data-cy="variant-form-date-published"]').fill(new_date_published);
            await page.locator('[data-cy="variant-form-submitters"] input').first().fill(new_submitter);
            await page.locator('[data-cy="variant-form-text"]').fill(new_text);
            await page.locator('[data-cy="variant-form-inputs-outputs"]').nth(0).fill(new_inputs_outputs_1);
            await page.locator('[data-cy="variant-form-inputs-outputs"]').nth(1).fill(new_inputs_outputs_2);

            await page.locator('[data-cy=approve-variant-btn]').click();

            await expect(page.locator('[data-cy="toast"]')).toHaveText(
                'Variant successfully updated. Your edits will be live within 24 hours.'
            );
            await expect(page.locator('[data-cy=edit-variant-modal]')).not.toBeVisible();
        }
    });

    test('Should Reject Variant - Incident Editor user', async ({ page, login }) => {

        await login({ customData: { first_name: 'John', last_name: 'Doe', roles: ['incident_editor'] } });

        await page.goto(url);

        const variants = await getVariants();
        if (variants.length > 0) {
            await page.locator('[data-cy=variant-card]').nth(0).locator('[data-cy=edit-variant-btn]').click();
            await page.waitForSelector('[data-cy=edit-variant-modal]');

            await page.locator('[data-cy="variant-form-date-published"]').fill(new_date_published);
            await page.locator('[data-cy="variant-form-submitters"] input').first().fill(new_submitter);
            await page.locator('[data-cy="variant-form-text"]').fill(new_text);
            await page.locator('[data-cy="variant-form-inputs-outputs"]').nth(0).fill(new_inputs_outputs_1);
            await page.locator('[data-cy="variant-form-inputs-outputs"]').nth(1).fill(new_inputs_outputs_2);

            await page.locator('[data-cy=reject-variant-btn]').click();

            await expect(page.locator('[data-cy="toast"]')).toHaveText(
                'Variant successfully updated. Your edits will be live within 24 hours.'
            );
            await expect(page.locator('[data-cy=edit-variant-modal]')).not.toBeVisible();
        }
    });

    test('Should Save Variant - Incident Editor user', async ({ page, login }) => {

        await login({ customData: { first_name: 'John', last_name: 'Doe', roles: ['incident_editor'] } });

        await page.goto(url);

        const variants = await getVariants();

        if (variants.length > 0) {
            await page.locator('[data-cy=variant-card]').nth(0).locator('[data-cy=edit-variant-btn]').click();
            await page.waitForSelector('[data-cy=edit-variant-modal]');

            await page.locator('[data-cy="variant-form-date-published"]').fill(new_date_published);
            await page.locator('[data-cy="variant-form-submitters"] input').first().fill(new_submitter);
            await page.locator('[data-cy="variant-form-text"]').fill(new_text);
            await page.locator('[data-cy="variant-form-inputs-outputs"]').nth(0).fill(new_inputs_outputs_1);

            await page.locator('[data-cy=save-variant-btn]').click();

            await expect(page.locator('[data-cy="toast"]')).toHaveText(
                'Variant successfully updated. Your edits will be live within 24 hours.'
            );
            await expect(page.locator('[data-cy=edit-variant-modal]')).not.toBeVisible();
        }
    });

    test('Should Delete Variant - Incident Editor user', async ({ page, login }) => {

        await login({ customData: { first_name: 'John', last_name: 'Doe', roles: ['incident_editor'] } });

        await page.goto(url);

        const variants = await getVariants();

        if (variants.length > 0) {

            await page.locator('[data-cy=variant-card]').nth(0).locator('[data-cy=edit-variant-btn]').click();
            await expect(page.locator('[data-cy=edit-variant-modal]')).toBeVisible();

            page.on('dialog', dialog => dialog.accept());

            await page.locator('[data-cy=delete-variant-btn]').click();

            await expect(page.locator('[data-cy="toast"]')).toHaveText(
                'Variant successfully deleted. Your changes will be live within 24 hours.'
            );
            await expect(page.locator('[data-cy=edit-variant-modal]')).not.toBeVisible();
        }
    });
});