import { expect } from '@playwright/test';
import { readdirSync } from 'fs';
import path from 'path';
import { test } from '../utils';

// `/summaries` redirects to `/about_apps`, which is therefore the index of the
// summaries. Every summary page must be listed there. SEE: #4180
const summaryPages = [
  ...readdirSync(path.join(__dirname, '../../src/pages/summaries'))
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.replace(/\.js$/, '')),
  // Created by page creators rather than src/pages
  'spatial',
  'wordcounts',
];

test.describe('The Apps and Summaries page', () => {
  for (const lang of ['en', 'es', 'fr']) {
    test(`Lists every summary page (${lang})`, async ({ page }) => {
      await page.goto(lang === 'en' ? '/about_apps' : `/${lang}/about_apps`);

      for (const summary of summaryPages) {
        await expect(page.locator(`a[href="/summaries/${summary}"]`)).toBeVisible();
      }
    });
  }
});
