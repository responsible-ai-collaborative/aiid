describe('Unsubscribe pages', () => {
  const userId = '6304204e580ff154aefea0c6';

  const incidentId = 10;

  const url = `/unsubscribe`;

  it('Successfully loads', () => {
    cy.visit(url);

    cy.contains('Invalid parameters').should('exist');
  });

  it('Should display an Invalid Params message if userId param is not present', () => {
    cy.visit(`${url}?type=incident`);

    cy.contains('Invalid parameters').should('exist');
  });

  it('Should display an Invalid Params message if type param is not present', () => {
    cy.visit(`${url}?userId=${userId}`);

    cy.contains('Invalid parameters').should('exist');
  });

  it('Should display an Invalid Params message if type param incident but incidentId is not present', () => {
    cy.visit(`${url}?type=incident&userId=${userId}`);

    cy.contains('Invalid parameters').should('exist');
  });

  it('Should not display an Invalid Params message if params are OK', () => {
    cy.visit(`${url}?type=all&userId=${userId}`);

    cy.contains('Invalid parameters').should('not.exist');
  });

  it('Should not display an Invalid Params message if params are OK', () => {
    cy.visit(`${url}?type=incident&userId=${userId}&incidentId=${incidentId}`);

    cy.contains('Invalid parameters').should('not.exist');
  });
});
