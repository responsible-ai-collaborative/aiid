import { expect } from '@playwright/test';
import config from '../../../config';
import { test } from '../../utils';

const productionUrl = config.gatsby.siteUrl;
const googleTrackingId = config.gatsby.gaTrackingId;

test.describe('Google Analytics Tracking', () => {
  test('Should track gtag only on production', async ({ page }) => {
    await page.goto('/');

    const currentUrl = page.url();

    const isProduction = currentUrl.startsWith(productionUrl);

    const hasGoogleTracking = await page.locator(`script[src*="https://www.googletagmanager.com/gtag/js?id=${googleTrackingId}"]`).count();

    if (isProduction) {
      expect(hasGoogleTracking).toBeGreaterThan(0);

      const [trackingRequest] = await Promise.all([
        page.waitForRequest((request) => request.url().includes(`https://www.google-analytics.com`) && request.method() === 'POST'),
      
      ]);

      expect(trackingRequest).toBeTruthy();
    } else {
      expect(hasGoogleTracking).toBe(0);

      let trackingRequestMade = false;
      page.on('request', (request) => {
        if (request.url().includes(`https://www.google-analytics.com`) && request.method() === 'POST') {
          trackingRequestMade = true;
        }
      });

      await page.reload();
      expect(trackingRequestMade).toBe(false);
    }
  });
});
