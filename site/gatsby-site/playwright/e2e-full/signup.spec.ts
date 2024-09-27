import { expect } from '@playwright/test';
import { test, conditionalIntercept, waitForRequest } from '../utils';
import config from '../config';

test.describe('Signup', () => {
  const url = '/signup';

  test('Should successfully load sign up page', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display success toast message after a sign up', async ({ page }) => {
    await page.goto(url);

    const email = 'newUser@test.com';
    const password = 'newUserPassword';

    await page.locator('[data-cy="signup-btn"]').click();

    await page.locator('input[name=email]').fill(email);
    await page.locator('input[name=password]').fill(password);
    await page.locator('input[name=passwordConfirm]').fill(password);

    await conditionalIntercept(
      page,
      '**/register',
      (req) => req.postDataJSON().email == email && req.postDataJSON().password == password,
      { statusCode: 201 },
      'Register'
    );

    await page.locator('[data-cy="signup-btn"]').click();
    await waitForRequest('Register');

    const result = await page.evaluate(() => JSON.parse(JSON.stringify(localStorage)));
    expect(result).toHaveProperty('signup');
    await expect(page.locator('[data-cy="toast"]')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('[data-cy="toast"]').getByText(`Verification email sent to ${email}`)).toBeVisible();
  });

  test('Should display the error toast message if the user already exists', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(url);

    await page.locator('[data-cy="signup-btn"]').click();

    await page.locator('input[name=email]').fill(config.E2E_ADMIN_USERNAME);
    await page.locator('input[name=password]').fill('anyPassword');
    await page.locator('input[name=passwordConfirm]').fill('anyPassword');
    await page.locator('[data-cy="signup-btn"]').click();
    await expect(page.locator('[data-cy="toast"]').getByText('name already in use')).toBeVisible();
  });

  test('Should display the error toast message if any other sign up error occurs', async ({ page }) => {
    await page.goto(url);

    await page.locator('[data-cy="signup-btn"]').click();

    await page.locator('input[name=email]').fill('test@test.com');
    await page.locator('input[name=password]').fill('anyPassword');
    await page.locator('input[name=passwordConfirm]').fill('anyPassword');

    await conditionalIntercept(
      page,
      '**/register',
      (req) => req.method() === 'POST',
      { error: 'Something bad happened :(' },
      'Register',
      500
    );

    await page.locator('[data-cy="signup-btn"]').click();
    await waitForRequest('Register');
    await expect(page.locator('[data-cy="toast"]')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('[data-cy="toast"]').getByText('Something bad happened :(')).toBeVisible();
  });

  test('Should redirect to specific page after sign up if redirectTo is provided', async ({ page }) => {
    const redirectTo = '/cite/10/';
    await page.goto(`${url}?redirectTo=${redirectTo}`);

    await page.locator('[data-cy="signup-btn"]').click();

    const email = 'newUser@test.com';
    const password = 'newUserPassword';

    await page.locator('input[name=email]').fill(email);
    await page.locator('input[name=password]').fill(password);
    await page.locator('input[name=passwordConfirm]').fill(password);

    await conditionalIntercept(
      page,
      '**/register',
      (req) => req.postDataJSON().email == email && req.postDataJSON().password == password,
      { statusCode: 201 },
      'Register'
    );

    await page.locator('[data-cy="signup-btn"]').click();
    await waitForRequest('Register');
    await page.waitForURL(redirectTo);
  });

  test('Should display success toast message after a subscription to Major updates', async ({ page }) => {
    await page.goto(url);

    const email = 'newUser@test.com';

    await page.locator('input[name=emailSubscription]').fill(email);

    await conditionalIntercept(
      page,
      '**/register',
      (req) => req.postDataJSON().email == email && req.postDataJSON().password == '123456',
      { statusCode: 201 },
      'Register'
    );

    await page.locator('[data-cy="subscribe-to-updates-btn"]').click();
    await waitForRequest('Register');
    await expect(page.locator('[data-cy="toast"]').getByText(`Thanks for subscribing to our Newsletter!`)).toBeVisible();
  });
});
