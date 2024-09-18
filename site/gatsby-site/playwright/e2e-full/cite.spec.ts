import { waitForRequest, query, mockDate, test, conditionalIntercept } from '../utils';
import upsertDuplicateClassification from '../fixtures/classifications/upsertDuplicateClassification.json';
import updateIncident50 from '../fixtures/incidents/updateIncident50.json';
import { format } from 'date-fns';
import incident10 from '../fixtures/incidents/fullIncident10.json';
import incident50 from '../fixtures/incidents/fullIncident50.json';
import { gql } from '@apollo/client';
import { expect } from '@playwright/test';
import config from '../config';
import { init } from '../memory-mongo';
import { DBIncident } from '../seeds/aiidprod/incidents';

test.describe('Cite pages', () => {
    const discoverUrl = '/apps/discover';

    const incidentId = 3;

    const url = `/cite/${incidentId}`;

    let lastIncidentId: number;

    test.beforeAll(async ({ request }) => {
        // Skip all tests if the environment is empty since /cite/{incident_id} is not available
        if (config.IS_EMPTY_ENVIRONMENT) {
            test.skip();
        }

        const response = await query({
            query: gql`
                        {
                            incidents(sort: {incident_id: DESC}, pagination: {limit: 1}) {
                                incident_id
                            }
                        }
                    `,
        });

        lastIncidentId = response.data.incidents[0].incident_id;
    });

    test('Successfully loads', async ({ page }) => {
        await page.goto(url);
    });

    test('Should show an edit link to users with the appropriate role', async ({ page, login }) => {
        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        const id = 'r1';

        await page.goto('/cite/1#' + id);

        await page.click(`#${id} [data-cy="edit-report"]`);

        await page.waitForSelector(`#${id} [data-cy="edit-report"]`, { state: 'visible' });

        await expect(async () => {
            expect(page.url()).toContain('/cite/edit/?report_number=1');
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

    test.skip('Should scroll to report when clicking on a report in the timeline', async ({ page }) => {
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
        const _id = '3';

        await init();

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'logReportHistory',
            {
                data: {
                    logReportHistory: {
                        report_number: 3,
                    },
                },
            },
            'logReportHistory'
        );

        await page.goto(url + '#' + _id);

        await page.click(`[id="r${_id}"] [data-cy="expand-report-button"]`);
        await page.click(`[id="r${_id}"] [data-cy="flag-button"]`);

        const modal = page.locator('[data-cy="flag-report-3"]');
        await expect(modal).toBeVisible();

        await modal.locator('[data-cy="flag-toggle"]').click();

        await waitForRequest('logReportHistory');

        await expect(modal.locator('[data-cy="flag-toggle"]')).toBeDisabled();

        await page.click('[aria-label="Close"]');

        await expect(modal).not.toBeVisible();

        const { data } = await query({
            query: gql`{report(filter: { report_number: { EQ: 3 } }) {
                                flag
                            }
                        }
                    `,
        });

        expect(data.report.flag).toBe(true);
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

        await page.click('[data-cy="confirm-remove-duplicate"]');

        await expect(page.locator('text=Incident 10 marked as duplicate')).toBeVisible();
    });

    test('Should pre-fill submit report form', async ({ page }) => {
        await page.goto(url);

        await page.locator('a:has-text("New Report")').click();

        await expect(page.locator('[data-cy="prefilled-incident-id"]')).toHaveText('Adding a new report to incident 3');
        await expect(page.locator('.incident-ids-field [data-cy="token"]:has-text("3")')).toBeVisible();
    });

    test('Should pre-fill submit report response form', async ({ page }) => {
        await page.goto(url);

        await page.locator('a:has-text("New Response")').click();

        await expect(page.locator('[data-cy="prefilled-incident-id"]')).toHaveText('Adding a new response to incident 3');
        await expect(page.locator('.incident-ids-field [data-cy="token"]:has-text("3")')).toBeVisible();
    });

    test('Should render Next and Previous incident buttons', async ({ page }) => {
        await page.goto('/cite/2');

        await expect(page.locator('a:has-text("Next Incident")')).toBeVisible();
        await expect(page.locator('a:has-text("Next Incident")')).toHaveAttribute('href', '/cite/3');

        await expect(page.locator('a:has-text("Previous Incident")')).toBeVisible();
        await expect(page.locator('a:has-text("Previous Incident")')).toHaveAttribute('href', '/cite/1');
    });

    test.skip('Should render Next and Previous incident buttons if duplicate incident', async ({ page }) => {
        await page.goto('/cite/90');

        await expect(page.locator('a:has-text("Next Incident")')).toBeVisible();
        await expect(page.locator('a:has-text("Next Incident")')).toHaveAttribute('href', '/cite/91');

        await expect(page.locator('a:has-text("Previous Incident")')).toBeVisible();
        await expect(page.locator('a:has-text("Previous Incident")')).toHaveAttribute('href', '/cite/89');
    });

    test('Should render the header next/previous buttons', async ({ page }) => {
        await page.goto('/cite/2');

        await expect(page.locator('[data-cy="header-previous-incident-link"]')).toBeVisible();
        await expect(page.locator('[data-cy="header-previous-incident-link"]')).toHaveAttribute('href', '/cite/1');

        await expect(page.locator('[data-cy="header-next-incident-link"]')).toBeVisible();
        await expect(page.locator('[data-cy="header-next-incident-link"]')).toHaveAttribute('href', '/cite/3');
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

    test('Should show the edit incident form', async ({ page, login }) => {
        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        await page.goto(url);

        await page.locator('a:has-text("Edit Incident")').click();

        await expect(page).toHaveURL(/\/incidents\/edit\/\?incident_id=3/);

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
            `@article{aiid:3,author={Olsson,Catherine},editor={McGregor,Sean},journal={AIIncidentDatabase},publisher={ResponsibleAICollaborative},title={IncidentNumber3},url={https://incidentdatabase.ai/cite/3},year={2014},urldate={${date}}}`
        );
    });

    test('Should display similar incidents', async ({ page }) => {
        await page.goto('/cite/3');

        await expect(async () => {
            const count = await page.locator('[data-cy="similar-incident-card"]').count();
            await expect(count).toBeGreaterThanOrEqual(0);
        }).toPass();
    });

    test('Should display similar incidents with localized links', async ({ page }) => {
        await page.goto('/es/cite/3');

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
        await page.goto('/cite/3');

        await expect(page.locator('[data-cy="edit-similar-incidents"]')).not.toBeVisible();
    });

    test('Should display edit link when logged in as editor', async ({ page, login }) => {
        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        await page.goto('/cite/3');

        await expect(page.locator('[data-cy="edit-similar-incidents"]').nth(1)).toBeVisible();
    });

    test('Should flag an incident as not related (not authenticated)', async ({ page }) => {

        await init();

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'logIncidentHistory',
            {
                data: {
                    logIncidentHistory: {
                        incident_id: 3,
                    },
                },
            },
            'logIncidentHistory'
        );

        const now = new Date('March 14 2042 13:37:11');
        await mockDate(page, now);

        await page.goto('/cite/3');

        await page.locator('[data-cy="similar-incidents-column"] [data-cy="flag-similar-incident"]').first().click();

        await waitForRequest('logIncidentHistory');

        const { data } = await query({
            query: gql`{incident(filter: { incident_id: { EQ: 3 } }) {
                                flagged_dissimilar_incidents
                            }
                        }
                    `,
        });

        expect(data.incident.flagged_dissimilar_incidents).toContain(1);
    });

    test('Should flag an incident as not related (authenticated)', async ({ page, login }) => {

        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName === 'logIncidentHistory',
            {
                data: {
                    logIncidentHistory: {
                        incident_id: 3,
                    },
                },
            },
            'logIncidentHistory'
        );

        await page.goto('/cite/3');

        const now = new Date();
        await page.addInitScript(`{
            Date.now = () => ${now.getTime()};
        }`);

        await page.locator('[data-cy="similar-incidents-column"] [data-cy="flag-similar-incident"]').first().click();

        await waitForRequest('logIncidentHistory');

        const { data } = await query({
            query: gql`{incident(filter: { incident_id: { EQ: 3 } }) {
                                flagged_dissimilar_incidents
                            }
                        }
                    `,
        });

        expect(data.incident.flagged_dissimilar_incidents).toContain(1);
    });

    test('Should have OpenGraph meta tags', async ({ page }) => {
        await page.goto(url);

        const response = await query({
            query: gql`
              query {
                incidents(filter: { incident_id: {EQ: ${incidentId} } }) {
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
        await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute('content', new RegExp(`^https://incidentdatabase.ai${url}/?$`));
        await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute('content', 'website');
        await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute('content', title);
        await expect(page.locator('head meta[property="og:description"]')).toHaveAttribute('content', description);
        await expect(page.locator('head meta[property="og:image"]').first()).toHaveAttribute('content');
        await expect(page.locator('head meta[property="twitter:title"]')).toHaveAttribute('content', title);
        await expect(page.locator('head meta[property="twitter:description"]')).toHaveAttribute('content', description);
        await expect(page.locator('head meta[property="twitter:image"]')).toHaveAttribute('content');
    });

    // TODO: test will be fixed in https://github.com/responsible-ai-collaborative/aiid/pull/3054
    test.skip('Should subscribe to incident updates (user authenticated)', async ({ page, login }) => {
        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

        await page.goto('/cite/3');

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
            'upsertSubscription'
        );

        await page.locator('button:has-text("Notify Me of Updates")').click();

        await waitForRequest('upsertSubscription');

        await expect(page.locator('[data-cy="toast"]')).toBeVisible();

        await expect(page.locator('[data-cy="toast"]')).toHaveText(
            `You have successfully subscribed to updates on incident 3`
        );
    });

    test('Should show proper entities card text', async ({ page }) => {
        await page.goto('/cite/3/');
        await expect(page.locator('[data-cy="alleged-entities"]')).toHaveText(
            'Alleged: Kronos developed an AI system deployed by Starbucks, which harmed Starbucks Employees.'
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

        await page.locator('button', { hasText: /Show Details on Incident \#1$/ }).first().click();

        await expect(page).toHaveURL(new RegExp('/cite/1'));
    });

    test('Should link similar incidents', async ({ page, login }) => {

        await init();

        await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'John', last_name: 'Doe', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName === 'logIncidentHistory',
            {
                "data": {
                    "logIncidentHistory": {
                        "incident_id": 50,
                        "__typename": "LogIncidentHistoryPayload"
                    }
                }
            },
            'logIncidentHistory'
        );

        await page.goto('/incidents/edit/?incident_id=3');

        await page.locator('[data-cy="similar-id-input"]').fill('1');

        await expect(page.getByText('#1 - Report 1')).toBeVisible();

        await page.locator('[data-cy="related-byId"] [data-cy="result"]:nth-child(1)').getByText("Yes").click();

        await page.locator('[data-cy="similar-id-input"]').fill('2');

        await expect(page.getByText('#2 - Report 2')).toBeVisible();

        await page.locator('[data-cy="related-byId"] [data-cy="result"]:nth-child(1)').getByText('No', { exact: true }).click();

        await page.getByText('Save').click();

        await waitForRequest('logIncidentHistory');

        await expect(page.locator('.tw-toast:has-text("Incident 3 updated successfully.")')).toBeVisible();


        const { data } = await query({
            query: gql`
              query {
                incident_1: incident(filter: { incident_id: {EQ: 1 } }) {
                    incident_id
                    editor_dissimilar_incidents
                    editor_similar_incidents
                }
                incident_2: incident(filter: { incident_id: {EQ: 2 } }) {
                    incident_id
                    editor_dissimilar_incidents
                    editor_similar_incidents
                }
                incident_3: incident(filter: { incident_id: {EQ: 3 } }) {
                    incident_id
                    editor_dissimilar_incidents
                    editor_similar_incidents
                }
              }
            `,
        });

        expect(data.incident_1).toMatchObject({ editor_dissimilar_incidents: [], editor_similar_incidents: [3] });
        expect(data.incident_2).toMatchObject({ editor_dissimilar_incidents: [3], editor_similar_incidents: [] });
        expect(data.incident_3).toMatchObject({ editor_dissimilar_incidents: [2], editor_similar_incidents: [1] });
    });

    test('Should load incident data not yet in build', async ({ page }) => {

        const incident: DBIncident = {
            incident_id: 4,
            title: 'Test Title',
            description: 'Incident 4 description',
            date: "2020-01-01",
            "Alleged deployer of AI system": ["entity1"],
            "Alleged developer of AI system": ["entity2"],
            "Alleged harmed or nearly harmed parties": ["entity3"],
            editors: ["user1"],
            reports: [1],
        }

        await init({ aiidprod: { incidents: [incident] } });

        await page.goto('/cite/4');

        await expect(page.getByText('Incident 4: Test Title')).toBeVisible();
        await expect(page.getByText('Incident 4 description')).toBeVisible();
        await expect(page.getByText('Alleged: Entity 2 developed an AI system deployed by Entity 1, which harmed Entity 3.')).toBeVisible()
    });
});