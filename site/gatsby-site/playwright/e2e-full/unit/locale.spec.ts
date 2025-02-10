import { expect } from '@playwright/test';
import { test, listFiles } from '../../utils';
import { readFileSync } from 'fs';
import config from '../../config';

test.describe('Locale', () => {
  test('Locale folder should contain specific JSON files for all specified languages', async ({ }) => {
    let availableLanguages: string = config.AVAILABLE_LANGUAGES;
    let enFiles: string[] = [];

    enFiles = await listFiles('./i18n/locales/en');

    if (availableLanguages) {
      const splittedLanguages: string[] = (availableLanguages as string).split(',');

      for (const locale of splittedLanguages.filter((a) => a !== 'en')) {
        const otherLocaleFiles = await listFiles(`./i18n/locales/${locale}`);
        expect(otherLocaleFiles.sort()).toEqual(
          enFiles.sort()
        );
      }
    }
  });

  test('should have a configuration for each available language', async ({ }) => {
    const configPath = './i18n/config.json';
    const configurations = JSON.parse(readFileSync(configPath, 'utf-8'));

    expect(configurations).toBeInstanceOf(Array);

    const availableLanguages = config.AVAILABLE_LANGUAGES.split(',');

    availableLanguages.forEach((locale) => {
      const hasConfig = configurations.some((config) => config.code === locale);
      expect(hasConfig).toBe(true);
    });
  });
});
