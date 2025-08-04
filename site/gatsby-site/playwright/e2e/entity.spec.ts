import { test } from '../utils';
import { expect } from '@playwright/test';
import { SUBSCRIPTION_TYPE } from '../../src/utils/subscriptions.js';
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

    await login();

    await page.goto(url);

    await page.locator('button:has-text("Follow")').click();

    await expect(page.locator('[data-cy="toast"]')).toContainText(`You have successfully subscribed to new ${entity.name} incidents`);
  });

  test('Should unsubscribe to new Entity incidents (authenticated user)', async ({ page, login }) => {

    await init();

    const [userId] = await login();

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
    
    await login();

    await page.goto(url);
    await expect(page.locator('[data-cy="edit-entity-btn"]')).toHaveAttribute('href', `/entities/edit?entity_id=${entity.entity_id}`);

    await page.locator('[data-cy="edit-entity-btn"]').click();

    await expect(page).toHaveURL(`/entities/edit/?entity_id=${entity.entity_id}`);
  });

  test('Should not display Edit button for non-admin users', async ({ page, login, skipOnEmptyEnvironment }) => {

    await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

    await page.goto(url);
    await expect(page.locator('[data-cy="edit-entity-btn"]')).not.toBeVisible();
  });

  test('Should not query user subscriptions when not logged in', async ({ page }) => {
    await page.goto(url);

    // Intercept GraphQL calls
    const graphqlCalls = [];

    page.on('request', request => {
        if (request.url().includes('/graphql')) {
            const postData = request.postData();

            if (postData) {
                const data = JSON.parse(postData);

                if (data.operationName === 'FindUserSubscriptions') {
                    graphqlCalls.push(data);
                }
            }
        }
    });

    // Wait a reasonable time to ensure no calls are made
    await page.waitForTimeout(2000);

    // Verify that FindUserSubscriptions query was not made
    expect(graphqlCalls).toHaveLength(0);
});

test('Should query user subscriptions when logged in', async ({ page, login }) => {

    await init();

    await login();

    await page.goto(url);

    // Intercept GraphQL calls
    const graphqlCalls = [];

    page.on('request', request => {
        if (request.url().includes('/graphql')) {

            const postData = request.postData();

            if (postData) {
                const data = JSON.parse(postData);

                if (data.operationName === 'FindUserSubscriptions') {
                    graphqlCalls.push(data);
                }
            }
        }
    });

    // Wait for the FindUserSubscriptions GraphQL request instead of a fixed timeout
    await page.waitForRequest(request =>
        request.url().includes('/graphql') &&
        request.postData() &&
        JSON.parse(request.postData()).operationName === 'FindUserSubscriptions'
    );

    // Verify that FindUserSubscriptions query was made
    expect(graphqlCalls).toHaveLength(1);
});
});