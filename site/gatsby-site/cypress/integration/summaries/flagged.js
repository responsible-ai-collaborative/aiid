const { gql } = require('@apollo/client');

describe('Incidents Summary', () => {
  const url = '/summaries/flagged';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Displays the correct number of incidents ', () => {
    cy.visit(url);

    cy.query({
      query: gql`
        {
          reports(query: { flag: true }) {
            report_number
          }
        }
      `,
    }).then(({ data: { reports } }) => {
      cy.get('[data-cy*="report"]').should('have.length', reports.length).and('be.visible');

      // could use some more toughly testing here
    });
  });
});
