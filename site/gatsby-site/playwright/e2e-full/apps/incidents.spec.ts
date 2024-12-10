import { expect } from '@playwright/test';
import { conditionalIntercept, fillAutoComplete, query, test, waitForRequest } from '../../utils';
import { init } from '../../memory-mongo';
import gql from 'graphql-tag';

test.describe('Incidents App', () => {
  const url = '/apps/incidents/';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
    await expect(page).toHaveURL(url);
  });

  test('Should display a list of incidents', async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('[data-cy="row"]')).toHaveCount(3);
  });

  test('Should display an empty list of incidents on Empty environment', async ({ page, runOnlyOnEmptyEnvironment }) => {
    await page.goto(url);
    await expect(page.locator('[data-cy="row"]')).toHaveCount(0);
  });

  test('Successfully filter and edit incident 3', async ({ page, login }) => {

    await init();

    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'John', last_name: 'Doe', roles: ['admin'] } });

    await page.goto(url);

    await page.waitForSelector('[data-testid="flowbite-toggleswitch-toggle"]');
    await page.locator('[data-testid="flowbite-toggleswitch-toggle"]').click();
    await page.locator('[data-cy="input-filter-Incident ID"]').fill('3');
    await page.keyboard.press('Enter');

    await expect(page.locator('[data-cy="row"]')).toHaveCount(1);
    await page.click('text=Edit');

    await page.waitForSelector('[data-cy="incident-form"]', { timeout: 12000 });
    await expect(page.locator('.submission-modal h3')).toHaveText('Edit Incident 3');

    await page.locator(`[data-cy=title-input]`).fill('Test title');
    await page.locator('[data-cy=description-input]').fill('New description');
    await page.locator('[data-cy=date-input]').fill('2023-05-04');
    await page.locator('[data-cy=alleged-deployer-of-ai-system-input] input').first().fill('Test Deployer{enter}');

    await fillAutoComplete(page, "#input-editors", "Joh", "John Doe");

    await page.getByText('Update', { exact: true }).click();

    await expect(page.locator('[data-cy="toast"]').locator('text=Incident 3 updated successfully.')).toBeVisible();

    const result = await query({
      query: gql`{
              incident(filter: { incident_id: { EQ: 3 } }) {
                title
                description
              }
            }`
    });

    expect(result.data.incident).toMatchObject({
      title: 'Test title',
      description: 'New description',
    });
  });

  test('Entities should link to entities page', async ({ page }) => {

    await init();
    await page.goto(url);

    await page.waitForSelector('[data-testid="flowbite-toggleswitch-toggle"]');
    await page.locator('[data-testid="flowbite-toggleswitch-toggle"]').click();

    const { data: { incidents } } = await query({
      query: gql`{
          incidents {
            incident_id
            title
            description
            date
            AllegedDeployerOfAISystem {
              entity_id
              name
            }
            AllegedDeveloperOfAISystem {
              entity_id
              name
            }
            AllegedHarmedOrNearlyHarmedParties {
              entity_id
              name
            }
            implicated_systems {
              entity_id
              name
            }
          }
        }`
    });

    const rowLocator = page.locator('[data-cy="row"]').first();
    const firstIncident = incidents[0];

    for (const [index, deployer] of firstIncident.AllegedDeployerOfAISystem.entries()) {

      const link = await rowLocator.locator('[data-cy="cell"]').nth(4).locator('[data-cy="cell-entity-link"]').nth(index).getAttribute('href');
      expect(link).toContain(`/entities/${deployer.entity_id}`);
    }

    for (const [index, developer] of firstIncident.AllegedDeveloperOfAISystem.entries()) {

      const link = await rowLocator.locator('[data-cy="cell"]').nth(5).locator('[data-cy="cell-entity-link"]').nth(index).getAttribute('href');
      expect(link).toContain(`/entities/${developer.entity_id}`);
    }

    for (const [index, harmed] of firstIncident.AllegedHarmedOrNearlyHarmedParties.entries()) {

      const link = await rowLocator.locator('[data-cy="cell"]').nth(6).locator('[data-cy="cell-entity-link"]').nth(index).getAttribute('href');
      expect(link).toContain(`/entities/${harmed.entity_id}`);
    }

    for (const [index, implicated_system] of firstIncident.implicated_systems.entries()) {

      const link = await rowLocator.locator('[data-cy="cell"]').nth(7).locator('[data-cy="cell-entity-link"]').nth(index).getAttribute('href');
      expect(link).toContain(`/entities/${implicated_system.entity_id}`);
    }
  });

  test('Successfully assigns similar/dissimilar incidents to incident 3', async ({ page, login }) => {

    await init();

    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'John', last_name: 'Doe', roles: ['incident_editor'] } });

    await page.goto(url);

    await page.waitForSelector('[data-testid="flowbite-toggleswitch-toggle"]');
    await page.locator('[data-testid="flowbite-toggleswitch-toggle"]').click();
    await page.locator('[data-cy="input-filter-Incident ID"]').fill('3');
    await page.keyboard.press('Enter');

    await expect(page.locator('[data-cy="row"]')).toHaveCount(1);
    await page.click('text=Edit');

    await page.waitForSelector('[data-cy="incident-form"]');
    await expect(page.locator('.submission-modal h3')).toHaveText('Edit Incident 3');

    await page.locator(`[data-cy=title-input]`).fill('Test title');
    await page.locator('[data-cy=description-input]').fill('New description');
    await page.locator('[data-cy=date-input]').fill('2023-05-04');
    await page.locator('[data-cy=alleged-deployer-of-ai-system-input] input').first().fill('Test Deployer{enter}');

    await fillAutoComplete(page, "#input-editors", "Joh", "John Doe");

    await fillAutoComplete(page, "#input-incidentSearch", "1", "1 - Incident 1");

    await page.locator('[data-cy=similar]').click();

    await fillAutoComplete(page, "#input-incidentSearch", "2", "2 - Incident 2");

    await page.locator('[data-cy=related-byId] [data-cy=dissimilar]').click();

    await page.getByText('Update', { exact: true }).click();

    await expect(page.locator('[data-cy="toast"]').locator('text=Incident 3 updated successfully.')).toBeVisible();

    const result = await query({
      query: gql`{
            incident(filter: { incident_id: { EQ: 3 } }) {
              title
              description
              editor_dissimilar_incidents
              editor_similar_incidents
            }
          }`
    });

    expect(result.data.incident).toMatchObject({
      title: 'Test title',
      description: 'New description',
      editor_similar_incidents: [1],
      editor_dissimilar_incidents: [2],
    });
  });

  test('Should display a list of live incidents', async ({ page }) => {

    await init({
      aiidprod: {
        incidents: [
          { incident_id: 14, title: 'Incident 14', description: 'Description 14', date: '2021-01-01' },
        ]
      }
    });

    const { data: { incidents } } = await query({
      query: gql`{
              incidents {
                incident_id
                title
                description
                date
                AllegedDeployerOfAISystem {
                  name
                }
                AllegedDeveloperOfAISystem {
                  name
                }
                AllegedHarmedOrNearlyHarmedParties {
                  name
                }
                implicated_systems {
                  name
                }
              }
            }`
    });

    await page.goto(url);

    await page.waitForSelector('[data-testid="flowbite-toggleswitch-toggle"]');
    await page.locator('[data-testid="flowbite-toggleswitch-toggle"]').click();

    const rowLocator = page.locator('[data-cy="row"]').first();
    const firstIncident = incidents[0];

    await expect(rowLocator.locator('[data-cy="cell"]')).toHaveCount(8);

    await expect(rowLocator.locator('[data-cy="cell"]').nth(0)).toHaveText(`Incident ${firstIncident.incident_id}`);
    await expect(rowLocator.locator('[data-cy="cell"]').nth(1)).toHaveText(firstIncident.title);
    await expect(rowLocator.locator('[data-cy="cell"]').nth(2)).toHaveText(firstIncident.description);

    // TODO: fix these

    await expect(rowLocator.locator('[data-cy="cell"]').nth(3)).toHaveText(firstIncident.date);
    await expect(rowLocator.locator('[data-cy="cell"]').nth(4)).toHaveText(firstIncident.AllegedDeployerOfAISystem.map((i: any) => i.name).join(', '));
    await expect(rowLocator.locator('[data-cy="cell"]').nth(5)).toHaveText(firstIncident.AllegedDeveloperOfAISystem.map((i: any) => i.name).join(', '));
    await expect(rowLocator.locator('[data-cy="cell"]').nth(6)).toHaveText(firstIncident.AllegedHarmedOrNearlyHarmedParties.map((i: any) => i.name).join(', '));
    await expect(rowLocator.locator('[data-cy="cell"]').nth(7)).toHaveText(firstIncident.implicated_systems.map((i: any) => i.name).join(', '));
  });

  test('Should navigate to the last page, and the first page', async ({ page }) => {
    await page.goto(url);

    await page.locator('[data-cy="last-page"]').click();

    const totalPages = await page.locator('[data-cy="total-pages"]').textContent();
    await expect(page.locator('[data-cy="current-page"]')).toHaveText(totalPages);

    await page.locator('[data-cy="first-page"]').click();

    await expect(page.locator('[data-cy="current-page"]')).toHaveText('1');
  });

  test('Should switch between views', async ({ page }) => {
    await page.goto(url);

    await page.waitForSelector('[data-cy="table-view"] button:has-text("Issue Reports")');
    await page.locator('[data-cy="table-view"] button:has-text("Issue Reports")').click();

    await page.waitForSelector('[data-cy="row"]');
    await expect(page.locator('[data-cy="row"]')).toHaveCount(1);

    const firstRowLink = await page.locator('[data-cy="row"] td a').first().getAttribute('href');
    expect(firstRowLink).toMatch(/^\/reports\/\d+$/);

    await page.getByText('Reports', { exact: true }).click();

    await page.waitForSelector('[data-cy="row"]');
    await expect(page.locator('[data-cy="row"]')).toHaveCount(4);

    const firstCiteLink = await page.locator('[data-cy="row"] td a').first().getAttribute('href');
    expect(firstCiteLink).toMatch(/^\/cite\/\d+#r\d+$/);
  });
});