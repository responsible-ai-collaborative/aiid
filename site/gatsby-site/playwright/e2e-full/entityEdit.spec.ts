import { conditionalIntercept, waitForRequest, test, query } from '../utils';
import entities from '../seeds/aiidprod/entities';
import { expect } from '@playwright/test';
import { init } from '../memory-mongo';
import gql from 'graphql-tag';

test.describe('Edit Entity', () => {
  const entity_id = 'entity1';
  const url = `/entities/edit?entity_id=${entity_id}`;

  function isDateApproximatelyEqual(expectedDate, actualDate, toleranceInSeconds = 5) {
    const expectedTime = new Date(expectedDate).getTime();
    const actualTime = new Date(actualDate).getTime();
    return Math.abs(expectedTime - actualTime) <= toleranceInSeconds * 1000;
  }
  
  test('Should successfully edit Entity fields', async ({ page, login, skipOnEmptyEnvironment }) => {
  
    const userId = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);
  
    await init({ customData: { users: [{ userId, first_name: 'Test', last_name: 'User', roles: ['admin'] }] }, }, { drop: true });
  
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
      const userId = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

      await init({ customData: { users: [{ userId, first_name: 'Test', last_name: 'User', roles: ['admin'] }] }, }, { drop: true });

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
      expect(updateEntityRequest.postDataJSON().variables.filter.entity_id.EQ).toBe(entity_id);
      expect(updateEntityRequest.postDataJSON().variables.update.set.name).toBe(values.name);

      await expect(page.locator('.tw-toast')).toContainText('Error updating Entity.');
    }
  );
});
