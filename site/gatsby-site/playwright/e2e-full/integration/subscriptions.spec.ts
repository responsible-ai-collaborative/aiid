import { conditionalIntercept, waitForRequest } from '../../utils';
import subscriptionsData from '../../fixtures/subscriptions/subscriptions.json';
import subscriptionsToDeletedIncidentsData from '../../fixtures/subscriptions/subscriptions-to-deleted-incidents.json';
import emptySubscriptionsData from '../../fixtures/subscriptions/empty-subscriptions.json';
import { SUBSCRIPTION_TYPE } from '../../../src/utils/subscriptions';
import { test } from '../../utils';
import { expect } from '@playwright/test';

const incidentSubscriptions = subscriptionsData.data.subscriptions
  .filter((subscription) => subscription.type === SUBSCRIPTION_TYPE.incident)
  .sort((a, b) => a.incident_id.incident_id - b.incident_id.incident_id);

const entitySubscriptions = subscriptionsData.data.subscriptions
  .filter((subscription) => subscription.type === SUBSCRIPTION_TYPE.entity)
  .sort((a, b) => a.entityId.name - b.entityId.name);

test.describe('Subscriptions', () => {
  const url = '/account';

  test('Incident Updates: Should display user subscriptions', async ({ page, login }) => { // DONE
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUserSubscriptions',
      subscriptionsData,
      'FindUserSubscriptions'
    );

    await page.goto(url);

    await waitForRequest('FindUserSubscriptions');

    await expect(page.locator('[data-cy="incident-subscription-item"]')).toHaveCount(incidentSubscriptions.length);

    for (let index = 0; index < incidentSubscriptions.length; index++) {
      const incident = incidentSubscriptions[index].incident_id;

      await page.locator('[data-cy="incident-subscription-item"] > div').nth(index).locator(`:has-text("Updates on incident #${incident.incident_id}: ${incident.title}")`).click();
    }
  });

  test("Incident Updates: Should display a information message if the user doesn't have subscriptions", async ({ page, login }) => { //D DONE
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUserSubscriptions',
      emptySubscriptionsData,
      'FindUserSubscriptions'
    );

    await page.goto(url);

    await waitForRequest('FindUserSubscriptions');

    await expect(page.locator('[data-cy="incident-subscription-item"]')).toHaveCount(0);

    await page.getByText("You don't have active subscriptions to Incident updates", { exact: true });
  });

  test('New Incidents: Should display the switch toggle off if user doesn\'t have a subscription', async ({ page, login }) => { // TODO
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUserSubscriptions',
      emptySubscriptionsData,
      'FindUserSubscriptions'
    );

    await page.goto(url);

    await waitForRequest('FindUserSubscriptions');

    await expect(page.locator('input[name=subscribe-all]')).toBeVisible();

    await page.locator('button[role=switch][aria-checked=false]').click();
  });

  test('New Incidents: Should display the switch toggle on if user has a subscription', async ({ page, login }) => {// TODO
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUserSubscriptions',
      subscriptionsData,
      'FindUserSubscriptions'
    );

    await page.goto(url);

    await page.locator('input[name=subscribe-all]').evaluate((element) => {
      expect(element).toBeChecked();
    });

    await page.locator('button[role=switch][aria-checked=true]').click();
  });

  test('Incident Updates: Should not display user subscriptions to deleted Incidents', async ({ page, login }) => {// TODO
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUserSubscriptions',
      subscriptionsToDeletedIncidentsData,
      'FindUserSubscriptions'
    );

    await page.goto(url);

    const incidentSubscriptions = subscriptionsToDeletedIncidentsData.data.subscriptions
      .filter((subscription) => subscription.type === SUBSCRIPTION_TYPE.incident && subscription.incident_id)
      .sort((a, b) => a.incident_id.incident_id - b.incident_id.incident_id);

    await page.locator('[data-cy="incident-subscription-item"]').evaluate((items, length) => {
      expect(items.length).toBe(length);
    }, incidentSubscriptions.length);

    for (let index = 0; index < incidentSubscriptions.length; index++) {
      const incident = incidentSubscriptions[index].incident_id;

      await page.locator('[data-cy="incident-subscription-item"] > div').nth(index).locator(`:has-text("Updates on incident #${incident.incident_id}: ${incident.title}")`).click();
    }
  });

  test('Entity: Should display user subscriptions', async ({ page, login }) => {// TODO
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUserSubscriptions',
      subscriptionsData,
      'FindUserSubscriptions'
    );

    await page.goto(url);

    await page.locator('[data-cy="entity-subscription-item"]').evaluate((items, length) => {
      expect(items.length).toBe(length);
    }, entitySubscriptions.length);

    for (let index = 0; index < entitySubscriptions.length; index++) {
      const entity = entitySubscriptions[index].entityId;

      await page.locator('[data-cy="entity-subscription-item"] > div').nth(index).locator(`:has-text("New ${entity.name} Entity incidents")`).click();
    }
  });

  test("Entity: Should display a information message if the user doesn't have subscriptions", async ({ page, login }) => {// TODO
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindUserSubscriptions',
      emptySubscriptionsData,
      'FindUserSubscriptions'
    );

    await page.goto(url);

    await page.locator('[data-cy="entity-subscription-item"]').evaluate((items) => {
      expect(items).not.toExist();
    });

    await page.locator(':has-text("You don\'t have active subscriptions to Entities")').click();
  });
});
