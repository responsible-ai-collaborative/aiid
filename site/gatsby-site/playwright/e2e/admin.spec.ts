import { expect } from '@playwright/test';
import { test, testUser } from '../utils';
import { init } from '../memory-mongo';

test.describe('Admin', () => {
  const baseUrl = '/admin';

  test.beforeEach(async () => {
    await init();
  });

  test('Should show not enough permissions message', async ({ page, login }) => {
    // A logged-in account without the admin role. A logged-out visitor is told
    // to log in instead (covered by e2e/apiAccess.spec.ts). SEE: server/apiAccess.ts
    await login({ customData: { roles: ['subscriber'] } });

    await page.goto(baseUrl);
    await expect(page.getByText("Not enough permissions")).toBeVisible({ timeout: 30000 });
  });

  test(
    'Should display a list of users, their roles and allow edition',
    async ({ page, login, skipOnEmptyEnvironment }) => {

      const [userId] = await login();
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
    'Should load the table with admin data in a single request',
    async ({ page, login, skipOnEmptyEnvironment }) => {

      // The table used to issue one `FindUser` request per account to fetch each
      // account's admin data, which tripped Netlify's per-IP rate limit on
      // `/api/graphql` as soon as there were more accounts than the limit allows.
      // Admins may read every account's admin data in the list query itself.
      const [userId] = await login();

      const operations: { name: string; userId?: string }[] = [];

      page.on('request', (request) => {
        if (request.url().includes('/api/graphql')) {
          const body = request.postDataJSON();
          if (body?.operationName) {
            operations.push({ name: body.operationName, userId: body.variables?.filter?.userId?.EQ });
          }
        }
      });

      await page.goto(baseUrl);

      await page.locator('[data-cy="input-filter-Id"]').fill(userId);

      const userRow = page.locator('[data-cy="cell"]:has-text("' + userId + '")').locator('..');

      // The logged-in account has an auth record, so its email is known.
      await expect(userRow.getByText(testUser.email)).toBeVisible();

      expect(operations.filter((op) => op.name === 'FindUsersAdmin')).toHaveLength(1);

      // No `FindUser` at all until an account is opened for editing.
      expect(operations.filter((op) => op.name === 'FindUser')).toHaveLength(0);
    }
  );

  test(
    'Should display New Incident button',
    async ({ page, login, skipOnEmptyEnvironment }) => {

      await login();

      await page.goto(baseUrl);

      await page.getByText('New Incident').click();

      await expect(page).toHaveURL(/\/incidents\/new/, { timeout: 30000 });
    }
  );

  test(
    'Should filter results',
    async ({ page, login, skipOnEmptyEnvironment }) => {

      await login();

      await page.goto(baseUrl);


      await page.locator('[data-cy="input-filter-First Name"]').fill('Test');
      await page.locator('[data-cy="input-filter-Last Name"]').fill('User');
      await page.locator('[data-cy="input-filter-Roles"]').fill('admin');

      // TODO: find a way to mock admin api and adminData graphql field

      // await page.locator('[data-cy="input-filter-Email"]').fill('pablo@botsfactory.io');
      // await page.locator('[data-cy="header-adminData.creationDate"] input').fill('01/09/2022 - 30/09/2022');
      // await page.locator('[data-cy="header-adminData.lastAuthenticationDate"] input').fill('06/06/2023 - 06/06/2023');

      await expect(page.locator('[data-cy="row"]')).toHaveCount(1);
    }
  );
});
