import { test, expect, Page } from '@playwright/test';
import { conditionalIt, conditionalIntercept, waitForStableDom } from './utils';
import flaggedReport from '../cypress/fixtures/reports/flagged.json';
import unflaggedReport from '../cypress/fixtures/reports/unflagged.json';
import config from '../config';
import path from 'path';
import { getUnixTime } from 'date-fns';
import { deleteReportTypenames, transformReportData } from 'utils/reports';

test.describe('The Discover app', () => {
    const url = '/apps/discover';

    test('Successfully loads', async ({ page }) => {
        await page.goto(url);
    });

    conditionalIt(process.env.isEmptyEnvironment === 'true', 'Should display empty state when no incidents are available', async ({ page }) => {
        await page.goto(url);

        await expect(async () => {
            const searchParams = new URL(page.url()).searchParams;
            expect(searchParams.get('is_incident_report')).toBe('true');
        }).toPass();

        await expect(page.locator('div[data-cy="hits-container"]')).not.toBeVisible();
        await expect(page.locator('text=Your search returned no results.')).toBeVisible();
    });

    conditionalIt(process.env.isEmptyEnvironment !== 'true', 'Should default to incident reports and show at least 30', async ({ page }) => {
        await page.goto(url);

        await expect(async () => {
            const searchParams = new URL(page.url()).searchParams;
            expect(searchParams.get('is_incident_report')).toBe('true');
        }).toPass();

        await expect(page.locator('[data-cy="display-options"]')).toBeVisible();

        await expect(async () => {
            const hitsCount = await page.locator('div[data-cy="hits-container"] > div').count();
            await expect(hitsCount).toBeGreaterThanOrEqual(28);
        }).toPass();
    });

    conditionalIt(process.env.isEmptyEnvironment !== 'true', 'Performs a search and filters results', async ({ page }) => {
        await page.goto(url);

        await page.fill('[data-cy="search-box"] input[placeholder="Type Here"]', 'starbucks');
        await page.keyboard.press('Enter');

        await expect(async () => {
            expect(page.url()).toContain('s=starbucks');
        }).toPass();

        await expect(async () => {
            const count = await page.locator('div[data-cy="hits-container"] > div').count();
            await expect(count).toBeGreaterThanOrEqual(8);
        }).toPass();
    });

    conditionalIt(process.env.isEmptyEnvironment !== 'true', 'Filters by incident Id using top filters', async ({ page }) => {
        await page.goto(url);

        await page.click('[data-cy=expand-filters]');

        await page.click('button:has-text("Incident ID")');

        await page.fill('[data-cy="incident_id"] [placeholder="Type Here"]', '34');
        await page.keyboard.press('Enter');
        await page.click('[data-cy="incident_id-item"]:has-text("34")');

        await expect(async () => {
            expect(page.url()).toContain('incident_id=34');
        }).toPass();

        await expect(async () => {
            const count = await page.locator('div[data-cy="hits-container"] > div').count();
            await expect(count).toBeGreaterThanOrEqual(28);
        }).toPass();
    });

    conditionalIt(process.env.isEmptyEnvironment !== 'true', 'Filters by Language using top filters', async ({ page }) => {
        await page.goto(url);

        await page.click('[data-cy=expand-filters]');

        await page.click('button:has-text("Language")');

        await page.fill('[data-cy="language"] [placeholder="Type Here"]', 'es');
        await page.keyboard.press('Enter');
        await page.click('[data-cy="language-item"]:has-text("es")');

        await expect(async () => {
            expect(page.url()).toContain('language=es');
        }).toPass();

        await expect(async () => {
            const count = await page.locator('div[data-cy="hits-container"] > div').count();
            await expect(count).toBeGreaterThanOrEqual(4);
        }).toPass();
    });

    conditionalIt(process.env.isEmptyEnvironment !== 'true', 'Shows expected filters', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto(url);

        await expect(page.locator('button:has-text("Classifications")')).toBeVisible();
        await expect(page.locator('button:has-text("Language")')).not.toBeVisible();
        await expect(page.locator('button:has-text("Submitter")')).not.toBeVisible();

        await page.setViewportSize({ width: 1280, height: 1080 });

        await expect(page.locator('button:has-text("Classifications")')).toBeVisible();
        await expect(page.locator('button:has-text("Language")')).toBeVisible();
        await expect(page.locator('button:has-text("Submitter")')).not.toBeVisible();

        await page.click('[data-cy=expand-filters]');
        await expect(page.locator('button:has-text("Classifications")')).toBeVisible();
        await expect(page.locator('button:has-text("Language")')).toBeVisible();
        await expect(page.locator('button:has-text("Submitter")')).toBeVisible();

        await page.setViewportSize({ width: 1920, height: 1080 });

        await expect(page.locator('button:has-text("Classifications")')).toBeVisible();
        await expect(page.locator('button:has-text("Language")')).toBeVisible();
        await expect(page.locator('button:has-text("Submitter")')).toBeVisible();
    });

    conditionalIt(process.env.isEmptyEnvironment !== 'true', 'Filters by Tags using top filters', async ({ page }) => {
        await page.goto(url);

        await page.click('[data-cy=expand-filters]');

        await page.click('button:has-text("Tags")');

        await page.fill('[data-cy="tags"] [placeholder="Type Here"]', 'response');
        await page.keyboard.press('Enter');
        await page.click('[data-cy="tags-item"]:has-text("response")');

        await expect(async () => {
            expect(page.url()).toContain('tags=response');
        }).toPass();

        await expect(async () => {
            const count = await page.locator('div[data-cy="hits-container"] > div').count();
            await expect(count).toBeGreaterThanOrEqual(1);
        }).toPass();
    });

    conditionalIt(process.env.isEmptyEnvironment !== 'true', 'Filters by incident Id using card button', async ({ page }) => {
        await page.goto(url);

        await page.click('[data-cy=expand-filters]');

        await page.click('div[data-cy="hits-container"] [title="Filter by Incident ID #10"]');

        await expect(page.locator('button:has-text("Incident ID") span.badge')).toContainText('1');

        await expect(async () => {
            expect(page.url()).toContain('incident_id=10');
        }).toPass();

        await expect(async () => {
            const count = await page.locator('div[data-cy="hits-container"] > div').count();
            await expect(count).toBeGreaterThanOrEqual(8);
        }).toPass();
    });
});