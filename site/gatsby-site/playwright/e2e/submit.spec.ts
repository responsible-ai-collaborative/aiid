import parseNews from '../fixtures/api/parseNews.json';
import { conditionalIntercept, waitForRequest, setEditorText, test, trackRequest, query, fillAutoComplete } from '../utils';
import { expect } from '@playwright/test';
import { init } from '../memory-mongo';
import gql from 'graphql-tag';
import { addWeeks, getUnixTime, subWeeks } from 'date-fns';


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

        await page.locator('[name="tags"]').fill('New Tag');
        await page.keyboard.press('Enter');

        await page.locator('[name="editor_notes"]').fill('Here are some notes');

        await page.locator('[data-cy="to-step-3"]').click();

        await expect(page.locator('[name="incident_title"]')).not.toBeVisible();

        await page.locator('[name="description"]').fill('Description');

        await expect(page.locator('[name="incident_editors"]')).not.toBeVisible();

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

        test.slow();

        await init();

        await login();

        await conditionalIntercept(
            page,
            '**/parseNews**',
            () => true,
            parseNews,
            'parseNews'
        );

        const findSubmissionsResponse = page.waitForResponse(((response) => response.request()?.postDataJSON()?.operationName == 'FindSubmissions'))

        const findUsersResponse = page.waitForResponse(((response) => response.request()?.postDataJSON()?.operationName == 'FindUsers'))

        await page.goto(url);

        await findSubmissionsResponse;

        await page.locator('input[name="url"]').fill(
            `https://www.arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/`
        );

        await page.locator('button:has-text("Fetch info")').click();

        await waitForRequest('parseNews');

        await page.locator('[name="incident_date"]').fill('2020-01-01');

        await expect(page.locator('.form-has-errors')).not.toBeVisible();

        await page.locator('[data-cy="to-step-2"]').click();

        await page.locator('[name="language"]').selectOption('Spanish');

        await page.locator('[name="tags"]').fill('New Tag');
        await page.keyboard.press('Enter');

        await page.locator('[name="editor_notes"]').fill('Here are some notes');

        await page.locator('[data-cy="to-step-3"]').click();

        await findUsersResponse;

        await page.locator('[name="incident_title"]').fill('Elsagate');

        await page.locator('[name="description"]').fill('Description');

        await fillAutoComplete(page, "#input-incident_editors", 'John', 'John Doe');

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
            incident_editors: [{ userId: '619b47ea5eed5334edfa3bbc' }],
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

        await page.locator('[name="tags"]').fill('New Tag');
        await page.keyboard.press('Enter');

        await page.locator('[name="editor_notes"]').fill('Here are some notes');

        await expect(page.locator('[data-cy="to-step-3"]')).not.toBeVisible();

        await expect(page.locator('[name="incident_title"]')).not.toBeVisible();

        await expect(page.locator('[name="description"]')).not.toBeVisible();

        await expect(page.locator('[name="incident_editors"]')).not.toBeVisible();

        await page.locator('[data-cy="submit-step-2"]').click();

        await expect(page.locator(':text("Report successfully added to review queue")')).toBeVisible();

        await login();

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

        await expect(page.locator('[data-cy="to-step-3"]')).not.toBeVisible();

        await page.locator('[data-cy="submit-step-2"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue")')).toBeVisible();
    });

    test('Should submit a submission and link it to the current user id', async ({ page, login, skipOnEmptyEnvironment }) => {

        const [userId] = await login();

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

        await expect(page.locator('[data-cy="to-step-3"]')).not.toBeVisible();

        await page.locator('[data-cy="submit-step-2"]').click();

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


    test('Should show a list of related reports', async ({ page, skipOnEmptyEnvironment }) => {

        await page.goto(url);

        const authors = "author1";
        const date_published = "2014-08-14";
        const reportUrl = 'http://example.com';

        const values = {
            url: reportUrl,
            authors,
            date_published,
            incident_ids: 1,
        };

        const epoch_date_published_gt = getUnixTime(subWeeks(new Date(date_published), 2));

        const epoch_date_published_lt = getUnixTime(addWeeks(new Date(date_published), 2));

        const { data: { reports: reportsAuthors } } = await query({
            query: gql`
            query {
              reports(filter: { authors: {IN: ["${authors}"] } }) {
                report_number
              }
            }
          `,
        });

        const { data: { reports: reportsPublished } } = await query({
            query: gql`
            query {
              reports(filter: { epoch_date_published: {GT: ${epoch_date_published_gt}, LT: ${epoch_date_published_lt} } }) {
                report_number
              }
            }
          `,
        });

        const { data: { reports: reportsUrl } } = await query({
            query: gql`
            query {
              reports(filter: { url: {IN: ["${reportUrl}"] } }) {
                report_number
              }
            }
          `,
        });

        const reports = {
            byAuthors: reportsAuthors,
            byDatePublished: reportsPublished,
            byURL: reportsUrl,
        }

        for (const key in values) {
            if (key == 'incident_ids') {
                await page.locator(`input[name="${key}"]`).fill(values[key].toString());
                await page.waitForSelector(`[role="option"]`);
                await page.locator(`[role="option"]`).first().click();
            } else {
                await page.locator(`input[name="${key}"]`).fill(values[key]);
            }
        }

        for (const key of Object.keys(reports)) {

            const parentLocator = page.locator(`[data-cy="related-${key}"]`);

            await expect(async () => {
                await expect(parentLocator.locator('[data-cy="result"]')).toHaveCount(reports[key].length);
            }).toPass();

            for (const report of reports[key]) {
                await expect(parentLocator.locator('[data-cy="result"]', { hasText: report.title })).toBeVisible();
            }

        }
    }
    );


    test('Should **not** show a list of related reports if no data entered', async ({ page, skipOnEmptyEnvironment }) => {

        await page.goto(url);

        const parentLocator = page.locator(`[data-cy="related-reports"]`);

        const childrenCount = await parentLocator.locator('> *').count();

        await expect(childrenCount).toBe(0);

    }
    );

    test('Should *not* show a list of related reports', async ({ page, skipOnEmptyEnvironment }) => {

        await page.goto(url);

        const authors = "this is a new non existing author";
        const date_published = "2034-01-01";
        const reportUrl = 'http://nonExistingUrlForReport.com';

        const values = {
            url: reportUrl,
            authors,
            date_published,
        };

        const epoch_date_published_gt = getUnixTime(subWeeks(new Date(date_published), 2));

        const epoch_date_published_lt = getUnixTime(addWeeks(new Date(date_published), 2));

        const { data: { reports: reportsAuthors } } = await query({
            query: gql`
          query {
            reports(filter: { authors: {IN: ["${authors}"] } }) {
              report_number
            }
          }
        `,
        });

        const { data: { reports: reportsPublished } } = await query({
            query: gql`
          query {
            reports(filter: { epoch_date_published: {GT: ${epoch_date_published_gt}, LT: ${epoch_date_published_lt} } }) {
              report_number
            }
          }
        `,
        });

        const { data: { reports: reportsUrl } } = await query({
            query: gql`
          query {
            reports(filter: { url: {IN: ["${reportUrl}"] } }) {
              report_number
            }
          }
        `,
        });

        const reports = {
            byAuthors: reportsAuthors,
            byDatePublished: reportsPublished,
            byURL: reportsUrl,
        }

        for (const key in values) {
            if (key == 'incident_ids') {
                await page.locator(`input[name="${key}"]`).fill(values[key].toString());
                await page.waitForSelector(`[role="option"]`);
                await page.locator(`[role="option"]`).first().click();
            } else {
                await page.locator(`input[name="${key}"]`).fill(values[key]);
            }
        }

        for (const key of Object.keys(reports)) {

            const parentLocator = page.locator(`[data-cy="related-${key}"]`);

            await expect(async () => {
                await expect(parentLocator.locator('[data-cy="result"]')).toHaveCount(0);
            }).toPass();

            await expect(page.locator(`[data-cy="related-${key}"]`).locator('[data-cy="no-related-reports"]')).toHaveText('No related reports found.');
        }
    }
    );

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
        
        await page.locator(`textarea[name="editor_notes"]`).fill('Here are some notes');
        await expect(page.locator('[name="editor_notes"]')).toBeVisible();

        await page.mouse.click(0, 0);
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

        await page.locator('[name="editor_notes"]').fill('Here are some notes');

        await page.locator('[data-cy="to-step-3"]').click();

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

        await expect(page.locator('[data-cy="to-step-3"]')).not.toBeVisible();

        await page.locator('[data-cy="submit-step-2"]').click();
    });

    test('Should show related reports based on author and add as similar', async ({ page }) => {

        await init();

        await page.goto(url);

        const values = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'author1',
            incident_date: '2022-01-01',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
        };

        for (const key in values) {
            await page.locator(`[name="${key}"]`).fill(values[key]);
        }

        await setEditorText(page, 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease');

        await expect(page.locator('[data-cy="related-byAuthors"] [data-cy="result"]').first()).toBeVisible();
        await page.locator('[data-cy="related-byAuthors"] [data-cy="result"]').nth(0).locator('[data-cy="similar"]').first().click();

        await page.locator('button[data-cy="submit-step-1"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue")')).toBeVisible();

        const { data } = await query({
            query: gql`
            query {
              submission(sort: { date_submitted:DESC }){
                editor_similar_incidents
              }
            }
          `,
        });

        expect(data.submission).toMatchObject({
            editor_similar_incidents: [1],
        });
    });

    test('Should show related reports based on author and add as dissimilar', async ({ page }) => {

        await init();

        await page.goto(url);

        const values = {
            url: 'https://incidentdatabase.ai',
            title: 'test title',
            authors: 'author1',
            incident_date: '2022-01-01',
            date_published: '2021-01-02',
            date_downloaded: '2021-01-03',
        };

        for (const key in values) {
            await page.locator(`[name="${key}"]`).fill(values[key]);
        }

        await setEditorText(page, 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease');

        await expect(page.locator('[data-cy="related-byAuthors"] [data-cy="result"]').first()).toBeVisible();
        await page.locator('[data-cy="related-byAuthors"] [data-cy="result"]').nth(0).locator('[data-cy="dissimilar"]').first().click();

        await page.locator('button[data-cy="submit-step-1"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue")')).toBeVisible();

        const { data } = await query({
            query: gql`
            query {
              submission(sort: { date_submitted:DESC }){
                editor_dissimilar_incidents
              }
            }
          `,
        });

        expect(data.submission).toMatchObject({
            editor_dissimilar_incidents: [1],
        });
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

        await page.locator(`textarea[name="editor_notes"]`).fill('Here are some notes');

        await page.mouse.click(0, 0);

        await expect(page.locator('[data-cy="to-step-3"]')).not.toBeVisible();

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
            editor_notes: 'Here are some notes',
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

    test('Should autocomplete new entities', async ({ page, skipOnEmptyEnvironment }) => {

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

        await page.locator('input[name="developers"]').fill('New entity');
        await page.keyboard.press('Enter');

        await page.locator('input[name="deployers"]').fill('New entity');

        await page.locator('#deployers-tags .dropdown-item[aria-label="New entity"]').click();

        await page.locator('button[type="submit"]').click();

        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();
        await expect(page.locator(':text("Please review. Some data is missing.")')).not.toBeVisible();
    });

    test('Should show an error for inputs with two or fewer characters in developers, deployers, harmed_parties, and implicated_systems', async ({ page }) => {
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

        await page.locator('input[name="developers"]').fill('ab');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Developer must have at least 3 characters and less than 200')).toBeVisible();
        await page.locator('[data-testid="developers-input"] .rbt-close').click();

        await page.locator('input[name="developers"]').fill('NewDev');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Developer must have at least 3 characters and less than 200')).not.toBeVisible();

        // Check for deployers field
        await page.locator('input[name="deployers"]').fill('cd');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Deployer must have at least 3 characters and less than 200')).toBeVisible();
        await page.locator('[data-testid="deployers-input"] .rbt-close').click();

        await page.locator('input[name="deployers"]').fill('NewDep');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Deployer must have at least 3 characters and less than 200')).not.toBeVisible();

        // Check for harmed_parties field
        await page.locator('input[name="harmed_parties"]').fill('ef');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Harmed parties must have at least 3 characters and less than 200')).toBeVisible();
        await page.locator('[data-testid="harmed_parties-input"] .rbt-close').click();

        await page.locator('input[name="harmed_parties"]').fill('NewHarmed');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Harmed parties must have at least 3 characters and less than 200')).not.toBeVisible();

        await page.locator('input[name="implicated_systems"]').fill('gh');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Implicated AI system must have at least 3 characters and less than 200')).toBeVisible();
        await page.locator('[data-testid="implicated_systems-input"] .rbt-close').click();

        await page.locator('input[name="implicated_systems"]').fill('NewSystem');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Implicated AI system must have at least 3 characters and less than 200')).not.toBeVisible();

        // Check for "New selection" behavior
        await page.locator('input[name="developers"]').fill('xy');
        await page.locator('#developers-tags .dropdown-item:has-text("New selection: xy")').click();
        await expect(page.locator('text=Each alleged Developer must have at least 3 characters and less than 200')).toBeVisible();
        await page.locator('div').filter({ hasText: /^xy×Remove$/ }).getByLabel('Remove').click();

        await page.locator('input[name="developers"]').fill('ValidDev');
        await page.locator('#developers-tags .dropdown-item:has-text("New selection: ValidDev")').click();
        await expect(page.locator('text=Each alleged Developer must have at least 3 characters and less than 200')).not.toBeVisible();

        // Submit to ensure the form does not proceed with errors
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();
        await expect(page.locator(':text("Please review. Some data is missing.")')).not.toBeVisible();
    });

    test('Should show an error for inputs with 200 or more characters in developers, deployers, harmed_parties, and implicated_systems', async ({ page }) => {
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

        await page.locator('input[name="developers"]').fill('This test input text is designed to have precisely two hundred characters total so it works perfectly for checking HTML input validation to ensure that anything this length or longer should show error');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Developer must have at least 3 characters and less than 200')).toBeVisible();
        await page.locator('[data-testid="developers-input"] .rbt-close').click();

        await page.locator('input[name="developers"]').fill('NewDev');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Developer must have at least 3 characters and less than 200')).not.toBeVisible();

        // Check for deployers field
        await page.locator('input[name="deployers"]').fill('This test input text is designed to have precisely two hundred characters total so it works perfectly for checking HTML input validation to ensure that anything this length or longer should show error');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Deployer must have at least 3 characters and less than 200')).toBeVisible();
        await page.locator('[data-testid="deployers-input"] .rbt-close').click();

        await page.locator('input[name="deployers"]').fill('NewDep');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Deployer must have at least 3 characters and less than 200')).not.toBeVisible();

        // Check for harmed_parties field
        await page.locator('input[name="harmed_parties"]').fill('This test input text is designed to have precisely two hundred characters total so it works perfectly for checking HTML input validation to ensure that anything this length or longer should show error');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Harmed parties must have at least 3 characters and less than 200')).toBeVisible();
        await page.locator('[data-testid="harmed_parties-input"] .rbt-close').click();

        await page.locator('input[name="harmed_parties"]').fill('NewHarmed');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Harmed parties must have at least 3 characters and less than 200')).not.toBeVisible();

        await page.locator('input[name="implicated_systems"]').fill('This test input text is designed to have precisely two hundred characters total so it works perfectly for checking HTML input validation to ensure that anything this length or longer should show error');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Implicated AI system must have at least 3 characters and less than 200')).toBeVisible();
        await page.locator('[data-testid="implicated_systems-input"] .rbt-close').click();

        await page.locator('input[name="implicated_systems"]').fill('NewSystem');
        await page.keyboard.press('Enter');
        await expect(page.locator('text=Each alleged Implicated AI system must have at least 3 characters and less than 200')).not.toBeVisible();

        // Check for "New selection" behavior
        await page.locator('input[name="developers"]').fill('This test input text is designed to have precisely two hundred characters total so it works perfectly for checking HTML input validation to ensure that anything this length or longer should show error');
        await page.locator('#developers-tags .dropdown-item:has-text("New selection: This test input text is designed to have precisely two hundred characters total so it works perfectly for checking HTML input validation to ensure that anything this length or longer should show error")').click();
        await expect(page.locator('text=Each alleged Developer must have at least 3 characters and less than 200')).toBeVisible();
        await page.locator('div').filter({ hasText: /^This test input text is designed to have precisely two hundred characters total so it works perfectly for checking HTML input validation to ensure that anything this length or longer should show error×Remove$/ }).getByLabel('Remove').click();

        await page.locator('input[name="developers"]').fill('ValidDev');
        await page.locator('#developers-tags .dropdown-item:has-text("New selection: ValidDev")').click();
        await expect(page.locator('text=Each alleged Developer must have at least 3 characters and less than 200')).not.toBeVisible();

        // Submit to ensure the form does not proceed with errors
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();
        await expect(page.locator(':text("Please review. Some data is missing.")')).not.toBeVisible();
    });

    test('Should set submitters to Anonymous if they are not provided', async ({ page }) => {
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

      const { data } = await query({
        query: gql`
            query {
              submission(sort: { _id: DESC }){
                  _id
                  submitters
              }
            }
          `,
      });

      expect(data.submission.submitters).toEqual(['Anonymous']);
    });
      
    test('Should allow commas in developers, deployers, harmed_parties, and implicated_systems', async ({ page }) => {
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

      await page.locator('input[name="developers"]').fill('This developer has a comma in its name, test');
      await page.keyboard.press('Enter');

      await expect(page.locator('text=Each alleged Developer must have at least 3 characters and less than 200')).not.toBeVisible();

      // Check for deployers field
      await page.locator('input[name="deployers"]').fill('This deployer has a comma in its name, test');
      await page.keyboard.press('Enter');
      await expect(page.locator('text=Each alleged Deployer must have at least 3 characters and less than 200')).not.toBeVisible();

      // Check for harmed_parties field
      await page.locator('input[name="harmed_parties"]').fill('This harmed_parties has a comma in its name, test');
      await page.keyboard.press('Enter');
      await expect(page.locator('text=Each alleged Harmed parties must have at least 3 characters and less than 200')).not.toBeVisible();

      await page.locator('input[name="implicated_systems"]').fill('This implicated_systems has a comma in its name, test');
      await page.keyboard.press('Enter');
      await expect(page.locator('text=Each alleged Implicated AI system must have at least 3 characters and less than 200')).not.toBeVisible();

      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.tw-toast:has-text("Report successfully added to review queue. You can see your submission")')).toBeVisible();
      await expect(page.locator(':text("Please review. Some data is missing.")')).not.toBeVisible();
    });
});
