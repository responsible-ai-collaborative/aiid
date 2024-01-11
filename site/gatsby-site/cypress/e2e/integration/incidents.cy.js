const { gql } = require('@apollo/client');

import { conditionalIt } from '../../support/utils';

describe('Incidents Summary', () => {
  const url = '/summaries/incidents';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Displays the correct number of incidents',
    () => {
      cy.visit(url);

      cy.query({
        query: gql`
          {
            incidents(limit: 9999) {
              incident_id
            }
          }
        `,
      }).then(({ data: { incidents } }) => {
        cy.get('[data-cy="incident-list"] > div')
          .should('have.length', incidents.length)
          .and('be.visible');
      });
    }
  );

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Should sort by Incident ID (ascending and descending)',
    () => {
      cy.visit(url);

      cy.query({
        query: gql`
          {
            incidents(limit: 9999, sortBy: INCIDENT_ID_DESC) {
              incident_id
            }
          }
        `,
      }).then(({ data: { incidents } }) => {
        cy.get('[data-cy="sort-ascending-button"]')
          .should('exist')
          .and('be.visible')
          .and('not.be.disabled');
        cy.get('[data-cy="sort-descending-button"]')
          .should('exist')
          .and('be.visible')
          .and('be.disabled');

        // Check default Incident ID descending order
        cy.get('[data-cy="incident-list"] > div')
          .first()
          .should('contain', `Incident ${incidents[0].incident_id}`);

        // Check Incident ID ascending order
        cy.get('[data-cy="sort-ascending-button"]').click();
        cy.waitForStableDOM();
        cy.get('[data-cy="incident-list"] > div')
          .first()
          .should('contain', `Incident ${incidents[incidents.length - 1].incident_id}`);

        // Check Incident ID descending order
        cy.get('[data-cy="sort-descending-button"]').click();
        cy.waitForStableDOM();
        cy.get('[data-cy="incident-list"] > div')
          .first()
          .should('contain', `Incident ${incidents[0].incident_id}`);
      });
    }
  );
});
