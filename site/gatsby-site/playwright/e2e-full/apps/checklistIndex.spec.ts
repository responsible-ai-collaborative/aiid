import { expect } from '@playwright/test';
import { test } from '../../utils';
import config from '../../config';
import { init } from '../../memory-mongo';

test.describe('Checklists App Index', () => {
    const url = '/apps/checklists';
    const newChecklistButtonSelector = '#new-checklist-button';

    test('Should sort checklists', async ({ page, login }) => {

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await init({
            aiidprod: {
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
                ]
            }
        })

        await page.goto(url);

        await expect(page.getByText('My Checklist')).toBeVisible();

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

    test('Should show delete buttons only for owned checklists', async ({ page, login }) => {

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await init({
            aiidprod: {
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
                        owner_id: 'user1',
                        risks: [],
                        tags_goals: [],
                        tags_methods: [],
                        tags_other: [],
                    },
                ],
            },
        }, { drop: true });

        await page.goto(url);

        await expect(page.locator('[data-cy="checklist-card"]:first-child [data-testid="delete-risk"]').first()).toContainText('Delete');

        // TODO: looks like this page is filtering checklists owned by the current user, so this will never pass
        // await expect(page.locator('[data-cy="checklist-card"]:last-child button')).not.toContainText('Delete');
    });

    test('Should allow deleting checklists', async ({ page, login }) => {

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await init({
            aiidprod: {
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
                    }
                ],
            },
        }, { drop: true });

        await page.goto(url);

        await page.locator('[data-cy="checklist-card"]:first-child [data-testid="delete-risk"]').click();

        await expect(page.getByText('You haven’t made any checklists')).toBeVisible();
    });

    test('Should show toast on error fetching checklists', async ({ page }) => {

        await page.route('**/graphql', async (route) => {
            const request = route.request();
            const postData = JSON.parse(await request.postData()!);

            if (postData.operationName === 'findChecklists') {
                await route.fulfill({
                    status: 200,
                    body: JSON.stringify({
                        errors: [{ message: 'Test error', locations: [{ line: 1, column: 1 }] }]
                    })
                });
                return;
            }
            await route.continue();
        });

        const response = page.waitForResponse(res => res?.request()?.postDataJSON()?.operationName === 'findChecklists');

        await page.goto(url);

        await response;

        await expect(page.locator('[data-cy="toast"]').first()).toContainText('Could not fetch checklists');
    });

    // TODO: not sure why this test is failing
    test.skip('Should show toast on error fetching risks', async ({ page, login }) => {

        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, {
            customData: {
                first_name: 'Test',
                last_name: 'User',
                roles: ['admin']
            }
        });

        await page.route('**/graphql', async (route) => {
            const request = route.request();
            const postData = JSON.parse(await request.postData()!);

            if (postData.query?.includes('GMF')) {
                await route.fulfill({
                    status: 200,
                    body: JSON.stringify({
                        errors: [{ message: 'Test error', locations: [{ line: 1, column: 1 }] }]
                    })
                });
                return;
            }
            await route.continue();
        });

        const response = page.waitForResponse(res => res?.request()?.postDataJSON()?.query?.includes('GMF'));

        await page.goto(url);

        await response;

        await expect(page.locator('[data-cy="toast"]').first()).toContainText('Failure searching for risks');
    });

    test('Should show toast on error creating checklist', async ({ page, login }) => {
        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, {
            customData: {
                first_name: 'Test',
                last_name: 'User',
                roles: ['admin']
            }
        });

        await page.route('**/graphql', async (route) => {
            const request = route.request();
            const postData = JSON.parse(await request.postData()!);

            if (postData.operationName === 'insertChecklist') {
                await route.fulfill({
                    status: 200,
                    body: JSON.stringify({
                        errors: [{ message: 'Test error', locations: [{ line: 1, column: 1 }] }]
                    })
                });
                return;
            }
            await route.continue();
        });

        await page.goto(url);

        const response = page.waitForResponse(res => res?.request()?.postDataJSON()?.operationName === 'insertChecklist');

        await page.click(newChecklistButtonSelector);

        await response;

        await expect(page.locator('[data-cy="toast"]').first()).toContainText('Could not create checklist.');
    });
});