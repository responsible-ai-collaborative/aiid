import { expect, Page, Download } from '@playwright/test';
import { conditionalIntercept, mockDate, waitForRequest, test } from '../utils';
import flaggedReport from '../fixtures/reports/flagged.json';
import unflaggedReport from '../fixtures/reports/unflagged.json';
import { getUnixTime } from 'date-fns';
import { deleteReportTypenames, transformReportData } from '../../src/utils/reports';
import fs from 'fs/promises';
import path from 'path';
import config from '../../config';

test.describe('The Discover app', () => {
    const url = '/apps/discover';

    test('Successfully loads', async ({ page }) => {
        await page.goto(url);
    });

    test('Should display empty state when no incidents are available', async ({ page, runOnlyOnEmptyEnvironment }) => {
        await page.goto(url);

        await expect(async () => {
            const searchParams = new URL(page.url()).searchParams;
            expect(searchParams.get('is_incident_report')).toBe('true');
        }).toPass();

        await expect(page.locator('div[data-cy="hits-container"]')).not.toBeVisible();
        await expect(page.locator('text=Your search returned no results.')).toBeVisible();
    });

    test('Should default to incident reports and show at least 30', async ({ page, skipOnEmptyEnvironment }) => {
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

    test('Performs a search and filters results', async ({ page, skipOnEmptyEnvironment }) => {
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

    test('Filters by incident Id using top filters', async ({ page, skipOnEmptyEnvironment }) => {
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

    test('Filters by Language using top filters', async ({ page, skipOnEmptyEnvironment }) => {
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

    test('Shows expected filters', async ({ page, skipOnEmptyEnvironment }) => {
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

    test('Filters by Tags using top filters', async ({ page, skipOnEmptyEnvironment }) => {
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

    test('Filters by incident Id using card button', async ({ page, skipOnEmptyEnvironment }) => {
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

    // TODO: this test needs to be moved to e2e-full folder
    test.skip('Should flag an incident', async ({ page, skipOnEmptyEnvironment }) => {

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'FindReport',
            unflaggedReport,
            'findReport',
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

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'UpdateReport',
            flaggedReport,
            'updateReport',
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'logReportHistory',
            {
                data: {
                    logReportHistory: {
                        report_number: 10,
                    },
                },
            },
            'logReportHistory',
        );

        await modal.locator('[data-cy="flag-toggle"]').click();

        const updateReportRequest = await waitForRequest('updateReport');
        const updateVariables = updateReportRequest.postDataJSON().variables;
        expect(updateVariables.query.report_number).toBe(23);
        expect(updateVariables.set).toEqual({
            flag: true,
            date_modified: now.toISOString(),
            epoch_date_modified: getUnixTime(now),
        });

        const logReportHistoryRequest = await waitForRequest('logReportHistory');
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

    test.skip('Opens an archive link', async ({ page, skipOnEmptyEnvironment }) => {

        await page.goto(url);

        await page.locator('[data-cy="web-archive-link"] [data-cy="dropdown-toggle"]').first().click();

        let popup: Page = null;

        page.once('popup', page => { popup = page; });

        const originalLink = page.locator('[data-cy="original"]').first();
        await expect(originalLink).toBeVisible();
        await originalLink.click();

        await expect(async () => {
            await expect(popup).toBeTruthy();
            await expect(popup).toHaveURL('https://www.cbsnews.com/news/is-starbucks-shortchanging-its-baristas/');
        }).toPass();

        popup = null;

        page.once('popup', page => { popup = page; });

        await page.locator('[data-cy="web-archive-link"] [data-cy="dropdown-toggle"]').first().click();

        const waybackMachineLink = page.locator('[data-cy="wayback-machine"]').first();
        await expect(waybackMachineLink).toBeVisible();
        await waybackMachineLink.click();

        await expect(async () => {
            await expect(popup).toBeTruthy();
            await expect(popup).toHaveURL('https://web.archive.org/web/20240404174436/https://www.cbsnews.com/news/is-starbucks-shortchanging-its-baristas/');
        }).toPass();
    });

    test('Lets you filter by type', async ({ page }) => {
        await page.goto(url);

        await page.locator('[data-cy="display-options"]:has-text("Incident Reports")').click();

        await page.locator('li:has-text("Issue Reports")').first().click();

        await expect(page).toHaveURL(/is_incident_report=false/);

        await expect(page.locator('[data-cy="display-options"]:has-text("Issue Reports")')).toBeVisible();
    });

    test('Clear filters button should be enabled if other than Incident Reports is selected', async ({ page }) => {
        await page.goto(url);

        await expect(page.locator('button:has-text("Clear Filter")')).toBeDisabled();

        await page.locator('[data-cy="display-options"]:has-text("Incident Reports")').click();

        await page.locator('[data-cy="display-options"] li:has-text("Incidents")').click();
        await expect(page.locator('button:has-text("Clear Filter")')).toBeEnabled();

        await page.locator('[data-cy="display-options"]:has-text("Incidents")').click();
        await page.locator('[data-cy="display-options"] li:has-text("Issue Reports")').nth(1).click();
        await expect(page.locator('button:has-text("Clear Filter")')).toBeEnabled();

        await page.locator('[data-cy="display-options"]:has-text("Issue Reports")').click();
        await page.locator('li:has-text("Incident and Issue Reports")').click();
        await expect(page.locator('button:has-text("Clear Filter")')).toBeEnabled();

        await page.locator('[data-cy="display-options"]:has-text("Incident and Issue Reports")').click();
        await page.locator('[data-cy="display-options"] li:has-text("Incident Reports")').click();
        await expect(page.locator('button:has-text("Clear Filter")')).toBeDisabled();
    });

    test('Should sort by incident date', async ({ page, skipOnEmptyEnvironment }) => {
        await page.goto(url);

        await page.locator('[data-cy="discover-sort"]').click();

        await page.locator('[data-cy="incident-date-asc-sort"]').click();

        await page.locator('[data-cy="discover-sort"]').click();

        await expect(page.locator('[data-cy="discover-sort"]')).toHaveText('Oldest Incident Date');

        await expect(async () => {
            const dates = await page.locator('[data-cy=incident-date]').elementHandles();
            const firstDateValue = parseInt(await dates[0].inputValue(), 10);
            const secondDateValue = parseInt(await dates[1].inputValue(), 10);

            expect(parseInt(await dates[1].inputValue(), 10)).toBeGreaterThanOrEqual(firstDateValue);
            expect(parseInt(await dates[2].inputValue(), 10)).toBeGreaterThanOrEqual(secondDateValue);
        }).toPass();
    });

    test('Should sort by published date', async ({ page, skipOnEmptyEnvironment }) => {
        await page.goto(url);

        await page.locator('[data-cy="discover-sort"]').click();

        await page.locator('[data-cy="published-date-desc-sort"]').click();

        await page.locator('[data-cy="discover-sort"]').click();

        await expect(page.locator('[data-cy="discover-sort"]')).toHaveText('Newest Published Date');

        await expect(async () => {
            const dates = await page.locator('[data-cy=date-published]').elementHandles();
            const secondDateValue = parseInt(await dates[1].inputValue(), 10);
            const thirdDateValue = parseInt(await dates[2].inputValue(), 10);

            expect(parseInt(await dates[0].inputValue(), 10)).toBeGreaterThanOrEqual(secondDateValue);
            expect(parseInt(await dates[1].inputValue(), 10)).toBeGreaterThanOrEqual(thirdDateValue);
        }).toPass();
    });

    test('Should display incidents instead of reports when selecting Incidents view', async ({ page }) => {
        await page.goto(url);

        await page.locator('[data-cy="display-options"]:has-text("Incidents")').click();
        await page.locator('[data-cy="display-options"] li:has-text("Incidents")').click();

        await expect(page).toHaveURL(/is_incident_report=true/);
        await expect(page).toHaveURL(/hideDuplicates=1/);
    });

    test('Should not add a trailing slash when loading the discover app', async ({ page }) => {
        await page.goto(url);

        await expect(page).toHaveURL(/\?is_incident_report=true$/);
    });

    test('Should export results to a CSV file', async ({ page, skipOnEmptyEnvironment }) => {
        await page.goto(url);

        await page.locator('[data-cy="search-box"] input[placeholder="Type Here"]').type('starbucks');
        await page.keyboard.press('Enter');

        const downloadPromise = page.waitForEvent('download');

        await page.locator('[data-cy=export-to-csv]').click();

        const download: Download = await downloadPromise;

        const fileName = download.suggestedFilename();

        const fullPath = path.join(__dirname, fileName);

        await download.saveAs(fullPath);

        const file = await fs.readFile(fullPath, 'utf-8');

        expect(file.length).toBeGreaterThan(10);
    });

    test('Should not export results to a CSV file if no results are displayed', async ({ page }) => {
        await page.goto(url);

        await page.locator('[data-cy="search-box"] input[placeholder="Type Here"]').fill('xxxxxxxxxxxxx');
        await page.keyboard.press('Enter');

        await expect(page).toHaveURL(/s=xxxxxxxxxxxxx/);

        await expect(page.locator('[data-cy=export-to-csv]')).toBeDisabled();
    });

    test('Should set the sort with the value from the URL', async ({ page }) => {
        await page.goto(url);

        await expect(page).toHaveURL(/\?is_incident_report=true/);
        await expect(page.locator('[data-cy="discover-sort"]')).toHaveText('Relevance');

        const newUrl = url + '?display=details&is_incident_report=true&page=1&sortBy=incident-date-desc';
        await page.goto(newUrl);

        await expect(page.locator('[data-cy="discover-sort"]')).toHaveText('Newest Incident Date');
    });

    test('Should default to the featured incidents', async ({ page, skipOnEmptyEnvironment }) => {
        await page.goto(url);

        for (const item of config.header.search.featured) {
            const [report_number] = Object.entries(item).flat();
            await expect(page.locator(`[data-cy-report-number="${report_number}"]`)).toBeVisible();
        }
    });

    test('Performs a search and filters results by source', async ({ page, skipOnEmptyEnvironment }) => {
        await page.goto(url);

        await page.locator('[data-cy="search-box"] input[placeholder="Type Here"]').fill('google');

        await page.keyboard.press('Enter');

        await expect(page).toHaveURL(/s=google/);

        await page.locator('[data-cy=expand-filters]').click();

        await page.locator('button:has-text("Source")').click();

        await page.locator('[data-cy="source_domain"] [placeholder="Type Here"]').type('theguardian.com');
        await page.keyboard.press('Enter');

        await page.locator('[data-cy="source_domain-item"]:has-text("theguardian.com")').first().click();

        await expect(page).toHaveURL(/source_domain=theguardian.com/);

        await expect(async () => {
            const count = await page.locator('div[data-cy="hits-container"] > div').count();
            await expect(count).toBeGreaterThanOrEqual(8);
        }).toPass();
    });

    test('Loads filters based on URL', async ({ page, skipOnEmptyEnvironment }) => {
        await page.goto(url + '?is_incident_report=true&submitters=Anonymous&page=3&classifications=CSETv0%3AIntent%3AAccident');

        await expect(page.locator('button:has-text("Submitters") span.badge')).toContainText('1');
        await expect(page.locator('button:has-text("Classifications") span.badge')).toContainText('1');
        await expect(page.locator('li.ais-Pagination-item--selected .ais-Pagination-link')).toHaveText('3');

        await page.goto(url + '?authors=Christopher%20Knaus&incident_id=57&is_incident_report=true&language=en&source_domain=theguardian.com');

        await expect(page.locator('button:has-text("Authors") span.badge')).toContainText('1');
        await expect(page.locator('button:has-text("Source") span.badge')).toContainText('1');
        await expect(page.locator('button:has-text("Incident ID") span.badge')).toContainText('1');
        await expect(page.locator('button:has-text("Language") span.badge')).toContainText('1');
    });

    test('Should update display types', async ({ page }) => {
        await page.goto(url + '?display=list');

        await expect(page.locator('[data-cy="display-mode-list"]')).toHaveClass(/selected/);

        await page.locator('[data-cy="display-mode-compact"]').click();

        await expect(page).toHaveURL(/display=compact/);
        await expect(page.locator('[data-cy="display-mode-compact"]')).toHaveClass(/selected/);

        await page.locator('[data-cy="display-mode-details"]').click();

        await expect(page).toHaveURL(/display=details/);
        await expect(page.locator('[data-cy="display-mode-details"]')).toHaveClass(/selected/);
    });

    test('Search using the classifications filter', async ({ page, skipOnEmptyEnvironment }) => {
        await page.goto(url);

        await page.locator('[data-cy=expand-filters]').click();
        await page.locator('button:has-text("Classifications")').click();

        await page.locator('[data-cy="search"] input').type('Buenos Aires');
        await page.locator('[data-cy="attributes"] [data-cy="Named Entities"]').locator('text=Buenos Aires').click();

        await expect(page).toHaveURL(/classifications=CSETv0%3ANamed%20Entities%3ABuenos%20Aires/);
        await expect(page.locator('[data-cy="selected-refinements"]')).toContainText('CSETv0 : Named Entities : Buenos Aires');

        await expect(async () => {
            const count = await page.locator('div[data-cy="hits-container"] > div').count();
            await expect(count).toBeGreaterThanOrEqual(0);
        }).toPass();
    });
});
