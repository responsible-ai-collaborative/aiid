describe('Cite pages', () => {
  const discoverUrl = '/apps/discover';

  const url = '/cite/10';

  it('Successfully loads', () => {
    cy.visit(url);

    cy.disableSmoothScroll();
  });

  it('Should scroll to report when comming from the discover app', () => {
    cy.visit(discoverUrl);

    cy.contains('Show Details on Incident #10').first().click();

    cy.disableSmoothScroll();

    cy.wait(1000);

    cy.window().its('scrollY').should('be.closeTo', 15761, 200);
  });

  it('Should scroll to report when clicking on a report in the timeline', () => {
    cy.visit(url);

    cy.disableSmoothScroll();

    cy.get('text').contains('For some Starbucks workers, job leaves bitter taste').click();

    cy.wait(1000);

    cy.window().its('scrollY').should('be.closeTo', 4946, 200);
  });
});
