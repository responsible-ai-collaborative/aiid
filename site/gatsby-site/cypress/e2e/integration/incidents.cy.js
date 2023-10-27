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

        // could use some more toughly testing here
      });
    }
  );
});
