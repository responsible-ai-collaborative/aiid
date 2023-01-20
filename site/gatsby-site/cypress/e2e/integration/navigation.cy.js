it.skip('Check menu links work (English)', () => {
  cy.visit('/');

  cy.waitForStableDOM();

  checkLinks();
});

it.skip('Check menu links work (Spanish)', () => {
  cy.visit('/es/');

  cy.waitForStableDOM();

  checkLinks();
});

it.skip('Check menu links work (French)', () => {
  cy.visit('/fr/');

  cy.waitForStableDOM();

  checkLinks();
});

const checkLinks = () => {
  cy.get('aside .item a').each((page) => {
    cy.visit(page.prop('href'));

    cy.waitForStableDOM();

    // Check if the sidebar active item match the current page
    cy.get('.item.active > a')
      .first()
      .should('have.attr', 'href')
      .then((href) => expect(page.prop('href').endsWith(href)).to.be.true);
  });
};
