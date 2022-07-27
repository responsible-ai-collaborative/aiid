describe('Incidents Summary', () => {
  const url = '/summaries/flagged';

  it('Successfully loads', () => {
    cy.visit(url);
  });
});
