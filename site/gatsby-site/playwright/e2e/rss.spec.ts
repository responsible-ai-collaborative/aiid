import { expect } from '@playwright/test';
import { test } from '../utils';
import { XMLParser } from 'fast-xml-parser';
import { init } from '../memory-mongo';

test.describe('RSS', () => {
  test('Should generate a valid RSS feed', async ({ page }) => {
    await init();
    const response = await page.request.get('/rss.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');

    const xml = await response.text();
    const parser = new XMLParser();
    const parsedXml = parser.parse(xml);

    const hasChannelTag = parsedXml.rss.channel !== undefined;
    expect(hasChannelTag).toBe(true);

    const items = parsedXml.rss.channel.item.slice(0, 20);
    expect(items.length).toBeGreaterThan(0);
  });

  test('Should generate a valid RSS feed data', async ({ page, skipOnEmptyEnvironment }) => {
    await init();
    const response = await page.request.get('/rss.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');

    const xml = await response.text();
    const parser = new XMLParser();
    const parsedXml = parser.parse(xml);

    const hasChannelTag = parsedXml.rss.channel !== undefined;
    expect(hasChannelTag).toBe(true);

    const items = parsedXml.rss.channel.item.slice(0, 20);
    expect(items.length).toBeGreaterThan(0);

    items.forEach((item: any) => {
      const description = item.description;
      const title = item.title;
      const pubDate = item.pubDate;
      const guid = item.guid;

      expect(description).not.toBeNull();
      expect(title).not.toBeNull();
      expect(pubDate).not.toBeNull();
      expect(guid).not.toBeNull();
    });
  });
});
