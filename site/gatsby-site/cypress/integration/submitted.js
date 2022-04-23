import { maybeIt } from '../support/utils';
import submittedReports from '../fixtures/submissions/submitted.json';

describe('Submitted reports', () => {
  const url = '/apps/submitted';

  it('Loads submitted reports', () => {
    cy.visit(url);

    cy.conditionalIntercept(
      '**/functions/call',
      (req) => req.body.arguments[0]?.collection == 'submissions' && req.body.name === 'find',
      'submitReport',
      submittedReports
    );

    cy.get('[data-cy="submissions"] > div').should('have.length', submittedReports.length);

    submittedReports.forEach((report, index) => {
      cy.get('[data-cy="submissions"]')
        .children(`:nth-child(${index + 1})`)
        .contains('review >')
        .click();

      cy.get('[data-cy="submissions"]')
        .children(`:nth-child(${index + 1})`)
        .within(() => {
          cy.get('[data-cy="source_domain"]').should('contain', report.source_domain);
          cy.get('[data-cy="authors"]').should('contain', report.authors);
          cy.get('[data-cy="submitters"]').should('contain', report.submitters);
          cy.get('[data-cy="incident_id"]').should('contain', report.incident_id.$numberLong);
          cy.get('[data-cy="date_published"]').should('contain', report.date_published);
          cy.get('[data-cy="date_submitted"]').should('contain', report.date_submitted);
          cy.get('[data-cy="date_downloaded"]').should('contain', report.date_downloaded);
          cy.get('[data-cy="date_modified"]').should('contain', report.date_modified);
          cy.get('[data-cy="url"]').should('contain', report.url);
        });
    });
  });

  maybeIt('Promotes a report and links it to a new incident', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/functions/call',
      (req) => req.body.arguments[0]?.collection == 'submissions' && req.body.name === 'find',
      'submissions',
      submittedReports.filter((r) => r.incident_id.$numberLong === '0')
    );

    cy.visit(url);

    cy.get('[data-cy="submissions"] > div:nth-child(1)').as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'LastIndexes',
      'lastIndexes',
      {
        data: {
          lastIncident: [{ __typename: 'Incident', incident_id: 171 }],
          lastReport: [{ __typename: 'Report', report_number: 1544 }],
          refsNumbers: null,
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertIncident',
      'insertIncident',
      { data: { insertOneIncident: { __typename: 'Incident', incident_id: 172 } } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertReport',
      'insertReport',
      { data: { insertOneReport: { __typename: 'Report', report_number: 1545 } } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'RelatedIncidents',
      'relatedIncidents',
      {
        data: {
          incidentsToLink: [{ __typename: 'Incident', incident_id: 172, reports: [] }],
          incidentsToUnlink: [],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'updateIncident',
      {
        data: {
          updateOneIncident: {
            __typename: 'Incident',
            incident_id: 172,
            reports: [{ __typename: 'Report', report_number: 1545 }],
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'DeleteSubmission',
      'deleteSubmission',
      {
        data: {
          deleteOneSubmission: { __typename: 'Submission', _id: '5f9c3ebfd4896d392493f03c' },
        },
      }
    );

    cy.get('@promoteForm').contains('button', 'Add New Incident').click();

    cy.wait('@lastIndexes');

    cy.wait('@insertIncident').its('request.body.variables.incident.incident_id').should('eq', 172);

    cy.wait('@insertReport')
      .its('request.body.variables.report')
      .then((report) => {
        expect(report.report_number).to.eq(1545);
        expect(report.incident_id).to.eq(172);
        expect(report.ref_number).eq(1);
      });

    cy.wait('@relatedIncidents')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.incidentIds).to.deep.equal([172]);
        expect(variables.reports).to.deep.equal([{ report_number: 1545 }]);
      });

    cy.wait('@updateIncident')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query).to.deep.equal({ incident_id: 172 });
        expect(variables.set).to.deep.equal({ reports: { link: [1545] } });
      });

    cy.wait('@deleteSubmission')
      .its('request.body.variables')
      .should('deep.equal', { _id: '5f9c3ebfd4896d392493f03c' });

    cy.wait('@submissions');

    cy.get('div[class^="ToastContext"]')
      .contains('Succesfully promoted submission to Incident 172 and Report 1545')
      .should('exist');
  });

  maybeIt('Promotes a report and links it to an existing incident', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/functions/call',
      (req) => req.body.arguments[0]?.collection == 'submissions' && req.body.name === 'find',
      'submissions',
      submittedReports.filter((r) => r.incident_id.$numberLong === '10')
    );

    cy.visit(url);

    cy.get('[data-cy="submissions"] > div:nth-child(1)').as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'LastIndexes',
      'lastIndexes',
      {
        data: {
          lastIncident: [{ __typename: 'Incident', incident_id: 171 }],
          lastReport: [{ __typename: 'Report', report_number: 1544 }],
          refsNumbers: {
            __typename: 'Incident',
            incident_id: 10,
            reports: [
              { __typename: 'Report', ref_number: 0, report_number: 16 },
              { __typename: 'Report', ref_number: 1, report_number: 17 },
              { __typename: 'Report', ref_number: 2, report_number: 18 },
              { __typename: 'Report', ref_number: 3, report_number: 19 },
            ],
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertReport',
      'insertReport',
      { data: { insertOneReport: { __typename: 'Report', report_number: 1545 } } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'RelatedIncidents',
      'relatedIncidents',
      {
        data: {
          incidentsToLink: [
            {
              __typename: 'Incident',
              incident_id: 10,
              reports: [
                { __typename: 'Report', ref_number: 0, report_number: 16 },
                { __typename: 'Report', ref_number: 1, report_number: 17 },
                { __typename: 'Report', ref_number: 2, report_number: 18 },
                { __typename: 'Report', ref_number: 3, report_number: 19 },
              ],
            },
          ],
          incidentsToUnlink: [],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'updateIncident',
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
              { __typename: 'Report', report_number: 1545 },
            ],
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'DeleteSubmission',
      'deleteSubmission',
      {
        data: {
          deleteOneSubmission: { __typename: 'Submission', _id: '5f9c3ebfd4896d392493f03c' },
        },
      }
    );

    cy.get('@promoteForm').contains('button', 'Add New Report').click();

    cy.wait('@lastIndexes');

    cy.wait('@insertReport')
      .its('request.body.variables.report')
      .then((report) => {
        expect(report.report_number).to.eq(1545);
        expect(report.incident_id).to.eq(10);
        expect(report.ref_number).eq(4);
      });

    cy.wait('@relatedIncidents')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.incidentIds).to.deep.equal([10]);
        expect(variables.reports).to.deep.equal([{ report_number: 1545 }]);
      });

    cy.wait('@updateIncident')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query).to.deep.equal({ incident_id: 10 });
        expect(variables.set).to.deep.equal({ reports: { link: [16, 17, 18, 19, 1545] } });
      });

    cy.wait('@deleteSubmission')
      .its('request.body.variables')
      .should('deep.equal', { _id: '5f9c3f3394413b2fe87918eb' });

    cy.wait('@submissions');

    cy.get('div[class^="ToastContext"]')
      .contains('Succesfully promoted submission to Incident 10 and Report 1545')
      .should('exist');
  });
});
