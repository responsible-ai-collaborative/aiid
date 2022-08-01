import { maybeIt } from '../support/utils';

import updateOneReport from '../fixtures/reports/updateOneReport.json';

import { format, getUnixTime } from 'date-fns';

import incident from '../fixtures/incidents/incident.json';

import report from '../fixtures/reports/report.json';

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
      (req) => req.body.operationName == 'FindReport',
      'findReport',
      report
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      incident
    );

    cy.visit(url);

    cy.wait(['@findReport', '@findIncident']);

    [
      'authors',
      'date_downloaded',
      'date_published',
      'image_url',
      'submitters',
      'title',
      'editor_notes',
    ].forEach((key) => {
      cy.get(`[name=${key}]`).should('have.value', report.data.report[key].toString());
    });

    cy.getEditorText().should('eq', report.data.report.text);

    cy.get(`[name="incident_id"]`).should('have.value', incident.data.incident.incident_id);

    cy.get('[class*=Typeahead] [option="Test Tag"]').should('have.length', 1);

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

    cy.get(`[name="language"]`).select('Spanish');

    cy.setEditorText(
      'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease'
    );

    cy.get('[class*=Typeahead] [type="text"]').type('New Tag');

    cy.get('a[aria-label="New Tag"]').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'updateReport',
      updateOneReport
    );

    // cypress doesn't provide a built-in way to check that a request wasn't made
    // in the context of this test this is an important assertion

    let updateIncidentInvoked = false;

    cy.intercept('**/graphql', (req) => {
      if (req.body.operationName === 'UpdateIncident') {
        updateIncidentInvoked = true;
      }
    });

    cy.contains('button', 'Submit').click();

    cy.wait('@updateReport').then((xhr) => {
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
        'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease'
      );
      expect(xhr.request.body.variables.set.title).eq('Test Title');
      expect(xhr.request.body.variables.set.url).eq('https://www.test.com/test');
      expect(xhr.request.body.variables.set.source_domain).eq('test.com');
      expect(xhr.request.body.variables.set.editor_notes).eq('Pro iustitia tantum');
      expect(xhr.request.body.variables.set.language).eq('es');
    });

    cy.wrap(updateIncidentInvoked).should('eq', false);

    cy.get('div[class^="ToastContext"]')
      .contains('Incident report 10 updated successfully.')
      .should('exist');
  });

  maybeIt('Should delete incident report', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'findReport',
      report
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
      (req) => req.body.operationName == 'UpdateIncident',
      'updateIncident'
    );

    cy.visit(url);

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
      (req) => req.body.operationName == 'FindReport',
      'findReport',
      report
    );

    cy.visit(`/cite/edit?report_number=23`);

    cy.get('form[data-cy="report"]').should('be.visible');

    cy.get('[name="incident_id"]').clear().type('12');

    cy.contains('button', 'Submit').click();

    cy.wait('@UpdateReport')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.report_number).to.equal(23);
        expect(variables.set.incident_id).to.equal(undefined);
      });

    cy.wait('@RelatedIncidents')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.incidentIds).to.deep.equal([12]);
        expect(variables.reports).to.deep.equal([{ report_number: 23 }]);
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
});
