const { gql } = require('@apollo/client');

describe('Incidents Summary', () => {
  const url = '/summaries/incidents';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Displays the correct number of incidents ', () => {
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
      cy.waitForStableDOM();

      cy.get('body').then((body) => {
        if (!body.text().includes('No incidents found')) {
          cy.get('[data-cy="incident-list"] > div')
            .should('have.length', incidents.length)
            .and('be.visible');

          // could use some more toughly testing here
        }
      });
    });
  });
});
