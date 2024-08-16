import { expect } from '@playwright/test';
import { test } from '../../utils';

const url = '/confirmemail';

test.describe('Confirm email', () => {

  test('Should successfully load confirm email page', async ({ page }) => {
    await page.goto(url);
  });

  test('Should display Invalid params message when token or tokenId are missing', async ({ page }) => {
    await page.goto(`${url}?token=dummyToken`);
    await expect(page.locator(':has-text("Invalid parameters")').first()).toBeVisible();
    await expect(page.locator('[data-cy="confirm-login-btn"]')).toBeVisible();
    await expect(page.locator('#content:has-text("An unknown error has occurred")')).toBeVisible();

    await page.goto(`${url}?tokenId=dummyTokenId`);
    await expect(page.locator(':has-text("Invalid parameters")').first()).toBeVisible();
    await expect(page.locator('[data-cy="confirm-login-btn"]')).toBeVisible();
    await expect(page.locator('#content:has-text("An unknown error has occurred")')).toBeVisible();
  });

  test('Should display an error message if the confirmation failed on Atlas', async ({ page }) => {
    await page.goto(`${url}?token=invalidToken&tokenId=invalidTokenId`);
    await expect(page.locator('[data-cy="toast"]:has-text("An unknown error has occurred")')).toBeVisible();
    await expect(page.locator('[data-cy="confirm-login-btn"]')).toBeVisible();
    await expect(page.locator('#content:has-text("An unknown error has occurred")')).toBeVisible();
  });

  test('Should display success message if the email is confirmed on Atlas', async ({ page }) => {
    await page.route('**/confirm', route => route.fulfill({ status: 201 }));
    await page.goto(`${url}?token=dummyToken&tokenId=dummyTokenId`);

    await expect(page.locator('[data-cy="toast"]:has-text("Thank you for verifying your account.")')).toBeVisible();
    await expect(page.locator('[data-cy="confirm-login-btn"]')).toBeVisible();
    await expect(page.locator('#content:has-text("Thank you for verifying your account.")')).toBeVisible();

    await page.locator('[data-cy="confirm-login-btn"]').click();
    await expect(page).toHaveURL('/login/?redirectTo=/account/');
  });

});
