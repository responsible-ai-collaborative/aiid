import { expect, Page } from '@playwright/test';
import { test } from '../utils';

test.describe('Navigation', () => {
  test('Check menu links work (English)', async ({ page }) => {
    await page.goto('/');
    await checkLinks(page);
  });

  test('Check menu links work (Spanish)', async ({ page }) => {
    await page.goto('/es/');
    await checkLinks(page);
  });

  test('Check menu links work (French)', async ({ page }) => {
    await page.goto('/fr/');
    await checkLinks(page);
  });

  const checkLinks = async (page: Page) => {
    const links = await page.locator('.item.active').evaluateAll((nodes: any[]) => nodes.map((node: { getAttribute: (arg0: string) => any; }) => node.getAttribute('href')));
    for (const href of links) {
      await page.goto(href);
      const activeHref = await page.getByTestId('sidebar-link-active').first().getAttribute('href');
      expect(href.endsWith(activeHref)).toBe(true);
    }
  };

  test('Check right sidebar "Contents" layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.getByText('About', { exact: true }).click();
    await expect(page.locator('.rightSideTitle')).toHaveText('CONTENTS');
    const sidebarElementsCount = await page.locator('.rightSideBarUL li').count();
    await expect(sidebarElementsCount).toBeGreaterThan(0);
    await page.getByTestId('sidebar-desktop').locator('#sidebar > [data-testid="sidebar-tree"] > [data-testid="sidebar-welcome"] [data-testid="sidebar-link"]').click();
    await expect(page.locator('.rightSideTitle')).not.toBeVisible();
  });

  test('Check right sidebar "Contents" scroll-to section on click on docs', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto('/');

    const aboutLink = await page.locator('#main-footer .tw-footer-link').filter({ hasText: /^About$/ });
    if (await aboutLink.count() > 0) {
      await aboutLink.click();

      await page.locator('.rightSideTitle:has-text("CONTENTS")').waitFor({ state: 'visible' });
      const listItems = await page.locator('.rightSideBarUL li');
      expect(await listItems.count()).toBeGreaterThanOrEqual(1);

      await listItems.nth(1).click();

      await expect(async () => {

        const subject = await page.locator('h2:has-text(\'Why "AI Incidents"?\')');
        const boundingBox = await subject.boundingBox();
        expect(boundingBox?.y).toBeCloseTo(0, 30);
      }).toPass();
    }
  });

  test('Check right sidebar "Contents" scroll-to section on click on prismic blog post', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto('/blog');

    const postLink = await page.locator('h5:has-text("AI Incident Roundup – January ‘24")');
    if (await postLink.count() > 0) {
      await postLink.click();

      await page.locator('.rightSideTitle:has-text("CONTENTS")').waitFor({ state: 'visible' });
      const listItems = await page.locator('.rightSideBarUL li');
      expect(await listItems.count()).toBeGreaterThanOrEqual(1);

      await listItems.nth(1).click();

      await expect(async () => {
        const subject = await page.locator('h2:has-text("🗄 Trending in the AIID")');
        const boundingBox = await subject.boundingBox();
        expect(boundingBox?.y).toBeCloseTo(0, 30);
      }).toPass();
    }
  });
});
