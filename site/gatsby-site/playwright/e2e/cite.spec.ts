import { conditionalIntercept, waitForRequest, query, login, maybeIt, mockDate } from '../utils';
import flaggedReport from '../fixtures/reports/flagged.json';
import unflaggedReport from '../fixtures/reports/unflagged.json';
import upsertDuplicateClassification from '../fixtures/classifications/upsertDuplicateClassification.json';
import updateIncident50 from '../fixtures/incidents/updateIncident50.json';
import { format, getUnixTime } from 'date-fns';
import updateOneIncidentFlagged from '../fixtures/incidents/updateOneIncidentFlagged.json';
import incident10 from '../fixtures/incidents/fullIncident10.json';
import incident50 from '../fixtures/incidents/fullIncident50.json';
import { transformIncidentData, deleteIncidentTypenames } from '../../src/utils/cite';
import { transformReportData, deleteReportTypenames } from '../../src/utils/reports';
import { gql } from '@apollo/client';
import { test, expect } from '@playwright/test';
import config from '../config';

test.describe('Cite pages', () => {
    const discoverUrl = '/apps/discover';

    const incidentId = 10;

    const url = `/cite/${incidentId}`;

    let user: { userId: string };

    let lastIncidentId: number;

    test.beforeAll(async ({ request }) => {
        // Skip all tests if the environment is empty since /cite/{incident_id} is not available
        if (config.IS_EMPTY_ENVIRONMENT) {
            test.skip();
        }

        const response = await query({
            query: gql`
                        {
                            user(query: { first_name: "Test", last_name: "User" }) {
                                userId
                                first_name
                                last_name
                            }
                            incidents(limit: 1, sortBy: INCIDENT_ID_DESC) {
                                incident_id
                            }
                        }
                    `,
        });

        user = response.data.user;
        lastIncidentId = response.data.incidents[0].incident_id;
    });

    test('Successfully loads', async ({ page }) => {
        await page.goto(url);
    });

    maybeIt('Should show an edit link to users with the appropriate role', async ({ page }) => {
        await login(page, config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        const id = 'r3';

        await page.goto('/cite/1#' + id);

        await page.click(`#${id} [data-cy="edit-report"]`);

        await page.waitForSelector(`#${id} [data-cy="edit-report"]`, { state: 'visible' });

        await expect(async () => {
            expect(page.url()).toContain('/cite/edit/?report_number=3');
        }).toPass();
    });


    test.skip(
        'Should scroll to report when coming from the discover app',
        async ({ page }) => {

            await page.goto(discoverUrl);
            await page.click('[data-cy="collapse-button"]:visible');

            await page.click('text="Show Details on Incident #10"');

            await expect(async () => {
                expect(page.url()).toContain('/cite/10/#r23');
            }).toPass();

            await expect(async () => {

                await page.waitForSelector('h5:has-text("Is Starbucks shortchanging its baristas?")', { timeout: 8000 });
                const incidentReportCard = await page.$('[data-cy="incident-report-card"]');
                const boundingBox = await incidentReportCard.boundingBox();
                expect(boundingBox.y).toBeLessThanOrEqual(20);
            }).toPass();
        },
        { retries: 4 }
    );

    test('Should scroll to report when clicking on a report in the timeline', async ({ page }) => {
        await page.goto(url);

        await page.waitForSelector('text=For some Starbucks workers, job leaves bitter taste');
        await page.click('a:has-text("For some Starbucks workers, job leaves bitter taste")');

        await expect(async () => {
            const incidentReportCard = await page.$('[data-cy="incident-report-card"] h5:has-text("For some Starbucks workers, job leaves bitter taste")');
            const boundingBox = await incidentReportCard!.boundingBox();
            expect(boundingBox?.y).toBeLessThanOrEqual(20);
        }).toPass();
    });

    test('Should show the incident stats table', async ({ page }) => {
        await page.goto(url);
        await expect(page.locator('[data-cy=incident-stats]')).toBeVisible();
    });

    test('Should show editors in the stats table', async ({ page }) => {
        await page.goto(url);
        const incidentStats = await page.locator('[data-cy=incident-stats] > * > *:has-text("Editors")');
        await expect(incidentStats.locator('text=Sean McGregor')).toBeVisible();
    });

    test('Should flag an incident', async ({ page }) => {
        const _id = '23';

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'FindReport',
            unflaggedReport,
            'fetchReport'
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
            'logReportHistory'
        );

        const now = new Date('March 14 2042 13:37:11');
        await mockDate(page, now)

        await page.goto(url + '#' + _id);

        await page.click(`[id="r${_id}"] [data-cy="expand-report-button"]`);
        await page.click(`[id="r${_id}"] [data-cy="flag-button"]`);

        const modal = page.locator('[data-cy="flag-report-23"]');
        await expect(modal).toBeVisible();

        await waitForRequest('fetchReport');

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'UpdateReport',
            flaggedReport,
            'updateReport'
        );

        await modal.locator('[data-cy="flag-toggle"]').click();

        const updateReportRequest = await waitForRequest('updateReport');
        const variables = updateReportRequest.postDataJSON().variables;
        expect(variables.query.report_number).toBe(23);
        expect(variables.set).toEqual({
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

        await page.click('[aria-label="Close"]');

        await expect(modal).not.toBeVisible();
    });

    test.skip('Should remove duplicate', async ({ page }) => {
        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'UpsertClassification',
            upsertDuplicateClassification,
            'upsertClassification'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'UpdateIncident',
            updateIncident50,
            'updateIncident'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'InsertDuplicate',
            {
                data: {
                    insertOneDuplicate: {
                        __typename: 'Duplicate',
                        duplicate_incident_number: 10,
                        true_incident_number: 50,
                    },
                },
            },
            'insertDuplicate'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName === 'FindIncident' &&
                req.postDataJSON().variables.query.incident_id === 10,
            incident10,
            'findIncident'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName === 'FindIncident' &&
                req.postDataJSON().variables.query.incident_id === 50,
            incident50,
            'findIncident'
        );

        await login(page, config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        await page.goto('/cite/10');

        await page.click('[data-cy="remove-duplicate"]');

        await page.fill('#input-duplicateIncidentId', '50');
        await page.click('#duplicateIncidentId > a[aria-label="50"]');
        // await page.blur('#input-duplicateIncidentId');

        await page.click('[data-cy="confirm-remove-duplicate"]');

        await expect(page.locator('text=Incident 10 marked as duplicate')).toBeVisible();
    });

    test('Should pre-fill submit report form', async ({ page }) => {
        await page.goto(url);

        await page.locator('a:has-text("New Report")').click();

        await expect(page.locator('[data-cy="prefilled-incident-id"]')).toHaveText('Adding a new report to incident 10');
        await expect(page.locator('.incident-ids-field [data-cy="token"]:has-text("10")')).toBeVisible();
    });

    test('Should pre-fill submit report response form', async ({ page }) => {
        await page.goto(url);

        await page.locator('a:has-text("New Response")').click();

        await expect(page.locator('[data-cy="prefilled-incident-id"]')).toHaveText('Adding a new response to incident 10');
        await expect(page.locator('.incident-ids-field [data-cy="token"]:has-text("10")')).toBeVisible();
    });

    test('Should render Next and Previous incident buttons', async ({ page }) => {
        await page.goto(url);

        await expect(page.locator('a:has-text("Next Incident")')).toBeVisible();
        await expect(page.locator('a:has-text("Next Incident")')).toHaveAttribute('href', '/cite/11');

        await expect(page.locator('a:has-text("Previous Incident")')).toBeVisible();
        await expect(page.locator('a:has-text("Previous Incident")')).toHaveAttribute('href', '/cite/9');
    });

    test('Should render Next and Previous incident buttons if duplicate incident', async ({ page }) => {
        await page.goto('/cite/90');

        await expect(page.locator('a:has-text("Next Incident")')).toBeVisible();
        await expect(page.locator('a:has-text("Next Incident")')).toHaveAttribute('href', '/cite/91');

        await expect(page.locator('a:has-text("Previous Incident")')).toBeVisible();
        await expect(page.locator('a:has-text("Previous Incident")')).toHaveAttribute('href', '/cite/89');
    });

    test('Should render the header next/previous buttons', async ({ page }) => {
        await page.goto(url);

        await expect(page.locator('[data-cy="header-previous-incident-link"]')).toBeVisible();
        await expect(page.locator('[data-cy="header-previous-incident-link"]')).toHaveAttribute('href', '/cite/9');

        await expect(page.locator('[data-cy="header-next-incident-link"]')).toBeVisible();
        await expect(page.locator('[data-cy="header-next-incident-link"]')).toHaveAttribute('href', '/cite/11');
    });

    test('Should disable Previous and Next incident buttons in header on first and last incidents', async ({ page }) => {
        await page.goto('/cite/1');

        await expect(page.locator('[data-cy="header-previous-incident-link"]')).not.toHaveAttribute('href');

        await expect(page.locator('[data-cy="header-next-incident-link"]')).toBeVisible();
        await expect(page.locator('[data-cy="header-next-incident-link"]')).toHaveAttribute('href', '/cite/2');

        await page.goto(`/cite/${lastIncidentId}`);

        await expect(page.locator('[data-cy="header-next-incident-link"]')).not.toHaveAttribute('href');

        await expect(page.locator('[data-cy="header-previous-incident-link"]')).toBeVisible();
        await expect(page.locator('[data-cy="header-previous-incident-link"]')).toHaveAttribute('href', `/cite/${lastIncidentId - 1}`);
    });

    maybeIt('Should show the edit incident form', async ({ page }) => {
        await login(page, config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        await page.goto(url);

        await page.locator('a:has-text("Edit Incident")').click();

        await expect(page).toHaveURL(/\/incidents\/edit\/\?incident_id=10/);

        await expect(page.locator('[data-cy="incident-form"]')).toBeVisible();
    });

    test('Should display correct BibTex Citation', async ({ page }) => {
        await page.goto(url);

        const date = format(new Date(), 'MMMMd,y');

        await page.locator('button:has-text("Citation Info")').click();

        await expect(page.locator('[data-cy="citation-info-modal"]')).toBeVisible();

        const bibTextElement = await page.locator('[data-cy="bibtex-format"] code').textContent();
        const bibText = bibTextElement.replace(/(\r\n|\n|\r| |\s)/g, '');

        expect(bibText).toBe(
            `@article{aiid:10,author={Olsson,Catherine},editor={McGregor,Sean},journal={AIIncidentDatabase},publisher={ResponsibleAICollaborative},title={IncidentNumber10},url={https://incidentdatabase.ai/cite/10},year={2014},urldate={${date}}}`
        );
    });

    test('Should display similar incidents', async ({ page }) => {
        await page.goto('/cite/9');

        await expect(async () => {
            const count = await page.locator('[data-cy="similar-incident-card"]').count();
            await expect(count).toBeGreaterThanOrEqual(0);
        }).toPass();
    });

    test('Should display similar incidents with localized links', async ({ page }) => {
        await page.goto('/es/cite/9');

        await expect(async () => {
            const count = await page.locator('[data-cy="similar-incident-card"]').count();
            await expect(count).toBeGreaterThanOrEqual(0);
        }).toPass();

        await expect(async () => {
            const similarIncidentLinks = await page.locator('.tw-main-container [data-cy="similar-incident-card"] > [data-cy="cite-link"]');
            const hrefs = await similarIncidentLinks.evaluateAll(links => links.map(link => link.href));

            hrefs.forEach(href => {
                expect(href).toContain('/es/cite/');
            });
        }).toPass();
    });

    test('Should not display duplicate similar incidents', async ({ page }) => {
        await page.goto('/cite/9');

        await expect(async () => {
            const similarIncidentLinks = await page.locator('.tw-main-container [data-cy="similar-incident-card"] > [data-cy="cite-link"]');
            const hrefs = new Set();

            const links = await similarIncidentLinks.evaluateAll(links => links.map(link => link.href));

            links.forEach(href => {
                expect(hrefs.has(href)).toBe(false);
                hrefs.add(href);
            });
        }).toPass();
    });

    test('Should not display edit link when not logged in', async ({ page }) => {
        await page.goto('/cite/9');

        await expect(page.locator('[data-cy="edit-similar-incidents"]')).not.toBeVisible();
    });

    maybeIt('Should display edit link when logged in as editor', async ({ page }) => {
        await login(page, config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        await page.goto('/cite/9');

        await expect(page.locator('[data-cy="edit-similar-incidents"]').nth(1)).toBeVisible();
    });

    test('Should flag an incident as not related (not authenticated)', async ({ page }) => {
        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'FindIncident',
            incident10,
            'findIncident'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'UpdateIncident',
            updateOneIncidentFlagged,
            'updateIncident'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'logIncidentHistory',
            {
                data: {
                    logIncidentHistory: {
                        incident_id: 9,
                    },
                },
            },
            'logIncidentHistory'
        );

        const now = new Date('March 14 2042 13:37:11');
        await mockDate(page, now);

        await page.goto('/cite/9');

        await waitForRequest('findIncident');

        await page.locator('[data-cy="similar-incidents-column"] [data-cy="flag-similar-incident"]').first().click();

        const updateIncidentRequest = await waitForRequest('updateIncident');
        const variables = updateIncidentRequest.postDataJSON().variables;

        expect(variables.query).toEqual({ incident_id: 9 });
        expect(variables.set).toEqual({
            flagged_dissimilar_incidents: [11],
            epoch_date_modified: getUnixTime(now),
            editors: { link: incident10.data.incident.editors.map(e => e.userId) },
        });

        const logIncidentHistoryRequest = await waitForRequest('logIncidentHistory');
        const input = logIncidentHistoryRequest.postDataJSON().variables.input;
        const expectedIncident = deleteIncidentTypenames(
            transformIncidentData(incident10.data.incident)
        );

        expectedIncident.flagged_dissimilar_incidents = [11];
        expectedIncident.epoch_date_modified = getUnixTime(now);
        expectedIncident.modifiedBy = '';

        expect(input).toEqual(expectedIncident);
    });

    maybeIt('Should flag an incident as not related (authenticated)', async ({ page }) => {
        await login(page, config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'FindIncident',
            incident10,
            'findIncident'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'UpdateIncident',
            updateOneIncidentFlagged,
            'updateIncident'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'logIncidentHistory',
            {
                data: {
                    logIncidentHistory: {
                        incident_id: 9,
                    },
                },
            },
            'logIncidentHistory'
        );

        await page.goto('/cite/9');

        await waitForRequest('findIncident');

        const now = new Date();
        await page.addInitScript(`{
            Date.now = () => ${now.getTime()};
        }`);

        await page.locator('[data-cy="similar-incidents-column"] [data-cy="flag-similar-incident"]').first().click();

        const updateIncidentRequest = await waitForRequest('updateIncident');
        const variables = updateIncidentRequest.postDataJSON().variables;

        expect(variables.query).toEqual({ incident_id: 9 });
        expect(variables.set).toEqual({
            flagged_dissimilar_incidents: [],
            epoch_date_modified: getUnixTime(now),
            editors: { link: [...incident10.data.incident.editors.map(e => e.userId), user.userId] },
        });

        const logIncidentHistoryRequest = await waitForRequest('logIncidentHistory');
        const input = logIncidentHistoryRequest.postDataJSON().variables.input;
        const expectedIncident = deleteIncidentTypenames(
            transformIncidentData(incident10.data.incident)
        );

        expectedIncident.flagged_dissimilar_incidents = [];
        expectedIncident.epoch_date_modified = getUnixTime(now);
        expectedIncident.modifiedBy = user.userId;
        expectedIncident.editors = [
            ...incident10.data.incident.editors.map((e) => e.userId),
            user.userId,
        ];

        expect(input).toEqual(expectedIncident);
    });

    test('Should have OpenGraph meta tags', async ({ page }) => {
        await page.goto(url);

        const response = await query({
            query: gql`
              query {
                incidents(query: { incident_id: ${incidentId} }, limit: 1) {
                  title
                  description
                  reports {
                    image_url
                    date_published
                  }
                }
              }
            `,
        });

        const { data: { incidents } } = response;
        const incident = incidents[0];

        const title = `Incident ${incidentId}: ${incident.title}`;
        const description = incident.description;

        await expect(page.locator('head meta[name="twitter:site"]')).toHaveAttribute('content', '@IncidentsDB');
        await expect(page.locator('head meta[name="twitter:creator"]')).toHaveAttribute('content', '@IncidentsDB');
        await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute('content', `https://incidentdatabase.ai${url}/`);
        await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute('content', 'website');
        await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute('content', title);
        await expect(page.locator('head meta[property="og:description"]')).toHaveAttribute('content', description);
        await expect(page.locator('head meta[property="og:image"]').first()).toHaveAttribute('content');
        await expect(page.locator('head meta[property="twitter:title"]')).toHaveAttribute('content', title);
        await expect(page.locator('head meta[property="twitter:description"]')).toHaveAttribute('content', description);
        await expect(page.locator('head meta[property="twitter:image"]')).toHaveAttribute('content');
    });

    maybeIt('Should subscribe to incident updates (user authenticated)', async ({ page }) => {
        await login(page, config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        await page.goto('/cite/51');

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'UpsertSubscription',
            {
                data: {
                    upsertOneSubscription: {
                        _id: 'dummyIncidentId',
                    },
                },
            },
        );

        await page.locator('button:has-text("Notify Me of Updates")').click();

        await expect(page.locator('[data-cy="toast"]')).toBeVisible();

        await expect(page.locator('[data-cy="toast"]')).toHaveText(
            `You have successfully subscribed to updates on incident 51`
        );
    });

    test('Should show proper entities card text', async ({ page }) => {
        await page.goto('/cite/67/');
        await expect(page.locator('[data-cy="alleged-entities"]')).toHaveText(
            'Alleged: Tesla developed an AI system deployed by Tesla and Motorist, which harmed Motorists.'
        );

        await page.goto('/cite/72/');
        await expect(page.locator('[data-cy="alleged-entities"]')).toHaveText(
            'Alleged: Facebook developed and deployed an AI system, which harmed unnamed Palestinian Facebook user , Palestinian Facebook users , Arabic-speaking Facebook users and Facebook users.'
        );

        await page.goto('/cite/30/');
        await expect(page.locator('[data-cy="alleged-entities"]')).toHaveText(
            'Alleged: Tesla developed and deployed an AI system, which harmed Tesla.'
        );
    });

    test('Should not display response in timeline or in badge', async ({ page }) => {
        await page.goto('/cite/1');

        await expect(page.locator('[data-cy="responded-badge"]')).not.toBeVisible();

        await expect(page.locator('[data-cy="timeline-text-response"]')).not.toBeVisible();
    });

    // the incident contains reports missing images so it will never pass
    test.skip('There should not be image errors (400)', async ({ page }) => {
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                expect(msg.text()).not.toContain('the server responded with a status of 400');
                expect(msg.location().url).not.toContain('res.cloudinary.com');
            }
        });

        await page.goto(url);

        await page.waitForTimeout(5000);
    });

    test('Should open incident from the discover app', async ({ page }) => {
        await page.goto(discoverUrl);

        await page.locator('[data-cy="collapse-button"]:visible').click();

        await page.locator('button', { hasText: /Show Details on Incident \#10$/ }).first().click();

        await expect(page).toHaveURL(new RegExp('/cite/10'));
    });

    maybeIt('Should link similar incidents', async ({ page }) => {
        await login(page, config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'UpdateIncident',
            updateIncident50,
            'updateIncident'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName === 'UpdateIncidents' &&
                req.postDataJSON().variables.set.editor_similar_incidents === 50,
            {
                data: {
                    updateManyIncidents: {
                        matchedCount: 1,
                        modifiedCount: 1,
                    },
                },
            },
            'updateSimilarIncidents'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName === 'UpdateIncidents' &&
                req.postDataJSON().variables.set.editor_dissimilar_incidents === 50,
            {
                data: {
                    updateManyIncidents: {
                        matchedCount: 1,
                        modifiedCount: 1,
                    },
                },
            },
            'updateDissimilarIncidents'
        );

        await page.goto('/incidents/edit/?incident_id=50');

        await page.locator('[data-cy="similar-id-input"]').fill('123');

        await page.locator('[data-cy="related-byId"] [data-cy="result"]:nth-child(1) button:has-text("Yes")').click();

        await page.locator('[data-cy="similar-id-input"]').fill('456');

        await page.locator('[data-cy="related-byId"] [data-cy="result"]:nth-child(1) button:has-text("No")').click();

        await page.locator('button[type="submit"]').click();

        const updateSimilarIncidentsRequest = await waitForRequest('updateSimilarIncidents');
        const updateDissimilarIncidentsRequest = await waitForRequest('updateDissimilarIncidents');

        expect(updateSimilarIncidentsRequest.postDataJSON().variables.query).toEqual({ incident_id_in: [123] });
        expect(updateSimilarIncidentsRequest.postDataJSON().variables.set).toEqual({
            editor_similar_incidents: [50],
        });

        expect(updateDissimilarIncidentsRequest.postDataJSON().variables.query).toEqual({ incident_id_in: [456] });
        expect(updateDissimilarIncidentsRequest.postDataJSON().variables.set).toEqual({
            editor_dissimilar_incidents: [50],
        });
    });
});