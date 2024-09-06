import { expect } from '@playwright/test';
import config from '../config';
import { test } from '../utils';

const incidentId = 3;
const incidentUrl = `/cite/${incidentId}/`;
const blogPostUrl = `/blog/join-raic/`;
const shareButtonsPerSection = 4;
const urlsToTest = [
  {
    page: 'Blog Post',
    url: blogPostUrl,
    title: `Join the Responsible AI Collaborative Founding Staff`,
    shareButtonSections: 1,
    fbShareUrl: [
      'https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2Fshare_channel%2F%3Flink%3Dhttps%253A%252F%252Fincidentdatabase.ai%252Fblog%252Fjoin-raic%252F%26',
    ]
  },
];

if (!config.IS_EMPTY_ENVIRONMENT) {
  urlsToTest.push({
    page: 'Incident',
    url: incidentUrl,
    title: 'Incident 3: Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees',
    shareButtonSections: 1,
    fbShareUrl: [
      'https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2Fshare_channel%2F%3Flink%3Dhttps%253A%252F%252Fincidentdatabase.ai%252Fcite%252F3%252F%26',
    ]
  });
}

test.describe('Social Share Buttons', () => {

  test.describe.configure({ retries: 4 });

  urlsToTest.forEach(({ page, url, title, shareButtonSections, fbShareUrl }) => {
    test(`${page} page should have ${shareButtonSections} Social Share button sections`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const buttons = page.locator('[data-cy="social-share-buttons"] button');
      await expect(buttons).toHaveCount(shareButtonSections * shareButtonsPerSection);
    });

    const canonicalUrl = `https://incidentdatabase.ai${url}`;

    test(`${page} page should have a Twitter share button`, async ({ page }) => {
      await page.goto(url);
      const twitterButton = page.locator('[data-cy=btn-share-twitter]');
      await expect(twitterButton).toBeVisible();

      const popupPromise = page.waitForEvent('popup');
      await twitterButton.first().click();

      const popup = await popupPromise;

      await popup.waitForURL(`https://x.com/intent/post?text=${encodeURIComponent(title).replace(/%20/g, '+')}&url=${encodeURIComponent(canonicalUrl)}`);
    });

    test(`${page} page should have a LinkedIn share button`, async ({ page }) => {
      await page.goto(url);
      const linkedInButton = page.locator('[data-cy=btn-share-linkedin]');
      await expect(linkedInButton).toBeVisible();
      await page.evaluate(() => {
        window.open = (url: string) => { window.location.href = url; return null; };
      });
      await linkedInButton.first().click();
      await page.waitForURL(/https:\/\/www\.linkedin\.com*/);
    });

    test(`${page} page should have an Email share button`, async ({ page }) => {
      await page.goto(url);
      const emailButton = page.locator('[data-cy=btn-share-email]');
      await expect(emailButton).toBeTruthy();
      await page.evaluate((url) => {
        window.open = (link: string) => {
          if (link.startsWith('mailto:')) {
            window.location.href = url;
          }
          return null;
        };
      }, canonicalUrl);
      await emailButton.first().click();
      await page.waitForURL(canonicalUrl);

    });

    test(`${page} page should have a Facebook share button`, async ({ page }) => {
      await page.goto(url);
      const facebookButton = page.locator('[data-cy=btn-share-facebook]');
      await expect(facebookButton).toBeVisible();

      const popupPromise = page.waitForEvent('popup');

      await facebookButton.first().click();

      const popup = await popupPromise;

      expect(async () => {
        const popupUrl = await popup.url();
        await expect(fbShareUrl.some(url => popupUrl.includes(url))).toBeTruthy();
      }).toPass();
    });
  });

});