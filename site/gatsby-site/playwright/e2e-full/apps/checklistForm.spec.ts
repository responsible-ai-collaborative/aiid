import { expect } from '@playwright/test';
import riskSortingRisks from '../../fixtures/checklists/riskSortingChecklist.json';
import riskSortingChecklist from '../../fixtures/checklists/riskSortingChecklist.json';
import { conditionalIntercept, test, waitForRequest } from '../../utils';
import config from '../../config';
import { init } from '../../memory-mongo';

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

    test.skip('Should have read-only access for non-logged-in users', async ({ page }) => {
        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'findChecklist',
            { data: { checklist: defaultChecklist } },
            'findChecklist'
        );

        await page.goto(url);

        await expect(page.locator('[data-cy="checklist-form"] textarea:not([disabled])')).not.toBeVisible();
        await expect(page.locator('[data-cy="checklist-form"] input:not([disabled]):not([readonly])')).not.toBeVisible();
    });

    test('Should have read-only access for logged-in non-owners', async ({ page, login }) => {

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'findChecklist',
            { data: { checklist: defaultChecklist } },
            'findChecklist',
        );

        await page.goto(url);

        await waitForRequest('findChecklist');

        await expect(page.locator('[data-cy="checklist-form"] textarea:not([disabled])')).not.toBeVisible();
        await expect(page.locator('[data-cy="checklist-form"] input:not([disabled]):not([readonly])')).not.toBeVisible();
    });

    test('Should allow editing for owner', async ({ page, login }) => {

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });


        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'findChecklist',
            { data: { checklist: { ...defaultChecklist, owner_id: userId } } },
            'findChecklist',
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'upsertChecklist',
            {
                data: {
                    checklist: {
                        ...defaultChecklist,
                        owner_id: userId,
                        about: "It's a system that does something probably.",
                    },
                },
            },
            'upsertChecklist',
        );

        await page.goto(url);

        await waitForRequest('findChecklist');

        await page.locator('[data-cy="about"]').type("It's a system that does something probably.");

        await waitForRequest('upsertChecklist');
    });

    test('Should trigger GraphQL upsert query on adding tag', async ({ page, login }) => {

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'findChecklist',
            { data: { checklist: { ...defaultChecklist, owner_id: userId } } },
            'findChecklist',
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'upsertChecklist',
            { data: { checklist: {} } },
            'upsertChecklist',
        );

        await page.goto(url);

        await waitForRequest('findChecklist');

        await page.locator('#tags_goals_input').type('Code Generation');
        await page.locator('#tags_goals').click();

        await waitForRequest('upsertChecklist');
    });

    test('Should trigger GraphQL update on removing tag', async ({ page, login }) => {

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'findChecklist',
            {
                data: {
                    checklist: {
                        ...defaultChecklist,
                        owner_id: userId,
                        tags_goals: ['GMF:Known AI Goal:Code Generation'],
                    },
                },
            },
            'findChecklist',
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'upsertChecklist',
            { data: { checklist: {} } },
            'upsertChecklist',
        );

        await page.goto(url);

        await waitForRequest('findChecklist');

        await page.locator('[option="GMF:Known AI Goal:Code Generation"] .close').click();

        await waitForRequest('upsertChecklist');
    });

    test('Should trigger UI update on adding and removing tag', async ({ page, login }) => {

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'findChecklist',
            { data: { checklist: { ...defaultChecklist, owner_id: userId } } },
            'findChecklist',
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'upsertChecklist',
            { data: { checklist: {} } },
            'upsertChecklist',
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'FindRisks',
            { data: { risks: riskSortingRisks.data.checklist.risks } },
            'risks'
        );

        await page.goto(url);

        await waitForRequest('findChecklist');

        await page.locator('#tags_methods_input').type('Transformer');
        await page.locator('#tags_methods').click();

        await waitForRequest('upsertChecklist');

        await waitForRequest('risks');

        await expect(page.locator('details').first()).toBeVisible();

        await page.locator('.rbt-close').click();

        await expect(page.locator('details')).not.toBeVisible();
    });

    test('Should change sort order of risk items', async ({ page, login }) => {

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await page.setViewportSize({ width: 1920, height: 1080 });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON()?.operationName === 'findChecklist',
            { data: { checklist: { ...riskSortingChecklist.data.checklist, owner_id: userId } } },
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

        await page.locator('text=Mitigated').first().click();
        await expect(page.locator('details:nth-child(2)')).toContainText('Distributional Bias');

        await page.locator('text=Minor').first().click();
        await expect(page.locator('details:nth-child(2)')).toContainText('Dataset Imbalance');
    });

    test.skip('Should remove a manually-created risk', async ({ page, login }) => {

        await init();

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

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

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

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