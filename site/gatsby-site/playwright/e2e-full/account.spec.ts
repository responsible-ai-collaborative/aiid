import { test } from '../utils';
import { expect } from '@playwright/test';
import config from '../config';

test.describe('Account', () => {
  const url = '/account';

  test('Should successfully load account page', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display account information if the user is logged in', async ({ page, login }) => {

    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'Test', last_name: 'User' } });

    await page.goto(url);

    const detailsTable = page.locator('[data-cy="details-table"]');

    await expect(detailsTable.locator(`td:text-is("${config.E2E_ADMIN_USERNAME}")`)).toBeVisible();
    await expect(detailsTable.locator('td:text-is("Test")')).toBeVisible();
    await expect(detailsTable.locator('td:text-is("User")')).toBeVisible();
    await expect(detailsTable.locator('span:text-is("admin")')).toBeVisible();

    await expect(page.locator('a:text-is("Log out")')).toBeVisible();
  });

  test('Should allow editing user data', async ({ page, login }) => {

    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'Test', last_name: 'User' } });

    await page.goto(url);


    await page.locator('button:has-text("Edit")').click();

    const editUserModal = page.getByTestId('edit-user-modal');

    await editUserModal.locator('[id="roles"]').fill('banana');
    await editUserModal.locator('button:has-text("Submit")').click();

    await expect(editUserModal).not.toBeVisible();

    await expect(page.locator('span:text-is("banana")')).toBeVisible();
  });

  test('Should show edit modal if query parameter is set', async ({ page, login }) => {

    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'Test', last_name: 'User' } });

    await page.goto(url + '?askToCompleteProfile=1');

    await expect(page.getByTestId('edit-user-modal')).toBeVisible();
  });
});