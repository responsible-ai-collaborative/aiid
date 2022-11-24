import { maybeIt } from '../support/utils';

import updateOneReport from '../fixtures/reports/updateOneReport.json';

import updateOneReportTranslation from '../fixtures/reports/updateOneReportTranslation.json';

import { format, getUnixTime } from 'date-fns';

import incident from '../fixtures/incidents/incident.json';

import reportWithTranslations from '../fixtures/reports/reportWithTranslations.json';

import issueWithTranslations from '../fixtures/reports/issueWithTranslations.json';

import reportSiblings from '../fixtures/reports/reportSiblings.json';

import incidentWithDeletedReport from '../fixtures/incidents/incidentWithDeletedReport.json';

describe('Edit report', () => {
  const url = '/cite/edit?report_number=10';

  it('Successfully loads', () => {
    cy.visit(url);

    cy.disableSmoothScroll();
  });

  maybeIt('Should load and update report values', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'findReportWithTranslations',
      reportWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      incident
    );

    cy.visit(url);

    cy.wait(['@findReportWithTranslations', '@findIncident']);

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

    cy.get(`[name="incident_id"]`).should('have.value', incident.data.incident.incident_id);

    cy.get('[class*=Typeahead] [option="Test Tag"]').should('have.length', 1);

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

    cy.get('[class*=Typeahead] [type="text"]').type('New Tag');

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

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'updateIncident',
      {}
    );

    cy.contains('button', 'Submit').click();

    cy.wait('@updateReport').then((xhr) => {
      expect(xhr.request.body.variables.query.report_number).eq(10);

      const date_modified = format(new Date(), 'yyyy-MM-dd');

      const epoch_date_modified = getUnixTime(new Date(date_modified));

      expect(xhr.request.body.variables.set.authors).deep.eq(['Test Author']);
      expect(xhr.request.body.variables.set.cloudinary_id).eq('reports/test.com/test.jpg');
      expect(xhr.request.body.variables.set.date_downloaded).eq('2022-01-01');
      expect(xhr.request.body.variables.set.date_modified).eq(date_modified);
      expect(xhr.request.body.variables.set.date_published).eq('2022-02-02');
      expect(xhr.request.body.variables.set.epoch_date_downloaded).eq(1640995200);
      expect(xhr.request.body.variables.set.epoch_date_modified).eq(epoch_date_modified);
      expect(xhr.request.body.variables.set.epoch_date_published).eq(1643760000);
      expect(xhr.request.body.variables.set.flag).eq(null);
      expect(xhr.request.body.variables.set.image_url).eq('https://test.com/test.jpg');
      expect(xhr.request.body.variables.set.report_number).eq(10);
      expect(xhr.request.body.variables.set.submitters).deep.eq(['Test Submitter']);
      expect(xhr.request.body.variables.set.tags).deep.eq(['Test Tag', 'New Tag']);
      expect(xhr.request.body.variables.set.text).eq(
        '## This is text in English\n\nthat is longer that eighty characters, yes eighty characters!'
      );
      expect(xhr.request.body.variables.set.plain_text).eq(
        'This is text in English\n\nthat is longer that eighty characters, yes eighty characters!\n'
      );
      expect(xhr.request.body.variables.set.title).eq('Test Title');
      expect(xhr.request.body.variables.set.url).eq('https://www.test.com/test');
      expect(xhr.request.body.variables.set.source_domain).eq('test.com');
      expect(xhr.request.body.variables.set.editor_notes).eq('Pro iustitia tantum');
      expect(xhr.request.body.variables.set.language).eq('en');
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

    cy.on('fail', (err) => {
      expect(err.message).to.include('`updateIncident`. No request ever occurred.');
    });

    cy.wait('@updateIncident', { timeout: 1000 });

    cy.get('div[class^="ToastContext"]')
      .contains('Incident report 10 updated successfully.')
      .should('exist');
  });

  maybeIt('Should load and update Issue values', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'findReportWithTranslations',
      issueWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      { data: { incident: null } }
    );

    cy.visit(url);

    cy.wait(['@findReportWithTranslations', '@findIncident']);

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

    cy.get('[class*=Typeahead] [option="Test Tag"]').should('have.length', 1);

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

    cy.get('[class*=Typeahead] [type="text"]').type('New Tag');

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

    cy.contains('button', 'Submit').click();

    cy.wait('@updateReport').then((xhr) => {
      expect(xhr.request.body.variables.query.report_number).eq(10);

      const date_modified = format(new Date(), 'yyyy-MM-dd');

      const epoch_date_modified = getUnixTime(new Date(date_modified));

      expect(xhr.request.body.variables.set.authors).deep.eq(['Test Author']);
      expect(xhr.request.body.variables.set.cloudinary_id).eq('reports/test.com/test.jpg');
      expect(xhr.request.body.variables.set.date_downloaded).eq('2022-01-01');
      expect(xhr.request.body.variables.set.date_modified).eq(date_modified);
      expect(xhr.request.body.variables.set.date_published).eq('2022-02-02');
      expect(xhr.request.body.variables.set.epoch_date_downloaded).eq(1640995200);
      expect(xhr.request.body.variables.set.epoch_date_modified).eq(epoch_date_modified);
      expect(xhr.request.body.variables.set.epoch_date_published).eq(1643760000);
      expect(xhr.request.body.variables.set.flag).eq(null);
      expect(xhr.request.body.variables.set.image_url).eq('https://test.com/test.jpg');
      expect(xhr.request.body.variables.set.report_number).eq(10);
      expect(xhr.request.body.variables.set.submitters).deep.eq(['Test Submitter']);
      expect(xhr.request.body.variables.set.tags).deep.eq(['Test Tag', 'New Tag']);
      expect(xhr.request.body.variables.set.text).eq(
        '## This is text in English\n\nthat is longer that eighty characters, yes eighty characters!'
      );
      expect(xhr.request.body.variables.set.plain_text).eq(
        'This is text in English\n\nthat is longer that eighty characters, yes eighty characters!\n'
      );
      expect(xhr.request.body.variables.set.title).eq('Test Title');
      expect(xhr.request.body.variables.set.url).eq('https://www.test.com/test');
      expect(xhr.request.body.variables.set.source_domain).eq('test.com');
      expect(xhr.request.body.variables.set.editor_notes).eq('Pro iustitia tantum');
      expect(xhr.request.body.variables.set.language).eq('en');
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

    cy.contains('[data-cy="toast"]', 'Issue 10 updated successfully. View Issue 10.').should(
      'exist'
    );
  });

  maybeIt('Should delete incident report', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'findReportWithTranslations',
      reportWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      incident
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'DeleteOneReport',
      'delete',
      { data: { deleteOneReport: { __typename: 'Report', report_number: 10 } } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'Siblings',
      'siblings',
      reportSiblings
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'updateIncident',
      incidentWithDeletedReport
    );

    cy.visit(url);

    cy.wait(['@findReportWithTranslations', '@findIncident']);

    cy.contains('button', 'Delete this report', { timeout: 8000 }).click();

    cy.wait('@delete');

    cy.wait('@updateIncident');

    cy.get('div[class^="ToastContext"]')
      .contains('Incident report 10 deleted successfully')
      .should('exist');
  });

  maybeIt('Should link a report to another incident', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'UpdateReport',
      {
        data: {
          updateOneReport: {
            __typename: 'Report',
            authors: ['Aimee Picchi'],
            date_downloaded: '2019-04-13',
            date_published: '2015-09-24',
            flag: true,
            image_url:
              'https://cbsnews1.cbsistatic.com/hub/i/r/2015/03/17/01a38576-5108-40f7-8df8-5416164ed878/thumbnail/1200x630/ca8d35fe6bc065b5c9a747d92bc6d94c/154211248.jpg',
            report_number: 23,
            submitters: ['Catherine Olsson'],
            tags: ['boe'],
            text: '## Video still of a reproduced version of Minnie Mouse\n\nWhich appeared on the now-suspended Simple Fun channel Simple Fun.',
            plain_text:
              'Video still of a reproduced version of Minnie Mouse\n\nWhich appeared on the now-suspended Simple Fun channel Simple Fun.',
            title: '​Is Starbucks shortchanging its baristas?',
            url: 'https://www.cbsnews.com/news/is-starbucks-shortchanging-its-baristas/',
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'RelatedIncidents',
      'RelatedIncidents',
      {
        data: {
          incidentsToLink: [
            {
              __typename: 'Incident',
              incident_id: 12,
              reports: [{ __typename: 'Report', report_number: 42 }],
            },
          ],
          incidentsToUnlink: [
            {
              __typename: 'Incident',
              incident_id: 10,
              reports: [
                { __typename: 'Report', report_number: 16 },
                { __typename: 'Report', report_number: 17 },
                { __typename: 'Report', report_number: 18 },
                { __typename: 'Report', report_number: 19 },
                { __typename: 'Report', report_number: 20 },
                { __typename: 'Report', report_number: 21 },
                { __typename: 'Report', report_number: 22 },
                { __typename: 'Report', report_number: 23 },
                { __typename: 'Report', report_number: 24 },
                { __typename: 'Report', report_number: 25 },
              ],
            },
          ],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpdateIncident' && req.body.variables.query.incident_id === 10,
      'UpdateIncident10',
      {
        data: {
          updateOneIncident: {
            __typename: 'Incident',
            incident_id: 10,
            reports: [
              { __typename: 'Report', report_number: 16 },
              { __typename: 'Report', report_number: 17 },
              { __typename: 'Report', report_number: 18 },
              { __typename: 'Report', report_number: 19 },
              { __typename: 'Report', report_number: 20 },
              { __typename: 'Report', report_number: 21 },
              { __typename: 'Report', report_number: 22 },
              { __typename: 'Report', report_number: 24 },
              { __typename: 'Report', report_number: 25 },
            ],
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpdateIncident' && req.body.variables.query.incident_id === 12,
      'UpdateIncident12',
      {
        data: {
          updateOneIncident: {
            __typename: 'Incident',
            incident_id: 12,
            reports: [
              { __typename: 'Report', report_number: 23 },
              { __typename: 'Report', report_number: 42 },
            ],
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'findReportWithTranslations',
      reportWithTranslations
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReportTranslation',
      'updateOneReportTranslation',
      updateOneReportTranslation
    );

    cy.visit(`/cite/edit?report_number=23`);

    cy.wait('@findReportWithTranslations');

    cy.get('form[data-cy="report"]').should('be.visible');

    cy.get('[name="incident_id"]').clear().type('12');

    cy.contains('button', 'Submit').click();

    cy.wait('@UpdateReport')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.report_number).to.equal(23);
        expect(variables.set.incident_id).to.equal(undefined);
      });

    cy.wait('@updateOneReportTranslation')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.input.title).to.eq('Este es el Titulo');
        expect(variables.input.text).to.eq(
          'Este es el texto que tiene un largo mayor a ochenta caracteres!'
        );
        expect(variables.input.language).to.eq('es');
        expect(variables.input.report_number).to.eq(23);
        expect(variables.input.plain_text).to.eq(
          'Este es el texto que tiene un largo mayor a ochenta caracteres!\n'
        );
      });

    cy.wait('@updateOneReportTranslation')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.input.title).to.eq('Este es el Titulo en frances');
        expect(variables.input.text).to.eq(
          'Este es el texto que tiene un largo mayor a ochenta caracteres en frances!'
        );
        expect(variables.input.language).to.eq('fr');
        expect(variables.input.report_number).to.eq(23);
        expect(variables.input.plain_text).to.eq(
          'Este es el texto que tiene un largo mayor a ochenta caracteres en frances!\n'
        );
      });

    cy.wait('@UpdateIncident10')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query).to.deep.equal({ incident_id: 10 });
        expect(variables.set).to.deep.equal({
          reports: { link: [16, 17, 18, 19, 20, 21, 22, 24, 25] },
        });
      });

    cy.wait('@UpdateIncident12')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query).to.deep.equal({ incident_id: 12 });
        expect(variables.set).to.deep.equal({ reports: { link: [42, 23] } });
      });
  });

  it('Should display an error message if data is missing', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportWithTranslations',
      'findReportWithTranslations',
      reportWithTranslations
    );

    cy.visit(`/cite/edit?report_number=23`);

    cy.wait('@findReportWithTranslations');

    cy.get('form[data-cy="report"]').should('be.visible');

    cy.get('[name="incident_id"]').clear();

    cy.contains('button', 'Submit').click();

    cy.contains('Please review report. Some data is missing.').should('exist');

    cy.contains('button', 'Submit').should('be.disabled');

    cy.get('[name="incident_id"]').type('12');

    cy.contains('button', 'Submit').should('not.be.disabled');
  });

  it('Should display the report image', () => {
    cy.visit(url);

    cy.get('[data-cy="image-preview-figure"] img').should(
      'have.attr',
      'src',
      'https://res.cloudinary.com/pai/image/upload/d_fallback.jpg/f_auto/q_auto/v1/reports/assets.change.org/photos/0/yb/id/eYyBIdJOMHpqcty-1600x900-noPad.jpg?1523726975'
    );
  });
});
