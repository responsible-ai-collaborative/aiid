describe('The Submit form', () => {
  const url = '/apps/submit';

  const articleURL = 'https://www.cbsnews.com/news/is-starbucks-shortchanging-its-baristas/';

  const parserURL = 'https://z14490usg0.execute-api.us-east-1.amazonaws.com/default/parseNews**';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should fetch an article data and fill forms accordingly', () => {
    cy.intercept('GET', parserURL).as('parseNews');

    cy.get('input[name="url"]').type(articleURL);

    cy.get('button').contains('Fetch info').click();

    cy.wait('@parseNews', { timeout: 30000 });

    cy.get('input[name="title"]').should('have.value', '​Is Starbucks shortchanging its baristas?');

    cy.get('input[name="authors"]').should('have.value', 'Aimee Picchi');

    cy.get('input[name="date_published"]').should('have.value', '2015-09-24');

    cy.get('input[name="date_downloaded"]').should('have.value', '2021-12-17');

    cy.get('input[name="image_url"]').should(
      'have.value',
      'https://cbsnews3.cbsistatic.com/hub/i/r/2015/03/17/01a38576-5108-40f7-8df8-5416164ed878/thumbnail/1200x630/ca8d35fe6bc065b5c9a747d92bc6d94c/154211248.jpg'
    );

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Should fetch an article data and fill forms accordingly', () => {
    cy.intercept('GET', parserURL).as('parseNews');

    cy.get('input[name="url"]').type(articleURL);

    cy.get('button').contains('Fetch info').click();

    cy.wait('@parseNews', { timeout: 30000 });

    cy.get('input[name="submitters"]').type('Something');

    cy.get('input[name="incident_date"]').type('2021-09-21');

    cy.get('button[type="submit"]').click();

    cy.get('div[class^="ToastContext"]')
      .contains('Report successfully added to review queue')
      .should('exist');
  });
});
