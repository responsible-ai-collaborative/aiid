import { expect } from '@playwright/test';
import { gql } from 'graphql-tag';
import { isArray } from 'lodash';
import { init, seedCollection } from '../../memory-mongo';
import { fillAutoComplete, query, setEditorText, test } from '../../utils';
import config from '../../config';
import { DBSubmission } from '../../seeds/aiidprod/submissions';
import { ObjectId } from 'mongodb';

test.describe('Submitted reports', () => {
    const url = '/apps/submitted';

    const getSubmissions = async () => {
        const { data: { submissions } } = await query({
            query: gql`{
                submissions {
                    _id
                    title
                    submitters
                    incident_date
                    incident_editors {
                       userId
                    }
                    status
                    text
                }
            }
        `,
        });

        return submissions;
    }

    test('Loads submissions', async ({ page }) => {

        await init();

        const submissions = await getSubmissions();

        await page.goto(url);

        await expect(page.locator('[data-cy="submissions"] [data-cy="row"]')).toHaveCount(submissions.length);

        for (let index = 0; index < submissions.length; index++) {
            const report = submissions[index];
            const row = page.locator('[data-cy="submissions"] [data-cy="row"]').nth(index);

            await expect(row.locator('[data-cy="cell"] [data-cy="review-submission"]')).not.toBeVisible();

            const keys = ['title', 'submitters', 'incident_date', 'incident_editors', 'status'];

            for (let cellIndex = 0; cellIndex < keys.length; cellIndex++) {
                if (report[keys[cellIndex]]) {
                    let value = report[keys[cellIndex]];

                    if (isArray(value)) {

                        if (keys[cellIndex] === 'incident_editors') {
                            value = value.map((s) => s.userId);
                        }

                        for (let i = 0; i < value.length; i++) {
                            await expect(row.locator('[data-cy="cell"]').nth(cellIndex)).toContainText(value[i]);
                        }
                    }
                    else {

                        await expect(row.locator('[data-cy="cell"]').nth(cellIndex)).toContainText(value);
                    }

                }
            }
        }
    });

    test('Promotes a submission to a new report and links it to a new incident', async ({ page, login }) => {
        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['admin'] } });

        await page.goto(url + `?editSubmission=6140e4b4b9b4f7b3b3b1b1b1`);

        await page.locator('select[data-cy="promote-select"]').selectOption('Incident');

        page.on('dialog', dialog => dialog.accept());

        await page.locator('[data-cy="promote-button"]').click();

        await expect(page.locator('[data-cy="toast"]').first()).toContainText('Successfully promoted submission to Incident 4 and Report 9');

        const { data: { incidents } } = await query({
            query: gql`{
                incidents {
                    incident_id
                    title
                    reports {
                        report_number
                    }
                }
            }
        `,
        });

        expect(incidents.find((i) => i.incident_id === 4).reports.map((r) => r.report_number)).toContain(9);
    });

    test('Promotes a submission to a new report and links it to an existing incident', async ({ page, login }) => {

        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=6140e4b4b9b4f7b3b3b1b1b1`);

        await fillAutoComplete(page, '#input-incident_ids', 'Inc', 'Incident 1');

        page.on('dialog', dialog => dialog.accept());

        await page.locator('[data-cy="promote-to-report-button"]').click();

        await expect(page.locator('[data-cy="toast"]')).toContainText('Successfully promoted submission to Incident 1 and Report 9');

        const { data: { incidents } } = await query({
            query: gql`{
                incidents {
                    incident_id
                    title
                    reports {
                        report_number
                    }
                }
            }
        `,
        });

        expect(incidents.find((i) => i.incident_id === 1).reports.map((r) => r.report_number)).toContain(9);
    });

    test('Promotes a submission to a new report and links it to multiple incidents', async ({ page, login }) => {

        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=6140e4b4b9b4f7b3b3b1b1b1`);

        await fillAutoComplete(page, '#input-incident_ids', 'inci', 'Incident 2');
        await fillAutoComplete(page, '#input-incident_ids', 'Kron', 'Kronos');

        page.on('dialog', dialog => dialog.accept());

        await page.locator('[data-cy="promote-to-report-button"]').click();

        await expect(page.getByText('Successfully promoted submission to Incident 2 and Report 9')).toBeVisible();
        await expect(page.getByText('Successfully promoted submission to Incident 3 and Report 9')).toBeVisible();

        const { data: { incidents } } = await query({
            query: gql`{
                incidents {
                    incident_id
                    title
                    reports {
                        report_number
                    }
                }
            }
        `,
        });

        expect(incidents.find((i) => i.incident_id === 2).reports.map((r) => r.report_number)).toContain(9);
        expect(incidents.find((i) => i.incident_id === 3).reports.map((r) => r.report_number)).toContain(9);
    });

    test('Promotes a submission to a new issue', async ({ page, login }) => {

        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=6140e4b4b9b4f7b3b3b1b1b1`);

        await page.locator('select[data-cy="promote-select"]').selectOption('Issue');

        page.on('dialog', dialog => dialog.accept());

        await page.locator('[data-cy="promote-button"]').click();

        await expect(page.locator('[data-cy="toast"]').first()).toContainText('Successfully promoted submission to Issue 9');

        const { data: { reports } } = await query({
            query: gql`{
                reports {
                    report_number
                }
            }
        `,
        });

        expect(reports.find((r) => r.report_number === 9)).toBeDefined();
    });

    test('Rejects a submission', async ({ page, login }) => {

        await init();

        const submissions = await getSubmissions();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=${submissions[0]._id}`);


        page.on('dialog', dialog => dialog.accept());

        await page.locator('[data-cy="reject-button"]').click();

        await page.waitForResponse((response) => response.request()?.postData()?.includes('deleteOneSubmission'));

        const updated = await getSubmissions();

        expect(updated.find((s) => s._id === submissions[0]._id)).toBeUndefined();
    });

    test('Edits a submission - update just a text', async ({ page, login }) => {

        await init();

        const submissions = await getSubmissions();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=${submissions[0]._id}`);

        const text = '## Another one\n\n**More markdown**\n\nAnother paragraph with more text to reach the minimum character count!';

        await setEditorText(page, text);

        await page.waitForResponse((response) => response.request()?.postData()?.includes('UpdateSubmission'));

        const updated = await getSubmissions();

        expect(updated.find((s) => s._id === submissions[0]._id).text).toContain(text);
    });

    test('Edits a submission - uses fetch info', async ({ page, login }) => {

        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=6140e4b4b9b4f7b3b3b1b1b1`);

        await page.locator('input[name="url"]').fill('https://arstechnica.com/gadgets/2017/11/youtube-to-crack-down-on-inappropriate-content-masked-as-kids-cartoons/');
        await page.click('[data-cy="fetch-info"]');

        await page.waitForResponse(response => response.url().includes('/api/parseNews') && response.status() === 200);

        await expect(page.locator('input[label="Title"]')).toHaveValue('YouTube to crack down on inappropriate content masked as kids’ cartoons');
    });

    test('Does not allow promotion of submission to Incident if schema is invalid (missing Description)', async ({ page, login }) => {

        const submissions: DBSubmission[] = [{
            _id: new ObjectId('5d34b8c29ced494f010ed469'),
            authors: ["Author 1", "Author 2"],
            cloudinary_id: "sample_cloudinary_id",
            date_downloaded: "2021-09-14",
            date_modified: "2021-09-14T00:00:00.000Z",
            date_published: "2021-09-14",
            date_submitted: "2021-09-14T00:00:00.000Z",
            deployers: ["entity1"],
            developers: ["entity2"],
            harmed_parties: ["entity3"],
            incident_editors: ["editor1"],
            image_url: "https://sample_image_url.com",
            language: "en",
            source_domain: "example.com",
            submitters: ["Submitter 1", "Submitter 2"],
            tags: ["tag1", "tag2"],
            text: "Sample text that must have at least 80 characters, so I will keep writing until I reach the minimum number of characters.",
            title: "Sample title",
            url: "http://example.com",
            user: "user1",
            incident_title: "Incident title",
            incident_date: "2021-09-14",
            editor_notes: "",
        }]

        await init({ aiidprod: { submissions } });

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=5d34b8c29ced494f010ed469`);

        await page.locator('select[data-cy="promote-select"]').selectOption('Incident');

        await page.locator('[data-cy="promote-button"]').click();

        await expect(page.locator('[data-cy="toast"]')).toContainText('Description is required');
    });

    test('Does not allow promotion of submission to Issue if schema is invalid (missing Title)', async ({ page, login }) => {

        const submissions: DBSubmission[] = [{
            _id: new ObjectId('5d34b8c29ced494f010ed469'),
            authors: ["Author 1", "Author 2"],
            cloudinary_id: "sample_cloudinary_id",
            date_downloaded: "2021-09-14",
            date_modified: "2021-09-14T00:00:00.000Z",
            date_published: "2021-09-14",
            date_submitted: "2021-09-14T00:00:00.000Z",
            deployers: ["entity1"],
            developers: ["entity2"],
            harmed_parties: ["entity3"],
            incident_editors: ["editor1"],
            image_url: "https://sample_image_url.com",
            language: "en",
            source_domain: "example.com",
            submitters: ["Submitter 1", "Submitter 2"],
            tags: ["tag1", "tag2"],
            text: "Sample text that must have at least 80 characters, so I will keep writing until I reach the minimum number of characters.",
            url: "http://example.com",
            user: "user1",
            incident_title: "Incident title",
            incident_date: "2021-09-14",
            editor_notes: "",
            description: 'Sarasa',
            title: "",
        }]

        await init({ aiidprod: { submissions } });

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=5d34b8c29ced494f010ed469`);

        await page.locator('select[data-cy="promote-select"]').selectOption('Issue');

        await page.locator('[data-cy="promote-button"]').click();

        await expect(page.locator('[data-cy="toast"]').first()).toContainText('*Title must have at least 6 characters');
    });

    test('Should display an error message if Date Published is not in the past', async ({ page, login }) => {

        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=6140e4b4b9b4f7b3b3b1b1b1`);

        await page.fill('input[name="date_published"]', '3000-01-01');

        await expect(page.locator('[data-cy="submission-form"]')).toContainText('Date must be in the past');
    });

    test('Should display an error message if Date Downloaded is not in the past', async ({ page, login }) => {

        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=6140e4b4b9b4f7b3b3b1b1b1`);

        await page.fill('input[name="date_downloaded"]', '3000-01-01');

        await expect(page.locator('[data-cy="submission-form"]')).toContainText('Date must be in the past');
    });

    test('Claims a submission', async ({ page, login }) => {

        await init();

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url);

        await page.click('[data-cy="claim-submission"]');

        await page.waitForResponse((response) => response.request()?.postData()?.includes('UpdateSubmission'));

        const { data: { submissions } } = await query({
            query: gql`{
                submissions {
                    _id
                    incident_editors {
                        userId
                    }
                }
            }
        `,
        });

        expect(submissions.find((s) => s._id === '6140e4b4b9b4f7b3b3b1b1b1').incident_editors.map((e) => e.userId)).toContain(userId);
    });

    test('Unclaims a submission', async ({ page, login }) => {

        await init();

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        const submissions: DBSubmission[] = [{
            _id: new ObjectId('63f3d58c26ab981f33b3f9c7'),
            authors: ["Author 1", "Author 2"],
            cloudinary_id: "sample_cloudinary_id",
            date_downloaded: "2021-09-14",
            date_modified: "2021-09-14T00:00:00.000Z",
            date_published: "2021-09-14",
            date_submitted: "2021-09-14T00:00:00.000Z",
            deployers: ["entity1"],
            developers: ["entity2"],
            harmed_parties: ["entity3"],
            incident_editors: [userId],
            image_url: "https://sample_image_url.com",
            language: "en",
            source_domain: "example.com",
            submitters: ["Submitter 1", "Submitter 2"],
            tags: ["tag1", "tag2"],
            text: "Sample text that must have at least 80 characters, so I will keep writing until I reach the minimum number of characters.",
            url: "http://example.com",
            user: "user1",
            incident_title: "Incident title",
            incident_date: "2021-09-14",
            editor_notes: "",
            description: 'Sarasa',
            title: "Already Claimed",
        }]

        await seedCollection({ name: 'submissions', docs: submissions, drop: false });

        await page.goto(url);

        await page.getByText('Unclaim', { exact: true }).click();

        await page.waitForResponse((response) => response.request()?.postData()?.includes('UpdateSubmission'));

        const { data: { submissions: updated } } = await query({
            query: gql`{
                submissions {
                    _id
                    incident_editors {
                        userId
                    }
                }
            }
        `,
        });

        expect(updated.find((s) => s._id === '63f3d58c26ab981f33b3f9c7').incident_editors.map((e) => e.userId)).not.toContain(userId);
    });

    test('Should maintain current page while claiming', async ({ page, login }) => {

        await init();

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        const submissions: DBSubmission[] = Array.from(Array(10).keys()).map(i => {

            return {
                authors: ["Author 1", "Author 2"],
                cloudinary_id: "sample_cloudinary_id",
                date_downloaded: "2021-09-14",
                date_modified: "2021-09-14T00:00:00.000Z",
                date_published: "2021-09-14",
                date_submitted: "2021-09-14T00:00:00.000Z",
                deployers: ["entity1"],
                developers: ["entity2"],
                harmed_parties: ["entity3"],
                incident_editors: [userId],
                image_url: "https://sample_image_url.com",
                language: "en",
                source_domain: "example.com",
                submitters: ["Submitter 1", "Submitter 2"],
                tags: ["tag1", "tag2"],
                text: "Sample text that must have at least 80 characters, so I will keep writing until I reach the minimum number of characters.",
                url: "http://example.com",
                user: "user1",
                incident_title: "Incident title",
                incident_date: "2021-09-14",
                editor_notes: "",
                description: 'Sarasa',
                title: "Submission " + i,
            }
        })

        await seedCollection({ name: 'submissions', docs: submissions, drop: false });

        await page.goto(url);

        await page.click('.pagination button:has-text("Next")');
        await page.click('[data-cy="claim-submission"]');

        await expect(page.locator('.pagination [aria-current="page"] button')).toHaveText('2');
    });

    test('Should display "No reports found" if no quick adds are found', async ({ page }) => {

        await init({ aiidprod: { quickadds: [] } }, { drop: true });

        await page.goto(url);


        await expect(page.locator('[data-cy="no-results"]')).toContainText('No reports found');
    });

    test('Should display submission image on edit page', async ({ page, login }) => {

        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=6140e4b4b9b4f7b3b3b1b1b1`);

        await expect(page.locator('[data-cy="image-preview-figure"] img')).toHaveAttribute(
            'src',
            'https://res.cloudinary.com/pai/image/upload/f_auto/q_auto/v1/reports/s3.amazonaws.com/ledejs/resized/s2020-pasco-ilp/600/nocco5.jpg'
        );
    });

    test('Should display fallback image on edit modal if submission does not have an image', async ({ page, login }) => {

        await init();

        const [userId] = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        const submissions: DBSubmission[] = [{
            _id: new ObjectId('63f3d58c26ab981f33b3f9c7'),
            authors: ["Author 1", "Author 2"],
            cloudinary_id: "sample_cloudinary_id",
            date_downloaded: "2021-09-14",
            date_modified: "2021-09-14T00:00:00.000Z",
            date_published: "2021-09-14",
            date_submitted: "2021-09-14T00:00:00.000Z",
            deployers: ["entity1"],
            developers: ["entity2"],
            harmed_parties: ["entity3"],
            incident_editors: [userId],
            image_url: "null",
            language: "en",
            source_domain: "example.com",
            submitters: ["Submitter 1", "Submitter 2"],
            tags: ["tag1", "tag2"],
            text: "Sample text that must have at least 80 characters, so I will keep writing until I reach the minimum number of characters.",
            url: "http://example.com",
            user: "user1",
            incident_title: "Incident title",
            incident_date: "2021-09-14",
            editor_notes: "",
            description: 'Sarasa',
            title: "Already Claimed",
        }]

        await seedCollection({ name: 'submissions', docs: submissions, drop: false });


        await page.goto(url + `?editSubmission=63f3d58c26ab981f33b3f9c7`);


        await expect(page.locator('[data-cy="image-preview-figure"] canvas')).toBeVisible();
    });

    test('Edits a submission - links to existing incident - Incident Data should be hidden', async ({ page, login }) => {
        await init();

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { first_name: 'Test', last_name: 'User', roles: ['incident_editor'] } });

        await page.goto(url + `?editSubmission=6140e4b4b9b4f7b3b3b1b1b1`);

        await page.fill(`input[name="incident_ids"]`, '1');

        await page.waitForSelector(`[role="option"]`);

        await fillAutoComplete(page, '#input-incident_ids', 'inci', 'Incident 1');

        await expect(page.locator('[data-cy="incident-data-section"]')).not.toBeVisible();
    });
});