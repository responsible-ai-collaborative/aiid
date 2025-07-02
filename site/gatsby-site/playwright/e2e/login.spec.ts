import { expect } from '@playwright/test';
import { generateMagicLink, test } from '../utils';
import { init } from '../memory-mongo';

test.describe('Login', () => {
  const url = '/login';

  test('Should successfully load login page', async ({ page }) => {
    await page.goto(url);
  });

  test('Should redirect to home page after login by default',
    async ({ page, skipOnEmptyEnvironment, login }) => {
      await login();

      await expect(page).toHaveURL('/');
    }
  );

  test('Should send redirectTo param to auth endpoint', async ({ page }) => {

    await init();

    const initialUrl = '/cite/1/';

    await page.goto(initialUrl);

    await page.locator('[data-cy="subscribe-btn"]').click();

    await page.getByText('Login').click();

    const email = 'test.user@incidentdatabase.ai';

    await page.route('**/api/auth/signin/http-email*', async (route) => {

      const formData = new URLSearchParams(await route.request().postData());

      expect(formData.get('callbackUrl')).toBe(initialUrl);

      await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: "http://localhost:8000/api/auth/verify-request?provider=http-email&type=email",
        })
      });
    });

    await expect(async () => {
      await page.locator('input[name=email]').clear();
      await page.locator('input[name=email]').fill(email);
      await expect(page.locator('[data-cy="login-btn"]')).toBeEnabled({ timeout: 1000 });
    }).toPass();

    const signupResponse = page.waitForResponse('**/api/auth/signin/http-email*');

    await page.locator('[data-cy="login-btn"]').click();

    await signupResponse;

    await expect(page.getByText(`A sign in link has been sent to ${email}`)).toBeVisible();
  });

  test('Should redirect to specific page after login if redirectTo is provided',
    async ({ page, skipOnEmptyEnvironment, login }) => {
      const redirectTo = '/cite/1/';

      const magicLink = await generateMagicLink('test.user@incidentdatabase.ai', redirectTo);

      await page.goto(magicLink);

      await page.waitForURL(redirectTo, { timeout: 7000 });
    }
  );

  test('Should disable Login button if email address is not valid', async ({ page }) => {
    await page.goto(url);
    await page.locator('input[name=email]').fill('fakeUser');
    await expect(page.locator('[data-cy="login-btn"]')).toBeDisabled();

    await page.locator('input[name=email]').fill('fakeUser@test.com');
    await expect(page.locator('[data-cy="login-btn"]')).toBeEnabled();
  });
});
