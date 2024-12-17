import { expect } from "@playwright/test";
import { test } from "../utils";

test.describe('Rollbar', () => {

  test('Should log an error to Rollbar', async ({ page, login }) => {

    const rollbarMock = page.waitForRequest('https://api.rollbar.com/api/1/item/');

    await page.route('https://api.rollbar.com/api/1/item/', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          err: 0,
          result: { id: "12345" }
        })
      });
    });

    await page.route('**/api/auth/signin/http-email*', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          url: null,
          error: "Email service not available"
        })
      });
    });

    await page.goto('/login');

    await page.locator('input[name="email"]').fill("test.user@test.com");
    await page.locator('[data-cy="login-btn"]').click();

    const rollbarRequest = await rollbarMock;
    
    expect(rollbarRequest.postDataJSON()).toMatchObject({ access_token: expect.any(String) });
  });
});