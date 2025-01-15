import { query, mockDate, test, fillAutoComplete } from '../utils';
import { format } from 'date-fns';
import { gql } from '@apollo/client';
import { expect } from '@playwright/test';
import config from '../config';
import { init } from '../memory-mongo';
import { DBIncident } from '../../server/interfaces';

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

        await page.goto(url + '#' + _id);

        await page.locator(`[id="r${_id}"] [data-cy="expand-report-button"]`).click();
        await page.locator(`[id="r${_id}"] [data-cy="flag-button"]`).click();

        const modal = page.locator('[data-cy="flag-report-3"]');
        await expect(modal).toBeVisible();

        await modal.locator('[data-cy="flag-toggle"]').click();

        await expect(modal.locator('[data-cy="flag-toggle"]')).toBeDisabled();

        await page.locator('[aria-label="Close"]').click();

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

    test('Should remove duplicate', async ({ page, login }) => {

        test.slow();

        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await page.goto('/cite/3');

        await page.click('[data-cy="remove-duplicate"]');

        await fillAutoComplete(page, '#input-duplicateIncidentId', '2 incident', 'Incident 2');

        await page.click('[data-cy="confirm-remove-duplicate"]');

        await expect(page.locator('text=Incident 3 marked as duplicate')).toBeVisible({ timeout: 30000 });

        const { data } = await query({
            query: gql`
            {
                duplicates(filter: { duplicate_incident_number: { EQ: 3 } }) {
                    true_incident_number
                }
                incident_classifications_3: classifications(filter: { incidents: { EQ: 3 } }) {
                    namespace
                    notes
                    incidents { 
                        incident_id 
                    }
                }
                incident_classifications_2: classifications(filter: { incidents: { EQ: 2 } }) {
                    namespace
                    notes
                    incidents { 
                        incident_id 
                    }
                }
            }
            `,
        });

        expect(data.duplicates).toEqual([{ true_incident_number: 2 }]);
        expect(data.incident_classifications_3).toHaveLength(0);
        expect(data.incident_classifications_2).toHaveLength(4);
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

    test('Should render duplicate page', async ({ page }) => {
        await page.goto('/cite/5');

        await expect(page.getByText('This incident is a duplicate of Incident 3. All new reports and citations should be directed to incident 3. The reports previously found on this page have been migrated to the previously existing incident.')).toBeVisible();

        await expect(page.locator('a:has-text("Next Incident")')).toBeVisible();
        await expect(page.locator('a:has-text("Next Incident")')).toHaveAttribute('disabled');


        await expect(page.locator('a:has-text("Previous Incident")')).toBeVisible();
        await expect(page.locator('a:has-text("Previous Incident")')).toHaveAttribute('href', '/cite/3');
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
        const retrievedDate = format(new Date(), 'MMMMyyyy')

        await page.locator('button:has-text("Citation Info")').click();

        await expect(page.locator('[data-cy="citation-info-modal"]')).toBeVisible();

        const bibTextElement = await page.locator('[data-cy="bibtex-format"] code').textContent();
        const bibText = bibTextElement.replace(/(\r\n|\n|\r| |\s)/g, '');

        expect(bibText).toBe(
          `@article{aiid:3,author={Olsson,Catherine},editor={McGregor,Sean},journal={AIIncidentDatabase},publisher={ResponsibleAICollaborative},title={IncidentNumber3:KronosSchedulingAlgorithmAllegedlyCausedFinancialIssuesforStarbucksEmployees},url={https://incidentdatabase.ai/cite/3},year={2014},urldate={${date}},note={Retrieved${retrievedDate}from\\url{https://incidentdatabase.ai/cite/3}}}`
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

        await page.goto('/cite/3');

        await page.locator('[data-cy="similar-incidents-column"] [data-cy="flag-similar-incident"]').first().click();

        await expect(page.getByText('Incident flagged successfully. Our editors will remove it from this list if it not relevant.')).toBeVisible();

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

        await page.goto('/cite/3');

        await page.locator('[data-cy="similar-incidents-column"] [data-cy="flag-similar-incident"]').first().click();

        await expect(page.getByText('Incident flagged successfully. Our editors will remove it from this list if it not relevant.')).toBeVisible();

        
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

    test('Should subscribe to incident updates (user authenticated)', async ({ page, login }) => {

        await init();

        const [userId, accessToken] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['subscriber'] } });

        await page.goto('/cite/3');

        await page.locator('button:has-text("Notify Me of Updates")').click();

        await expect(page.locator('[data-cy="toast"]')).toHaveText(`You have successfully subscribed to updates on incident 3`);


        const { data } = await query({
            query: gql`
              query SubscriptionQuery($filter: SubscriptionFilterType!){
                subscriptions(filter: $filter) {
                  type
                  incident_id {
                    incident_id
                  }
                }
              }
            `,
            variables: { filter: { userId: { EQ: userId } } },
        },
            { authorization: `Bearer ${accessToken}` }
        );

        expect(data.subscriptions).toEqual([{ type: 'incident', incident_id: { incident_id: 3 } }]);
    });

    test('Should not show a spinner on notify button when not logged in', async ({ page, login }) => {

        const id = 'r1';

        await page.goto('/cite/1#' + id);

        await expect(page.locator('[data-cy="notify-button"] [data-cy="spinner"]')).toHaveCount(0);

    });

    test('Should show proper entities card text', async ({ page }) => {
        await page.goto('/cite/3/');
        await expect(page.locator('[data-cy="alleged-entities"]')).toHaveText(
            'Alleged: Kronos developed an AI system deployed by Starbucks, which harmed Starbucks Employees.Alleged implicated AI system: Entity 1'
        );
    });

    test('Should not display response in timeline or in badge', async ({ page }) => {
        await page.goto('/cite/1');

        await expect(page.locator('[data-cy="responded-badge"]')).not.toBeVisible();

        await expect(page.locator('[data-cy="timeline-text-response"]')).not.toBeVisible();
    });

    test('There should not be image errors (400)', async ({ page }) => {
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

        await page.goto('/incidents/edit/?incident_id=3');

        await fillAutoComplete(page, '#input-incidentSearch', '1 Incident', 'Incident 1');

        await page.locator('[data-cy="related-byId"] [data-cy="result"]:nth-child(1)').getByText("Yes").click();

        await fillAutoComplete(page, '#input-incidentSearch', '2 Incident', 'Incident 2');

        await page.locator('[data-cy="related-byId"] [data-cy="result"]:nth-child(1)').getByText('No', { exact: true }).click();

        await page.getByText('Save').click();

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

        await init();

        const incident: DBIncident = {
            incident_id: 4,
            title: 'Test Title',
            description: 'Incident 4 description',
            date: "2020-01-01",
            "Alleged deployer of AI system": ["entity-1"],
            "Alleged developer of AI system": ["entity-2"],
            "Alleged harmed or nearly harmed parties": ["entity-3"],
            editors: ["user1"],
            reports: [1],
            editor_notes: "This is an editor note",
            flagged_dissimilar_incidents: []
        }

        await init({ aiidprod: { incidents: [incident] } });

        await page.goto('/cite/4');

        await expect(page.getByText('Incident 4: Test Title')).toBeVisible();
        await expect(page.getByText('Incident 4 description')).toBeVisible();
        await expect(page.getByText('Alleged: Entity 2 developed an AI system deployed by Entity 1, which harmed Entity 3.')).toBeVisible()
    });
  
    test('Should not show Annotator taxonomies', async ({ page, login }) => {

        await page.goto('/cite/3');

        await expect(page.locator(`[data-cy="taxonomy-tag-CSETv1"]`)).toHaveCount(1);
        await expect(page.locator(`[data-cy="taxonomy-tag-CSETv1_Annotator"]`)).toHaveCount(0);

    });
});
