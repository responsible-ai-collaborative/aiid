describe('Navigation', () => {
  it('Check menu links work', () => {
    cy.visit('/');

    cy.get('aside .item a').each((page) => {
      cy.request(page.prop('href'));
    });
  });
});
