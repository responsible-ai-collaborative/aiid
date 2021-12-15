describe('The Discover app', () => {
  const url = '/apps/discover';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should load at least 30 hits', () => {
    cy.visit(url);

    cy.get('div[class^="Hits__HitsContainer"]').children().should('have.length.at.least', 30);
  });

  it('Performs a search and filters results', () => {
    cy.visit(url);

    cy.get('form#searchForm').as('form');

    cy.get('@form').get('input[placeholder="Type Here"]').type('starbucks').type('{enter}');

    cy.url().should('include', 's=starbucks');

    cy.get('div[class^="Hits__HitsContainer"]').children().should('have.length.at.least', 12);
  });

  it('Filters by incident Id using top filters', () => {
    cy.visit(url);

    cy.get('button:contains("Incident ID")').click();

    cy.get('.card [placeholder="Type Here"]').type('100').type('{enter}');

    cy.get('.list-group-item:contains("100")').click();

    cy.url().should('include', 'incident_id=100');

    cy.get('div[class^="Hits__HitsContainer"]').children().should('have.length', 1);
  });

  it('Filters by incident Id using card button', () => {
    cy.visit(url);

    cy.get('div[class^="Hits__HitsContainer"]')
      .children()
      .get('[title="Filter by Incident ID #10"]')
      .first()
      .click();

    cy.get('button:contains("Incident ID")').get('span.badge').should('contain.text', '1');

    cy.url().should('include', 'incident_id=10');

    cy.get('div[class^="Hits__HitsContainer"]').children().should('have.length.at.least', 10);
  });
});
