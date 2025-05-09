import { expect } from '@playwright/test';
import config from '../../config';
import { test } from '../utils';

const googleTrackingId = config.gatsby.gaTrackingId;

test.describe('Google Analytics Tracking', () => {
  test('Should track gtag only on production', async ({ page, runOnlyInProduction }) => {
    await page.goto('/');

    const hasGoogleTracking = await page.locator(`script[src*="https://www.googletagmanager.com/gtag/js?id=${googleTrackingId}"]`).count();

    expect(hasGoogleTracking).toBeGreaterThan(0);
  });


  test('Should not track gtag outside production', async ({ page, runAnywhereExceptProduction }) => {
    await page.goto('/');

    const hasGoogleTracking = await page.locator(`script[src*="https://www.googletagmanager.com/gtag/js?id=${googleTrackingId}"]`).count();
    
    expect(hasGoogleTracking).toBe(0);
  });
});
