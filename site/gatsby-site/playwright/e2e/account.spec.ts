import { conditionalIntercept, waitForRequest, test } from '../utils';
import { expect } from '@playwright/test';
import config from '../config';

test.describe('Account', () => {
  const url = '/account';

  const user = {
    "data": {
      "user": {
        "__typename": "User",
        "adminData": {
          "__typename": "UserAdminDatum",
          "creationDate": "2022-09-26T20:34:46Z",
          "disabled": false,
          "email": process.env.E2E_ADMIN_USERNAME,
          "lastAuthenticationDate": "2023-06-06T00:07:30Z"
        },
        "first_name": "Test",
        "last_name": "User",
        "roles": [
          "admin"
        ],
        "userId": "6423479655e4bb918a233bda"
      }
    }
  };

  test('Should successfully load account page', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display account information if the user is logged in', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) =>
        req.postDataJSON().operationName === 'FindUser',
      user,
      'findUser'
    );

    await page.goto(url);

    await waitForRequest('findUser');

    const detailsTable = page.locator('[data-cy="details-table"]');
    await expect(detailsTable.locator(`td:text-is("${config.E2E_ADMIN_USERNAME}")`)).toBeVisible();
    await expect(detailsTable.locator('td:text-is("Test")')).toBeVisible();
    await expect(detailsTable.locator('td:text-is("User")')).toBeVisible();
    await expect(detailsTable.locator('span:text-is("admin")')).toBeVisible();

    await expect(page.locator('a:text-is("Log out")')).toBeVisible();
  });

  test('Should allow editing user data', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) =>
        req.postDataJSON().operationName === 'FindUser',
      user,
      'findUser'
    );

    await page.goto(url);

    await waitForRequest('findUser');

    await page.locator('button:has-text("Edit")').click();

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
    const editUserModal = page.getByTestId('edit-user-modal');
    await editUserModal.locator('[id="roles"]').fill('banana');
    await editUserModal.locator('button:has-text("Submit")').click();

    const updateUserRolesRequest = await waitForRequest('UpdateUserRoles');
    const variables = updateUserRolesRequest.postDataJSON().variables;
    expect(variables.roles).toContain('banana');
  });

  test('Should show edit modal if query parameter is set', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) =>
        req.postDataJSON().operationName === 'FindUser',
      user,
      'findUser'
    );

    await page.goto(url + '?askToCompleteProfile=1');

    await waitForRequest('findUser');

    await expect(page.getByTestId('edit-user-modal')).toBeVisible();
  });
});