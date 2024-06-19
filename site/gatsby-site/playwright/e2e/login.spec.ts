import { expect } from '@playwright/test';
import { waitForRequest, conditionalIntercept, test } from '../utils';
import config from '../config';

test.describe('Login', () => {
  const url = '/login';

  test('Should successfully load login page', async ({ page }) => {
    await page.goto(url);
  });

  test('Should redirect to home page after login by default', 
    async ({ page, skipOnEmptyEnvironment, login }) => {
      await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

      await expect(page).toHaveURL('/');
    }
  );

  test('Should redirect to the account page if the signup storage key is set', 
    async ({ page, skipOnEmptyEnvironment, login }) => {

      await page.goto('/');

      await page.evaluate(() => window.localStorage.setItem('signup', '1'));

      await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

      await expect(page).toHaveURL('/account/?askToCompleteProfile=1');

      await expect(page.getByTestId('edit-user-modal')).toBeVisible({ timeout: 30000 });

      const localStorage = await page.evaluate(() => window.localStorage);

      expect(localStorage.signup).toBeUndefined();
    }
  );

  test('Should redirect to specific page after login if redirectTo is provided', 
    async ({ page, skipOnEmptyEnvironment }) => {
      const redirectTo = '/cite/10/';

      await page.goto(`${url}?redirectTo=${redirectTo}`);
      await page.locator('input[name=email]').fill(config.E2E_ADMIN_USERNAME);
      await page.locator('input[name=password]').fill(config.E2E_ADMIN_PASSWORD);
      await page.locator('[data-cy="login-btn"]').click();

      await expect(page).toHaveURL(redirectTo, { timeout: 60000 });
    }
  );

  test('Should display error toast if the email address or password is incorrect', async ({ page }) => {
    await page.goto(url);
    await page.locator('input[name=email]').fill('fakeUser@test.com');
    await page.locator('input[name=password]').fill('fakePassword');
    await page.locator('[data-cy="login-btn"]').click();

    await expect(page.locator('[data-cy="toast"]')).toBeVisible();
    await expect(page.locator('[data-cy="toast"]')).toContainText('unauthorized');
  });

  test('Should disable Login button if email address is not valid', async ({ page }) => {
    await page.goto(url);
    await page.locator('input[name=email]').fill('fakeUser');
    await page.locator('input[name=password]').fill('fakePassword');
    await expect(page.locator('[data-cy="login-btn"]')).toBeDisabled();

    await page.locator('input[name=email]').fill('fakeUser@test.com');
    await expect(page.locator('[data-cy="login-btn"]')).toBeEnabled();
  });

  test('Should redirect to forgot password page if the user clicks on "Forgot password?" link', async ({ page }) => {
    await page.goto(url);
    await page.getByText('Forgot password?').click();
    await expect(page).toHaveURL('/forgotpassword/', { timeout: 30000 });
  });

  test('Should give the option to resend Email verification if the user is not confirmed', async ({ page }) => {
    await conditionalIntercept(
      page,
      '**/login',
      (req) => req.method() == "POST" && req.postDataJSON().username == config.E2E_ADMIN_USERNAME,
      {
        error: 'confirmation required',
        error_code: 'AuthError',
        link: 'https://services.cloud.mongodb.com/groups/633205e6aecbcc4b2c2067c3/apps/633207f10d438f13ab3ab4d6/logs?co_id=6549772172bdb9e8eadeea95'
      },
      'Login',
      401
    );

    await conditionalIntercept(
      page,
      '**/auth/providers/local-userpass/confirm/call',
      (req) => req.postDataJSON().email == config.E2E_ADMIN_USERNAME,
      {},
      'Confirmation',
      204
    );

    await page.goto(url);

    await page.locator('input[name=email]').fill(config.E2E_ADMIN_USERNAME);
    await page.locator('input[name=password]').fill(config.E2E_ADMIN_PASSWORD);
    await page.locator('[data-cy="login-btn"]').click();

    await waitForRequest('Login');
    await expect(page.locator('[data-cy="toast"]').getByText('Resend Verification email')).toBeVisible();
    await page.locator('[data-cy="toast"]').getByText('Resend Verification email').click();

    await waitForRequest('Confirmation');
    await expect(page.locator('[data-cy="toast"]').getByText(`Verification email sent to ${config.E2E_ADMIN_USERNAME}`)).toBeVisible();
  });
});
