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

      // The id is no longer a column; the logged-in account is found by its email.
      await page.locator('[data-cy="input-filter-Email"]').fill(testUser.email);

      const userRow = page.locator('[data-cy="cell"]:has-text("' + testUser.email + '")').locator('..');

      for (const role of users[0].roles) {
        await expect(userRow.getByText(role)).toBeVisible();
      }

      const [user] = users;

      await page.getByRole('button', { name: 'Edit' }).click();


      const editModal = page.locator('[data-testid="edit-user-modal"]');

      // The account id moved from the table into the modal, with a copy control.
      await expect(editModal.locator('[data-cy="account-id"]')).toContainText(user.userId);

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

      await page.locator('[data-cy="input-filter-Email"]').fill(testUser.email);

      // The logged-in account has an auth record, so its email is known.
      await expect(page.locator('[data-cy="cell"]:has-text("' + testUser.email + '")')).toBeVisible();

      expect(operations.filter((op) => op.name === 'FindUsersAdmin')).toHaveLength(1);

      // No `FindUser` at all until an account is opened for editing.
      expect(operations.filter((op) => op.name === 'FindUser')).toHaveLength(0);

      expect(userId).toBeTruthy();
    }
  );

  test(
    'Should show each account\'s API usage from one summaries request, over a selectable window',
    async ({ page, login, skipOnEmptyEnvironment }) => {

      // Seeded usage (playwright/seeds/customData/apiUsage.ts): John Doe has 30 + 12
      // requests today and yesterday with one refused; the incident editor has 5
      // requests 60 days ago, inside the 90-day window only. (The logged-in admin's
      // own bucket grows with the requests this test makes, so it is not asserted.)
      await login();

      const summaries: { from?: string; to?: string }[] = [];

      page.on('request', (request) => {
        if (request.url().includes('/api/graphql')) {
          const body = request.postDataJSON();
          if (body?.operationName === 'FindApiUsageSummaries') summaries.push(body.variables || {});
        }
      });

      await page.goto(baseUrl);

      await page.locator('[data-cy="input-filter-First Name"]').fill('John');

      const johnRow = page.locator('[data-cy="cell"]:has-text("John")').first().locator('..');

      await expect(johnRow.locator('[data-cy="cell"]').nth(5)).toHaveText('42');
      await expect(johnRow.locator('[data-cy="cell"]').nth(6)).toHaveText('2');
      await expect(johnRow.locator('[data-cy="cell"]').nth(7)).toHaveText('1');

      // One aggregation for the whole table, for the default 30-day window.
      expect(summaries).toHaveLength(1);
      expect(summaries[0].userId).toBeUndefined();
      expect(summaries[0].to).toBe(new Date().toISOString().slice(0, 10));

      // The incident editor's usage is outside the 30-day window...
      await page.locator('[data-cy="input-filter-First Name"]').fill('');
      await page.locator('[data-cy="input-filter-Roles"]').fill('incident_editor');

      const editorRow = page.locator('[data-cy="row"]').first();

      await expect(editorRow.locator('[data-cy="cell"]').nth(5)).toHaveText('0');

      // ...and inside the 90-day one, which is one more request.
      await page.locator('[data-cy="usage-window"]').selectOption('90');

      await expect(editorRow.locator('[data-cy="cell"]').nth(5)).toHaveText('5');

      expect(summaries).toHaveLength(2);
    }
  );

  test(
    'Should copy the account id from the edit modal',
    async ({ page, context, login, skipOnEmptyEnvironment }) => {

      const [userId] = await login();

      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      await page.goto(baseUrl);

      await page.locator('[data-cy="input-filter-Email"]').fill(testUser.email);

      await page.getByRole('button', { name: 'Edit' }).click();

      const editModal = page.locator('[data-testid="edit-user-modal"]');

      await expect(editModal.locator('[data-cy="account-id"]')).toContainText(userId);

      await editModal.locator('[data-cy="copy-user-id"]').click();

      await expect(page.locator('[data-cy="toast"]')).toContainText('Copied');

      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(userId);
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
