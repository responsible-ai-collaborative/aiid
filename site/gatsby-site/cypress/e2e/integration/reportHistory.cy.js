import { format, fromUnixTime, getUnixTime } from 'date-fns';
import reportHistory from '../../fixtures/history/reportHistory.json';
import updateOneReport from '../../fixtures/reports/updateOneReport.json';
import { maybeIt } from '../../support/utils';
const { gql } = require('@apollo/client');

describe('Report History', () => {
  const url = '/cite/history?report_number=3206&incident_id=563';

  let user;

  before('before', () => {
    cy.query({
      query: gql`
        {
          users {
            userId
            first_name
            last_name
          }
        }
      `,
    }).then(({ data: { users } }) => {
      user = users.find((u) => u.first_name == 'Test' && u.last_name == 'User');
    });
  });

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should display the Report Version History table data', () => {
    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportHistory',
      'FindReportHistory',
      reportHistory
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUsers',
      'FindUsers',
      {
        data: {
          users: [
            { userId: '1', first_name: 'Sean', last_name: 'McGregor', roles: [] },
            { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
          ],
        },
      }
    );

    cy.wait(['@FindReportHistory', '@FindUsers']);

    cy.waitForStableDOM();

    cy.get('h2').contains('Version History').should('exist');

    cy.get('[data-cy="history-row"]').should('have.length', 9);

    reportHistory.data.history_reports.forEach((history, index) => {
      cy.get('[data-cy="history-row"]')
        .eq(index)
        .within(() => {
          cy.contains(
            `${format(fromUnixTime(history.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}`
          ).should('exist');
          cy.contains(
            `Modified by: ${history.modifiedBy === '1' ? 'Sean McGregor' : 'Pablo Costa'}`
          ).should('exist');
        });
    });

    cy.get('[data-cy="history-row"]')
      .eq(reportHistory.data.history_reports.length - 1)
      .contains('Initial version')
      .should('exist');
  });

  it('Should not display the Report Version History table data if no data is present', () => {
    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportHistory',
      'FindReportHistory',
      { data: { history_reports: [] } }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUsers',
      'FindUsers',
      {
        data: {
          users: [
            { userId: '1', first_name: 'Sean', last_name: 'McGregor', roles: [] },
            { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
          ],
        },
      }
    );

    cy.wait(['@FindReportHistory', '@FindUsers']);

    cy.waitForStableDOM();

    cy.contains('Version History').should('not.exist');

    cy.get('[data-cy="history-table"]').should('not.exist');

    cy.contains('There are no version history records for this Report').should('exist');
  });

  it('Should go back to the Report', () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.contains(`Back to Report 3206`).click();

    cy.url().should('include', '/cite/563/#r3206');
  });

  it('Should refresh Report history if the user go back on the browser', () => {
    cy.visit('/cite/10');

    cy.waitForStableDOM();

    cy.contains('Read More').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportHistory',
      'FindReportHistory',
      reportHistory
    );

    cy.get('[data-cy="report-history-button"]').click();

    cy.waitForStableDOM();

    cy.wait('@FindReportHistory');

    cy.url().should('include', '/cite/history/?report_number=16&incident_id=10');

    cy.go('back');

    cy.url().should('include', '/cite/10');

    cy.go('forward');

    cy.wait('@FindReportHistory');
  });

  it('Should not be able to restore a version if the user does not have the right permissions', () => {
    cy.visit(url);

    cy.contains('Restore Version').should('not.exist');
  });

  maybeIt('Should restore an Report previuos version', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'FindReport',
      {
        data: {
          report: reportHistory.data.history_reports[0],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReportHistory',
      'FindReportHistory',
      reportHistory
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUsers',
      'FindUsers',
      {
        data: {
          users: [
            { userId: '1', first_name: 'Sean', last_name: 'McGregor', roles: [] },
            { userId: '2', first_name: 'Pablo', last_name: 'Costa', roles: [] },
          ],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'UpdateReport',
      updateOneReport
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'logReportHistory',
      'logReportHistory',
      { data: { logReportHistory: { report_number: 3206 } } }
    );

    cy.wait(['@FindReportHistory', '@FindUsers', '@FindReport']);

    cy.waitForStableDOM();

    reportHistory.data.history_reports.forEach((_history, index) => {
      cy.get('[data-cy="history-row"]')
        .eq(index)
        .within(() => {
          if (index === 0) {
            cy.get('[data-cy="restore-button"]').should('not.exist');
          } else {
            cy.get('[data-cy="restore-button"]').should('exist');
          }
        });
    });

    const now = new Date();

    cy.clock(now);

    cy.get('[data-cy="history-row"]')
      .eq(reportHistory.data.history_reports.length - 1)
      .within(() => {
        cy.get('[data-cy="restore-button"]').click();
      });

    cy.get('[data-cy="restoring-message"]').should('exist');

    const initialVersion =
      reportHistory.data.history_reports[reportHistory.data.history_reports.length - 1];

    const updatedReport = {
      ...initialVersion,
      epoch_date_modified: getUnixTime(new Date()),
      editor_notes: '',
    };

    delete updatedReport._id;
    delete updatedReport.modifiedBy;

    cy.wait('@UpdateReport').then((xhr) => {
      expect(xhr.request.body.operationName).to.eq('UpdateReport');
      expect(xhr.request.body.variables.query.report_number).to.eq(updatedReport.report_number);
      expect(xhr.request.body.variables.set).to.deep.eq(updatedReport);
    });

    cy.wait('@logReportHistory', { timeout: 30000 })
      .its('request.body.variables.input')
      .then((input) => {
        const expectedReport = {
          ...initialVersion,
          editor_notes: updatedReport.editor_notes,
          epoch_date_modified: updatedReport.epoch_date_modified,
          modifiedBy: user.userId,
        };

        delete expectedReport._id;

        expect(input).to.deep.eq(expectedReport);
      });

    cy.get('[data-cy="toast"]').contains('Report version restored successfully.').should('exist');

    cy.get('[data-cy="restoring-message"]').should('not.exist');

    cy.wait('@FindReportHistory');
  });
});
