import { expect } from '@playwright/test';
import { test } from '../utils';

test.describe('Signup', () => {
  const url = '/signup';

  test('Should successfully load sign up page', async ({ page }) => {
    await page.goto(url);
  });

  test('Should send callback url parameter and show magic link message after a sign up', async ({ page }) => {
    await page.goto(url);

    const email = 'new.user@test.com';

    await page.route('**/api/auth/signin/http-email*', async (route) => {

      const formData = new URLSearchParams(await route.request().postData() || '');
      expect(formData.get('email')).toBe(email);
      expect(formData.get('redirect')).toBe('false');
      expect(formData.get('callbackUrl')).toBe(`/account/?askToCompleteProfile=1`);

      await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'http://localhost:8000/api/auth/verify-request?provider=http-email&type=email'
        })
      });
    });

    await page.locator('input[name=email]').fill(email);

    const signupResponse = page.waitForResponse('**/api/auth/signin/http-email*');

    await page.locator('[data-cy="signup-btn"]').click();

    await signupResponse;

    await expect(page.getByText('A sign up link has been sent to new.user@test.com')).toBeVisible();
  });

  test('Should display the error toast message if any other sign up error occurs', async ({ page }) => {
    await page.goto(url);

    await page.route('**/api/auth/signin/http-email*', async (route) => {

      await route.fulfill({
        status: 200,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-store, max-age=0',
          'connection': 'close',
          'transfer-encoding': 'chunked',
          'x-powered-by': 'Express'
        },
        body: JSON.stringify({
          url: 'http://localhost:8000/api/auth/error?error=EmailSignin'
        })
      });
    });

    await page.locator('input[name=email]').fill('test@test.com');

    const signupResponse = page.waitForResponse('**/api/auth/signin/http-email*');

    await page.locator('[data-cy="signup-btn"]').click();

    await signupResponse;

    await expect(page.getByText('An unknown error has occurred')).toBeVisible();
  });
});
