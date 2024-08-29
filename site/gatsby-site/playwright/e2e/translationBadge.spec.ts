import { expect } from '@playwright/test';
import { test } from '../utils';

test.describe('Translation Badges', () => {
  test('Should be visible on blog post', async ({ page }) => {
    await page.goto('/es/blog/using-ai-to-connect-ai-incidents');
    await expect(page.locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
    await expect(page.locator('a', { hasText: 'Ver Original' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Ver Original' })).toHaveAttribute('href', '/blog/using-ai-to-connect-ai-incidents/');
  });

  test('Should be visible on the discover app', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto('/es/apps/discover?display=details&incident_id=1&page=1&source_domain=today.com');
    await expect(page.locator('[data-cy="5d34b8c29ced494f010ed45c"]').locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
  });

  test('Should be visible on an incident card on the citation page', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto('/es/cite/1#r1');
    await expect(page.locator('#r1').locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
  });

  test('Should be visible on documentation pages', async ({ page }) => {
    await page.goto('/es/about_apps');
    await expect(page.locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
    await expect(page.locator('a', { hasText: 'Ver Original' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Ver Original' })).toHaveAttribute('href', '/about_apps/');
  });
});
