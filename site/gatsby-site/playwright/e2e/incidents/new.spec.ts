import { expect } from '@playwright/test';
import gql from 'graphql-tag';
import { test, conditionalIntercept, waitForRequest, query, fillAutoComplete } from '../../utils';
import { init } from '../../memory-mongo';

test.describe('New Incident page', () => {
  const url = '/incidents/new';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should successfully create a new incident', async ({ page, login }) => {

    await init({
      customData: {
        users: [
          { userId: 'mocked', first_name: 'Mock', last_name: 'User', roles: ['admin'] },
        ]
      }
    });

    await login();

    await page.goto(url);

    const values = {
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
    };

    for (const [key, value] of Object.entries(values)) {
      await page.locator(`[name=${key}]`).fill(value);
    }

    await page.locator('[data-cy="alleged-deployer-of-ai-system-input"] input').first().fill('Test Deployer');
    await page.keyboard.press('Enter');
    await page.locator('[data-cy="alleged-developer-of-ai-system-input"] input').first().fill('youtube');
    await page.keyboard.press('Enter');
    await page.locator('[data-cy="alleged-harmed-or-nearly-harmed-parties-input"] input').first().fill('children');
    await page.keyboard.press('Enter');
    await page.locator('[data-cy="implicated-systems-input"] input').first().fill('children');
    await page.keyboard.press('Enter');

    await fillAutoComplete(page, '#input-editors', 'John', 'John Doe');

    await page.getByText('Save').click();

    await page.getByText(`You have successfully create Incident 5. View incident`).waitFor();
  });

  test('Should create a new incident for reports that already exist, keeping them in their incidents', async ({ page, login }) => {

    // One article can cover several distinct incidents; the report should be the
    // underlying report of each, not re-submitted per incident. SEE: #4052

    await init();

    await login();

    await page.goto(url);

    const values = {
      title: 'A second incident from an existing article',
      description: 'Test description',
      date: '2021-01-02',
    };

    for (const [key, value] of Object.entries(values)) {
      await page.locator(`[name=${key}]`).fill(value);
    }

    await page.locator('[data-cy="alleged-deployer-of-ai-system-input"] input').first().fill('Test Deployer');
    await page.keyboard.press('Enter');
    await page.locator('[data-cy="alleged-developer-of-ai-system-input"] input').first().fill('youtube');
    await page.keyboard.press('Enter');
    await page.locator('[data-cy="alleged-harmed-or-nearly-harmed-parties-input"] input').first().fill('children');
    await page.keyboard.press('Enter');
    await page.locator('[data-cy="implicated-systems-input"] input').first().fill('children');
    await page.keyboard.press('Enter');

    await fillAutoComplete(page, '#input-editors', 'John', 'John Doe');

    // Report 3 is seeded as one of incident 3's reports.
    await page.locator('[data-cy="reports-field-input"]').fill('3');
    await page.locator('[data-cy="reports-field-add"]').click();

    const picked = page.locator('[data-cy="reports-field-report"]');

    await expect(picked).toHaveCount(1);
    await expect(picked.first()).toContainText('#3');
    await expect(picked.first()).toContainText('also in incident 3');

    // A number that is not a report is refused before saving.
    await page.locator('[data-cy="reports-field-input"]').fill('999999');
    await page.locator('[data-cy="reports-field-add"]').click();

    await expect(page.locator('[data-cy="reports-field-error"]')).toContainText('does not exist');

    await expect(picked).toHaveCount(1);

    await page.getByText('Save').click();

    await page.getByText(`You have successfully create Incident 5. View incident`).waitFor();

    await expect(page.locator('[data-cy="toast"]')).toContainText('1 existing report(s) linked');

    const { data } = await query({
      query: gql`{
        created: incident(filter: { incident_id: { EQ: 5 } }) { incident_id reports { report_number } }
        original: incident(filter: { incident_id: { EQ: 3 } }) { incident_id reports { report_number } }
      }`,
    });

    expect(data.created.reports.map((r) => r.report_number)).toEqual([3]);

    // The report is now the underlying report of both incidents.
    expect(data.original.reports.map((r) => r.report_number)).toContain(3);
  });

  test('Should clone an incident', async ({ page, login }) => {

    await init();

    await login();

    const newIncidentId = 5;

    await page.goto(`${url}/?incident_id=3`);

    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.getByText('Save').click();

    await page.getByText(`You have successfully create Incident ${newIncidentId}. View incident`).waitFor();
  });
});
