import { expect } from '@playwright/test';
import { test } from '../utils';
import { init } from '../memory-mongo';

test.describe('Admin', () => {
  const baseUrl = '/admin';

  test.beforeEach(async () => {
    await init();
  });

  test('Should show not enough permissions message', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.getByText("Not enough permissions")).toBeVisible({ timeout: 30000 });
  });

  test(
    'Should display a list of users, their roles and allow edition',
    async ({ page, login, skipOnEmptyEnvironment }) => {

      const userId = await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'John', last_name: 'Doe', roles: ['admin'] } });
      const users = [{ userId, first_name: 'John', last_name: 'Doe', roles: ['admin'] }];

      await page.goto(baseUrl);

      for (const user of users.slice(0, 5)) {
        await page.locator('[data-cy="input-filter-Id"]').fill(user.userId);

        const userRow = page.locator('[data-cy="cell"]:has-text("' + user.userId + '")').locator('..');

        for (const role of user.roles) {
          await expect(userRow.getByText(role)).toBeVisible();
        }
      }

      const [user] = users;
      await page.locator('[data-cy="input-filter-Id"]').fill(user.userId);

      await page.getByRole('button', { name: 'Edit' }).click();


      const editModal = page.locator('[data-testid="edit-user-modal"]');
      await editModal.locator('[id="roles"]').fill('banana');
      await page.keyboard.press('Enter');
      await editModal.locator('[name="first_name"]').fill('Edited');
      await editModal.getByRole("button").filter({ hasText: 'Submit' }).click();

      // TODO: Fetch user roles and check if they were updated
    });

  test(
    'Should display New Incident button',
    async ({ page, login, skipOnEmptyEnvironment }) => {

      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'John', last_name: 'Doe', roles: ['admin'] } });

      await page.goto(baseUrl);

      await page.getByText('New Incident').click();

      await expect(page).toHaveURL(/\/incidents\/new/, { timeout: 30000 });
    }
  );

  test(
    'Should filter results',
    async ({ page, login, skipOnEmptyEnvironment }) => {

      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'John', last_name: 'Doe', roles: ['admin'] } });

      await page.goto(baseUrl);


      await page.locator('[data-cy="input-filter-First Name"]').fill('John');
      await page.locator('[data-cy="input-filter-Last Name"]').fill('Doe');
      await page.locator('[data-cy="input-filter-Roles"]').fill('admin');

      // TODO: find a way to mock admin api and adminData graphql field

      // await page.locator('[data-cy="input-filter-Email"]').fill('pablo@botsfactory.io');
      // await page.locator('[data-cy="header-adminData.creationDate"] input').fill('01/09/2022 - 30/09/2022');
      // await page.locator('[data-cy="header-adminData.lastAuthenticationDate"] input').fill('06/06/2023 - 06/06/2023');

      await expect(page.locator('[data-cy="row"]')).toHaveCount(1);
    }
  );
});
