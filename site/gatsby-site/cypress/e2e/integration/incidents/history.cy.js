import { format, fromUnixTime } from 'date-fns';
import incidentHistory from '../../../fixtures/history/incidentHistory.json';

describe('Incidents', () => {
  const url = '/incidents/history/?incident_id=10';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should display the Version History table data', () => {
    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentHistory',
      'FindIncidentHistory',
      incidentHistory
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
      (req) => req.body.operationName == 'FindEntities',
      'FindEntities',
      {
        data: {
          entities: [
            { __typename: 'Entity', entity_id: 'youtube', name: 'Youtube' },
            { __typename: 'Entity', entity_id: 'google', name: 'Google' },
            { __typename: 'Entity', entity_id: 'tesla', name: 'Tesla' },
          ],
        },
      }
    );

    cy.wait(['@FindIncidentHistory', '@FindEntities', '@FindUsers']);

    cy.waitForStableDOM();

    cy.get('h2').contains('Version History').should('exist');

    cy.get('[data-cy="history-row"]').should('have.length', 4);

    incidentHistory.data.history_incidents.forEach((history, index) => {
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
      .eq(incidentHistory.data.history_incidents.length - 1)
      .contains('Initial version')
      .should('exist');
  });

  it('Should not display the Version History table data if no data is present', () => {
    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentHistory',
      'FindIncidentHistory',
      { data: { history_incidents: [] } }
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
      (req) => req.body.operationName == 'FindEntities',
      'FindEntities',
      {
        data: {
          entities: [
            { __typename: 'Entity', entity_id: 'youtube', name: 'Youtube' },
            { __typename: 'Entity', entity_id: 'google', name: 'Google' },
            { __typename: 'Entity', entity_id: 'tesla', name: 'Tesla' },
          ],
        },
      }
    );

    cy.wait(['@FindIncidentHistory', '@FindEntities', '@FindUsers']);

    cy.waitForStableDOM();

    cy.contains('Version History').should('not.exist');

    cy.get('[data-cy="history-table"]').should('not.exist');

    cy.contains('There are no version history records for this Incident').should('exist');
  });

  it('Should display an error message if no Incident ID is provided', () => {
    cy.visit('/incidents/history?incident_id=');

    cy.contains('Invalid Incident ID').should('exist');
  });

  it('Should display an error message if an invalid Incident ID is provided', () => {
    cy.visit('/incidents/history?incident_id=xxx');

    cy.contains('Invalid Incident ID').should('exist');
  });

  it('Should go back to the Incident', () => {
    cy.visit(url);

    cy.waitForStableDOM();

    cy.contains(`Back to Incident 10`).click();

    cy.url().should('include', '/cite/10');
  });

  it('Should refresh Report history if the user go back on the browser', () => {
    cy.visit('/cite/10');

    cy.waitForStableDOM();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentHistory',
      'FindIncidentHistory',
      incidentHistory
    );

    cy.get('[data-cy="view-history-btn"]').click();

    cy.waitForStableDOM();

    cy.wait('@FindIncidentHistory');

    cy.url().should('include', url);

    cy.go('back');

    cy.url().should('include', '/cite/10');

    cy.go('forward');

    cy.wait('@FindIncidentHistory');
  });
});
