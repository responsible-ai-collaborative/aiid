import { test, expect } from '@playwright/test';
import { query, conditionalIt } from '../utils';
import gql from 'graphql-tag';

const url = '/summaries/incidents';

test.describe('Incidents Summary', () => {
  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  conditionalIt(
    !process.env.isEmptyEnvironment,
    'Displays the correct number of incidents',
    async ({ page }) => {
      await page.goto(url);

      const { data: { incidents } } = await query({
        query: gql`
          {
            incidents(limit: 9999) {
              incident_id
            }
          }
        `,
      });

      await expect(page.locator('[data-cy="incident-list"]')).toBeVisible();
      await expect(page.locator('[data-cy="incident-list"] > div')).toHaveCount(incidents.length);

    }
  );

  conditionalIt(
    !process.env.isEmptyEnvironment,
    'Should sort by Incident ID (ascending and descending)',
    async ({ page }) => {
      await page.goto(url);

      const { data: { incidents } } = await query({
        query: gql`
          {
            incidents(limit: 9999, sortBy: INCIDENT_ID_DESC) {
              incident_id
            }
          }
        `,
      });

      await expect(page.locator('[data-cy="sort-ascending-button"]')).toBeVisible();
      await expect(page.locator('[data-cy="sort-descending-button"]')).toBeVisible();
      await expect(page.locator('[data-cy="sort-descending-button"]')).toBeDisabled();

      await expect(page.locator('[data-cy="incident-list"] > div').first()).toContainText(`Incident ${incidents[0].incident_id}`);

      await page.locator('[data-cy="sort-ascending-button"]').click();
      await expect(page.locator('[data-cy="incident-list"] > div').first()).toContainText(`Incident ${incidents[incidents.length - 1].incident_id}`);

      await page.locator('[data-cy="sort-descending-button"]').click();
      await expect(page.locator('[data-cy="incident-list"] > div').first()).toContainText(`Incident ${incidents[0].incident_id}`);
    }
  );
});
