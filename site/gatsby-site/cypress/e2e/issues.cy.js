import { maybeIt } from '../support/utils';
import submittedReports from '../fixtures/submissions/submitted.json';

describe('Issues', () => {
  const url = '/apps/submitted';

  maybeIt('Promotes a Submission to a new Issue', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const submission = submittedReports.data.submissions.find((r) => r.incident_id === 0);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindSubmissions',
      'FindSubmissions',
      {
        data: {
          submissions: [submission],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'AllQuickAdd',
      'AllQuickAdd',
      {
        data: {
          quickadds: [],
        },
      }
    );

    cy.visit(url);

    cy.wait('@FindSubmissions');

    cy.wait('@AllQuickAdd');

    cy.get('[data-cy="submission"]').first().as('promoteForm');

    cy.get('@promoteForm').contains('review >').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'PromoteSubmission',
      'promoteSubmission',
      {
        data: {
          promoteSubmissionToReport: {
            incident_ids: [],
            report_number: 182,
          },
        },
      }
    );

    cy.get('@promoteForm').contains('button', 'Add as issue').click();

    cy.wait('@promoteSubmission')
      .its('request.body.variables.input')
      .then((input) => {
        expect(input.incident_ids).to.deep.eq([]);
        expect(input.submission_id).to.eq('5f9c3ebfd4896d392493f03c');
        expect(input.is_incident_report).to.eq(false);
      });

    cy.contains('[data-cy="toast"]', 'Successfully promoted submission to Issue 182').should(
      'exist'
    );
  });
});
