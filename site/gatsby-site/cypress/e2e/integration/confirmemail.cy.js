describe('Confirm email', () => {
  const url = '/confirmemail';

  it('Should successfully load confirm email page', () => {
    cy.visit(url);
  });

  it('Should display Invalid params messsage when token or tokenId are missing', () => {
    cy.visit(`${url}?token=dummyToken`);

    cy.contains('Invalid parameters').should('exist');
    cy.get('[data-cy="confirm-login-btn"]').should('exist');

    cy.visit(`${url}?tokenId=dummyTokenId`);

    cy.contains('Invalid parameters').should('exist');
    cy.get('[data-cy="confirm-login-btn"]').should('exist');
  });

  it('Should display an error message if the confirmation failed on Atlas', () => {
    cy.visit(`${url}?token=invalidToken&tokenId=invalidTokenId`);

    cy.contains('An unknown error has ocurred').should('exist');
    cy.get('[data-cy="confirm-login-btn"]').should('exist');
  });

  it('Should display success message if the email is confirmed on Atlas', () => {
    cy.intercept('POST', '**/confirm', {
      statusCode: 201,
    });

    cy.visit(`${url}?token=dummyToken&tokenId=dummyTokenId`);

    cy.contains('Thank you for verifying your account.').should('exist');
    cy.get('[data-cy="confirm-login-btn"]').should('exist');

    cy.get('[data-cy="confirm-login-btn"]').click();
    cy.location('pathname', { timeout: 8000 }).should('eq', '/login/');
    cy.location('search', { timeout: 8000 }).should('eq', '?redirectTo=/account');
  });
});
