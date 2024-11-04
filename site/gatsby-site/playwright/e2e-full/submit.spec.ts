import parseNews from '../fixtures/api/parseNews.json';
import { conditionalIntercept, waitForRequest, setEditorText, test, trackRequest, query, fillAutoComplete } from '../utils';
import { expect } from '@playwright/test';
import config from '../config';
import { init } from '../memory-mongo';
import gql from 'graphql-tag';


test.describe('The Submit form', () => {
    const url = '/apps/submit';
    const parserURL = '/api/parseNews**';

    // Listen for the dialog and handle it
    test.beforeEach(async ({ page }) => {
      page.once('dialog', async dialog => {
        const dialogMessage = dialog.message();
        if (dialogMessage.includes('Please confirm you are ready to submit this report. Report details cannot be changed after submission.') || dialogMessage.includes('Por favor confirma que estás listo para enviar este informe. Los detalles del informe no se pueden cambiar después de la presentación.') || dialogMessage.includes('Veuillez confirmer que vous êtes prêt à soumettre ce rapport. Les détails du rapport ne peuvent pas être modifiés après la soumission.') || dialogMessage.includes('このレポートを送信する準備ができていることを確認してください。送信後にレポートの詳細を変更することはできません')) {
          await dialog.accept();
        }
      });
    });

    test('Successfully loads', async ({ page }) => {
        await page.goto(url);
    });

    test('Should submit a new report not linked to any incident once all fields are filled properly', async ({ page }) => {

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews'
        );

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        await page.locator('input[name="url"]').fill(
            `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
        );

        await page.locator('button:has-text("Fetch info")').click();

        await waitForRequest('parseNews');

        await page.locator('[name="incident_date"]').fill('2020-01-01');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('input[name="submitters"]').fill('Something');

        await page.locator('[name="language"]').selectOption('Spanish');

        await page.locator('[data-cy="to-step-3"]').click();

        await expect(page.locator('[name="incident_title"]')).not.toBeVisible();

        await page.locator('[name="description"]').fill('Description');

        await expect(page.locator('[name="incident_editors"]')).not.toBeVisible();

        await page.locator('[name="tags"]').fill('New Tag');
        await page.keyboard.press('Enter');

        await page.locator('[name="editor_notes"]').fill('Here are some notes');

        await page.locator('button[type="submit"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();

        const { data } = await query({
            query: gql`
              query {
                submission(sort: { _id: DESC }){
                    _id
                    title
                    text
                    authors
                    incident_ids
                    incident_editors {
                        userId
                    }
                }
              }
            `,
        });

        expect(data.submission).toMatchObject({
            title: "YouTube to crack down on inappropriate content masked as kids’ cartoons",
            text: parseNews.text,
            authors: ["Valentina Palladino"],
            incident_ids: [],
            incident_editors: [],
        });
    });

    test('Should autocomplete entities', async ({ page, skipOnEmptyEnvironment }) => {

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews'
        );

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        await page.locator('input[name="url"]').fill(
            `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
        );

        await page.locator('button:has-text("Fetch info")').click();

        await waitForRequest('parseNews');

        await page.locator('[name="incident_date"]').fill('2020-01-01');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('[data-cy="to-step-3"]').click();

        await page.locator('input[name="deployers"]').fill('Entity 1');

        await page.locator('#deployers-tags .dropdown-item[aria-label="Entity 1"]').click();

        await page.locator('input[name="deployers"]').fill('NewDeployer');
        await page.keyboard.press('Enter');
        await page.locator('button[type="submit"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();
        await expect(page.locator(':text("Please review. Some data is missing.")')).not.toBeVisible();
    });

    test('As editor, should submit a new incident report, adding an incident title and editors.', async ({ page, login, skipOnEmptyEnvironment }) => {

        await init();

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Cesar', last_name: 'Ito', roles: ['admin'] } });

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews'
        );

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindUsers',
            'findUsers'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        await page.locator('input[name="url"]').fill(
            `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
        );

        await page.locator('button:has-text("Fetch info")').click();

        await waitForRequest('parseNews');

        await page.locator('[name="incident_date"]').fill('2020-01-01');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('[name="language"]').selectOption('Spanish');

        await page.locator('[data-cy="to-step-3"]').click();

        await waitForRequest('findUsers');

        await page.locator('[name="incident_title"]').fill('Elsagate');

        await page.locator('[name="description"]').fill('Description');

        await fillAutoComplete(page, "#input-incident_editors", 'Ces', 'Cesar Ito');

        await page.locator('[name="tags"]').fill('New Tag');
        await page.keyboard.press('Enter');

        await page.locator('[name="editor_notes"]').fill('Here are some notes');

        await page.locator('button[type="submit"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue")')).toBeVisible();

        await expect(page.locator('.tw-toast a')).toHaveAttribute('href', '/apps/submitted/');

        await expect(page.locator(':text("Please review. Some data is missing.")')).not.toBeVisible();


        const { data } = await query({
            query: gql`
              query {
                submission(sort: { _id: DESC }){
                    _id
                    title
                    text
                    authors
                    incident_ids
                    incident_editors {
                        userId
                    }
                }
              }
            `,
        });

        expect(data.submission).toMatchObject({
            title: "YouTube to crack down on inappropriate content masked as kids’ cartoons",
            text: parseNews.text,
            authors: ["Valentina Palladino"],
            incident_ids: [],
            incident_editors: [{ userId }],
        });
    });

    test('Should submit a new report linked to incident 1 once all fields are filled properly', async ({ page, login, skipOnEmptyEnvironment }) => {

        await init();

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews'
        );

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findInitialSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findInitialSubmissions');

        await page.locator('input[name="url"]').fill(
            `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
        );

        await page.locator('button:has-text("Fetch info")').click();

        await waitForRequest('parseNews');

        await setEditorText(
            page,
            `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube. While all content on YouTube Kids is meant to be suitable for children under the age of 13, some inappropriate videos using animations, cartoons, and child-focused keywords manage to get past YouTube's algorithms and in front of kids' eyes. Now, YouTube will implement a new policy in an attempt to make the whole of YouTube safer: it will age-restrict inappropriate videos masquerading as children's content in the main YouTube app.`
        );

        await page.locator('[data-cy=related-byText] [data-cy=result] [data-cy=set-id]:has-text("#1")').first().click();

        await page.locator('[data-cy=related-byText] [data-cy=result] [data-cy="similar-selector"] [data-cy="similar"]').last().click();

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('[data-cy="to-step-3"]').click();

        await expect(page.locator('[name="incident_title"]')).not.toBeVisible();

        await expect(page.locator('[name="description"]')).not.toBeVisible();

        await expect(page.locator('[name="incident_editors"]')).not.toBeVisible();

        await page.locator('[name="tags"]').fill('New Tag');
        await page.keyboard.press('Enter');

        await page.locator('[name="editor_notes"]').fill('Here are some notes');

        await page.locator('button[type="submit"]').click();

        await expect(page.locator(':text("Report successfully added to review queue")')).toBeVisible();


        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await page.goto('/apps/submitted');

        await expect(page.locator('[data-cy="row"]:has-text("YouTube to crack down on inappropriate content masked as kids’ cartoons")')).toBeVisible();
    });

    test('Should show a toast on error when failing to reach parsing endpoint', async ({ page }) => {
        await page.goto(url);

        await page.route(parserURL, route => route.abort('failed'));

        await page.locator('input[name="url"]').fill(
            `https://www.cbsnews.com/news/is-starbucks-shortchanging-its-baristas/`
        );

        await page.locator('button:has-text("Fetch info")').click();

        await page.waitForSelector('.tw-toast:has-text("Error reaching news info endpoint, please try again in a few seconds.")');
    });

    test('Should pull parameters from the query string and auto-fill fields', async ({ page }) => {

        const values = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'test author',
            submitters: 'test submitter',
            incident_date: '2022-01-01',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
            image_url: 'https://incidentdatabase.ai/image.jpg',
            incident_ids: [1],
            text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
            tags: 'test tag',
            editor_notes: 'Here are some notes',
        };

        const params = new URLSearchParams(values);

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            {
                title: 'test title',
                authors: 'test author',
                date_published: '2021-01-02',
                date_downloaded: '2021-01-03',
                image_url: 'https://incidentdatabase.ai/image.jpg',
                text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
            },
            'parseNews'
        );

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url + `?${params.toString()}`);

        await waitForRequest('parseNews');

        await waitForRequest('findSubmissions');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('[data-cy="to-step-3"]').click();

        await page.locator('button[type="submit"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue")')).toBeVisible();
    });

    test('Should submit a submission and link it to the current user id', async ({ page, login, skipOnEmptyEnvironment }) => {

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        const values = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'test author',
            incident_date: '2022-01-01',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
            image_url: 'https://incidentdatabase.ai/image.jpg',
            incident_ids: [1],
            text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
            tags: 'test tag',
            editor_notes: 'Here are some notes',
        };

        const params = new URLSearchParams(values);

        await page.route(parserURL, route => route.fulfill({
            body: JSON.stringify({
                title: 'test title',
                authors: 'test author',
                date_published: '2021-01-02',
                date_downloaded: '2021-01-03',
                image_url: 'https://incidentdatabase.ai/image.jpg',
                text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
            })
        }));


        await page.goto(url + `?${params.toString()}`);

        await waitForRequest('findIncidentsTitles');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('[data-cy="to-step-3"]').click();

        await page.locator('button[type="submit"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue")')).toBeVisible();


        const { data } = await query({
            query: gql`
              query {
                submission(sort: { _id: DESC }){
                    _id
                    title
                    text
                    authors
                    incident_ids
                    user {
                        userId
                    }
                }
              }
            `,
        });

        expect(data.submission).toMatchObject({
            user: { userId },
        });
    });


    test.skip('Should show a list of related reports', async ({ page, skipOnEmptyEnvironment }) => {

        const relatedReports = {
            byURL: {
                data: {
                    reports: [
                        {
                            __typename: 'Report',
                            report_number: 1501,
                            title: 'Zillow to exit its home buying business, cut 25% of staff',
                            url: 'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
                        },
                    ],
                },
            },
            byDatePublished: {
                data: {
                    reports: [
                        {
                            __typename: 'Report',
                            report_number: 810,
                            title: "Google's Nest Stops Selling Its Smart Smoke Alarm For Now Due To Faulty Feature",
                            url: 'https://www.forbes.com/sites/aarontilley/2014/04/03/googles-nest-stops-selling-its-smart-smoke-alarm-for-now',
                        },
                        {
                            __typename: 'Report',
                            report_number: 811,
                            title: 'Why Nest’s Smoke Detector Fail Is Actually A Win For Everyone',
                            url: 'https://readwrite.com/2014/04/04/nest-smoke-detector-fail/',
                        },
                    ],
                },
            },
            byAuthors: {
                data: { reports: [] },
            },
            byIncidentId: {
                data: {
                    incidents: [
                        {
                            __typename: 'Incident',
                            incident_id: 1,
                            title: 'Google’s YouTube Kids App Presents Inappropriate Content',
                            reports: [
                                {
                                    __typename: 'Report',
                                    report_number: 10,
                                    title: 'Google’s YouTube Kids App Presents Inappropriate Content',
                                    url: 'https://www.change.org/p/remove-youtube-kids-app-until-it-eliminates-its-inappropriate-content',
                                },
                            ],
                        },
                    ],
                },
            },
        };

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName == 'ProbablyRelatedReports' &&
                req.postDataJSON().variables.query?.url_in,
            relatedReports.byURL,
            'RelatedReportsByURL'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName == 'ProbablyRelatedReports' &&
                req.postDataJSON().variables.query?.epoch_date_published_gt &&
                req.postDataJSON().variables.query?.epoch_date_published_lt,
            relatedReports.byDatePublished,
            'RelatedReportsByPublishedDate'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName == 'ProbablyRelatedReports' &&
                req.postDataJSON().variables.query?.authors_in?.length,
            relatedReports.byAuthors,
            'RelatedReportsByAuthor'
        );

        const values = {
            url: 'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
            authors: 'test author',
            date_published: '2014-03-30',
            incident_ids: 1,
        };

        for (const key in values) {
            if (key == 'incident_ids') {
                await page.locator(`input[name="${key}"]`).fill(values[key].toString());
                await page.waitForSelector(`[role="option"]`);
                await page.locator(`[role="option"]`).first().click();
            } else {
                await page.locator(`input[name="${key}"]`).fill(values[key]);
            }
        }

        await waitForRequest('RelatedReportsByAuthor');
        await waitForRequest('RelatedReportsByURL');
        await waitForRequest('RelatedReportsByPublishedDate');

        for (const key of ['byURL', 'byDatePublished']) {
            const reports =
                key == 'byIncidentId'
                    ? relatedReports[key].data.incidents[0].reports
                    : relatedReports[key].data.reports;

            const parentLocator = page.locator(`[data-cy="related-${key}"]`);

            await expect(async () => {
                await expect(parentLocator.locator('[data-cy="result"]')).toHaveCount(reports.length);
            }).toPass();

            for (const report of reports) {
                await expect(parentLocator.locator('[data-cy="result"]', { hasText: report.title })).toBeVisible();
            }

        }

        await expect(page.locator(`[data-cy="related-byAuthors"]`).locator('[data-cy="no-related-reports"]')).toHaveText('No related reports found.');
    }
    );

    test.skip('Should show a preliminary checks message', async ({ page }) => {
        const relatedReports = {
            byURL: {
                data: {
                    reports: [],
                },
            },
            byDatePublished: {
                data: {
                    reports: [],
                },
            },
            byAuthors: {
                data: { reports: [] },
            },
            byIncidentId: {
                data: {
                    incidents: [],
                },
            },
        };

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName == 'ProbablyRelatedReports' &&
                req.postDataJSON().variables.query?.url_in?.[0] ==
                'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
            relatedReports.byURL,
            'RelatedReportsByURL'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName == 'ProbablyRelatedReports' &&
                req.postDataJSON().variables.query?.epoch_date_published_gt == 1608346800 &&
                req.postDataJSON().variables.query?.epoch_date_published_lt == 1610766000,
            relatedReports.byDatePublished,
            'RelatedReportsByPublishedDate'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) =>
                req.postDataJSON().operationName == 'ProbablyRelatedReports' &&
                req.postDataJSON().variables.query?.authors_in?.[0] == 'test author',
            relatedReports.byAuthors,
            'RelatedReportsByAuthor'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            { data: { submissions: [] } },
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        const values = {
            url: 'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
            authors: 'test author',
            date_published: '2021-01-02',
            incident_ids: '1',
        };

        for (const key in values) {
            if (key == 'incident_ids') {
                await page.locator(`input[name="${key}"]`).fill(values[key]);
                await page.waitForSelector(`[role="option"]`);
                await page.locator(`[role="option"]`).first().click();
            } else {
                await page.locator(`input[name="${key}"]`).fill(values[key]);
            }
        }


        await waitForRequest('RelatedReportsByAuthor')
        await waitForRequest('RelatedReportsByURL')
        await waitForRequest('RelatedReportsByPublishedDate')

        await expect(page.locator('[data-cy="no-related-reports"]').first()).toBeVisible();

        await expect(page.locator('[data-cy="result"]')).not.toBeVisible();
    });

    test('Should *not* show semantically related reports when the text is under 256 non-space characters', async ({ page }) => {

        await page.goto(url);

        await setEditorText(
            page,
            `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube.`
        );

        await expect(page.locator('[data-cy=related-byText]')).toContainText('Reports must have at least');
    });

    test('Should *not* show related orphan reports', async ({ page, skipOnEmptyEnvironment }) => {
        await page.goto(url);

        const values = {
            authors: 'Ashley Belanger',
        };

        for (const key in values) {
            await page.locator(`input[name="${key}"]`).fill(values[key]);
        }

        await expect(page.locator('[data-cy=related-byAuthors] [data-cy=result] a[data-cy=title]:has-text("Thousands scammed by AI voices mimicking loved ones in emergencies")'))
            .not.toBeVisible();
    });

    test.skip('Should show fallback preview image on initial load', async ({ page }) => {
        const values = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'test author',
            submitters: 'test submitter',
            incident_date: '2022-01-01',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
            incident_id: '1',
        };

        const params = new URLSearchParams(values);

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews',
        );

        await page.goto(url + `?${params.toString()}`);

        await waitForRequest('parseNews');

        await setEditorText(
            page,
            `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube. While all content on YouTube Kids is meant to be suitable for children under the age of 13, some inappropriate videos using animations, cartoons, and child-focused keywords manage to get past YouTube's algorithms and in front of kids' eyes. Now, YouTube will implement a new policy in an attempt to make the whole of YouTube safer: it will age-restrict inappropriate videos masquerading as children's content in the main YouTube app.`
        );

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await expect(page.locator('[data-cy="image-preview-figure"] canvas')).toBeVisible();
    });

    test('Should update preview image when url is typed', async ({ page }) => {
        const values = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'test author',
            submitters: 'test submitter',
            incident_date: '2022-01-01',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
            incident_id: '1',
        };

        const params = new URLSearchParams(values);

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews',
        );

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url + `?${params.toString()}`);

        await waitForRequest('findSubmissions');

        await waitForRequest('parseNews');


        const suffix = 'github.com/favicon.ico';
        const newImageUrl = 'https://' + suffix;
        const cloudinaryImageUrl = 'https://res.cloudinary.com/pai/image/upload/f_auto/q_auto/v1/reports/' + suffix;

        await setEditorText(
            page,
            `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube. While all content on YouTube Kids is meant to be suitable for children under the age of 13, some inappropriate videos using animations, cartoons, and child-focused keywords manage to get past YouTube's algorithms and in front of kids' eyes. Now, YouTube will implement a new policy in an attempt to make the whole of YouTube safer: it will age-restrict inappropriate videos masquerading as children's content in the main YouTube app.`
        );

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('input[name=image_url]').fill(newImageUrl);

        await expect(page.locator('[data-cy=image-preview-figure] img')).toHaveAttribute('src', cloudinaryImageUrl);
    });

    test('Should show the editor notes field', async ({ page }) => {

        await page.goto(url);

        const valuesStep1 = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'test author',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
            incident_date: '2022-01-01',
        };

        for (const key in valuesStep1) {
            await page.locator(`input[name="${key}"]`).fill(valuesStep1[key]);
        }

        await setEditorText(
            page,
            'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease'
        );

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        const valuesStep2 = {
            submitters: 'test submitter',
            image_url: 'https://incidentdatabase.ai/image.jpg',
        };

        for (const key in valuesStep2) {
            await page.locator(`input[name="${key}"]`).fill(valuesStep2[key]);
        }

        await page.mouse.click(0, 0);

        await page.locator('[data-cy="to-step-3"]').click();

        const valuesStep3 = {
            editor_notes: 'Here are some notes',
        };

        for (const key in valuesStep3) {
            await page.locator(`textarea[name="${key}"]`).fill(valuesStep3[key]);
        }

        await expect(page.locator('[name="editor_notes"]')).toBeVisible();
    });

    test('Should show a popover', async ({ page }) => {
        await page.goto(url);

        await page.locator('[data-cy="label-title"]').hover();

        await expect(page.locator('[data-cy="popover-title"]')).toBeVisible();

        await expect(page.locator('[data-cy="popover-title"] h5')).toHaveText('Headline');

        await expect(page.locator('[data-cy="popover-title"] div')).toContainText('Most works have a title');
    });

    test('Should show a translated popover', async ({ page }) => {
        await page.goto(`/es/apps/submit/`);

        await page.locator('[data-cy="label-title"]').hover();

        await expect(page.locator('[data-cy="popover-title"]')).toBeVisible();

        await expect(page.locator('[data-cy="popover-title"] h5')).toHaveText('Título');

        await expect(page.locator('[data-cy="popover-title"] div')).toContainText('La mayoría de los trabajos tienen un');
    });

    test('Should work with translated page', async ({ page }) => {

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews',
        );

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(`/es/apps/submit/`);

        await waitForRequest('findSubmissions');

        await page.locator('input[name="url"]').fill(
            `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
        );

        await page.locator('[data-cy="fetch-info"]').click();

        await waitForRequest('parseNews');

        await page.locator('input[name="authors"]').fill('Something');

        await page.locator('[name="incident_date"]').fill('2020-01-01');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('input[name="submitters"]').fill('Something');

        await page.locator('[data-cy="to-step-3"]').click();

        await page.locator('[name="editor_notes"]').fill('Here are some notes');

        await page.locator('button[type="submit"]').click();

        await expect(page.locator('.tw-toast:has-text("Informe agregado exitosamente a la cola de revisión.")')).toBeVisible();
    });

    test('Should submit on step 1', async ({ page }) => {

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews',
        );

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        await page.locator('input[name="url"]').fill(
            `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
        );

        await page.locator('[data-cy="fetch-info"]').click();

        await waitForRequest('parseNews');

        await page.locator('input[name="authors"]').fill('Something');

        await page.locator('[name="incident_date"]').fill('2020-01-01');

        await page.locator('[data-cy="submit-step-1"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();
    });

    test('Should submit on step 2', async ({ page }) => {

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews'
        );

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        await page.locator('input[name="url"]').fill(
            `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
        );

        await page.locator('[data-cy="fetch-info"]').click();

        await waitForRequest('parseNews');

        await page.locator('input[name="authors"]').fill('Something');

        await page.locator('[name="incident_date"]').fill('2020-01-01');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('input[name="submitters"]').fill('Something');

        await page.locator('[data-cy="submit-step-2"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();

        const keys = ['url', 'title', 'authors', 'incident_date'];

        for (const key of keys) {
            await expect(page.locator(`input[name="${key}"]`)).toHaveValue('');
        }
    });

    test('Should display an error message if data is missing', async ({ page }) => {

        await page.goto(url);

        await page.locator('button:has-text("Submit")').click();

        await expect(page.locator('text=Please review. Some data is missing.')).toBeVisible();
    });

    test('Should submit a new report response', async ({ page }) => {
        const values = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'test author',
            submitters: 'test submitter',
            incident_date: '2022-01-01',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
            image_url: 'https://incidentdatabase.ai/image.jpg',
            incident_ids: [1],
            text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
            tags: 'response',
            editor_notes: 'Here are some notes',
        };

        const params = new URLSearchParams(values);


        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews'
        );

        await page.goto(url + `?${params.toString()}`);

        await waitForRequest('findSubmissions');

        await waitForRequest('parseNews');

        await expect(page.locator('[data-cy="submit-form-title"]')).toHaveText('New Incident Response');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('[data-cy="to-step-3"]').click();

        await page.locator('button[type="submit"]').click();
    });

    test.skip('Should show related reports based on author', async ({ page }) => {

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        const values = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'BBC News',
            incident_date: '2022-01-01',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
        };

        for (const key in values) {
            await page.locator(`[name="${key}"]`).fill(values[key]);
        }

        await setEditorText(page, 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease');

        await expect(page.locator('[data-cy="related-byAuthors"] [data-cy="result"]').first()).toBeVisible();
        await page.locator('[data-cy="related-byAuthors"] [data-cy="result"]').nth(0).locator('[data-cy="unspecified"]').first().click();
        await page.locator('[data-cy="related-byAuthors"] [data-cy="result"]').nth(1).locator('[data-cy="dissimilar"]').first().click();
        await page.locator('[data-cy="related-byAuthors"] [data-cy="result"]').nth(2).locator('[data-cy="similar"]').first().click();

        await page.locator('button[data-cy="submit-step-1"]').click();
    });

    test('Should hide incident_date, description, deployers, developers & harmed_parties if incident_ids is set', async ({ page }) => {

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        const valuesStep1 = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'test author',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
            incident_ids: '1',
        };

        for (const key in valuesStep1) {
            if (key == 'incident_ids') {
                await page.locator(`input[name="${key}"]`).fill(valuesStep1[key]);
                await page.locator(`[role="option"]`).first().click();
            } else {
                await page.locator(`input[name="${key}"]`).fill(valuesStep1[key]);
            }
        }

        await setEditorText(page, 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await expect(page.locator('input[name="incident_date"]')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        const valuesStep2 = {
            submitters: 'test submitter',
            image_url: 'https://incidentdatabase.ai/image.jpg',
        };

        for (const key in valuesStep2) {
            await page.locator(`input[name="${key}"]`).fill(valuesStep2[key]);
        }

        await page.mouse.click(0, 0);

        await page.locator('[data-cy="to-step-3"]').click();

        const valuesStep3 = {
            editor_notes: 'Here are some notes',
        };

        for (const key in valuesStep3) {
            await page.locator(`textarea[name="${key}"]`).fill(valuesStep3[key]);
        }

        await expect(page.locator('input[name="description"]')).not.toBeVisible();
        await expect(page.locator('input[name="deployers"]')).not.toBeVisible();
        await expect(page.locator('input[name="developers"]')).not.toBeVisible();
        await expect(page.locator('input[name="harmed_parties"]')).not.toBeVisible();
    });

    test('Should allow two submissions in a row', async ({ page }) => {

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');



        async function submitForm() {

            await conditionalIntercept(
                page,
                '**/parseNews**',
                () => true,
                parseNews,
                'parseNews',
            );

            await page.locator('input[name="url"]').fill(
                `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
            );

            await page.locator('[data-cy="fetch-info"]').click();

            await waitForRequest('parseNews');

            await page.locator('input[name="authors"]').fill('Something');

            await page.locator('[name="incident_date"]').fill('2020-01-01');

            await page.locator('[data-cy="submit-step-1"]').click();

            await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();
        }

        await submitForm();
        await submitForm();
    });

    test('Should fetch the news if the url param is in the querystring', async ({ page }) => {
        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews',
        );

        await page.goto(
            `${url}?url=https%3A%2F%2Fwww.arstechnica.com%2Fgadgets%2F2017%2F11%2Fyoutube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons%2F`
        );

        await waitForRequest('parseNews');

        await expect(page.locator('.tw-toast:has-text("Please verify all information programmatically pulled from the report")')).toBeVisible();
    });

    test('Should load from localstorage', async ({ page, skipOnEmptyEnvironment }) => {
        const values = {
            url: 'https://incidentdatabase.ai',
            authors: ['test author'],
            title: 'test title',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
            image_url: 'https://incidentdatabase.ai/image.jpg',
            incident_ids: [1],
            text: '## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease',
            submitters: ['test submitters'],
            tags: ['test tags'],
            source_domain: `incidentdatabase.ai`,
            cloudinary_id: `reports/incidentdatabase.ai/image.jpg`,
            editor_notes: 'Here are some notes',
        };

        await page.addInitScript(values => {
            window.localStorage.setItem('formValues', JSON.stringify(values));
        }, values);

        await page.goto(url);

        await page.locator('[data-cy="submit-step-1"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();

        const { data } = await query({
            query: gql`
              query {
                submission(sort: { _id: DESC }){
                    url
                    title
                    text
                    authors
                    incident_ids
                    user {
                        userId
                    }
                }
              }
            `,
        });

        expect(data.submission).toMatchObject({
            url: "https://incidentdatabase.ai",
            title: "test title",
            text: "## Sit quo accusantium \n\n quia **assumenda**. Quod delectus similique labore optio quaease",
            authors: [
                "test author",
            ],
            incident_ids: [
                1,
            ],
            user: null,
        });
    });

    test('Should save form data in local storage', async ({ page }) => {

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            { data: { submissions: [] } },
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        const valuesStep1 = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'test author',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
            incident_date: '2020-01-01',
        };

        for (const key in valuesStep1) {
            await page.locator(`[name="${key}"]`).fill(valuesStep1[key]);
        }

        await setEditorText(page, 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease');

        await page.mouse.click(0, 0);

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        const valuesStep2 = {
            submitters: 'test submitter',
            image_url: 'https://incidentdatabase.ai/image.jpg',
            language: 'en',
        };

        for (const key in valuesStep2) {
            key == 'language'
                ? await page.locator(`[name="${key}"]`).selectOption({ value: valuesStep2[key] })
                : await page.locator(`[name="${key}"]`).fill(valuesStep2[key]);
        }

        await page.mouse.click(0, 0);

        await page.locator('[data-cy="to-step-3"]').click();

        const valuesStep3 = {
            developers: 'test developer',
            deployers: 'test deployer',
            harmed_parties: 'test harmed_parties',
            editor_notes: 'Here are some notes',
        };

        for (const key in valuesStep3) {
            await page.locator(`[name="${key}"]`).fill(valuesStep3[key]);
            await page.mouse.click(0, 0);
        }

        expect(async () => {

            const formValues = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('formValues'));
            });

            expect(formValues).toMatchObject({
                ...valuesStep1,
                ...valuesStep2,
                ...valuesStep3,
                authors: [valuesStep1.authors],
                submitters: [valuesStep2.submitters],
                tags: [],
                developers: [valuesStep3.developers],
                deployers: [valuesStep3.deployers],
                harmed_parties: [valuesStep3.harmed_parties],
                nlp_similar_incidents: [],
                cloudinary_id: `reports/incidentdatabase.ai/image.jpg`,
                text: 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease',
                incident_ids: [],
                incident_editors: [],
            });
        }).toPass();
    });

    test('Should clear form', async ({ page, skipOnEmptyEnvironment }) => {

        const values = {
            url: 'https://incidentdatabase.ai',
            authors: 'test author',
            title: 'test title',
            date_published: '2021-01-02',
            incident_ids: [1],
        };

        const params = new URLSearchParams(values);

        await page.goto(url + `?${params.toString()}`);

        await page.locator('[data-cy="clear-form"]').click();

        for (const key in values) {
            await expect(page.locator(`input[name="${key}"]`)).toHaveValue('');
        }
    });

    test('Should display an error message if Date Published is not in the past', async ({ page }) => {

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        await page.locator('input[name="date_published"]').fill('3000-01-01');

        await page.locator('button:has-text("Submit")').click();

        await expect(page.locator(':has-text("*Date must be in the past")').first()).toBeVisible();
    });

    test('Should display an error message if Date Downloaded is not in the past', async ({ page }) => {
        await page.goto(url);

        await page.locator('input[name="date_downloaded"]').fill('3000-01-01');

        await page.locator('button:has-text("Submit")').click();

        await expect(page.locator('form:has-text("*Date must be in the past")')).toBeVisible();
    });

    test('Should fetch article', async ({ page }) => {

        await trackRequest(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            'findSubmissions'
        );

        await page.goto(url);

        await waitForRequest('findSubmissions');

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews',
        );

        await page.locator('input[name="url"]').fill(
            `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
        );

        await page.locator('button:has-text("Fetch info")').click();

        await waitForRequest('parseNews');

        await expect(page.locator('.tw-toast:has-text("Please verify all information programmatically pulled from the report")')).toBeVisible();
        await expect(page.locator('.tw-toast:has-text("Error fetching news.")')).not.toBeVisible();
    });

    // I'm getting "*something* was blocked" error
    test.skip('Should fetch article from site using cookies as fallback', async ({ page }) => {
        await page.goto(url);

        await page.locator('input[name="url"]').fill(
            'https://www.washingtonpost.com/technology/2023/02/16/microsoft-bing-ai-chatbot-sydney/'
        );

        await page.locator('button:has-text("Fetch info")').click();

        await expect(page.locator('.tw-toast:has-text("Please verify all information programmatically pulled from the report")')).toBeVisible();
        await expect(page.locator('.tw-toast:has-text("Error fetching news.")')).not.toBeVisible();
    });
});