import { query, test } from '../utils';
import { SUBSCRIPTION_TYPE } from '../../src/utils/subscriptions';
import gql from 'graphql-tag';
import { expect } from '@playwright/test';

test.describe('Unsubscribe pages', () => {
  const incidentId = 3;
  const url = `/unsubscribe`;
  let userId: string;
  let accessToken: string;

  test.beforeEach(async ({ page, login }) => {
    if (!userId) {
      [userId, accessToken] = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });
    }
  });

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

    await page.getByText('Confirm').click();

    await page.locator('[data-cy="toast"]').getByText('You have successfully unsubscribed.').waitFor();

    await page.getByText('Continue').click();

    await page.waitForURL('/');


    const { data: { subscriptions: subscriptionsData } } = await query({
      query: gql`
      query {
          subscriptions(filter: {userId: {EQ:"${userId}"}}) {
              _id
              userId {
                  userId
              }
          }
      }`,
    },
      { authorization: `Bearer ${accessToken}` }
    );

    expect(subscriptionsData).toHaveLength(0);
  });

  test('Should unsubscribe from an incident subscription', async ({ page }) => {
    await page.goto(`${url}?type=${SUBSCRIPTION_TYPE.incident}&userId=${userId}&incidentId=${incidentId}`);

    await page.getByText('Confirm').click();

    await page.locator('[data-cy="toast"]').getByText('You have successfully unsubscribed.').waitFor();

    await page.getByText('Continue').click();
    await page.waitForURL('/');
  });

  test('Should unsubscribe from new incidents subscription', async ({ page }) => {
    await page.goto(`${url}?type=${SUBSCRIPTION_TYPE.newIncidents}&userId=${userId}`);

    await page.getByText('Confirm').click();

    await page.locator('[data-cy="toast"]').getByText('You have successfully unsubscribed.').waitFor();

    await page.getByText('Continue').click();
    await page.waitForURL('/');
  });
});
