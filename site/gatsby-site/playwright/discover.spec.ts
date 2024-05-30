import { test, expect } from '@playwright/test';
import { conditionalIntercept, conditionalIt, mockDate } from './utils';
import flaggedReport from '../cypress/fixtures/reports/flagged.json';
import unflaggedReport from '../cypress/fixtures/reports/unflagged.json';
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

    conditionalIt(!process.env.isEmptyEnvironment, 'Should flag an incident', async ({ page }) => {

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'FindReport',
            unflaggedReport,
            { ignoreWait: true }
        );


        const now = new Date('June 21 2026 13:00:00');

        await mockDate(page, now);

        await page.goto(
            url +
            '?display=details&incident_id=10&s=%E2%80%8BIs%20Starbucks%20shortchanging%20its%20baristas%3F'
        );

        const _id = '5d34b8c29ced494f010ed470';


        await page.click(`[data-cy="${_id}"] [data-cy="flag-button"]`);

        const modal = page.locator('[data-cy="flag-report-23"]');
        await expect(modal).toBeVisible();

        const [updateReportPromise] = await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'UpdateReport',
            flaggedReport
        );

        const [logReportHistoryPromise] = await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'logReportHistory',
            {
                data: {
                    logReportHistory: {
                        report_number: 10,
                    },
                },
            }
        );

        await modal.locator('[data-cy="flag-toggle"]').click();

        const updateReportRequest = await updateReportPromise;
        const updateVariables = updateReportRequest.postDataJSON().variables;
        expect(updateVariables.query.report_number).toBe(23);
        expect(updateVariables.set).toEqual({
            flag: true,
            date_modified: now.toISOString(),
            epoch_date_modified: getUnixTime(now),
        });

        const logReportHistoryRequest = await logReportHistoryPromise;
        const input = logReportHistoryRequest.postDataJSON().variables.input;

        const expectedReport = deleteReportTypenames(
            transformReportData(flaggedReport.data.updateOneReport)
        );

        expectedReport.modifiedBy = '';
        expectedReport.date_modified = now.toISOString();
        expectedReport.epoch_date_modified = getUnixTime(now);

        expect(input).toEqual(expectedReport);

        await expect(modal.locator('[data-cy="flag-toggle"]')).toBeDisabled();
        await modal.locator('[aria-label="Close"]').click();
        await expect(modal).not.toBeVisible();
    });
});