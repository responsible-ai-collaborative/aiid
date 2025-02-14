import { expect } from '@playwright/test';
import { query, test } from '../utils';
import gql from 'graphql-tag';
import { init } from '../memory-mongo';

const url = '/summaries/incidents';

test.describe('Incidents Summary', () => {
  
  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Displays the correct number of incidents', async ({ page, skipOnEmptyEnvironment }) => {

    await init();

    await page.goto(url);

    const { data: { incidents } } = await query({
      query: gql`
          {
            incidents {
              incident_id
            }
          }
        `,
    });

    await expect(page.locator('[data-cy="incident-list"]')).toBeVisible();
    await expect(page.locator('[data-cy="incident-list"] > div')).toHaveCount(incidents.length);
  });

  test('Should sort by Incident ID (ascending and descending)', async ({ page, skipOnEmptyEnvironment }) => {

    await init();

    await page.goto(url);

    const { data: { incidents } } = await query({
      query: gql`
          {
            incidents(sort: {incident_id: DESC}) {
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
  });
});
