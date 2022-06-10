import flaggedReport from '../fixtures/reports/flagged.json';
import unflaggedReport from '../fixtures/reports/unflagged.json';

describe('The Discover app', () => {
  const url = '/apps/discover';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should load at least 30 hits', () => {
    cy.visit(url);

    cy.get('div[class^="Hits__HitsContainer"]').children().should('have.length.at.least', 28);
  });

  it('Performs a search and filters results', () => {
    cy.visit(url);

    cy.get('form#searchForm').as('form');

    cy.get('@form').get('input[placeholder="Type Here"]').type('starbucks').type('{enter}');

    cy.url().should('include', 's=starbucks');

    // a flaky assertion here, should improve once a testing enviqronment is set up
    cy.get('div[class^="Hits__HitsContainer"]').children().should('have.length.at.least', 8);
  });

  it('Filters by incident Id using top filters', () => {
    cy.visit(url);

    cy.contains('button', 'Incident ID').click();

    cy.get('.card [placeholder="Type Here"]').type('34').type('{enter}');

    cy.get('.list-group-item:contains("34")').click();

    cy.url().should('include', 'incident_id=34');

    cy.get('div[class^="Hits__HitsContainer"]').children().should('have.length.at.least', 28);
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

  it('Should flag an incident', () => {
    // mock requests until a testing database is implemented

    cy.visit(
      url +
        '?display=details&incident_id=10&s=%E2%80%8BIs%20Starbucks%20shortchanging%20its%20baristas%3F'
    );

    const _id = '5d34b8c29ced494f010ed470';

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindReport',
      'fetchReport',
      unflaggedReport
    );

    cy.get(`[data-cy="${_id}"`).find('[data-cy="flag-button"]').click();

    cy.get('[data-cy="flag-modal"]').as('modal').should('be.visible');

    cy.wait('@fetchReport');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'updateReport',
      flaggedReport
    );

    cy.get('@modal').find('[data-cy="flag-toggle"]').click();

    cy.wait('@updateReport');

    cy.get('@modal').find('[data-cy="flag-toggle"]').should('be.disabled');

    cy.contains('Close').click();

    cy.get('@modal').should('not.exist');
  });
});
