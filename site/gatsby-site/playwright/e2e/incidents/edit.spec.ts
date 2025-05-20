import { expect } from '@playwright/test';
import { test, fillAutoComplete, query } from '../../utils';
import { init } from '../../memory-mongo';
import gql from 'graphql-tag';

test.describe('Incidents', () => {
  const url = '/incidents/edit?incident_id=3';

  test('Should successfully edit incident fields', async ({ page, login }) => {

    await init({
      customData: {
        users: [
          { userId: 'pablo', first_name: 'Pablo', last_name: 'Costa', roles: ['admin'] },
        ]
      }
    });

    await login();

    await page.goto(url);

    const values = {
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
      editor_notes: 'Test editor notes',
    };

    for (const key in values) {
      await page.locator(`[name=${key}]`).fill(values[key]);
    }

    await page.locator('[data-cy="alleged-deployer-of-ai-system-input"] input').first().fill('Test Deployer');
    await page.keyboard.press('Enter');

    await expect(await page.locator('[title="John Doe"]')).toBeVisible();

    await fillAutoComplete(page, '#input-editors', 'Pab', 'Pablo Costa');

    await page.getByText('Save', { exact: true }).click();

    await page.locator('.tw-toast:has-text("Incident 3 updated successfully.")').isVisible();
  });

  test('Should successfully edit tags for linked reports', async ({ page, login }) => {

    await init();

    await login();

    await page.goto(url);

    await expect(page.locator('text=Linked Reports')).toBeVisible();


    const reportSection = page.locator('[data-testid="linked-report-3"]');


    await expect(reportSection.getByText('Test Tag')).toBeVisible();

    await reportSection.getByRole('button', { name: 'Edit' }).click();

    await expect(reportSection.locator('.Typeahead')).toBeVisible();

    const removeButton = reportSection.locator('.rbt-token-remove-button');
    await removeButton.click();

    await reportSection.locator('input[type="text"]').fill('New Tag');
    await reportSection.locator('a[aria-label="New Tag"]').click();

    await reportSection.getByText('Save').click();

    await expect(page.locator('.tw-toast:has-text("Tags updated successfully")')).toBeVisible();

    await expect(reportSection.getByText('New Tag')).toBeVisible();
    await expect(reportSection.getByText('Test Tag')).not.toBeVisible();

    const { data } = await query({
      query: gql`{
        report(filter: { report_number: { EQ: 3 } }) {
          report_number
          tags
        }
      }`
    });

    expect(data.report.tags).toEqual(['New Tag']);
  });

  test('Should handle cancellation when editing tags', async ({ page, login }) => {

    await init();

    await login();

    await page.goto(url);

    await expect(page.locator('text=Linked Reports')).toBeVisible();

    const reportSection = page.locator('[data-testid="linked-report-3"]');

    await expect(reportSection.getByText('Test Tag')).toBeVisible();

    await reportSection.locator('button:has-text("Edit")').click();

    await expect(reportSection.locator('.Typeahead')).toBeVisible();

    const removeButton = reportSection.locator('.rbt-token-remove-button');
    await removeButton.click();

    await reportSection.locator('input[type="text"]').fill('New Tag');
    await reportSection.locator('a[aria-label="New Tag"]').click();

    await reportSection.locator('button:has-text("Cancel")').click();

    await expect(reportSection.getByText('Test Tag')).toBeVisible();
    await expect(reportSection.getByText('New Tag')).not.toBeVisible();

    // Verify the tags in the database using GraphQL query
    const { data } = await query({
      query: gql`{
        report(filter: { report_number: { EQ: 3 } }) {
          report_number
          tags
        }
      }`
    });

    // Verify that the tags in the database remain unchanged after cancellation
    expect(data.report.tags).toEqual(['Test Tag']);
  });
});
