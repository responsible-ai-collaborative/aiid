import { conditionalIntercept, waitForRequest, test } from '../../utils';
import entity from '../../fixtures/entities/entity.json';
import updateOneEntity from '../../fixtures/entities/updateOneEntity.json';
import { expect, Page } from '@playwright/test';

test.describe('Edit Entity', () => {
  const entity_id = 'google';
  const url = `/entities/edit?entity_id=${entity_id}`;

  test('Should successfully edit Entity fields',
    async ({ page, login, skipOnEmptyEnvironment  }) => {
      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);
      await page.goto(url);

      await conditionalIntercept(
        page,
        '**/graphql',
        (req) => req.postDataJSON().operationName === 'FindEntity',
        entity,
        'FindEntity'
      );

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
        updateOneEntity,
        'UpdateEntity'
      );

      const now = new Date();

      await page.addInitScript(() => {
        Date.now = () => now.getTime();
      });

      await page.locator(':has-text("Save")').click();

      const updatedEntity = {
        name: values.name,
        date_modified: now.toISOString(),
      };

      const updateEntityRequest = await waitForRequest('UpdateEntity');
      const variables = updateEntityRequest.postDataJSON().variables;
      expect(variables.query.entity_id).toBe(entity_id);
      expect(variables.set).toEqual(updatedEntity);

      await expect(page.locator('.tw-toast')).toContainText('Entity updated successfully.');
    }
  );

  test('Should display an error message when editing Entity fails',
    async ({ page, login, skipOnEmptyEnvironment }) => {
      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);
      await page.goto(url);

      await conditionalIntercept(
        page,
        '**/graphql',
        (req) => req.postDataJSON().operationName === 'FindEntity',
        entity,
        'FindEntity'
      );

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

      const now = new Date();

      await page.addInitScript(() => {
        Date.now = () => now.getTime();
      });

      await page.locator(':has-text("Save")').click();

      const updateEntityRequest = await waitForRequest('UpdateEntity');
      const variables = updateEntityRequest.postDataJSON().variables;
      expect(variables.query.entity_id).toBe(entity_id);
      expect(variables.set).toEqual({
        name: values.name,
        date_modified: now.toISOString(),
      });

      await expect(page.locator('.tw-toast')).toContainText('Error updating Entity.');
    }
  );
});
