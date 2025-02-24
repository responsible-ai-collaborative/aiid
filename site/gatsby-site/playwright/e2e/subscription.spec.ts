import { expect } from '@playwright/test';
import { query, test } from '../utils'
import { SUBSCRIPTION_TYPE } from '../../src/utils/subscriptions';
import { init, seedFixture } from '../memory-mongo';
import gql from 'graphql-tag';
import { ObjectId } from 'bson';
import { DBSubscription } from '../../server/interfaces';

test.describe('Subscriptions', () => {
    const url = '/account';

    test('Incident Updates: Should display user subscriptions', async ({ page, login }) => {

        await init();

        await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);

        await expect(page.locator('[data-cy="incident-subscription-item"]')).toHaveCount(2);
        await expect(page.locator(`[data-cy="incident-subscription-item"]`).getByText('Updates on incident #1: Incident 1')).toBeVisible();
        await expect(page.locator(`[data-cy="incident-subscription-item"]`).getByText('Updates on incident #2: Incident 2')).toBeVisible();
    });

    test("Incident Updates: Should display a information message if the user doesn't have subscriptions", async ({ page, login }) => {
        await init();

        await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

        const subscriptions: DBSubscription[] = [
            {
                _id: new ObjectId("62f40cd14016f5858d72385d"),
                entityId: undefined,
                incident_id: 1,
                type: SUBSCRIPTION_TYPE.incident,
                userId: 'random-user-id',
            },
        ]

        await seedFixture({ customData: { subscriptions } });


        await page.goto(url);

        await expect(page.getByText("You don't have active subscriptions to Incident updates")).toBeVisible();
    });

    test('Incident Updates: Delete a user subscription', async ({ page, login }) => {

        await init();

        const [userId, accessToken] = await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);


        page.on('dialog', dialog => dialog.accept());

        await page.locator('[data-cy="incident-delete-btn"]').first().click();

        await expect(page.locator(`[data-cy="incident-subscription-item"]`).getByText('Updates on incident #1: Incident 1')).not.toBeVisible();

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
            { Cookie: `next-auth.session-token=${encodeURIComponent(accessToken)};` }
        );

        expect(subscriptionsData).toMatchObject([
            {
                _id: "619b47eb5eed5334edfa3bd7",
                userId: {
                    userId: "6737a6e881955aa4905ccb04",
                },
            },
            {
                _id: "60a7c5b7b4f5b8a6d8f9c7e7",
                userId: {
                    userId: "6737a6e881955aa4905ccb04",
                },
            },
        ]);
    });

    test('New Incidents: Should display the switch toggle off if user does not have a subscription', async ({ page, login }) => {

        await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);


        await expect(page.locator('input[name=subscribe-all]')).not.toBeVisible();
        await expect(page.locator('button[role=switch][aria-checked=false]')).toBeVisible();
    });

    test('New Incidents: Should display the switch toggle on if user has a subscription', async ({ page, login }) => {

        await init();

        const [userId] = await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

        const subscriptions: DBSubscription[] = [
            {
                _id: new ObjectId("62f40cd14016f5858d72385d"),
                type: SUBSCRIPTION_TYPE.newIncidents,
                userId: userId,
            },
        ]

        await seedFixture({ customData: { subscriptions } }, false);

        await page.goto(url);

        await expect(page.locator('input[name=subscribe-all]')).toBeChecked();
        await expect(page.locator('button[role=switch][aria-checked=true]')).toBeVisible();
    });

    test('New Incidents: Should let you toggle it on and off', async ({ page, login }) => {

        await init();

        await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);

        await expect(page.locator('#subscribe-all')).not.toBeDisabled();

        await page.locator('#subscribe-all').click();

        await expect(page.locator('input[name=subscribe-all]')).toBeChecked();

        await page.locator('#subscribe-all').click();

        await expect(page.locator('#subscribe-all')).not.toBeDisabled();

        await expect(page.locator('input[name=subscribe-all]')).toHaveCount(0);
    });

    test('Incident Updates: Should not display user subscriptions to deleted Incidents', async ({ page, login }) => {

        await init();

        const [userId] = await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

        const subscriptions: DBSubscription[] = [
            {
                _id: new ObjectId("62f40cd14016f5858d72385d"),
                incident_id: null,
                type: SUBSCRIPTION_TYPE.incident,
                userId: userId,
            },
        ]

        await seedFixture({ customData: { subscriptions } }, false);

        await page.goto(url);

        await expect(page.locator(`[data-cy="incident-subscription-item"]`)).toHaveCount(2);
    });

    test('Entity: Should display user subscriptions', async ({ page, login }) => {

        await init();

        await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);


        await expect(page.locator('[data-cy="entity-subscription-item"]').getByText('New Entity 1 Entity incidents')).toBeVisible();
    });

    test("Entity: Should display a information message if the user doesn't have subscriptions", async ({ page, login }) => {

        await init();

        await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

        const subscriptions: DBSubscription[] = []

        await seedFixture({ customData: { subscriptions } });

        await page.goto(url);

        await expect(page.locator('[data-cy="entity-subscription-item"]')).not.toBeVisible();
        await expect(page.locator("text=You don't have active subscriptions to Entities")).toBeVisible();
    });

    test('Entity: Delete a user subscription', async ({ page, login }) => {

        await init();

        const [userId, accessToken] = await login({ customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);


        page.on('dialog', dialog => dialog.accept());

        await page.locator('[data-cy="entity-delete-btn"]').first().click();

        await expect(page.locator('[data-cy="entity-subscription-item"]').getByText('New Entity 1 Entity incidents')).not.toBeVisible();

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
        }, {
            Cookie: `next-auth.session-token=${encodeURIComponent(accessToken)};`

        });

        expect(subscriptionsData).not.toMatchObject([{ _id: "619b47eb5eed5334edfa3bd7" }]);
    });
});