import { test, expect } from '@playwright/test';
import config from '../config';

test.describe('AIID Embed Test Page', () => {
  test('should display specific AIID link buttons', async ({ page }) => {
    await page.goto(`https://aiid-embed-test.netlify.app?embedBaseURL=${config.SITE_URL}`);

    // Check for the first link
    const link1 = page.locator('a:has-text("View incident #1 on AIID")');
    await expect(link1).toHaveAttribute('href', `${config.SITE_URL}/cite/1`);

    // Check for the second link
    const link999 = page.locator('a:has-text("View incident #999 on AIID")');
    await expect(link999).toHaveAttribute('href', `${config.SITE_URL}/cite/999`);

    // Check for the third link
    const link2 = page.locator('a:has-text("Explore incident 2 details")');
    await expect(link2).toHaveAttribute('href', `${config.SITE_URL}/cite/2`);
  });
});
