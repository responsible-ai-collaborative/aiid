import { expect } from '@playwright/test';
import { mockAlgolia, test } from '../utils';

test.describe('Translation Badges', () => {
  test('Should be visible on blog post', async ({ page }) => {
    await page.goto('/es/blog/using-ai-to-connect-ai-incidents');
    await expect(page.locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
    await expect(page.locator('a', { hasText: 'Ver Original' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Ver Original' })).toHaveAttribute('href', '/blog/using-ai-to-connect-ai-incidents/');
  });

  test('Should not be visible on Prismic blog post without translation', async ({ page }) => {
    await page.goto('/es/blog/ai-incident-journalism-analysis');
    await expect(page.locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).not.toBeVisible();
    await expect(page.locator('a', { hasText: 'Ver Original' })).not.toBeVisible();
  });

  test('Should be visible on the discover app if the item has a translation available', async ({ page, skipOnEmptyEnvironment }) => {
    await mockAlgolia(page);

    await page.goto('/es/apps/discover');
    await expect(page.locator('[data-cy="6243a9eedf8b4b62d982817e"]').locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
  });

  test('Should not be visible on the discover app if the item does not have a translation available', async ({ page, skipOnEmptyEnvironment }) => {
    await mockAlgolia(page);

    await page.goto('/es/apps/discover');
    await expect(page.locator('[data-cy="5d34b8c29ced494f010ed470"]').locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).not.toBeVisible();
  });

  test('Should be visible on an report card on the citation page if it was translated', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto('/es/cite/3#r3');
    await expect(page.locator('#r3').locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
  });

  test('Should not be visible on an report card on the citation page if it was not translated', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto('/es/cite/3#r4');
    await expect(page.locator('#r4').locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).not.toBeVisible();
  });

  test('Should be visible on documentation pages', async ({ page }) => {
    await page.goto('/es/about_apps');
    await expect(page.locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
    await expect(page.locator('a', { hasText: 'Ver Original' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Ver Original' })).toHaveAttribute('href', '/about_apps/');
  });

  test('Should be visible on the incident page if it was translated', async ({ page }) => {
    await page.goto('/es/cite/1');
    await expect(page.locator('[data-testid="incident-title-section"]').locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
    await expect(page.locator('[data-testid="incident-description-section"]').locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
  });

  test('Should not be visible on the incident page if it was not translated', async ({ page }) => {
    await page.goto('/es/cite/3');
    await expect(page.locator('[data-testid="incident-title-section"]').locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).not.toBeVisible();
    await expect(page.locator('[data-testid="incident-description-section"]').locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).not.toBeVisible();
  });

  test('Should be visible on the homepage if the incident is translated', async ({ page }) => {
    await page.goto('/es/');
    // Incident 1 has a spanish translation
    await expect(page.locator('[data-testid="carousel-item"]').nth(0).locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
    // Incident 2 does not have a spanish translation
    await expect(page.locator('[data-testid="carousel-item"]').nth(1).locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).toBeVisible();
    // Incident 3 does not have a spanish translation
    await expect(page.locator('[data-testid="carousel-item"]').nth(2).locator('[data-cy="translation-badge"]').getByText('Traducido por IA')).not.toBeVisible();
  });
});
