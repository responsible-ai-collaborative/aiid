import { query, setEditorText, getEditorText, test } from '../utils';
import { expect } from '@playwright/test';
import { init } from '../memory-mongo';
import reports from '../seeds/aiidprod/reports';
import reportsTranslations from '../seeds/translations/reports';
import gql from 'graphql-tag';

test.describe('Edit report', () => {
  const url = '/cite/edit?report_number=3&incident_id=3';

  test.beforeEach(async () => {

    await init();
  });

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should load and update report values', async ({ page, login }) => {

    await login();

    await page.goto(url);

    const report = reports.find((r) => r.report_number === 3);

    await expect(page.getByText('Editing Incident Report 3')).toBeVisible();


    for (const key of ['authors', 'date_downloaded', 'date_published', 'image_url', 'submitters', 'title', 'editor_notes']) {

      switch (key) {
        case 'date_downloaded':
        case 'date_published':
          await expect(page.locator(`[name=${key}]`)).toHaveValue((report[key] as Date).toISOString().split('T')[0]);
          break;
        default:
          await expect(page.locator(`[name=${key}]`)).toHaveValue(report[key].toString());
      }
    }

    let editorText = await getEditorText(page);
    await expect(editorText).toBe(report.text);

    await expect(page.locator('label:has-text("Incident IDs") + * [data-cy="token"]:has-text("Kronos Scheduling")')).toBeVisible();


    await expect(page.locator('.submit-report-tags [option="Test Tag"]')).toHaveCount(1);

    const report_es = reportsTranslations.find((r) => r.report_number === 3 && r.language === 'es');

    await expect(page.locator('[data-cy="translation-es"] [type="text"]')).toHaveValue(report_es.title);

    editorText = await getEditorText(page, '[data-cy="translation-es"] .CodeMirror');
    await expect(editorText).toBe(report_es.text);

    const updates = {
      authors: 'Test Author',
      date_downloaded: '2022-01-01',
      date_published: '2022-02-02',
      image_url: 'https://test.com/test.jpg',
      submitters: 'Test Submitter',
      title: 'Test Title',
      url: 'https://www.test.com/test',
      editor_notes: 'Pro iustitia tantum',
    };

    for (const [key, value] of Object.entries(updates)) {
      const locator = page.locator(`[name=${key}]`);
      await locator.fill('');
      await locator.fill(value);
    }

    await page.locator(`[name="quiet"]`).click();

    await setEditorText(page, '## This is text in English\n\nthat is longer that eighty characters, yes eighty characters!');

    await page.locator('[id^=submit-report-tags]').fill('New Tag');
    await page.locator('a[aria-label="New Tag"]').click();

    await page.locator('[data-cy="translation-es"] [type="text"]').fill('Este es un titulo en Espanol!');

    await setEditorText(page, '## Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!', '[data-cy="translation-es"] .CodeMirror');


    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Incident report 3 updated successfully.')).toBeVisible();

    const { data } = await query({
      query: gql`{
        report(filter: { report_number: { EQ: 3 } }) {
          report_number
          authors
          date_downloaded 
          date_published
          image_url
          submitters
          title
          url
          editor_notes
          translations(languages: ["es"]) {
            title
            text
          }
        }
      }`,
    });

    expect(data.report).toMatchObject({
      report_number: 3,
      authors: ['Test Author'],
      "date_downloaded": "2022-01-01T00:00:00.000Z",
      "date_published": "2022-02-02T00:00:00.000Z",
      image_url: 'https://test.com/test.jpg',
      submitters: ['Test Submitter'],
      title: 'Test Title',
      url: 'https://www.test.com/test',
      editor_notes: 'Pro iustitia tantum',
      translations: [{
        title: 'Este es un titulo en Espanol!',
        text: '## Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!',
      }],
    })
  });

  test('Should load and update Issue values', async ({ page, login }) => {

    await login();

    await page.goto('/cite/edit?report_number=5');

    const updates = {
      authors: 'Test Author',
      date_downloaded: '2022-01-01',
      date_published: '2022-02-02',
      image_url: 'https://test.com/test.jpg',
      submitters: 'Test Submitter',
      title: 'Test Title',
      url: 'https://www.test.com/test',
      editor_notes: 'Pro iustitia tantum'
    };

    for (const [key, value] of Object.entries(updates)) {
      await page.locator(`[name=${key}]`).fill(value);
    }

    await setEditorText(page, '## This is text in English\n\nthat is longer that eighty characters, yes eighty characters!', '[data-cy="text"] .CodeMirror');

    await page.locator('[id^=submit-report-tags]').fill('New Tag');
    await page.locator('a[aria-label="New Tag"]').click();

    await page.locator('[data-cy="translation-es"] [type="text"]').fill('Este es un titulo en Espanol!');

    await setEditorText(page, '## Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!', '[data-cy="translation-es"] .CodeMirror');


    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Issue 5 updated successfully')).toBeVisible({ timeout: 45000 });


    const { data } = await query({
      query: gql`{
        report(filter: { report_number: { EQ: 5 } }) {
          report_number
          authors
          date_downloaded 
          date_published
          image_url
          submitters
          title
          url
          editor_notes
          translations(languages: ["es"]) {
            title
            text
          }
        }
      }`,
    });

    expect(data.report).toMatchObject({
      report_number: 5,
      authors: ['Test Author'],
      "date_downloaded": "2022-01-01T00:00:00.000Z",
      "date_published": "2022-02-02T00:00:00.000Z",
      image_url: 'https://test.com/test.jpg',
      submitters: ['Test Submitter'],
      title: 'Test Title',
      url: 'https://www.test.com/test',
      editor_notes: 'Pro iustitia tantum',
      translations: [{
        title: 'Este es un titulo en Espanol!',
        text: '## Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!',
      }],
    })
  });

  test('Should delete incident report', async ({ page, login }) => {

    await login();

    await page.goto(url);

    page.on('dialog', async dialog => dialog.accept());

    await page.getByText('Delete this report').click();

    await expect(page.getByText('Incident report 3 deleted successfully')).toBeVisible();

    const result = await query({
      query: gql`{
        reports {
          report_number
        }
        incident(filter: { incident_id: { EQ: 3 } }) {
          reports {
            report_number
          }
        }
      }`
    });

    expect(result.data.reports).toHaveLength(8);
    expect(result.data.reports).not.toContainEqual({ report_number: 3 });
    expect(result.data.incident.reports).not.toContainEqual({ report_number: 3 });
  });

  test('Should link a report to another incident', async ({ page, login }) => {

    await login();

    await page.goto(`/cite/edit?report_number=3`);

    await expect(page.locator('form[data-cy="report"]')).toBeVisible();

    const incidentDiv = page.locator('div:has-text("Kronos Scheduling")');

    await incidentDiv.locator('xpath=following-sibling::button[1]').click();

    await page.locator('[name="incident_ids"]').fill('2');

    await page.locator('[id="incident_ids-item-0"]').click();

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('[data-cy="toast"]')).toContainText('Incident report 3 updated successfully');

    const result = await query({
      query: gql`{
        incident_3: incident(filter: { incident_id: { EQ: 3 } }) {
          reports {
            report_number
          }
        }
        incident_2: incident(filter: { incident_id: { EQ: 2 } }) {
          reports {
            report_number
          }
        }
      }`
    });

    expect(result.data.incident_3.reports).toMatchObject([{ report_number: 4 }, { report_number: 6 }, { report_number: 7 }, { report_number: 8 }]);
    expect(result.data.incident_3.reports).toHaveLength(4);

    expect(result.data.incident_2.reports).toMatchObject([{ report_number: 2 }, { report_number: 3 }]);
    expect(result.data.incident_2.reports).toHaveLength(2);
  });

  test('Should convert an incident report to an issue', async ({ page, login }) => {

    await login();

    await page.goto(`/cite/edit?report_number=3`);

    await page.locator('form[data-cy="report"]').waitFor();

    const incidentDiv = page.locator('div:has-text("Kronos Scheduling")');

    await incidentDiv.locator('xpath=following-sibling::button[1]').click();

    await page.evaluate(() => window.confirm = () => true);

    await page.getByRole('button', { name: 'Submit' }).click();

    await page.getByText('Issue 3 updated successfully').waitFor();


    const result = await query({
      query: gql`{
        incident_3: incident(filter: { incident_id: { EQ: 3 } }) {
          reports {
            report_number
          }
        }
        report(filter: { report_number: { EQ: 3 } }) {
          report_number
          is_incident_report
        }
      }`
    });

    expect(result.data.incident_3.reports).toMatchObject([{ report_number: 4 }, { report_number: 6 }, { report_number: 7 }, { report_number: 8 }]);
    expect(result.data.incident_3.reports).toHaveLength(4);

    expect(result.data.report).toMatchObject({ report_number: 3, is_incident_report: false });
  });

  test('Should display the report image', async ({ page, login }) => {

    await login();
    await page.goto(url);

    await page.locator('[data-cy="image-preview-figure"] img').waitFor();

    const imgSrc = await page.locator('[data-cy="image-preview-figure"] img').getAttribute('src');

    expect(imgSrc).toBe('https://res.cloudinary.com/pai/image/upload/f_auto/q_auto/v1/reports/static01.nyt.com/images/2014/08/13/us/worker-hours-1407960684740/worker-hours-1407960684740-articleLarge.jpg');
  });
});