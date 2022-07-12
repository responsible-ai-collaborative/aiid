describe('Submitter Selection', () => {
  const url = '/';

  it('Should successfully load home page', () => {
    cy.visit(url);
  });

  it('Should sroll to Incident Report Submission Leaderboards', () => {
    cy.contains('Incident Report Submission Leaderboards').scrollIntoView();
  });

  it('Should select the first submitter if there is one', () => {
    cy.get('div[class^="Leaderboard__StyledItem"] a').its('length').should('be.gt', 1);

    cy.get('div[class^="Leaderboard__StyledItem"] a').first().click();
  });

  it('Should load the discover page with a pre-selected submitter in the URL', () => {
    cy.url().should('include', 'submitters=');
  });

  it('Should have the submitter pre-selected on the dropdown', () => {
    cy.contains('Submitters').find('span.badge').first().click();

    cy.contains('Submitters').find('span.badge').first().should('contain.text', '1');
  });
});
