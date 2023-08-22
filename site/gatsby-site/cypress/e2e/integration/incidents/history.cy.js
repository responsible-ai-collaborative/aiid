import { format, fromUnixTime } from 'date-fns';
import incidentHistory from '../../../fixtures/history/incidentHistory.json';
import versionReports from '../../../fixtures/history/versionReports.json';

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

  it('Should display the Version History details modal', () => {
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

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReports',
      'FindReports',
      versionReports
    );

    cy.wait(['@FindIncidentHistory', '@FindEntities', '@FindUsers']);

    cy.waitForStableDOM();

    // Click the 2nd version
    cy.get('[data-cy="history-row"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="view-full-version-button"]').click();
      });

    cy.wait('@FindReports').then((xhr) => {
      expect(xhr.request.body.variables.query).to.deep.eq({
        report_number_in: incidentHistory.data.history_incidents[1].reports,
      });
    });

    cy.get('[data-cy="version-view-modal"]').as('modal').should('be.visible');

    cy.get('[data-cy="version-view-modal"]').within(() => {
      const version = incidentHistory.data.history_incidents[1];

      cy.contains('View Version details').should('exist');
      cy.contains(`Title: ${version.title}`).should('exist');
      cy.contains('Modified by: Sean McGregor').should('exist');
      cy.contains(
        `Modified on: ${format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}`
      ).should('exist');
      cy.contains(`Description: ${version.description}`).should('exist');
      if (version.editor_notes) {
        cy.contains(`Editor Notes: ${version.editor_notes}`).should('exist');
      }
      cy.get('[data-cy="alleged-entities"]').within(() => {
        cy.contains(
          'Alleged: developed an AI system deployed by Youtube, which harmed Google.'
        ).should('exist');
      });
      cy.get('[data-cy="citation"]').within(() => {
        cy.contains(`${version.incident_id}`).should('exist');
        cy.contains(`${version.reports.length}`).should('exist');
        cy.contains(`${version.date}`).should('exist');
        cy.contains('Sean McGregor, Pablo Costa').should('exist');
      });
      cy.get('[cy-data-cy="version-reports"]').within(() => {
        cy.get('a').contains('#3205 - Report 3205 title').should('exist');
        cy.get('a').contains('#3206 - Report 3206 title').should('exist');
      });
      cy.get('button').contains('Close').click();
    });
    cy.get('[data-cy="version-view-modal"]').should('not.exist');

    // Click the latest version
    cy.get('[data-cy="history-row"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="view-full-version-button"]').click();
      });

    cy.wait('@FindReports').then((xhr) => {
      expect(xhr.request.body.variables.query).to.deep.eq({
        report_number_in: incidentHistory.data.history_incidents[0].reports,
      });
    });

    cy.get('[data-cy="version-view-modal"]').as('modal').should('be.visible');

    cy.get('[data-cy="version-view-modal"]').within(() => {
      const version = incidentHistory.data.history_incidents[0];

      cy.contains('View Version details').should('exist');
      cy.contains(`Title: ${version.title}`).should('exist');
      cy.contains('Modified by: Sean McGregor').should('exist');
      cy.contains(
        `Modified on: ${format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}`
      ).should('exist');
      cy.contains(`Description: ${version.description}`).should('exist');
      if (version.editor_notes) {
        cy.contains(`Editor Notes: ${version.editor_notes}`).should('exist');
      }
      cy.get('[data-cy="alleged-entities"]').within(() => {
        cy.contains(
          'Alleged: developed an AI system deployed by Youtube, which harmed Google.'
        ).should('exist');
      });
      cy.get('[data-cy="citation"]').within(() => {
        cy.contains(`${version.incident_id}`).should('exist');
        cy.contains(`${version.reports.length}`).should('exist');
        cy.contains(`${version.date}`).should('exist');
        cy.contains('Sean McGregor, Pablo Costa').should('exist');
      });
      cy.get('[cy-data-cy="version-reports"]').within(() => {
        cy.get('a').contains('#3205 - Report 3205 title').should('exist');
        cy.get('a').contains('#3206 - Report 3206 title').should('exist');
      });
      cy.get('button').contains('Close').click();
    });
    cy.get('[data-cy="version-view-modal"]').should('not.exist');
  });
});
