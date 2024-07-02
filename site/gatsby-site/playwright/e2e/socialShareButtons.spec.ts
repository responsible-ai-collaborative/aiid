import { expect } from '@playwright/test';
import config from '../config';
import { test } from '../utils';

const incidentId = 10;
const incidentUrl = `/cite/${incidentId}/`;
const blogPostUrl = `/blog/join-raic/`;
const shareButtonsPerSection = 4;
const urlsToTest = [
  {
    page: 'Blog Post',
    url: blogPostUrl,
    title: `Join the Responsible AI Collaborative Founding Staff`,
    shareButtonSections: 1,
  },
];

if (!config.IS_EMPTY_ENVIRONMENT) {
  urlsToTest.push({
    page: 'Incident',
    url: incidentUrl,
    title: 'Incident 10: Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees',
    shareButtonSections: 1,
  });
}

urlsToTest.forEach(({ page, url, title, shareButtonSections }) => {
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
    await page.evaluate(() => {
      window.open = (url: string) => { window.location.href = url; return null; };
    });
    await twitterButton.first().click();
    await page.waitForURL(`https://x.com/intent/post?text=${encodeURIComponent(title).replace(/%20/g, '+')}&url=${encodeURIComponent(canonicalUrl)}`);
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
    await page.evaluate(() => {
      window.open = (url: string) => { window.location.href = url; return null; };
    });
    await facebookButton.first().click();
    await page.waitForURL(/https:\/\/www\.facebook\.com\/(login\.php|sharer\/sharer\.php\?u=)/);
  });
});
