describe('Navigation', () => {
  it('Check menu links work (English)', () => {
    cy.visit('/');

    checkLinks();
  });

  it('Check menu links work (Spanish)', () => {
    cy.visit('/es/');

    checkLinks();
  });

  it('Check menu links work (French)', () => {
    cy.visit('/fr/');

    checkLinks();
  });

  const checkLinks = () => {
    cy.get('aside .item a').each((page) => {
      cy.visit(page.prop('href'));

      // Check if the sidebar active item match the current page
      cy.get('aside .item .active a')
        .first()
        .should('have.attr', 'href')
        .then((href) => expect(page.prop('href').endsWith(href)).to.be.true);
    });
  };
});
