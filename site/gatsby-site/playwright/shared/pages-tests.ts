import { expect } from '@playwright/test';
import { switchLocalizedPath } from '../../i18n';
import isString from 'lodash/isString';
import { test } from '../utils';
import config from '../config';

export function testPages(paths: string[]) {

  const baseUrl = config.SITE_URL;

  const languages = [
    {
      code: 'en',
      hrefLang: 'en-US',
    },
    {
      code: 'es',
      hrefLang: 'es',
    },
    {
      code: 'fr',
      hrefLang: 'fr',
    },
    {
      code: 'ja',
      hrefLang: 'ja',
    },
  ].filter(({ code }) => config.AVAILABLE_LANGUAGES.includes(code));

  paths.forEach((path) => {
    languages.forEach(({ code }) => {
      test(`/${code}${path} Should not have errors`, async ({ page }) => {
        const canonicalPath = switchLocalizedPath({ newLang: code, path });

        await page.goto(canonicalPath);
        const consoleErrors = [];

        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            msg.args().forEach(async (arg) => {
              const errorMsg = await arg.jsonValue();

              if (
                isString(errorMsg) &&
                (errorMsg.includes('did not match') || errorMsg.includes('Minified React error'))
              ) {
                consoleErrors.push(errorMsg);
              }
            });
          }
        });

        expect(consoleErrors.length).toBe(0);

        // check for SEO tags
        const url = baseUrl + canonicalPath;

        await expect(page.locator('[rel="canonical"]')).toHaveAttribute('href', url);
        await expect(page.locator('[rel="alternate"]')).toHaveCount(6);
        await expect(page.locator('[rel="alternate"][hrefLang="x-default"]')).toHaveAttribute(
          'href',
          baseUrl
        );
        await expect(page.locator('[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
          'href',
          '/rss.xml'
        );

        for (const language of languages) {
          const alternatePath = switchLocalizedPath({ newLang: language.code, path });

          const alternateUrl = baseUrl + alternatePath;

          await expect(
            page.locator(
              `[rel="alternate"][hrefLang="${language.hrefLang}"][href="${alternateUrl}"]`
            )
          ).toHaveCount(1);
        }
      });

      test(`/${code}${path} Should load images properly`, async ({ page }) => {
        await page.goto(path);

        const cloudinaryImageWrappers = await page
          .getByTestId('cloudinary-image-wrapper')
          .elementHandles();

        if (cloudinaryImageWrappers.length > 0) {
          for (const wrapper of cloudinaryImageWrappers) {
            await wrapper.scrollIntoViewIfNeeded();
            const image = await wrapper.$('[data-testid="cloudinary-image"]');

            const imageSrc = await image.getAttribute('src');

            const response = await page.request.get(imageSrc);

            if (response.status() !== 200) {
              const imageClass = await image.getAttribute('class');

              expect(imageClass).toContain('hidden');
              const placeholder = await wrapper.$('[data-testid="cloudinary-image-placeholder"]');

              const placeholderClass = await placeholder.getAttribute('class');

              expect(placeholderClass).not.toContain('hidden');
            }
          }
        } else {
          console.log(`No images found on page, skipping image test for path ${path}`);
        }
      });

      test(`/${code}${path} Should have open graph tags`, async ({ page }) => {
        const canonicalPath = switchLocalizedPath({ newLang: code, path });

        await page.goto(canonicalPath);

        await expect(page.locator('head meta[name="twitter:site"]')).toHaveCount(1);
        await expect(page.locator('head meta[name="twitter:creator"]')).toHaveCount(1);
        await expect(page.locator('head meta[property="og:url"]')).toHaveCount(1);
        await expect(page.locator('head meta[property="og:type"]')).toHaveCount(1);
        await expect(page.locator('head meta[property="og:title"]')).toHaveCount(1);
        await expect(page.locator('head meta[property="og:description"]')).toHaveCount(1);
        await expect(page.locator('head meta[property="og:image"]').first()).toHaveCount(1);
        await expect(page.locator('head meta[property="twitter:title"]')).toHaveCount(1);
        await expect(page.locator('head meta[property="twitter:description"]')).toHaveCount(1);
        await expect(page.locator('head meta[property="twitter:image"]')).toHaveCount(1);
      });
    });
  });
}
