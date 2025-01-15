import { expect } from '@playwright/test';
import riskSortingRisks from '../../fixtures/checklists/riskSortingChecklist.json';
import riskSortingChecklist from '../../fixtures/checklists/riskSortingChecklist.json';
import { conditionalIntercept, query, test, waitForRequest } from '../../utils';
import config from '../../config';
import { init } from '../../memory-mongo';
import gql from 'graphql-tag';

test.describe('Checklists App Form', () => {
    const url = '/apps/checklists?id=testChecklist';

    const defaultChecklist = {
        __typename: 'Checklist',
        about: '',
        id: 'testChecklist',
        name: 'Test Checklist',
        owner_id: 'a-fake-user-id-that-does-not-exist',
        risks: [],
        tags_goals: [],
        tags_methods: [],
        tags_other: [],
    };

    test('Should have read-only access for non-logged-in users', async ({ page }) => {

        await init({ aiidprod: { checklists: [defaultChecklist] } }, { drop: true });

        await page.goto(url);

        await expect(page.getByText('Test Checklist')).toBeVisible();
        await expect(page.locator('[data-cy="checklist-form"] textarea:not([disabled])')).not.toBeVisible();
        await expect(page.locator('[data-cy="checklist-form"] input:not([disabled]):not([readonly])')).not.toBeVisible();
    });

    test('Should have read-only access for logged-in non-owners', async ({ page, login }) => {

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await init({ aiidprod: { checklists: [defaultChecklist] } }, { drop: true });

        await page.goto(url);

        await expect(page.getByText('Test Checklist')).toBeVisible();
        await expect(page.locator('[data-cy="checklist-form"] textarea:not([disabled])')).not.toBeVisible();
        await expect(page.locator('[data-cy="checklist-form"] input:not([disabled]):not([readonly])')).not.toBeVisible();
    });

    test('Should allow editing for owner', async ({ page, login }) => {

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await init({ aiidprod: { checklists: [{ ...defaultChecklist, owner_id: userId }] } }, { drop: true });

        await page.goto(url);

        await expect(page.getByText('Test Checklist')).toBeVisible();


        const response = page.waitForResponse((response) => response.request()?.postDataJSON()?.variables?.checklist?.about === 'It\'s a system that does something probably.');

        await page.locator('[data-cy="about"]').fill("It's a system that does something probably.");

        await response;

        const { data } = await query({
            query: gql`
            {
                checklists {
                    about
                }
            }
        `,
        });

        expect(data).toMatchObject({ checklists: [{ about: "It's a system that does something probably." }] });
    });

    test('Should trigger GraphQL upsert query on adding tag', async ({ page, login }) => {

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await init({ aiidprod: { checklists: [{ ...defaultChecklist, owner_id: userId }] } }, { drop: true });

        await page.goto(url);


        const response = page.waitForResponse((response) => response.request()?.postDataJSON()?.operationName === 'upsertChecklist');

        await page.locator('#tags_goals_input').fill('Code Generation');
        await page.locator('#tags_goals').click();

        await response;
    });

    test('Should trigger GraphQL update on removing tag', async ({ page, login }) => {

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await init({ aiidprod: { checklists: [{ ...defaultChecklist, owner_id: userId, tags_goals: ['GMF:Known AI Goal:Code Generation'] }] } }, { drop: true });

        await page.goto(url);

        const response = page.waitForResponse((response) => response.request()?.postDataJSON()?.operationName === 'upsertChecklist');

        await page.locator('[option="GMF:Known AI Goal:Code Generation"] .close').click();

        await response;
    });

    test('Should trigger UI update on adding and removing tag', async ({ page, login }) => {

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await init({ aiidprod: { checklists: [{ ...defaultChecklist, owner_id: userId }] } }, { drop: true });

        await page.goto(url);

        await page.locator('#tags_methods_input').fill('Transformer');
        await page.locator('#tags_methods').click();


        await expect(page.locator('details').first()).toBeVisible();

        await page.locator('.rbt-close').click();

        await expect(page.locator('details')).not.toBeVisible();
    });

    test.skip('Should change sort order of risk items', async ({ page, login }) => {

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await page.setViewportSize({ width: 1920, height: 1080 });

        await page.goto(url);

        await page.locator('text=Mitigated').first().click();
        await expect(page.locator('details:nth-child(2)')).toContainText('Distributional Bias');

        await page.locator('text=Minor').first().click();
        await expect(page.locator('details:nth-child(2)')).toContainText('Dataset Imbalance');
    });

    test.skip('Should remove a manually-created risk', async ({ page, login }) => {

        await init();

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'findChecklist',
            {
                data: {
                    checklist: {
                        ...defaultChecklist,
                        owner_id: userId,
                        risks: [
                            {
                                __typename: 'ChecklistRisk',
                                generated: false,
                                id: '5bb31fa6-2d32-4a01-b0a0-fa3fb4ec4b7d',
                                likelihood: '',
                                precedents: [],
                                risk_notes: '',
                                risk_status: 'Mitigated',
                                severity: '',
                                tags: ['GMF:Known AI Goal:Content Search'],
                                title: 'Manual Test Risk',
                                touched: false,
                            },
                        ],
                    },
                },
            },
            'findChecklist'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'upsertChecklist',
            { data: { checklist: { ...defaultChecklist, owner_id: userId } } },
            'upsertChecklist'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'FindRisks',
            { data: { risks: [] } },
            'risks'
        );

        await page.goto(url);

        await waitForRequest('findChecklist');

        page.on('dialog', (dialog) => dialog.accept());

        await page.getByTestId('delete-risk').click();

        await waitForRequest('upsertChecklist');

        await waitForRequest('FindRisks');

        await expect(page.locator('text=Manual Test Risk')).not.toBeVisible();
    });

    // TODO: test is crashing not sure if it is a bug or missing seed data
    test.skip('Should persist open state on editing query', async ({ page, login }) => {

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'findChecklist',
            {
                data: { checklist: { ...riskSortingChecklist.data.checklist, owner_id: userId } },
            },
            'findChecklist'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.query.includes('GMF'),
            { data: { risks: riskSortingRisks.data.checklist.risks } },
            'risks'
        );

        await page.goto(url);

        await waitForRequest('findChecklist');
        await waitForRequest('risks');

        await page.locator('text=Distributional Artifacts').first().click();

        await page.locator('[data-cy="risk_query-container"] .rbt-input-main').first().fill('CSETv1:Physical Objects:no');

        await page.locator('[aria-label="CSETv1:Physical Objects:no"]').click();

        await expect(page.locator('[data-cy="risk_query-container"]').locator('..').first()).toHaveAttribute('open', '');
    });
});