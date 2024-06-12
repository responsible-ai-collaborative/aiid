import parseNews from '../fixtures/api/parseNews.json';
import semanticallyRelated from '../fixtures/api/semanticallyRelated.json';
import users from '../fixtures/users/users.json';
import { conditionalIt, conditionalIntercept, waitForRequest, login, setEditorText } from '../utils';
import { test, expect } from '@playwright/test';
import config from '../config';

test.describe('The Submit form', () => {
    const url = '/apps/submit';
    const parserURL = '/api/parseNews**';

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

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'InsertSubmission',
            {
                data: {
                    insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
                },
            },
            'insertSubmission'
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

        const updateReportRequest = await waitForRequest('insertSubmission');
        const variables = updateReportRequest.postDataJSON().variables;

        expect(variables.submission).toMatchObject({
            title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
            submitters: ['Something'],
            authors: ['Valentina Palladino'],
            incident_date: '2020-01-01',
            date_published: '2017-11-10',
            image_url:
                'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
            tags: ['New Tag'],
            incident_ids: [],
            text: "## Recent news stories and blog\n\nposts _highlighted_ the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.",
            plain_text:
                "Recent news stories and blog\n\nposts highlighted the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.\n",
            url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
            source_domain: `arstechnica.com`,
            language: 'es',
            editor_notes: 'Here are some notes',
            description: 'Description',
        });

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();
        await expect(page.locator(':text("Please review. Some data is missing.")')).not.toBeVisible();
    });

    conditionalIt(!process.env.isEmptyEnvironment, 'Should autocomplete entities', async ({ page }) => {

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'InsertSubmission',
            {
                data: {
                    insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
                },
            },
            'insertSubmission'
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

        await page.locator('input[name="url"]').fill(
            `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
        );

        await page.locator('button:has-text("Fetch info")').click();

        await waitForRequest('parseNews');

        await page.locator('[name="incident_date"]').fill('2020-01-01');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('[data-cy="to-step-3"]').click();

        await page.locator('input[name="deployers"]').fill('YouT');

        await page.locator('#deployers-tags .dropdown-item[aria-label="YouTube"]').click();

        await page.locator('input[name="deployers"]').fill('NewDeployer');
        await page.keyboard.press('Enter');
        await page.locator('button[type="submit"]').click();

        const updateReportRequest = await waitForRequest('insertSubmission');
        const variables = updateReportRequest.postDataJSON().variables;

        expect(variables.submission).toMatchObject({
            title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
            authors: ['Valentina Palladino'],
            date_published: '2017-11-10',
            image_url:
                'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
            incident_ids: [],
            text: "## Recent news stories and blog\n\nposts _highlighted_ the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.",
            plain_text:
                "Recent news stories and blog\n\nposts highlighted the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.\n",
            url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
            source_domain: `arstechnica.com`,
            deployers: { link: ['youtube', 'newdeployer'] },
        });

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();
        await expect(page.locator(':text("Please review. Some data is missing.")')).not.toBeVisible();
    });

    conditionalIt(
        !config.IS_EMPTY_ENVIRONMENT && !!config.E2E_ADMIN_USERNAME && !!config.E2E_ADMIN_PASSWORD,
        'As editor, should submit a new incident report, adding an incident title and editors.',
        async ({ page }) => {
            await login(page, config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

            await conditionalIntercept(
                page,
                '**/parseNews**',
                () => true,
                parseNews,
                'parseNews'
            );

            await conditionalIntercept(
                page,
                '**/graphql',
                (req) => req.postDataJSON().operationName == 'InsertSubmission',
                {
                    data: {
                        insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
                    },
                },
                'insertSubmission'
            );

            await conditionalIntercept(
                page,
                '**/graphql',
                (req) => req.postDataJSON().operationName == 'FindUsers',
                users,
                'findUsers'
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

            await page.locator('#input-incident_editors').fill('Test');

            await page.locator('[aria-label="Test User"]').click();

            await page.locator('[name="tags"]').fill('New Tag');
            await page.keyboard.press('Enter');

            await page.locator('[name="editor_notes"]').fill('Here are some notes');

            await page.locator('button[type="submit"]').click();

            const insertSubmissionRequest = await waitForRequest('insertSubmission');
            const variables = insertSubmissionRequest.postDataJSON().variables;

            expect(variables.submission).toMatchObject({
                title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
                submitters: ['Test User'],
                authors: ['Valentina Palladino'],
                incident_date: '2020-01-01',
                incident_editors: { link: ['63320ce63ec803072c9f529c'] },
                incident_title: 'Elsagate',
                date_published: '2017-11-10',
                image_url:
                    'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
                tags: ['New Tag'],
                incident_ids: [],
                text: "## Recent news stories and blog\n\nposts _highlighted_ the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.",
                plain_text:
                    "Recent news stories and blog\n\nposts highlighted the underbelly of YouTube Kids, Google's children-friendly version. This is more text to reach the 256 charactrs minimum, becuase otherwise the text by similarity component doesnt fetch, which surprisingly is way more character that I initially imagined when I started writing this.\n",
                url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
                source_domain: `arstechnica.com`,
                language: 'es',
                editor_notes: 'Here are some notes',
                description: 'Description',
            });

            expect(variables.submission.user.link).toBeDefined();

            await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue")')).toBeVisible();

            await expect(page.locator('.tw-toast a')).toHaveAttribute('href', '/apps/submitted/');

            await expect(page.locator(':text("Please review. Some data is missing.")')).not.toBeVisible();
        }
    );

    conditionalIt(
        !process.env.isEmptyEnvironment,
        'Should submit a new report linked to incident 1 once all fields are filled properly',
        async ({ page }) => {

            await conditionalIntercept(
                page,
                '**/parseNews**',
                () => true,
                parseNews,
                'parseNews'
            );

            await conditionalIntercept(
                page,
                '**/graphql',
                (req) => req.postDataJSON().operationName == 'FindIncidentsTitles',
                {
                    data: {
                        incidents: [
                            {
                                __typename: 'Incident',
                                incident_id: 1,
                                title: 'Test title',
                                date: '2016-03-13',
                            },
                        ],
                    },
                },
                'findIncidentsTitles'
            );

            await conditionalIntercept(
                page,
                '**/graphql',
                (req) => req.postDataJSON().operationName == 'InsertSubmission',
                {
                    data: {
                        insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
                    },
                },
                'insertSubmission'
            );

            await conditionalIntercept(
                page,
                '**/semanticallyRelated**',
                () => true,
                semanticallyRelated,
            );

            await conditionalIntercept(
                page,
                '**/graphql',
                (req) => req.postDataJSON().operationName == 'FindSubmissions',
                { data: { submissions: [] } },
                'findInitialSubmissions'
            );

            await page.goto(url);

            await waitForRequest('findInitialSubmissions');

            await page.locator('input[name="url"]').fill(
                `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
            );

            await page.locator('button:has-text("Fetch info")').click();

            await setEditorText(
                page,
                `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube. While all content on YouTube Kids is meant to be suitable for children under the age of 13, some inappropriate videos using animations, cartoons, and child-focused keywords manage to get past YouTube's algorithms and in front of kids' eyes. Now, YouTube will implement a new policy in an attempt to make the whole of YouTube safer: it will age-restrict inappropriate videos masquerading as children's content in the main YouTube app.`
            );

            await page.locator('[data-cy=related-byText] [data-cy=result] [data-cy=set-id]:has-text("#1")').first().click();

            await page.locator('[data-cy=related-byText] [data-cy=result] [data-cy="similar-selector"] [data-cy="similar"]').last().click();

            await expect(page.locator('.form-has-errors')).not.toBeVisible();

            await page.locator('[data-cy="to-step-2"]').click();

            await waitForRequest('findIncidentsTitles');

            await page.locator('[data-cy="to-step-3"]').click();

            await expect(page.locator('[name="incident_title"]')).not.toBeVisible();

            await expect(page.locator('[name="description"]')).not.toBeVisible();

            await expect(page.locator('[name="incident_editors"]')).not.toBeVisible();

            await page.locator('[name="tags"]').fill('New Tag');
            await page.keyboard.press('Enter');

            await page.locator('[name="editor_notes"]').fill('Here are some notes');

            await page.locator('button[type="submit"]').click();

            const insertSubmissionRequest = await waitForRequest('insertSubmission');
            const variables = insertSubmissionRequest.postDataJSON().variables;

            expect(variables.submission).toMatchObject({
                title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
                submitters: ['Anonymous'],
                authors: ['Valentina Palladino'],
                date_published: '2017-11-10',
                image_url:
                    'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
                cloudinary_id:
                    'reports/cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
                tags: ['New Tag'],
                incident_ids: [1],
                url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
                source_domain: `arstechnica.com`,
                editor_notes: 'Here are some notes',
            });
            expect(variables.submission.editor_similar_incidents.length).toBe(1);

            await expect(page.locator(':text("Report successfully added to review queue")')).toBeVisible();



            await conditionalIntercept(
                page,
                '**/graphql',
                (req) => req.postDataJSON().operationName == 'FindSubmissions',
                {
                    data: {
                        submissions: [
                            {
                                __typename: 'Submission',
                                _id: '6272f2218933c7a9b512e13b',
                                text: 'Something',
                                title: 'YouTube to crack down on inappropriate content masked as kids’ cartoons',
                                submitters: ['Something'],
                                authors: ['Valentina Palladino'],
                                incident_date: '2021-09-21',
                                date_published: '2017-11-10',
                                image_url:
                                    'https://cdn.arstechnica.net/wp-content/uploads/2017/11/Screen-Shot-2017-11-10-at-9.25.47-AM-760x380.png',
                                tags: ['New Tag'],
                                incident_ids: [1],
                                url: `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`,
                                source_domain: 'arstechnica.com',
                                language: 'en',
                                description: 'Something',
                                editor_notes: 'Here are some notes',
                            },
                        ],
                    },
                },
                'findSubmissions'
            );

            await login(page, config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

            await page.goto('/apps/submitted');

            await waitForRequest('findSubmissions');

            await expect(page.locator('[data-cy="row"]:has-text("YouTube to crack down on inappropriate content masked as kids’ cartoons")')).toBeVisible();
        }
    );

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

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'InsertSubmission',
            {
                data: {
                    insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
                },
            },
            'insertSubmission'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindIncidentsTitles',
            {
                data: {
                    incidents: [
                        {
                            __typename: 'Incident',
                            incident_id: 1,
                            title: 'Test title',
                            date: '2022-01-01',
                        },
                    ],
                },
            },
            'findIncidentsTitles'
        );

        await conditionalIntercept(
            page,
            '**/graphql',
            (req) => req.postDataJSON().operationName == 'FindSubmissions',
            { data: { submissions: [] } },
            'findSubmissions'
        );

        await page.goto(url + `?${params.toString()}`);

        await waitForRequest('parseNews');

        await waitForRequest('findSubmissions');


        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('[data-cy="to-step-3"]').click();

        await page.locator('button[type="submit"]').click();

        const insertSubmissionRequest = await waitForRequest('insertSubmission');
        const variables = insertSubmissionRequest.postDataJSON().variables;

        expect(variables.submission).toMatchObject({
            ...values,
            incident_ids: [1],
            authors: [values.authors],
            submitters: [values.submitters],
            tags: [values.tags],
            plain_text:
                'Sit quo accusantium\n\nquia assumenda. Quod delectus similique labore optio quaease\n',
            source_domain: `incidentdatabase.ai`,
            cloudinary_id: `reports/incidentdatabase.ai/image.jpg`,
            editor_notes: 'Here are some notes',
        });

        expect(variables.submission.user).toBeUndefined();
    });

    conditionalIt(
        !config.isEmptyEnvironment && !!config.E2E_ADMIN_USERNAME && !!config.E2E_ADMIN_PASSWORD,
        'Should submit a submission and link it to the current user id',
        async ({ page }) => {
            await login(page, config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

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

            await conditionalIntercept(
                page,
                '**/graphql',
                (req) => req.postDataJSON().operationName == 'InsertSubmission',
                {
                    data: {
                        insertOneSubmission: { __typename: 'Submission', _id: '6272f2218933c7a9b512e13b' },
                    },
                },
                'insertSubmission'
            );

            await conditionalIntercept(
                page,
                '**/graphql',
                (req) => req.postDataJSON().operationName == 'FindIncidentsTitles',
                {
                    data: {
                        incidents: [
                            {
                                __typename: 'Incident',
                                incident_id: 1,
                                title: 'Test title',
                                date: '2022-01-01',
                            },
                        ],
                    },
                },
                'findIncidentsTitles'
            );

            await page.goto(url + `?${params.toString()}`);

            await waitForRequest('findIncidentsTitles');

            await expect(page.locator('.form-has-errors')).not.toBeVisible();

            await page.locator('[data-cy="to-step-2"]').click();

            await page.locator('[data-cy="to-step-3"]').click();

            await page.locator('button[type="submit"]').click();

            const insertSubmissionRequest = await waitForRequest('insertSubmission');
            const variables = insertSubmissionRequest.postDataJSON().variables;

            expect(variables.submission).toMatchObject({
                ...values,
                incident_ids: [1],
                authors: [values.authors],
                submitters: ['Test User'],
                tags: [values.tags],
                plain_text:
                    'Sit quo accusantium\n\nquia assumenda. Quod delectus similique labore optio quaease\n',
                source_domain: `incidentdatabase.ai`,
                cloudinary_id: `reports/incidentdatabase.ai/image.jpg`,
                editor_notes: 'Here are some notes',
            });

            expect(variables.submission.user.link).toBeDefined();
        }
    );

    conditionalIt(
        !process.env.isEmptyEnvironment,
        'Should show a list of related reports',
        async ({ page }) => {

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

            await conditionalIntercept(
                page,
                '**/parseNews**',
                () => true,
                parseNews,
            );

            await conditionalIntercept(
                page,
                '**/graphql',
                (req) => req.postDataJSON().operationName == 'FindIncidentsTitles',
                {
                    data: {
                        incidents: [
                            {
                                __typename: 'Incident',
                                incident_id: 1,
                                title: 'Test title',
                                date: '2022-01-01',
                            },
                        ],
                    },
                },
                'findIncidentsTitles'
            );

            await conditionalIntercept(
                page,
                '**/graphql',
                (req) => req.postDataJSON().operationName == 'FindSubmissions',
                { data: { submissions: [] } },
                'findSubmissions'
            );

            await page.goto(url);

            await waitForRequest('findIncidentsTitles');
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
                    req.postDataJSON().variables.query?.authors_in.length,
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

    test('Should show a preliminary checks message', async ({ page }) => {
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

        const values = {
            url: 'https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business/index.html',
            authors: 'test author',
            date_published: '2021-01-02',
            incident_ids: '1',
        };

        await page.goto(url);

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

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
        );

        await page.goto(url);

        await setEditorText(
            page,
            `Recent news stories and blog posts highlighted the underbelly of YouTube Kids, Google's children-friendly version of the wide world of YouTube.`
        );

        await expect(page.locator('[data-cy=related-byText]')).toContainText('Reports must have at least');
    });

    conditionalIt(
        !process.env.isEmptyEnvironment,
        'Should *not* show related orphan reports',
        async ({ page }) => {
            await page.goto(url);

            const values = {
                authors: 'Ashley Belanger',
            };

            for (const key in values) {
                await page.locator(`input[name="${key}"]`).fill(values[key]);
            }

            await expect(page.locator('[data-cy=related-byAuthors] [data-cy=result] a[data-cy=title]', { timeout: 20000 })).not.toContainText(
                'Thousands scammed by AI voices mimicking loved ones in emergencies'
            );
        }
    );
});