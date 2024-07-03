import { expect } from '@playwright/test';
import { login, conditionalIntercept, waitForRequest, conditionalIt, test } from '../utils';
import users from '../fixtures/users/users.json';
import config from '../config';

test.describe('Admin', () => {
  const baseUrl = '/admin';

  test('Should show not enough permissions message', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.getByText("Not enough permissions")).toBeVisible({ timeout: 30000 });
  });

  test.skip(
    'Should display a list of users, their roles and allow edition',
    async ({ page, login, skipOnEmptyEnvironment }) => {
      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

      await conditionalIntercept(
        page,
        '**/graphql',
        (req) => req.postDataJSON().operationName == 'FindUsers',
        users,
        'findUsers'
      );

      users.data.users.forEach(async (user, index) => {
        await conditionalIntercept(
          page,
          '**/graphql',
          (req) =>
            req.postDataJSON().operationName == 'FindUser' &&
            req.postDataJSON()?.variables?.query.userId == user.userId,
          { data: { user } },
          'findUser' + index
        );
      });

      await page.goto(baseUrl);

      for (const user of users.data.users.slice(0, 5)) {
        await page.locator('[data-cy="input-filter-Id"]').fill(user.userId);

        if (user.adminData.email) {
          const userRow = page.locator('[data-cy="cell"]:has-text("' + user.userId + '")').locator('..');
          await expect(userRow.locator(':has-text("' + user.adminData.email + '")')).toBeVisible();
          for (const role of user.roles) {
            await expect(userRow.getByText(role)).toBeVisible();
          }
        } else {
          const userRow = page.locator('[data-cy="cell"]:has-text("' + user.userId + '")').locator('..');
          await expect(userRow.locator(':has-text("Not found")')).toBeVisible();
          for (const role of user.roles) {
            await expect(userRow.locator(':has-text("' + role + '")')).toBeVisible();
          }
        }
      }

      const [user] = users.data.users;
      await page.locator('[data-cy="input-filter-Id"]').fill(user.userId);

      await page.locator('[data-cy="cell"]:has-text("' + user.adminData.email + '")').locator('..').getByText('Edit').click();

      await conditionalIntercept(
        page,
        '**/graphql',
        (req) => req.postDataJSON().operationName == 'UpdateUserRoles',
        {
          data: {
            updateOneUser: {
              __typename: 'User',
              roles: ['subscriber', 'bananas', 'ban', 'admin', 'banana'],
              userId: '6423479655e4bb918a233bda',
            },
          },
        },
        'UpdateUserRoles'
      );

      await conditionalIntercept(
        page,
        '**/graphql',
        (req) => req.postDataJSON().operationName == 'UpdateUserProfile',
        {
          data: {
            users: [
              {
                __typename: 'User',
                adminData: {
                  __typename: 'UserAdminDatum',
                  creationDate: '2023-03-28T20:01:26Z',
                  disabled: false,
                  email: 'mail@cesarvarela.com',
                  lastAuthenticationDate: '2023-05-04T22:03:06Z',
                },
                first_name: 'TestEdited',
                last_name: 'User',
                roles: ['subscriber', 'admin', 'banana'],
                userId: '6423479655e4bb918a233bda',
              },
              {
                __typename: 'User',
                adminData: {
                  __typename: 'UserAdminDatum',
                  creationDate: '2023-03-30T19:04:55Z',
                  disabled: false,
                  email: 'aiidsubscriber@cesarvarela.com',
                  lastAuthenticationDate: '2023-04-28T00:33:58Z',
                },
                first_name: 'cesarito',
                last_name: 'test',
                roles: ['subscriber', 'incident_editor'],
                userId: '6425dd57ea44a80bf1443b33',
              },
              {
                __typename: 'User',
                adminData: {
                  __typename: 'UserAdminDatum',
                  creationDate: null,
                  disabled: null,
                  email: null,
                  lastAuthenticationDate: null,
                },
                first_name: null,
                last_name: null,
                roles: ['subscriber', 'admin'],
                userId: '6425dd79c505cc40eb65661e',
              },
            ],
          },
        },
        'UpdateUserProfile'
      );

      const editModal = page.locator('[data-cy="edit-user-modal"]');
      await editModal.locator('[id="roles"]').fill('banana');
      await page.keyboard.press('Enter');
      await editModal.locator('[name="first_name"]').fill('Edited');
      await editModal.getByRole("button").filter({ hasText: 'Submit' }).click();

      const updateUserRolesRequest = await waitForRequest('UpdateUserRoles');
      const updateUserRolesVariables = updateUserRolesRequest.postDataJSON().variables;
      expect(updateUserRolesVariables.roles).toContain('banana');
      expect(updateUserRolesVariables.userId).toBe(user.userId);

      const updateUserProfileRequest = await waitForRequest('UpdateUserProfile');
      const updateUserProfileVariables = updateUserProfileRequest.postDataJSON().variables;
      expect(updateUserProfileVariables.first_name).toBe('Edited');
      expect(updateUserProfileVariables.userId).toBe(user.userId);
    }
  );

  test(
    'Should display New Incident button',
    async ({ page, login, skipOnEmptyEnvironment }) => {
      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

      await conditionalIntercept(
        page,
        '**/graphql',
        (req) => req.postDataJSON().operationName == 'FindUsers',
        users,
        'findUsers'
      );

      await page.goto(baseUrl);

      await waitForRequest('findUsers');

      await page.getByText('New Incident').click();

      await expect(page).toHaveURL(/\/incidents\/new/, { timeout: 30000 });
    }
  );

  test(
    'Should filter results',
    async ({ page, login, skipOnEmptyEnvironment }) => {
      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

      await conditionalIntercept(
        page,
        '**/graphql',
        (req) => req.postDataJSON().operationName == 'FindUsers',
        users,
        'findUsers'
      );

      users.data.users.forEach(async (user) => {
        await conditionalIntercept(
          page,
          '**/graphql',
          (req) =>
            req.postDataJSON().operationName == 'FindUser' &&
            req.postDataJSON()?.variables?.query.userId == user.userId,
          { data: { user } },
          'findUser' + user.userId
        );
      });

      await page.goto(baseUrl);

      await waitForRequest('findUsers');

      users.data.users.forEach(async (user) => {
        await waitForRequest('findUser' + user.userId);
      })

      await page.locator('[data-cy="input-filter-First Name"]').fill('Test');
      await page.locator('[data-cy="input-filter-Last Name"]').fill('User');
      await page.locator('[data-cy="input-filter-Roles"]').fill('admin');
      await page.locator('[data-cy="input-filter-Email"]').fill('pablo@botsfactory.io');
      await page.locator('[data-cy="header-adminData.creationDate"] input').fill('01/09/2022 - 30/09/2022');
      await page.locator('[data-cy="header-adminData.lastAuthenticationDate"] input').fill('06/06/2023 - 06/06/2023');

      await expect(page.locator('[data-cy="row"]')).toHaveCount(1);
    }
  );
});
