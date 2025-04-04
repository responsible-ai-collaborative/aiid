import { test, testUser } from '../utils';
import { expect } from '@playwright/test';
import { init } from '../memory-mongo';

test.describe('Account', () => {
  const url = '/account';

  test('Should successfully load account page', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display account information if the user is logged in', async ({ page, login }) => {

    await init();

    await login();

    await page.goto(url);

    const detailsTable = page.locator('[data-cy="details-table"]');

    await expect(detailsTable.locator(`td:text-is("${testUser.email}")`)).toBeVisible();
    await expect(detailsTable.locator('td:text-is("Test")')).toBeVisible();
    await expect(detailsTable.locator('td:text-is("User")')).toBeVisible();
    await expect(detailsTable.locator('span:text-is("admin")')).toBeVisible();

    await expect(page.locator('a:text-is("Log out")')).toBeVisible();
  });

  test('Should allow editing user role data (admin user)', async ({ page, login }) => {

    await init();

    await login();

    await page.goto(url);

    await page.locator('button:has-text("Edit")').click();

    const editUserModal = page.getByTestId('edit-user-modal');

    await editUserModal.locator('[id="roles"]').fill('banana');
    await editUserModal.locator('button:has-text("Submit")').click();

    await expect(editUserModal).not.toBeVisible();

    await expect(page.locator('span:text-is("banana")')).toBeVisible();
  });

  test('Should show edit modal if query parameter is set', async ({ page, login }) => {

    await login();

    await page.goto(url + '?askToCompleteProfile=1');

    await expect(page.getByTestId('edit-user-modal')).toBeVisible();
  });

  test('Should allow editing their own first and last name (subscriber user)', async ({ page, login }) => {

    await login({ customData: { roles: ['subscriber'], first_name: 'Test', last_name: 'User' } });

    await page.goto(url);

    await page.locator('button:has-text("Edit")').click();

    const editUserModal = page.getByTestId('edit-user-modal');

    await editUserModal.locator('[id="first_name"]').fill('New first name');
    await editUserModal.locator('[id="last_name"]').fill('New last name');
    await editUserModal.locator('button:has-text("Submit")').click();

    await expect(editUserModal).not.toBeVisible();

    await expect(page.locator('[data-cy="toast"]')).toContainText('User updated.', { timeout: 60000 });

    await expect(page.locator('[data-cy="user-first-name"]').locator('td:text-is("New first name")')).toBeVisible();
    await expect(page.locator('[data-cy="user-last-name"]').locator('td:text-is("New last name")')).toBeVisible();
  });

  test('Should not allow to edit roles (subscriber user)', async ({ page, login }) => {

    await login({ customData: { roles: ['subscriber'], first_name: 'Test', last_name: 'User' } });

    await page.goto(url);

    await page.locator('button:has-text("Edit")').click();

    const editUserModal = page.getByTestId('edit-user-modal');

    const rolesInput = editUserModal.locator('[id="roles"]');

    await expect(rolesInput).toBeDisabled({ timeout: 3000 });
  });
});