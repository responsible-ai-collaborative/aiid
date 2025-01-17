import { conditionalIntercept, waitForRequest, test, query } from '../utils';
import entities from '../seeds/aiidprod/entities';
import { expect } from '@playwright/test';
import { init } from '../memory-mongo';
import gql from 'graphql-tag';

test.describe('Edit Entity', () => {
  const entity_id = 'entity-1';
  const url = `/entities/edit?entity_id=${entity_id}`;

  function isDateApproximatelyEqual(expectedDate, actualDate, toleranceInSeconds = 5) {
    const expectedTime = new Date(expectedDate).getTime();
    const actualTime = new Date(actualDate).getTime();
    return Math.abs(expectedTime - actualTime) <= toleranceInSeconds * 1000;
  }

  test('Should successfully edit Entity fields', async ({ page, login, skipOnEmptyEnvironment }) => {

    await init();

    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });


    await page.goto(url);

    const values = {
      name: 'Google new',
    };

    for (const key in values) {
      await page.locator(`[name=${key}]`).fill(values[key]);
    }

    await page.getByText("Save", { exact: true }).click();

    const now = new Date();

    await page.addInitScript(() => {
      Date.now = () => now.getTime();
    });

    await expect(page.locator('.tw-toast')).toContainText('Entity updated successfully.');

    const { data } = await query({
      query: gql`{
        entity(filter: { entity_id: { EQ: "${entity_id}" } }) {
          entity_id
          name
          created_at
          date_modified
        }
      }`,
    });

    expect(data.entity).toMatchObject({
      entity_id,
      created_at: entities[0].created_at,
      name: values.name,
    });

    expect(isDateApproximatelyEqual(data.entity.date_modified, now.toISOString())).toBe(true);

    await expect(page.locator('.tw-toast')).toContainText('Entity updated successfully.');
  });


  test('Should display an error message when editing Entity fails',
    async ({ page, login, skipOnEmptyEnvironment }) => {

      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

      await page.goto(url);

      const values = {
        name: 'Google new',
      };

      for (const key in values) {
        await page.locator(`[name=${key}]`).fill(values[key]);
      }

      await conditionalIntercept(
        page,
        '**/graphql',
        (req) => req.postDataJSON().operationName === 'UpdateEntity',
        {
          data: null,
          errors: [
            {
              message: 'Dummy error message',
            },
          ],
        },
        'UpdateEntity'
      );

      await page.getByText("Save", { exact: true }).click();

      const updateEntityRequest = await waitForRequest('UpdateEntity');
      expect(updateEntityRequest.postDataJSON().variables.input.entity_id).toBe(entity_id);
      expect(updateEntityRequest.postDataJSON().variables.input.name).toBe(values.name);

      await expect(page.locator('.tw-toast')).toContainText('Error updating Entity.');
    }
  );

  test('Should successfully add Entity Relationship', async ({ page, login, skipOnEmptyEnvironment }) => {
  
    await init();
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);
  
    await page.goto(url);
  
    await page.locator('[data-cy="entity-relationships"]').fill("Entity 2");
    await page.locator("#ta-entity-relationships-item-0").click();
  
    await page.getByText("Save", { exact: true }).click();
  
    await expect(page.locator('.tw-toast')).toContainText('Entity updated successfully.');

    const { data: entityRelationships } = await query({
      query: gql`{
        entity_relationships(filter: { sub: { EQ: "${entity_id}" } }) {
          sub {
            entity_id
          }
          obj {
            entity_id
          }
        }
      }`,
    });

    expect(entityRelationships.entity_relationships).toHaveLength(1);
  
    await expect(page.locator('.tw-toast')).toContainText('Entity updated successfully.');
  });

  test('Should successfully remove Entity Relationship', async ({ page, login, skipOnEmptyEnvironment }) => {
  
    await init({
      aiidprod: {
        entity_relationships: [
          {
            sub: 'entity-2',
            obj: entity_id,
            is_symmetric: true,
          },
        ],
      },
    });
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);
  
    await page.goto(`/entities/edit?entity_id=${entity_id}`);

    await page.locator('.rbt.Typeahead .rbt-token-remove-button').first().click();
  
    await page.getByText("Save", { exact: true }).click();
  
    await expect(page.locator('.tw-toast')).toContainText('Entity updated successfully.');

    const { data: entityRelationships } = await query({
      query: gql`{
        entity_relationships(filter: { sub: { EQ: "${entity_id}" } }) {
          sub {
            entity_id
          }
          obj {
            entity_id
          }
        }
      }`,
    });

    expect(entityRelationships.entity_relationships).toHaveLength(0);
  
    await expect(page.locator('.tw-toast')).toContainText('Entity updated successfully.');
  });
});
