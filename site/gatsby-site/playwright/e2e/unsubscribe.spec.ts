import { test } from '../utils';
import { SUBSCRIPTION_TYPE } from '../../src/utils/subscriptions';
import { conditionalIntercept, waitForRequest } from '../utils';

test.describe('Unsubscribe pages', () => {
  const userId = '6304204e580ff154aefea0c6';
  const incidentId = 10;
  const url = `/unsubscribe`;

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
    await page.getByText('Invalid parameters').waitFor();
  });

  test('Should display an Invalid Params message if userId param is not present', async ({ page }) => {
    await page.goto(`${url}?type=incident`);
    await page.getByText('Invalid parameters').waitFor();
  });

  test('Should display an Invalid Params message if type param is not present', async ({ page }) => {
    await page.goto(`${url}?userId=${userId}`);
    await page.getByText('Invalid parameters').waitFor();
  });

  test('Should display an Invalid Params message if type param incident but incidentId is not present', async ({ page }) => {
    await page.goto(`${url}?type=incident&userId=${userId}`);
    await page.getByText('Invalid parameters').waitFor();
  });

  test('Should not display an Invalid Params message if "all" subscription params are OK', async ({ page }) => {
    await page.goto(`${url}?type=all&userId=${userId}`);
    await page.getByText('Invalid parameters').waitFor({ state: 'detached' });
  });

  test('Should not display an Invalid Params message if "incident" subscription params are OK', async ({ page }) => {
    await page.goto(`${url}?type=incident&userId=${userId}&incidentId=${incidentId}`);
    await page.getByText('Invalid parameters').waitFor({ state: 'detached' });
  });

  test('Should not display an Invalid Params message if "new-incidents" subscription params are OK', async ({ page }) => {
    await page.goto(`${url}?type=${SUBSCRIPTION_TYPE.newIncidents}&userId=${userId}`);
    await page.getByText('Invalid parameters').waitFor({ state: 'detached' });
  });

  test('Should unsubscribe from all subscriptions', async ({ page }) => {
    await page.goto(`${url}?type=all&userId=${userId}`);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) =>
        req.postDataJSON().operationName === 'DeleteSubscriptions' &&
        req.postDataJSON().variables.query.userId.userId === userId &&
        !req.postDataJSON().variables.query.incident_id,
      {
        data: {
          deleteManySubscriptions: {
            __typename: 'DeleteManyPayload',
            deletedCount: 0,
          },
        },
      },
      'DeleteSubscriptions'
    );

    await page.getByText('Confirm').click();

    const deleteSubscriptionsRequest = await waitForRequest('DeleteSubscriptions');
    await page.locator('[data-cy="toast"]').getByText('You have successfully unsubscribed.').waitFor();

    await page.getByText('Continue').click();
    await page.waitForURL('/');
  });

  test('Should unsubscribe from an incident subscription', async ({ page }) => {
    await page.goto(`${url}?type=${SUBSCRIPTION_TYPE.incident}&userId=${userId}&incidentId=${incidentId}`);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) =>
        req.postDataJSON().operationName === 'DeleteSubscriptions' &&
        req.postDataJSON().variables.query.type === SUBSCRIPTION_TYPE.incident &&
        req.postDataJSON().variables.query.userId.userId === userId &&
        req.postDataJSON().variables.query.incident_id.incident_id === `${incidentId}`,
      {
        data: {
          deleteManySubscriptions: {
            __typename: 'DeleteManyPayload',
            deletedCount: 0,
          },
        },
      },
      'DeleteSubscriptions'
    );

    await page.getByText('Confirm').click();

    const deleteSubscriptionsRequest = await waitForRequest('DeleteSubscriptions');
    await page.locator('[data-cy="toast"]').getByText('You have successfully unsubscribed.').waitFor();

    await page.getByText('Continue').click();
    await page.waitForURL('/');
  });

  test('Should unsubscribe from new incidents subscription', async ({ page }) => {
    await page.goto(`${url}?type=${SUBSCRIPTION_TYPE.newIncidents}&userId=${userId}`);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) =>
        req.postDataJSON().operationName === 'DeleteSubscriptions' &&
        req.postDataJSON().variables.query.type === SUBSCRIPTION_TYPE.newIncidents &&
        req.postDataJSON().variables.query.userId.userId === userId &&
        !req.postDataJSON().variables.query.incident_id,
      {
        data: {
          deleteManySubscriptions: {
            __typename: 'DeleteManyPayload',
            deletedCount: 0,
          },
        },
      },
      'DeleteSubscriptions'
    );

    await page.getByText('Confirm').click();

    await waitForRequest('DeleteSubscriptions');
    await page.locator('[data-cy="toast"]').getByText('You have successfully unsubscribed.').waitFor();

    await page.getByText('Continue').click();
    await page.waitForURL('/');
  });
});
