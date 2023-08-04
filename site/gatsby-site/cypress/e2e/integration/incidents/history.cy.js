import { format, fromUnixTime } from 'date-fns';
import incidentHistory from '../../../fixtures/history/incidentHistory.json';

describe('Incidents', () => {
  const url = '/incidents/history?incident_id=10';

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
});
