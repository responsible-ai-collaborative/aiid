import { test, expect } from '@playwright/test';
import { SITE_URL } from '../../config';

test.describe('AIID Embed Test Page', () => {
  test('should display specific AIID link buttons', async ({ page }) => {
    await page.goto('https://aiid-embed-test.vercel.app');

    // Check for the first link
    const link1 = page.locator('a:has-text("See it on the AIID #1")');
    await expect(link1).toHaveAttribute('href', `${SITE_URL}/cite/1`);

    // Check for the second link
    const link999 = page.locator('a:has-text("See it on the AIID #999")');
    await expect(link999).toHaveAttribute('href', `${SITE_URL}/cite/999`);
  });
});
