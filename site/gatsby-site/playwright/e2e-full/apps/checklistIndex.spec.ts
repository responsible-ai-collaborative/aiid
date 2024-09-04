import { expect, request } from '@playwright/test';
import { conditionalIntercept, test, waitForRequest } from '../../utils';
import config from '../../config';

test.describe('Checklists App Index', () => {
    const url = '/apps/checklists';
    const newChecklistButtonSelector = '#new-checklist-button';

    test('Should sort checklists', async ({ page, login }) => {

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req: any) => req.postDataJSON()?.operationName === 'findChecklists',
            {
                data: {
                    checklists: [
                        {
                            about: '',
                            id: 'fakeChecklist1',
                            name: 'My Checklist',
                            owner_id: userId,
                            risks: [],
                            tags_goals: ['GMF:Known AI Goal:Translation'],
                            tags_methods: [],
                            tags_other: [],
                            date_created: '2024-01-01T00:26:02.959+00:00',
                            date_updated: '2024-01-05T00:26:02.959+00:00',
                        },
                        {
                            about: '',
                            id: 'fakeChecklist2',
                            name: 'Another checklist',
                            owner_id: userId,
                            risks: [],
                            tags_goals: [],
                            tags_methods: [],
                            tags_other: [],
                            date_created: '2024-01-03T00:26:02.959+00:00',
                            date_updated: '2024-01-03T00:26:02.959+00:00',
                        },
                    ],
                },
            },
            'findChecklists',
        );


        await page.goto(url);

        await waitForRequest('findChecklists');

        await page.selectOption('#sort-by', 'newest-first');
        await expect(page.locator('[data-cy="checklist-card"]').first()).toContainText('Another checklist');

        await page.selectOption('#sort-by', 'last-updated');
        await expect(page.locator('[data-cy="checklist-card"]').first()).toContainText('My Checklist');

        await page.selectOption('#sort-by', 'alphabetical');
        await expect(page.locator('[data-cy="checklist-card"]').first()).toContainText('Another checklist');

        await page.selectOption('#sort-by', 'oldest-first');
        await expect(page.locator('[data-cy="checklist-card"]').first()).toContainText('My Checklist');
    });

    test('Should not display New Checklist button as non-logged-in user', async ({ page }) => {
        await page.goto(url);
        await expect(page.locator(newChecklistButtonSelector)).not.toBeVisible();
    });

    test('Should display New Checklist button as logged-in user', async ({ page, login }) => {

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await page.goto(url);
        await expect(page.locator(newChecklistButtonSelector)).toBeVisible();
    });

    test.skip('Should show delete buttons only for owned checklists', async ({ page, login }) => {

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req: any) => req.body.operationName == 'findChecklists',
            {
                data: {
                    checklists: [
                        {
                            about: '',
                            id: 'fakeChecklist1',
                            name: 'My Checklist',
                            owner_id: user.userId,
                            risks: [],
                            tags_goals: [],
                            tags_methods: [],
                            tags_other: [],
                        },
                        {
                            about: '',
                            id: 'fakeChecklist2',
                            name: "Somebody Else's Checklist",
                            owner_id: 'aFakeUserId',
                            risks: [],
                            tags_goals: [],
                            tags_methods: [],
                            tags_other: [],
                        },
                    ],
                },
            },
            'findChecklists',
        );

        await page.goto(url);

        await waitForRequest('findChecklists');

        await expect(page.locator('[data-cy="checklist-card"]:first-child button')).toContainText('Delete');
        await expect(page.locator('[data-cy="checklist-card"]:last-child button')).not.toContainText('Delete');
    });

    test('Should show toast on error fetching checklists', async ({ page }) => {

        await conditionalIntercept(
            page,
            '**/graphql',
            (req: any) => req.postDataJSON().operationName === 'findChecklists',
            { errors: [{ message: 'Test error', locations: [{ line: 1, column: 1 }] }] },
            'findChecklists',
        );

        await page.goto(url);

        await waitForRequest('findChecklists');

        await expect(page.locator('[data-cy="toast"]')).toContainText('Could not fetch checklists');
    });

    test('Should show toast on error fetching risks', async ({ page, login }) => {

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req: any) => req.postDataJSON().operationName === 'findChecklists',
            {
                data: {
                    checklists: [
                        {
                            about: '',
                            id: 'fakeChecklist1',
                            name: 'My Checklist',
                            owner_id: userId,
                            risks: [],
                            tags_goals: ['GMF:Known AI Goal:Translation'],
                            tags_methods: [],
                            tags_other: [],
                        },
                        {
                            about: '',
                            id: 'fakeChecklist2',
                            name: "Somebody Else's Checklist",
                            owner_id: 'aFakeUserId',
                            risks: [],
                            tags_goals: [],
                            tags_methods: [],
                            tags_other: [],
                        },
                    ],
                },
            },
            'findChecklists',
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req: any) => req.postDataJSON()?.query.includes('GMF'),
            { errors: [{ message: 'Test error', locations: [{ line: 1, column: 1 }] }] },
            'risks',
        );

        await page.goto(url);

        await waitForRequest('findChecklists');
        await waitForRequest('risks');

        await expect(page.locator('[data-cy="toast"]')).toContainText('Failure searching for risks');
    });

    test('Should show toast on error creating checklist', async ({ page, login }) => {

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req: any) => req.postDataJSON().operationName === 'insertChecklist',
            { errors: [{ message: 'Test error', locations: [{ line: 1, column: 1 }] }] },
            'insertChecklist',
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req: any) => req.postDataJSON().operationName === 'findChecklists',
            {
                data: {
                    checklists: [
                        {
                            about: '',
                            id: 'fakeChecklist1',
                            name: 'My Checklist',
                            owner_id: userId,
                            risks: [],
                            tags_goals: [],
                            tags_methods: [],
                            tags_other: [],
                        },
                        {
                            about: '',
                            id: 'fakeChecklist2',
                            name: "Somebody Else's Checklist",
                            owner_id: 'aFakeUserId',
                            risks: [],
                            tags_goals: [],
                            tags_methods: [],
                            tags_other: [],
                        },
                    ],
                },
            },
            'findChecklists',
        );

        await page.goto(url);

        await waitForRequest('findChecklists');

        await page.click(newChecklistButtonSelector);

        await waitForRequest('insertChecklist');

        await expect(page.locator('[data-cy="toast"]')).toContainText('Could not create checklist.');
    });
});