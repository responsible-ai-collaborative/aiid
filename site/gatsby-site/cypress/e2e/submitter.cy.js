describe('Submitter Selection', () => {
  let url = '/';

  it('Should select the first submitter if there is one and load the discover page with a pre-selected submitter in the URL', () => {
    cy.visit(url);

    cy.contains('Incident Report Submission Leaderboards').scrollIntoView();

    cy.get('div[class^="Leaderboard__StyledItem"] a').its('length').should('be.gt', 1);

    cy.get('div[class^="Leaderboard__StyledItem"] a').first().click();

    cy.url().should('include', 'submitters=');
  });

  it('Should have the submitter pre-selected on the dropdown', () => {
    url = '/apps/discover?submitters=Anonymous';

    cy.visit(url);

    cy.contains('Submitters').find('span.badge').first().click();

    cy.get('.shadow-lg.card').find('.list-group-item.active').should('contain.text', 'Anonymous');
  });
});
