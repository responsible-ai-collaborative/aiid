describe('The Discover app', () => {
  const url = '/apps/discover';

  const dummyIncident = {
    url: '',
    title: '',
    authors: '',
    submitters: '',
    incident_date: '',
    date_published: '',
    date_downloaded: '',
    image_url: '',
    incident_id: '',
    text: '',
    flag: '',
    tags: [],
  };

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

    // a flaky assertion here, should improve once a testing enviqronment is set up
    cy.get('div[class^="Hits__HitsContainer"]').children().should('have.length.at.least', 10);
  });

  it('Filters by incident Id using top filters', () => {
    cy.visit(url);

    cy.get('button:contains("Incident ID")').click();

    cy.get('.card [placeholder="Type Here"]').type('34').type('{enter}');

    cy.get('.list-group-item:contains("34")').click();

    cy.url().should('include', 'incident_id=34');

    cy.get('div[class^="Hits__HitsContainer"]').children().should('have.length.at.least', 30);
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

    cy.intercept('POST', '**/graphql', {
      data: {
        incident: {
          __typename: 'Incident',
          _id,
          ...dummyIncident,
          flag: false,
        },
      },
    }).as('fetchIncident');

    cy.get(`[data-cy="${_id}"`).find('[data-cy="flag-button"]').click();

    cy.get('[data-cy="flag-modal"]').as('modal').should('be.visible');

    cy.wait('@fetchIncident');

    cy.intercept('POST', '**/graphql', {
      data: {
        updateOneIncident: {
          __typename: 'Incident',
          _id,
          ...dummyIncident,
          flag: true,
        },
      },
    }).as('updateIncident');

    cy.get('@modal').find('[data-cy="flag-toggle"]').click();

    cy.wait('@updateIncident');

    cy.get('@modal').find('[data-cy="flag-toggle"]').should('be.disabled');

    cy.contains('Close').click();

    cy.get('@modal').should('not.exist');
  });
});
