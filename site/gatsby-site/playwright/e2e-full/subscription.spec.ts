import { expect } from '@playwright/test';
import { query, test } from '../utils'
import { SUBSCRIPTION_TYPE } from '../../src/utils/subscriptions';
import { init, seedFixture } from '../memory-mongo';
import { DBSubscription } from '../seeds/customData/subscriptions';
import gql from 'graphql-tag';
import { ObjectId } from 'bson';

test.describe('Subscriptions', () => {
    const url = '/account';

    test('Incident Updates: Should display user subscriptions', async ({ page, login }) => {

        await init();

        const [userId] = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

        const subscriptions: DBSubscription[] = [
            {
                _id: new ObjectId("62f40cd14016f5858d72385d"),
                entityId: undefined,
                incident_id: 1,
                type: SUBSCRIPTION_TYPE.incident,
                userId: userId,
            },
        ]

        await seedFixture({ customData: { subscriptions } }, false);

        await page.goto(url);

        await expect(page.locator('[data-cy="incident-subscription-item"]')).toHaveCount(1);
        await expect(page.locator(`[data-cy="incident-subscription-item"]`).getByText('Updates on incident #1: Incident 1')).toBeVisible();
    });

    test("Incident Updates: Should display a information message if the user doesn't have subscriptions", async ({ page, login }) => {
        await init();

        await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);

        await expect(page.getByText("You don't have active subscriptions to Incident updates")).toBeVisible();
    });

    test('Incident Updates: Delete a user subscription', async ({ page, login }) => {

        await init();

        const [userId, accessToken] = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

        const subscriptions: DBSubscription[] = [
            {
                _id: new ObjectId("62f40cd14016f5858d72385d"),
                entityId: undefined,
                incident_id: 1,
                type: SUBSCRIPTION_TYPE.incident,
                userId: userId,
            },
            {
                _id: new ObjectId("62f40cd14016f5858d72385e"),
                entityId: undefined,
                incident_id: 2,
                type: SUBSCRIPTION_TYPE.incident,
                userId: userId,
            }
        ]

        await seedFixture({ customData: { subscriptions } }, false);

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
            { authorization: `Bearer ${accessToken}` }
        );

        expect(subscriptionsData).toMatchObject([{ _id: "62f40cd14016f5858d72385e" }]);
    });

    test('New Incidents: Should display the switch toggle off if user does not have a subscription', async ({ page, login }) => {

        await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);


        await expect(page.locator('input[name=subscribe-all]')).not.toBeVisible();
        await expect(page.locator('button[role=switch][aria-checked=false]')).toBeVisible();
    });

    test('New Incidents: Should display the switch toggle on if user has a subscription', async ({ page, login }) => {

        await init();

        const [userId] = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

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

        await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['subscriber'], first_name: 'John', last_name: 'Doe' } });

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

        const [userId] = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

        const subscriptions: DBSubscription[] = [
            {
                _id: new ObjectId("62f40cd14016f5858d72385d"),
                incident_id: null,
                type: SUBSCRIPTION_TYPE.incident,
                userId: userId,
            },
            {
                _id: new ObjectId("62f40cd14016f5858d72385e"),
                entityId: undefined,
                incident_id: 2,
                type: SUBSCRIPTION_TYPE.incident,
                userId: userId,
            }
        ]

        await seedFixture({ customData: { subscriptions } }, false);

        await page.goto(url);

        await expect(page.locator(`[data-cy="incident-subscription-item"]`)).toHaveCount(1);
        await expect(page.locator(`[data-cy="incident-subscription-item"]`).getByText('Updates on incident #2: Incident 2')).toBeVisible();
    });

    test('Entity: Should display user subscriptions', async ({ page, login }) => {

        await init();

        const [userId] = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

        const subscriptions: DBSubscription[] = [
            {
                _id: new ObjectId("62f40cd14016f5858d72385d"),
                entityId: 'entity1',
                type: SUBSCRIPTION_TYPE.entity,
                userId: userId,
            },
            {
                _id: new ObjectId("62f40cd14016f5858d72385e"),
                entityId: 'entity2',
                type: SUBSCRIPTION_TYPE.entity,
                userId: userId,
            }
        ]

        await seedFixture({ customData: { subscriptions } }, false);

        await page.goto(url);


        await expect(page.locator('[data-cy="entity-subscription-item"]').getByText('New Entity 1 Entity incidents')).toBeVisible();
        await expect(page.locator('[data-cy="entity-subscription-item"]').getByText('New Entity 2 Entity incidents')).toBeVisible();
    });

    test("Entity: Should display a information message if the user doesn't have subscriptions", async ({ page, login }) => {

        await init();

        await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

        await page.goto(url);

        await expect(page.locator('[data-cy="entity-subscription-item"]')).not.toBeVisible();
        await expect(page.locator("text=You don't have active subscriptions to Entities")).toBeVisible();
    });

    test('Entity: Delete a user subscription', async ({ page, login }) => {

        await init();

        const [userId, accessToken] = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

        const subscriptions: DBSubscription[] = [
            {
                _id: new ObjectId("62f40cd14016f5858d72385d"),
                entityId: 'entity1',
                type: SUBSCRIPTION_TYPE.entity,
                userId: userId,
            },
            {
                _id: new ObjectId("62f40cd14016f5858d72385e"),
                entityId: 'entity2',
                type: SUBSCRIPTION_TYPE.entity,
                userId: userId,
            }
        ]

        await seedFixture({ customData: { subscriptions } }, false);

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
            authorization: `Bearer ${accessToken}`
        });

        expect(subscriptionsData).toMatchObject([{ _id: "62f40cd14016f5858d72385e" }]);
    });
});