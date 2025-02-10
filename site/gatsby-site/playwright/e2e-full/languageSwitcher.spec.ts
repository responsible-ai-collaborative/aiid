import { expect } from '@playwright/test';
import { test } from '../utils';

test.describe('The Language switcher', () => {
  test('Should be visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('language-switcher')).toBeVisible();
  });

  test('Language should default to English', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1 > :has-text("Welcome to the")')).toBeVisible();
    await expect(page.locator('h1 > :has-text("AI Incident Database")')).toBeVisible();
  });

  test('Should update the path with the selected language', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('language-switcher').click();
    await page.getByTestId('language-switcher').getByText("Español").click();
    await expect(page).toHaveURL(/\/es\//, { timeout: 30000 });
    await expect(page.getByText('Bienvenido ala base de datos de incidentes de IA')).toBeVisible();
  });
});
