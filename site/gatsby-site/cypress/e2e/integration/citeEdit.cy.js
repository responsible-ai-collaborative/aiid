import { maybeIt } from '../../support/utils';
import updateOneReport from '../../fixtures/reports/updateOneReport.json';
import updateOneReportTranslation from '../../fixtures/reports/updateOneReportTranslation.json';
import { format, getUnixTime } from 'date-fns';
import reportWithTranslations from '../../fixtures/reports/reportWithTranslations.json';
import issueWithTranslations from '../../fixtures/reports/issueWithTranslations.json';
import report10 from '../../fixtures/reports/report.json';
const { gql } = require('@apollo/client');

describe('Edit report', () => {
  const url = '/cite/edit?report_number=10';

  let user;

  before('before', () => {
    cy.query({
      query: gql`
        {
          user(query: { first_name: "Test", last_name: "User" }) {
            userId
            first_name
            last_name
          }
        }
      `,
    }).then(({ data: { user: userData } }) => {
      user = userData;
    });
  });

  it('Successfully loads', () => {
    cy.visit(url);

    cy.disableSmoothScroll();
  });

  maybeIt('Should load and update report values', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'FindReportWithTranslations',
      reportWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'FindReport',
      report10
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'FindIncidents',
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
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentsTitles',
      'FindIncidentsTitles',
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
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logReportHistory',
      'logReportHistory',
      {
        data: {
          logReportHistory: {
            report_number: 10,
          },
        },
      }
    );

    cy.visit(url);

    cy.wait(['@FindReportWithTranslations', '@FindIncidents', '@FindReport']);

    [
      'authors',
      'date_downloaded',
      'date_published',
      'image_url',
      'submitters',
      'title',
      'editor_notes',
    ].forEach((key) => {
      cy.get(`[name=${key}]`).should(
        'have.value',
        reportWithTranslations.data.report[key].toString()
      );
    });

    cy.getEditorText().should('eq', reportWithTranslations.data.report.text);

    cy.contains('label', 'Incident IDs')
      .next()
      .contains('[data-cy="token"]', 'Incident 1')
      .should('be.visible');

    cy.get('.submit-report-tags [option="Test Tag"]').should('have.length', 1);

    cy.get('[data-cy="translation-es"] [type="text"]').should(
      'have.value',
      reportWithTranslations.data.report.translations_es.title
    );

    cy.getEditorText('[data-cy="translation-es"] .CodeMirror').should(
      'eq',
      reportWithTranslations.data.report.translations_es.text
    );

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

    Object.keys(updates).forEach((key) => {
      cy.get(`[name=${key}]`).clear().type(updates[key]);
    });

    cy.setEditorText(
      '## This is text in English\n\nthat is longer that eighty characters, yes eighty characters!',
      '[data-cy="text"] .CodeMirror'
    );

    cy.get('[id^=submit-report-tags]').type('New Tag');

    cy.get('a[aria-label="New Tag"]').click();

    cy.get('[data-cy="translation-es"] [type="text"]')
      .clear()
      .type('Este es un titulo en Espanol!');

    cy.setEditorText(
      '## Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!',
      '[data-cy="translation-es"] .CodeMirror'
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'updateReport',
      updateOneReport
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReportTranslation',
      'updateOneReportTranslation',
      updateOneReportTranslation
    );

    const now = new Date();

    cy.clock(now);

    cy.contains('button', 'Submit').click();

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
    };

    cy.wait('@updateReport').then((xhr) => {
      expect(xhr.request.body.variables.query.report_number).eq(expectedReport.report_number);
      expect({
        ...xhr.request.body.variables.set,
        date_modified: format(new Date(xhr.request.body.variables.set.date_modified), 'yyyy-MM-dd'),
      }).to.deep.eq(expectedReport);
    });

    cy.wait('@logReportHistory')
      .its('request.body.variables.input')
      .then((input) => {
        const expectedResult = {
          ...report10.data.report,
          ...expectedReport,
          modifiedBy: user.userId,
          user: report10.data.report.user.userId,
          date_modified: input.date_modified,
        };

        expect(input).to.deep.eq(expectedResult);
      });

    cy.wait('@updateOneReportTranslation').then((xhr) => {
      expect(xhr.request.body.variables.input.language).eq('es');
      expect(xhr.request.body.variables.input.report_number).eq(10);
      expect(xhr.request.body.variables.input.text).eq(
        '## Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!'
      );
      expect(xhr.request.body.variables.input.plain_text).eq(
        'Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!\n'
      );
      expect(xhr.request.body.variables.input.title).eq('Este es un titulo en Espanol!');
    });

    cy.get('.tw-toast').contains('Incident report 10 updated successfully.').should('exist');
  });

  maybeIt('Should load and update Issue values', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'FindReportWithTranslations',
      issueWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'FindReport',
      report10
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'FindIncidents',
      {
        data: {
          incidents: [],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentsTitles',
      'FindIncidentsTitles',
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
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logReportHistory',
      'logReportHistory',
      {
        data: {
          logReportHistory: {
            report_number: 10,
          },
        },
      }
    );

    cy.visit(url);

    cy.wait(['@FindReportWithTranslations', '@FindIncidents', '@FindReport']);

    [
      'authors',
      'date_downloaded',
      'date_published',
      'image_url',
      'submitters',
      'title',
      'editor_notes',
    ].forEach((key) => {
      cy.get(`[name=${key}]`).should(
        'have.value',
        reportWithTranslations.data.report[key].toString()
      );
    });

    cy.getEditorText().should('eq', reportWithTranslations.data.report.text);

    cy.get(`[name="incident_id"]`).should('not.exist');

    cy.get('.submit-report-tags [option="Test Tag"]').should('have.length', 1);

    cy.get('[data-cy="translation-es"] [type="text"]').should(
      'have.value',
      reportWithTranslations.data.report.translations_es.title
    );

    cy.getEditorText('[data-cy="translation-es"] .CodeMirror').should(
      'eq',
      reportWithTranslations.data.report.translations_es.text
    );

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

    Object.keys(updates).forEach((key) => {
      cy.get(`[name=${key}]`).clear().type(updates[key]);
    });

    cy.setEditorText(
      '## This is text in English\n\nthat is longer that eighty characters, yes eighty characters!',
      '[data-cy="text"] .CodeMirror'
    );

    cy.get('[id^=submit-report-tags]').type('New Tag');

    cy.get('a[aria-label="New Tag"]').click();

    cy.get('[data-cy="translation-es"] [type="text"]')
      .clear()
      .type('Este es un titulo en Espanol!');

    cy.setEditorText(
      '## Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!',
      '[data-cy="translation-es"] .CodeMirror'
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'updateReport',
      updateOneReport
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReportTranslation',
      'updateOneReportTranslation',
      updateOneReportTranslation
    );

    const now = new Date();

    cy.clock(now);

    cy.contains('button', 'Submit').click();

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
    };

    cy.wait('@updateReport').then((xhr) => {
      expect(xhr.request.body.variables.query.report_number).eq(10);
      expect({
        ...xhr.request.body.variables.set,
        date_modified: format(new Date(xhr.request.body.variables.set.date_modified), 'yyyy-MM-dd'),
      }).to.deep.eq(expectedReport);
    });

    cy.wait('@logReportHistory')
      .its('request.body.variables.input')
      .then((input) => {
        const expectedResult = {
          ...report10.data.report,
          ...expectedReport,
          modifiedBy: user.userId,
          user: report10.data.report.user.userId,
          date_modified: input.date_modified,
        };

        expect(input).to.deep.eq(expectedResult);
      });

    cy.wait('@updateOneReportTranslation').then((xhr) => {
      expect(xhr.request.body.variables.input.language).eq('es');
      expect(xhr.request.body.variables.input.report_number).eq(10);
      expect(xhr.request.body.variables.input.text).eq(
        '## Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!'
      );
      expect(xhr.request.body.variables.input.plain_text).eq(
        'Este es texto en espanol\n\nque es mas largo que ochenta caracters, si ochenta caracteres!\n'
      );
      expect(xhr.request.body.variables.input.title).eq('Este es un titulo en Espanol!');
    });

    cy.contains('[data-cy="toast"]', 'Issue 10 updated successfully').should('exist');
  });

  maybeIt('Should delete incident report', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'FindReportWithTranslations',
      issueWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'FindIncidents',
      {
        data: {
          incidents: [],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentsTitles',
      'FindIncidentsTitles',
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
      }
    );

    cy.visit(url);

    cy.wait(['@FindIncidents', '@FindIncidentsTitles', '@FindReportWithTranslations']);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'DeleteOneReport',
      'delete',
      { data: { deleteOneReport: { __typename: 'Report', report_number: 10 } } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'LinkReportsToIncidents',
      'LinkReportsToIncidents',
      {
        data: {
          linkReportsToIncidents: [],
        },
      }
    );

    cy.contains('button', 'Delete this report').click();

    cy.wait('@delete').then((xhr) => {
      expect(xhr.request.body.variables.query).to.deep.eq({ report_number: 10 });
    });

    cy.wait('@LinkReportsToIncidents').then((xhr) => {
      expect(xhr.request.body.variables.input).to.deep.eq({
        incident_ids: [],
        report_numbers: [10],
      });
    });

    cy.contains('[data-cy="toast"]', 'Incident report 10 deleted successfully').should('exist');
  });

  maybeIt('Should link a report to another incident', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'FindReport',
      report10
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'ProbablyRelatedReports',
      'ProbablyRelatedReports',
      {
        data: { reports: [] },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'ProbablyRelatedIncidents',
      'ProbablyRelatedIncidents',
      {
        data: { incidents: [] },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'FindReportWithTranslations',
      reportWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'FindIncidents',
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
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentsTitles',
      'FindIncidentsTitles',
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
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logReportHistory',
      'logReportHistory',
      {
        data: {
          logReportHistory: {
            report_number: 10,
          },
        },
      }
    );

    cy.visit(`/cite/edit?report_number=23`);

    cy.wait(['@FindReportWithTranslations', '@FindIncidents', '@FindIncidentsTitles']);

    cy.get('form[data-cy="report"]').should('be.visible');

    cy.contains('div', 'Incident 1').next().click();

    cy.get('[name="incident_ids"]').type('2');

    cy.get('[id="incident_ids-item-0"]').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReportTranslation',
      'updateOneReportTranslation',
      updateOneReportTranslation
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'UpdateReport',
      updateOneReport
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'LinkReportsToIncidents',
      'LinkReportsToIncidents',
      {
        data: {
          linkReportsToIncidents: [],
        },
      }
    );

    const now = new Date();

    cy.clock(now);

    cy.contains('button', 'Submit').click();

    const expectedReport = {
      authors: ['Marco Acevedo'],
      cloudinary_id:
        'reports/assets.change.org/photos/0/yb/id/eYyBIdJOMHpqcty-1600x900-noPad.jpg?1523726975',
      date_downloaded: new Date('2019-04-13').toISOString(),
      date_modified: format(now, 'yyyy-MM-dd'),
      date_published: new Date('2015-07-11').toISOString(),
      editor_notes: '',
      epoch_date_modified: getUnixTime(now),
      epoch_date_published: 1436572800,
      flag: null,
      image_url:
        'https://assets.change.org/photos/0/yb/id/eYyBIdJOMHpqcty-1600x900-noPad.jpg?1523726975',
      language: 'en',
      plain_text:
        'Video still of a reproduced version of Minnie Mouse\n\nWhich appeared on the now-suspended Simple Fun channel Simple Fun.\n',
      report_number: 10,
      source_domain: 'change.org',
      submitters: ['Roman Yampolskiy'],
      tags: ['Test Tag'],
      text: '## Video still of a reproduced version of Minnie Mouse\n\nWhich appeared on the now-suspended Simple Fun channel Simple Fun.',
      title: 'Remove YouTube Kids app until it eliminates its inappropriate content',
      url: 'https://www.change.org/p/remove-youtube-kids-app-until-it-eliminates-its-inappropriate-content',
    };

    cy.wait('@UpdateReport')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.report_number).to.equal(23);
        expect({
          ...variables.set,
          date_modified: format(new Date(variables.set.date_modified), 'yyyy-MM-dd'),
        }).deep.eq(expectedReport);
      });

    cy.wait('@logReportHistory')
      .its('request.body.variables.input')
      .then((input) => {
        const expectedResult = {
          ...report10.data.report,
          ...expectedReport,
          modifiedBy: user.userId,
          user: report10.data.report.user.userId,
          date_modified: input.date_modified,
        };

        expect(input).to.deep.eq(expectedResult);
      });

    cy.wait('@updateOneReportTranslation')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.input.title).to.eq('Este es el Título en español');
        expect(variables.input.text).to.eq(
          'Este es un texto de prueba que tiene un largo mayor a ochenta caracteres (en español)'
        );
        expect(variables.input.language).to.eq('es');
        expect(variables.input.report_number).to.eq(23);
        expect(variables.input.plain_text).to.eq(
          'Este es un texto de prueba que tiene un largo mayor a ochenta caracteres (en español)\n'
        );
      });

    cy.wait('@updateOneReportTranslation')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.input.title).to.eq(`C'est le Titre en français`);
        expect(variables.input.text).to.eq(
          `Il s'agit d'un texte de test de plus de quatre-vingts caractères - lorem ipsum (en français)`
        );
        expect(variables.input.language).to.eq('fr');
        expect(variables.input.report_number).to.eq(23);
        expect(variables.input.plain_text).to.eq(
          `Il s'agit d'un texte de test de plus de quatre-vingts caractères - lorem ipsum (en français)\n`
        );
      });

    cy.wait('@updateOneReportTranslation')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.input.title).to.eq('これは日本語でのタイトルです');
        expect(variables.input.text).to.eq(
          '解サオライ協立なーづ民手ぶみドに即記朝ぐ奥置ぱで地更トるあて栄厚ぜづを祭屋ん来派どてゃ読速ヘ誌約カタシネ原39業理る。外ヒヱフ社第むせゆ由更混ソエ夕野しりすよ顔飛リの兆基う公言や置17謝后嘘5供フキヌア星集ヘラ辞勘壇崇さびわ。（日本語で）'
        );
        expect(variables.input.language).to.eq('ja');
        expect(variables.input.report_number).to.eq(23);
        expect(variables.input.plain_text).to.eq(
          '解サオライ協立なーづ民手ぶみドに即記朝ぐ奥置ぱで地更トるあて栄厚ぜづを祭屋ん来派どてゃ読速ヘ誌約カタシネ原39業理る。外ヒヱフ社第むせゆ由更混ソエ夕野しりすよ顔飛リの兆基う公言や置17謝后嘘5供フキヌア星集ヘラ辞勘壇崇さびわ。（日本語で）\n'
        );
      });

    cy.wait('@LinkReportsToIncidents').then((xhr) => {
      expect(xhr.request.body.variables.input).to.deep.eq({
        incident_ids: [2],
        report_numbers: [23],
      });
    });

    cy.contains('[data-cy="toast"]', 'Incident report 23 updated successfully', { timeout: 8000 });
  });

  maybeIt('Should display an error message if data is missing', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'findReportWithTranslations',
      reportWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'ProbablyRelatedReports',
      'ProbablyRelatedReports',
      {
        data: { reports: [] },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'ProbablyRelatedIncidents',
      'ProbablyRelatedIncidents',
      {
        data: { incidents: [] },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'FindIncidents',
      { data: { incidents: [] } }
    );

    cy.visit(`/cite/edit?report_number=23`);

    cy.wait('@findReportWithTranslations');

    cy.get('form[data-cy="report"]').should('be.visible');

    cy.get('[name="title"]').clear();

    cy.contains('Please review report. Some data is missing.').should('exist');

    cy.contains('button', 'Submit').should('be.disabled');

    cy.get('[name="title"]').type(
      'Remove YouTube Kids app until it eliminates its inappropriate content'
    );

    cy.contains('button', 'Submit').should('not.be.disabled');
  });

  maybeIt('Should convert an issue to a incident report', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'FindReport',
      report10
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'ProbablyRelatedReports',
      'ProbablyRelatedReports',
      {
        data: { reports: [] },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'ProbablyRelatedIncidents',
      'ProbablyRelatedIncidents',
      {
        data: { incidents: [] },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'FindReportWithTranslations',
      issueWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'FindIncidents',
      { data: { incidents: [] } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentsTitles',
      'FindIncidentsTitles',
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
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logReportHistory',
      'logReportHistory',
      {
        data: {
          logReportHistory: {
            report_number: 10,
          },
        },
      }
    );

    cy.visit(`/cite/edit?report_number=23`);

    cy.wait('@FindIncidents');

    cy.wait('@FindReportWithTranslations');

    cy.wait('@FindIncidentsTitles');

    cy.get('form[data-cy="report"]').should('be.visible');

    cy.get('[name="incident_ids"]').type('1');

    cy.get('[id="incident_ids-item-0"]').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'UpdateReport',
      updateOneReport
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReportTranslation',
      'UpdateReportTranslation',
      updateOneReportTranslation
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'LinkReportsToIncidents',
      'LinkReportsToIncidents',
      {
        data: {
          linkReportsToIncidents: [
            {
              __typename: 'Incident',
              incident_id: 1,
              reports: [{ __typename: 'Report', report_number: 23 }],
            },
          ],
        },
      }
    );

    cy.window().then((win) => cy.stub(win, 'confirm').as('confirm').returns(true));

    const now = new Date();

    cy.clock(now);

    cy.contains('button', 'Submit').click();

    cy.get('@confirm').should('have.been.calledOnce').invoke('restore');

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

    cy.wait('@UpdateReport')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.report_number).to.equal(23);
        expect({
          ...variables.set,
          date_modified: format(new Date(variables.set.date_modified), 'yyyy-MM-dd'),
        }).deep.eq(expectedReport);
      });

    cy.wait('@logReportHistory')
      .its('request.body.variables.input')
      .then((input) => {
        const expectedResult = {
          ...report10.data.report,
          ...expectedReport,
          modifiedBy: user.userId,
          user: report10.data.report.user.userId,
          date_modified: input.date_modified,
        };

        expect(input).to.deep.eq(expectedResult);
      });

    cy.wait('@UpdateReportTranslation');

    cy.wait('@UpdateReportTranslation');

    cy.wait('@LinkReportsToIncidents').then((xhr) => {
      expect(xhr.request.body.variables.input).to.deep.eq({
        incident_ids: [1],
        report_numbers: [23],
      });
    });

    cy.contains('[data-cy="toast"]', 'Incident report 23 updated successfully.', { timeout: 8000 });
  });

  maybeIt('Should convert an incident report to an issue', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'FindReport',
      report10
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'ProbablyRelatedReports',
      'ProbablyRelatedReports',
      {
        data: { reports: [] },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'ProbablyRelatedIncidents',
      'ProbablyRelatedIncidents',
      {
        data: { incidents: [] },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'FindReportWithTranslations',
      reportWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'FindIncidents',
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
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentsTitles',
      'FindIncidentsTitles',
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
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logReportHistory',
      'logReportHistory',
      {
        data: {
          logReportHistory: {
            report_number: 10,
          },
        },
      }
    );

    cy.visit(`/cite/edit?report_number=23`);

    cy.wait('@FindIncidents');

    cy.wait('@FindReportWithTranslations');

    cy.wait('@FindIncidentsTitles');

    cy.get('form[data-cy="report"]').should('be.visible');

    cy.contains('div', 'Incident 1').next().click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'UpdateReport',
      updateOneReport
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReportTranslation',
      'UpdateReportTranslation',
      updateOneReportTranslation
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'LinkReportsToIncidents',
      'LinkReportsToIncidents',
      {
        data: {
          linkReportsToIncidents: [],
        },
      }
    );

    cy.window().then((win) => cy.stub(win, 'confirm').as('confirm').returns(true));

    const now = new Date();

    cy.clock(now);

    cy.contains('button', 'Submit').click();

    cy.get('@confirm').should('have.been.calledOnce').invoke('restore');

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

    cy.wait('@UpdateReport')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.report_number).to.equal(23);
        expect({
          ...variables.set,
          date_modified: format(new Date(variables.set.date_modified), 'yyyy-MM-dd'),
        }).deep.eq(expectedReport);
      });

    cy.wait('@logReportHistory')
      .its('request.body.variables.input')
      .then((input) => {
        const expectedResult = {
          ...report10.data.report,
          ...expectedReport,
          modifiedBy: user.userId,
          user: report10.data.report.user.userId,
          date_modified: input.date_modified,
        };

        expect(input).to.deep.eq(expectedResult);
      });

    cy.wait('@UpdateReportTranslation');

    cy.wait('@UpdateReportTranslation');

    cy.wait('@LinkReportsToIncidents').then((xhr) => {
      expect(xhr.request.body.variables.input).to.deep.eq({
        incident_ids: [],
        report_numbers: [23],
      });
    });

    cy.contains('[data-cy="toast"]', 'Issue 23 updated successfully', { timeout: 8000 });
  });

  it.skip('Should display the report image', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.get('[data-cy="image-preview-figure"] img', { timeout: 15000 }).should(
      'have.attr',
      'src',
      'https://res.cloudinary.com/pai/image/upload/d_fallback.jpg/f_auto/q_auto/v1/reports/assets.change.org/photos/0/yb/id/eYyBIdJOMHpqcty-1600x900-noPad.jpg?1523726975'
    );
  });
});
