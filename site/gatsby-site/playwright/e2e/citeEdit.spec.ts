import { conditionalIntercept, waitForRequest, query, setEditorText, getEditorText, test } from '../utils';
import { format, getUnixTime } from 'date-fns';
import { gql } from '@apollo/client';
import { expect } from '@playwright/test';
import config from '../config';
import reportWithTranslations from '../fixtures/reports/reportWithTranslations.json';
import report10 from '../fixtures/reports/report.json';
import updateOneReport from '../fixtures/reports/updateOneReport.json';
import updateOneReportTranslation from '../fixtures/reports/updateOneReportTranslation.json';
import issueWithTranslations from '../fixtures/reports/issueWithTranslations.json';

test.describe('Edit report', () => {
  const url = '/cite/edit?report_number=10';

  let user;

  test.beforeAll(async () => {
    const response = await query({
      query: gql`
        {
          user(query: { first_name: "Test", last_name: "User" }) {
            userId
            first_name
            last_name
          }
        }
      `,
    });
    user = response.data.user;
  });

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
    await page.evaluate(() => {
      document.querySelectorAll('*').forEach(el => {
        el.style.scrollBehavior = 'auto';
      });
    });
  });

  test('Should load and update report values', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReportWithTranslations',
      reportWithTranslations,
      'FindReportWithTranslations'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReport',
      report10,
      'FindReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncidents',
      {
        data: {
          incidents: [
            {
              _typename: 'Incident',
              incident_id: 1,
              title: 'Incident 1',
            },
          ],
        },
      },
      'FindIncidents'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncidentsTitles',
      {
        data: {
          incidents: [
            {
              _typename: 'Incident',
              incident_id: 1,
              title: 'Incident 1',
            },
            {
              _typename: 'Incident',
              incident_id: 2,
              title: 'Incident 2',
            },
          ],
        },
      },
      'FindIncidentsTitles'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'logReportHistory',
      {
        data: {
          logReportHistory: {
            report_number: 10,
          },
        },
      },
      'logReportHistory'
    );

    await page.goto(url);

    await Promise.all([
      waitForRequest('FindReportWithTranslations'),
      waitForRequest('FindIncidents'),
      waitForRequest('FindReport')
    ]);

    [
      'authors',
      'date_downloaded',
      'date_published',
      'image_url',
      'submitters',
      'title',
      'editor_notes',
    ].forEach(async (key) => {
      const locator = page.locator(`[name=${key}]`);
      await expect(locator).toHaveValue(reportWithTranslations.data.report[key].toString());
    });

    let editorText = await getEditorText(page);
    await expect(editorText).toBe(reportWithTranslations.data.report.text);

    await expect(page.locator('label:has-text("Incident IDs") + * [data-cy="token"]:has-text("Incident 1")')).toBeVisible();


    await expect(page.locator('.submit-report-tags [option="Test Tag"]')).toHaveCount(1);

    await expect(page.locator('[data-cy="translation-es"] [type="text"]')).toHaveValue(reportWithTranslations.data.report.translations_es.title);

    editorText = await getEditorText(page, '[data-cy="translation-es"] .CodeMirror');
    await expect(editorText).toBe(reportWithTranslations.data.report.translations_es.text);

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

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReport',
      updateOneReport,
      'updateReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReportTranslation',
      updateOneReportTranslation,
      'updateOneReportTranslation'
    );

    const now = new Date();
    await page.context().addInitScript(`{
      const now = ${now.getTime()};
      Date.now = () => now;
      const originalDate = Date;
      globalThis.Date = class extends originalDate {
        constructor(...args) {
          if (args.length === 0) {
            super(now);
          } else {
            super(...args);
          }
        }
      }
    }`);

    await page.getByRole('button', { name: 'Submit' }).click();

    const updateReportRequest = await waitForRequest('updateReport');
    const variables = updateReportRequest.postDataJSON().variables;

    const expectedReport = {
      authors: ['Test Author'],
      cloudinary_id: 'reports/test.com/test.jpg',
      date_downloaded: new Date('2022-01-01').toISOString(),
      date_modified: format(now, 'yyyy-MM-dd'),
      date_published: new Date('2022-02-02').toISOString(),
      epoch_date_modified: getUnixTime(now),
      epoch_date_published: 1643760000,
      flag: null,
      image_url: 'https://test.com/test.jpg',
      report_number: 10,
      submitters: ['Test Submitter'],
      tags: ['Test Tag', 'New Tag'],
      text: '## This is text in English\n\nthat is longer that eighty characters, yes eighty characters!',
      plain_text:
        'This is text in English\n\nthat is longer that eighty characters, yes eighty characters!\n',
      title: 'Test Title',
      url: 'https://www.test.com/test',
      source_domain: 'test.com',
      editor_notes: 'Pro iustitia tantum',
      language: 'en',
      quiet: true,
    };

    expect(variables.query.report_number).toBe(10);

    const expectedResult = {
      ...expectedReport,
      date_modified: format(new Date(variables.set.date_modified), 'yyyy-MM-dd')
    }

    expect({
      ...variables.set,
      date_modified: format(new Date(variables.set.date_modified), 'yyyy-MM-dd')
    }
    ).toEqual(expectedResult);

    const logReportHistoryRequest = await waitForRequest('logReportHistory');
    const input = logReportHistoryRequest.postDataJSON().variables.input;
    const expectedReportResult = {
      ...report10.data.report,
      ...expectedReport,
      modifiedBy: user.userId,
      user: report10.data.report.user.userId,
      date_modified: input.date_modified,
    };

    expect(input).toEqual(expectedReportResult);

    const updateOneReportTranslationRequest = await waitForRequest('updateOneReportTranslation');
    const translationVariables = updateOneReportTranslationRequest.postDataJSON().variables.input;
    expect(translationVariables.language).toBe('es');
    expect(translationVariables.report_number).toBe(10);
    expect(translationVariables.text).toBe('## Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!');
    expect(translationVariables.plain_text).toBe('Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!\n');
    expect(translationVariables.title).toBe('Este es un titulo en Espanol!');

    await expect(page.getByText('Incident report 10 updated successfully.')).toBeVisible();
  });

  test('Should load and update Issue values', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReportWithTranslations',
      issueWithTranslations,
      'FindReportWithTranslations'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReport',
      report10,
      'FindReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncidents',
      { data: { incidents: [] } },
      'FindIncidents'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncidentsTitles',
      { data: { incidents: [{ _typename: 'Incident', incident_id: 1, title: 'Incident 1' }] } },
      'FindIncidentsTitles'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'logReportHistory',
      { data: { logReportHistory: { report_number: 10 } } },
      'logReportHistory'
    );

    await page.goto(url);

    await Promise.all([
      waitForRequest('FindReportWithTranslations'),
      waitForRequest('FindIncidents'),
      waitForRequest('FindReport')
    ]);

    for (const key of ['authors', 'date_downloaded', 'date_published', 'image_url', 'submitters', 'title', 'editor_notes']) {
      await expect(page.locator(`[name=${key}]`)).toHaveValue(reportWithTranslations.data.report[key].toString());
    }

    const text = await getEditorText(page);
    expect(text).toBe(reportWithTranslations.data.report.text);

    await expect(page.locator(`[name="incident_id"]`)).not.toBeVisible();

    await expect(page.locator('.submit-report-tags [option="Test Tag"]')).toHaveCount(1);

    await expect(page.locator('[data-cy="translation-es"] [type="text"]')).toHaveValue(reportWithTranslations.data.report.translations_es.title);

    const esText = await getEditorText(page, '[data-cy="translation-es"] .CodeMirror');
    expect(esText).toBe(reportWithTranslations.data.report.translations_es.text);

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

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReport',
      updateOneReport,
      'updateReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReportTranslation',
      updateOneReportTranslation,
      'updateOneReportTranslation'
    );

    const now = new Date();
    await page.context().addInitScript(`Date = class extends Date { constructor() { super("${now.toISOString()}"); } }`);

    await page.getByRole('button', { name: 'Submit' }).click();

    const expectedReport = {
      authors: ['Test Author'],
      cloudinary_id: 'reports/test.com/test.jpg',
      date_downloaded: new Date('2022-01-01').toISOString(),
      date_modified: format(now, 'yyyy-MM-dd'),
      date_published: new Date('2022-02-02').toISOString(),
      epoch_date_modified: getUnixTime(now),
      epoch_date_published: 1643760000,
      flag: null,
      image_url: 'https://test.com/test.jpg',
      report_number: 10,
      submitters: ['Test Submitter'],
      tags: ['Test Tag', 'New Tag'],
      text: '## This is text in English\n\nthat is longer that eighty characters, yes eighty characters!',
      plain_text: 'This is text in English\n\nthat is longer that eighty characters, yes eighty characters!\n',
      title: 'Test Title',
      url: 'https://www.test.com/test',
      source_domain: 'test.com',
      editor_notes: 'Pro iustitia tantum',
      language: 'en'
    };

    const updateReportRequest = await waitForRequest('updateReport');
    const variables = updateReportRequest.postDataJSON().variables;
    expect(variables.query.report_number).toBe(10);
    expect({ ...variables.set, date_modified: format(new Date(variables.set.date_modified), 'yyyy-MM-dd') }).toEqual(expectedReport);

    const logReportHistoryRequest = await waitForRequest('logReportHistory');
    const input = logReportHistoryRequest.postDataJSON().variables.input;
    const expectedResult = { ...report10.data.report, ...expectedReport, modifiedBy: user.userId, user: report10.data.report.user.userId, date_modified: input.date_modified };
    expect(input).toEqual(expectedResult);

    const updateOneReportTranslationRequest = await waitForRequest('updateOneReportTranslation');
    const translationVariables = updateOneReportTranslationRequest.postDataJSON().variables.input;
    expect(translationVariables.language).toBe('es');
    expect(translationVariables.report_number).toBe(10);
    expect(translationVariables.text).toBe('## Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!');
    expect(translationVariables.plain_text).toBe('Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!\n');
    expect(translationVariables.title).toBe('Este es un titulo en Espanol!');

    await expect(page.getByText('Issue 10 updated successfully')).toBeVisible();
  });

  test('Should delete incident report', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReportWithTranslations',
      issueWithTranslations,
      'FindReportWithTranslations'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncidents',
      { data: { incidents: [] } },
      'FindIncidents'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncidentsTitles',
      {
        data: {
          incidents: [
            { _typename: 'Incident', incident_id: 1, title: 'Incident 1' }
          ]
        }
      },
      'FindIncidentsTitles'
    );

    await page.goto(url);

    await Promise.all([
      waitForRequest('FindIncidents'),
      waitForRequest('FindIncidentsTitles'),
      waitForRequest('FindReportWithTranslations')
    ]);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'DeleteOneReport',
      { data: { deleteOneReport: { __typename: 'Report', report_number: 10 } } },
      'DeleteReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'LinkReportsToIncidents',
      { data: { linkReportsToIncidents: [] } },
      'LinkReportsToIncidents'
    );

    // Set up the dialog event listener before triggering the click action
    page.once('dialog', async dialog => {
      await dialog.accept();

      const deleteRequest = await waitForRequest('DeleteReport');
      expect(deleteRequest.postDataJSON().variables.query).toEqual({ report_number: 10 });

      const linkReportsToIncidentsRequest = await waitForRequest('LinkReportsToIncidents');
      expect(linkReportsToIncidentsRequest.postDataJSON().variables.input).toEqual({
        incident_ids: [],
        report_numbers: [10]
      });

      await expect(page.getByText('Incident report 10 deleted successfully')).toBeVisible();

    });

    await page.getByText('Delete this report').click();

    await page.waitForTimeout(2000); // Needed to wait for the dialog to be accepted
  });

  test('Should link a report to another incident', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReport',
      report10,
      'FindReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'ProbablyRelatedReports',
      { data: { reports: [] } },
      'ProbablyRelatedReports'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'ProbablyRelatedIncidents',
      { data: { incidents: [] } },
      'ProbablyRelatedIncidents'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReportWithTranslations',
      reportWithTranslations,
      'FindReportWithTranslations'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncidents',
      {
        data: {
          incidents: [
            {
              __typename: 'Incident',
              incident_id: 1,
              title: 'Incident 1',
            },
          ],
        },
      },
      'FindIncidents'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncidentsTitles',
      {
        data: {
          incidents: [
            {
              _typename: 'Incident',
              incident_id: 1,
              title: 'Incident 1',
            },
            {
              _typename: 'Incident',
              incident_id: 2,
              title: 'Incident 2',
            },
          ],
        },
      },
      'FindIncidentsTitles'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'logReportHistory',
      {
        data: {
          logReportHistory: {
            report_number: 10,
          },
        },
      },
      'logReportHistory'
    );

    await page.goto(`/cite/edit?report_number=23`);

    await Promise.all([
      waitForRequest('FindReportWithTranslations'),
      waitForRequest('FindIncidents'),
      waitForRequest('FindIncidentsTitles')
    ]);

    await expect(page.locator('form[data-cy="report"]')).toBeVisible();

    const incidentDiv = page.locator('div:has-text("Incident 1")');

    await incidentDiv.locator('xpath=following-sibling::button[1]').click();

    await page.locator('[name="incident_ids"]').fill('2');

    await page.locator('[id="incident_ids-item-0"]').click();

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReportTranslation',
      updateOneReportTranslation,
      'updateOneReportTranslationSpanish'
    );
    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReportTranslation' && req.postDataJSON().variables.input.language === 'fr',
      updateOneReportTranslation,
      'updateOneReportTranslationFrench'
    );
    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReportTranslation' && req.postDataJSON().variables.input.language === 'ja',
      updateOneReportTranslation,
      'updateOneReportTranslationJapanese'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReport',
      updateOneReport,
      'UpdateReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'LinkReportsToIncidents',
      { data: { linkReportsToIncidents: [] } },
      'LinkReportsToIncidents'
    );

    await page.getByRole('button', { name: 'Submit' }).click();

    let now = new Date();
    await page.addInitScript(`{
        Date.now = () => ${now.getTime()};
    }`);

    const expectedReport = {
      authors: ['Marco Acevedo'],
      cloudinary_id: 'reports/assets.change.org/photos/0/yb/id/eYyBIdJOMHpqcty-1600x900-noPad.jpg?1523726975',
      date_downloaded: new Date('2019-04-13').toISOString(),
      date_modified: format(now, 'yyyy-MM-dd'),
      date_published: new Date('2015-07-11').toISOString(),
      editor_notes: '',
      epoch_date_published: 1436572800,
      flag: null,
      image_url: 'https://assets.change.org/photos/0/yb/id/eYyBIdJOMHpqcty-1600x900-noPad.jpg?1523726975',
      language: 'en',
      plain_text: 'Video still of a reproduced version of Minnie Mouse\n\nWhich appeared on the now-suspended Simple Fun channel Simple Fun.\n',
      report_number: 10,
      source_domain: 'change.org',
      submitters: ['Roman Yampolskiy'],
      tags: ['Test Tag'],
      text: '## Video still of a reproduced version of Minnie Mouse\n\nWhich appeared on the now-suspended Simple Fun channel Simple Fun.',
      title: 'Remove YouTube Kids app until it eliminates its inappropriate content',
      url: 'https://www.change.org/p/remove-youtube-kids-app-until-it-eliminates-its-inappropriate-content',
      epoch_date_modified: null,
    };

    now = new Date();
    const updateReportRequest = await waitForRequest('UpdateReport');
    const variables = updateReportRequest.postDataJSON().variables;
    expect(variables.query.report_number).toBe(23);

    expect({
      ...variables.set,
      date_modified: format(new Date(variables.set.date_modified), 'yyyy-MM-dd'),
    }).toEqual({
      ...expectedReport,
      epoch_date_modified: getUnixTime(now),
    });

    const expectedNow = new Date();
    const logReportHistoryRequest = await waitForRequest('logReportHistory');
    const input = logReportHistoryRequest.postDataJSON().variables.input;
    const expectedResult = {
      ...report10.data.report,
      ...expectedReport,
      modifiedBy: user.userId,
      user: report10.data.report.user.userId,
      date_modified: input.date_modified,
      epoch_date_modified: getUnixTime(now),
    };
    expect(input).toEqual(expectedResult);

    const updateOneReportTranslationRequest1 = await waitForRequest('updateOneReportTranslationSpanish');
    let translationVariables = updateOneReportTranslationRequest1.postDataJSON().variables;
    expect(translationVariables.input.title).toBe('Este es el Título en español');
    expect(translationVariables.input.text).toBe('Este es un texto de prueba que tiene un largo mayor a ochenta caracteres (en español)');
    expect(translationVariables.input.language).toBe('es');
    expect(translationVariables.input.report_number).toBe(23);
    expect(translationVariables.input.plain_text).toBe('Este es un texto de prueba que tiene un largo mayor a ochenta caracteres (en español)\n');

    const updateOneReportTranslationRequest2 = await waitForRequest('updateOneReportTranslationFrench');
    translationVariables = updateOneReportTranslationRequest2.postDataJSON().variables;
    expect(translationVariables.input.title).toBe(`C'est le Titre en français`);
    expect(translationVariables.input.text).toBe(`Il s'agit d'un texte de test de plus de quatre-vingts caractères - lorem ipsum (en français)`);
    expect(translationVariables.input.language).toBe('fr');
    expect(translationVariables.input.report_number).toBe(23);
    expect(translationVariables.input.plain_text).toBe(`Il s'agit d'un texte de test de plus de quatre-vingts caractères - lorem ipsum (en français)\n`);

    const updateOneReportTranslationRequest3 = await waitForRequest('updateOneReportTranslationJapanese');
    translationVariables = updateOneReportTranslationRequest3.postDataJSON().variables;
    expect(translationVariables.input.title).toBe('これは日本語でのタイトルです');
    expect(translationVariables.input.text).toBe('解サオライ協立なーづ民手ぶみドに即記朝ぐ奥置ぱで地更トるあて栄厚ぜづを祭屋ん来派どてゃ読速ヘ誌約カタシネ原39業理る。外ヒヱフ社第むせゆ由更混ソエ夕野しりすよ顔飛リの兆基う公言や置17謝后嘘5供フキヌア星集ヘラ辞勘壇崇さびわ。（日本語で）');
    expect(translationVariables.input.language).toBe('ja');
    expect(translationVariables.input.report_number).toBe(23);
    expect(translationVariables.input.plain_text).toBe('解サオライ協立なーづ民手ぶみドに即記朝ぐ奥置ぱで地更トるあて栄厚ぜづを祭屋ん来派どてゃ読速ヘ誌約カタシネ原39業理る。外ヒヱフ社第むせゆ由更混ソエ夕野しりすよ顔飛リの兆基う公言や置17謝后嘘5供フキヌア星集ヘラ辞勘壇崇さびわ。（日本語で）\n');

    const linkReportsToIncidentsRequest = await waitForRequest('LinkReportsToIncidents');
    expect(linkReportsToIncidentsRequest.postDataJSON().variables.input).toEqual({
      incident_ids: [2],
      report_numbers: [23],
    });

    await expect(page.locator('[data-cy="toast"]')).toContainText('Incident report 23 updated successfully');
  });

  test('Should convert an incident report to an issue', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReport',
      report10,
      'FindReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'ProbablyRelatedReports',
      { data: { reports: [] } },
      'ProbablyRelatedReports'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'ProbablyRelatedIncidents',
      { data: { incidents: [] } },
      'ProbablyRelatedIncidents'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindReportWithTranslations',
      reportWithTranslations,
      'FindReportWithTranslations'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncidents',
      {
        data: {
          incidents: [
            {
              _typename: 'Incident',
              incident_id: 1,
              title: 'Incident 1',
            },
          ],
        },
      },
      'FindIncidents'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncidentsTitles',
      {
        data: {
          incidents: [
            { _typename: 'Incident', incident_id: 1, title: 'Incident 1' },
            { _typename: 'Incident', incident_id: 2, title: 'Incident 2' },
          ],
        },
      },
      'FindIncidentsTitles'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'logReportHistory',
      { data: { logReportHistory: { report_number: 10 } } },
      'logReportHistory'
    );

    await page.goto(`/cite/edit?report_number=23`);

    await page.locator('form[data-cy="report"]').waitFor();

    const incidentDiv = page.locator('div:has-text("Incident 1")');

    await incidentDiv.locator('xpath=following-sibling::button[1]').click();

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReport',
      updateOneReport,
      'UpdateReport'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateReportTranslation',
      updateOneReportTranslation,
      'UpdateReportTranslation'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'LinkReportsToIncidents',
      { data: { linkReportsToIncidents: [] } },
      'LinkReportsToIncidents'
    );

    await page.evaluate(() => window.confirm = () => true);

    const now = new Date();

    await page.addInitScript(`{
      Date.now = () => ${now.getTime()};
  }`);

    await page.getByRole('button', { name: 'Submit' }).click();

    const expectedReport = {
      authors: ['Marco Acevedo'],
      cloudinary_id:
        'reports/assets.change.org/photos/0/yb/id/eYyBIdJOMHpqcty-1600x900-noPad.jpg?1523726975',
      date_downloaded: new Date('2019-04-13').toISOString(),
      date_published: new Date('2015-07-11').toISOString(),
      flag: null,
      image_url:
        'https://assets.change.org/photos/0/yb/id/eYyBIdJOMHpqcty-1600x900-noPad.jpg?1523726975',
      report_number: 10,
      submitters: ['Roman Yampolskiy'],
      tags: ['Test Tag'],
      text: '## Video still of a reproduced version of Minnie Mouse\n\nWhich appeared on the now-suspended Simple Fun channel Simple Fun.',
      plain_text:
        'Video still of a reproduced version of Minnie Mouse\n\nWhich appeared on the now-suspended Simple Fun channel Simple Fun.\n',
      title: 'Remove YouTube Kids app until it eliminates its inappropriate content',
      url: 'https://www.change.org/p/remove-youtube-kids-app-until-it-eliminates-its-inappropriate-content',
      editor_notes: '',
      language: 'en',
      source_domain: 'change.org',
      epoch_date_published: 1436572800,
      date_modified: format(now, 'yyyy-MM-dd'),
      epoch_date_modified: getUnixTime(now),
    };

    const updateReportRequest = await waitForRequest('UpdateReport');
    const variables = updateReportRequest.postDataJSON().variables;
    expect(variables.query.report_number).toBe(23);
    expect({
      ...variables.set,
      date_modified: format(new Date(variables.set.date_modified), 'yyyy-MM-dd'),
    }).toEqual(expectedReport);

    const logReportHistoryRequest = await waitForRequest('logReportHistory');
    const input = logReportHistoryRequest.postDataJSON().variables.input;
    const expectedResult = {
      ...report10.data.report,
      ...expectedReport,
      modifiedBy: user.userId,
      user: report10.data.report.user.userId,
      date_modified: input.date_modified,
    };

    expect(input).toEqual(expectedResult);

    await waitForRequest('UpdateReportTranslation');
    await waitForRequest('UpdateReportTranslation');

    const linkReportsToIncidentsRequest = await waitForRequest('LinkReportsToIncidents');
    expect(linkReportsToIncidentsRequest.postDataJSON().variables.input).toEqual({
      incident_ids: [],
      report_numbers: [23],
    });

    await page.getByText('Issue 23 updated successfully').waitFor();
  });

  test('Should display the report image', async ({ page, login }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);

    await page.goto(url);

    await page.locator('[data-cy="image-preview-figure"] img').waitFor();
    const imgSrc = await page.locator('[data-cy="image-preview-figure"] img').getAttribute('src');
    expect(imgSrc).toBe('https://res.cloudinary.com/pai/image/upload/f_auto/q_auto/v1/reports/assets.change.org/photos/0/yb/id/eYyBIdJOMHpqcty-1600x900-noPad.jpg?1523726975');
  });
});