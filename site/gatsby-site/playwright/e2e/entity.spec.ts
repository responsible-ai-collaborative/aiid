import { conditionalIntercept, waitForRequest, test } from '../utils';
import { expect } from '@playwright/test';
import emptySubscriptionsData from '../fixtures/subscriptions/empty-subscriptions.json';
import subscriptionsData from '../fixtures/subscriptions/subscriptions.json';
import { SUBSCRIPTION_TYPE } from '../../src/utils/subscriptions.js';
import config from '../config';

const entity = {
  entity_id: 'google',
  name: 'Google',
};

test.describe('Individual Entity page', () => {
  test.beforeAll(async () => {
    // Skip all tests if the environment is empty since /entities/{entity_id} page is not available
    if (config.isEmptyEnvironment) {
      test.skip();
    }
  });

  const url = `/entities/${entity.entity_id}`;

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should subscribe to new Entity incidents (authenticated user)', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUserSubscriptions',
      emptySubscriptionsData,
      'FindUserSubscriptions',
    );

    await page.goto(url);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) =>
        req.postDataJSON().operationName == 'UpsertSubscription' &&
        req.postDataJSON().variables.query.entityId.entity_id == entity.entity_id &&
        req.postDataJSON().variables.query.type == SUBSCRIPTION_TYPE.entity &&
        req.postDataJSON().variables.subscription.entityId.link == entity.entity_id &&
        req.postDataJSON().variables.subscription.type == SUBSCRIPTION_TYPE.entity,
      {
        data: {
          upsertOneSubscription: {
            _id: 'dummyIncidentId',
          },
        },
      },
      'upsertSubscription',
    );

    await waitForRequest('FindUserSubscriptions');
    await page.locator('button:has-text("Follow")').scrollIntoViewIfNeeded();
    await page.locator('button:has-text("Follow")').click();

    await expect(page.locator('[data-cy="toast"]')).toContainText(`You have successfully subscribed to new ${entity.name} incidents`);
  });

  test('Should unsubscribe to new Entity incidents (authenticated user)', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUserSubscriptions',
      subscriptionsData,
      'FindUserSubscriptions',
    );

    await page.goto(url);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) =>
        req.postDataJSON().operationName == 'DeleteSubscriptions' &&
        req.postDataJSON().variables.query.type == SUBSCRIPTION_TYPE.entity &&
        req.postDataJSON().variables.query.entityId.entity_id == entity.entity_id,
      {
        data: {
          deleteManySubscriptions: {
            __typename: 'DeleteManyPayload',
            deletedCount: 1,
          },
        },
      },
      'DeleteSubscription',
    );

    await waitForRequest('FindUserSubscriptions');
    await page.locator('button:has-text("Unfollow")').scrollIntoViewIfNeeded();
    await page.locator('button:has-text("Unfollow")').click();

    await expect(page.locator('[data-cy="toast"]')).toContainText(`You have successfully unsubscribed to new ${entity.name} incidents`);
  });

  test('Should not subscribe to new Entity incidents (user unauthenticated)', async ({ page }) => {
    await page.goto(url);

    await page.locator('button:has-text("Follow")').scrollIntoViewIfNeeded();
    await page.locator('button:has-text("Follow")').click();

    await expect(page.locator('[data-cy="toast"]')).toContainText(`Please log in to subscribe`);
  });

  test('Should not display Edit button for unauthenticated users', async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('[data-cy="edit-entity-btn"]')).not.toBeVisible();
  });

  test('Should display Edit button only for Admin users', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUserSubscriptions',
      emptySubscriptionsData,
      'FindUserSubscriptions',
    );

    await page.goto(url);
    await waitForRequest('FindUserSubscriptions');
    await expect(page.locator('[data-cy="edit-entity-btn"]')).toHaveAttribute('href', `/entities/edit?entity_id=${entity.entity_id}`);
    await page.locator('[data-cy="edit-entity-btn"]').click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(`/entities/edit/?entity_id=${entity.entity_id}`);
  }
  );
});