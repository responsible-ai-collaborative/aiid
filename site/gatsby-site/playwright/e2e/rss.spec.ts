import { expect } from '@playwright/test';
import { test } from '../utils';
import { parse } from 'node-html-parser';

test.describe('RSS', () => {
  test('Should generate a valid RSS feed', async ({ page }) => {
    const response = await page.request.get('/rss.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');

    const xml = await response.text();
    const parsedXml = parse(xml);

    const hasChannelTag = parsedXml.querySelectorAll('channel').length > 0;
    expect(hasChannelTag).toBe(true);

    const items = Array.from(parsedXml.querySelectorAll('channel > item')).slice(0, 20);
    expect(items.length).toBeGreaterThan(0);
  });

  test('Should generate a valid RSS feed data', async ({ page, skipOnEmptyEnvironment }) => {
    const response = await page.request.get('/rss.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');

    const xml = await response.text();
    const parsedXml = parse(xml);

    const hasChannelTag = parsedXml.querySelectorAll('channel').length > 0;
    expect(hasChannelTag).toBe(true);

    const items = Array.from(parsedXml.querySelectorAll('channel > item')).slice(0, 20);
    expect(items.length).toBeGreaterThan(0);

    items.forEach((item) => {
      const description = item.querySelector('description');
      const title = item.querySelector('title');
      const pubDate = item.querySelector('pubDate');
      const guid = item.querySelector('guid');

      expect(description).not.toBeNull();
      expect(title).not.toBeNull();
      console.log(pubDate, description)
      expect(pubDate).not.toBeNull();
      expect(guid).not.toBeNull();
    });
  });
});
