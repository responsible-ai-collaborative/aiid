import { format, fromUnixTime } from 'date-fns';
import reportHistory from '../../fixtures/history/reportHistory.json';

describe('Report History', () => {
  const url = '/cite/history?report_number=3206&incident_id=563';

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
});
