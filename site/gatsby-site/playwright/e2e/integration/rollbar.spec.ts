import { expect } from "@playwright/test";
import { test } from "../../utils";
import config from "../../config";

test('Should log an error to Rollbar', async ({ page, login }) => {
  const rollbarAPICall = page.waitForRequest('https://api.rollbar.com/api/1/item/');

  await page.goto('/login');

  await page.locator('input[name="email"]').fill(config.E2E_ADMIN_USERNAME);
  await page.locator('input[name="password"]').fill('invalidPassword');
  await page.locator('[data-cy="login-btn"]').click();

  const rollbarRequest = await rollbarAPICall;
  const response = await rollbarRequest.response();

  if (response) {
    expect(response.status()).toBe(200);
    const responseBody = await response. json();
    expect(responseBody.err).toBe(0);
  } else {
    throw new Error('No response received for Rollbar API call.');
  }
});
