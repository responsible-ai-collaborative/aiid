import { conditionalIntercept, waitForRequest, test } from '../utils';
import { expect } from '@playwright/test';
import { SUBSCRIPTION_TYPE } from '../../src/utils/subscriptions.js';
import config from '../config';
import { DBSubscription } from '../seeds/customData/subscriptions';
import { init, seedFixture } from '../memory-mongo';
import { ObjectId } from 'bson';

const entity = {
  entity_id: 'kronos',
  name: 'Kronos',
};

test.describe('Individual Entity page', () => {

  const url = `/entities/${entity.entity_id}`;

  test('Successfully loads', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);
  });

  test('Should subscribe to new Entity incidents (authenticated user)', async ({ page, login }) => {

    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

    await page.goto(url);

    await page.locator('button:has-text("Follow")').click();

    await expect(page.locator('[data-cy="toast"]')).toContainText(`You have successfully subscribed to new ${entity.name} incidents`);
  });

  test('Should unsubscribe to new Entity incidents (authenticated user)', async ({ page, login }) => {

    await init();

    const [userId] = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

    const subscriptions: DBSubscription[] = [
      {
        _id: new ObjectId("62f40cd14016f5858d72385d"),
        entityId: 'kronos',
        type: SUBSCRIPTION_TYPE.entity,
        userId: userId,
      },
    ]

    await seedFixture({ customData: { subscriptions } }, false);

    await page.goto(url);

    await page.locator('button:has-text("Unfollow")').click();

    await expect(page.locator('[data-cy="toast"]')).toContainText(`You have successfully unsubscribed to new ${entity.name} incidents`);
  });

  test('Should not subscribe to new Entity incidents (user unauthenticated)', async ({ page }) => {
    await page.goto(url);

    await page.locator('button:has-text("Follow")').click();

    await expect(page.locator('[data-cy="toast"]')).toContainText(`Please log in to subscribe`);
  });

  test('Should not display Edit button for unauthenticated users', async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('[data-cy="edit-entity-btn"]')).not.toBeVisible();
  });

  test('Should display Edit button for Admin users', async ({ page, login, skipOnEmptyEnvironment }) => {
    
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

    await page.goto(url);
    await expect(page.locator('[data-cy="edit-entity-btn"]')).toHaveAttribute('href', `/entities/edit?entity_id=${entity.entity_id}`);

    await page.locator('[data-cy="edit-entity-btn"]').click();

    await expect(page).toHaveURL(`/entities/edit/?entity_id=${entity.entity_id}`);
  });

  test('Should not display Edit button for non-admin users', async ({ page, login, skipOnEmptyEnvironment }) => {

    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

    await page.goto(url);
    await expect(page.locator('[data-cy="edit-entity-btn"]')).not.toBeVisible();
  });
});