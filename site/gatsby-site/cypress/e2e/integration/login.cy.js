describe('Login', () => {
  const url = '/login';

  it('Should successfully load login page', () => {
    cy.visit(url);
  });

  it('Should redirect to home page after login by default', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));
  });

  it('Should redirect to specific page after login if redirectTo is provided', () => {
    const redirectTo = '/cite/10/';

    cy.clearLocalStorage();
    cy.visit(`${url}?redirectTo=${redirectTo}`);
    cy.get('input[name=email]').type(Cypress.env('e2eUsername'));
    cy.get('input[name=password]').type(Cypress.env('e2ePassword'));
    cy.get('[data-cy="login-btn"]').click();

    cy.location('pathname', { timeout: 8000 }).should('eq', redirectTo);
  });

  it('Should display error toast if the email address or password is incorrect', () => {
    cy.visit(url);
    cy.get('input[name=email]').type('fakeUser@test.com');
    cy.get('input[name=password]').type('fakePassword');
    cy.get('[data-cy="login-btn"]').click();

    cy.get('[data-cy="toast"]').contains('invalid username/password').should('exist');
  });

  it('Should disable Login button if email address is not valid', () => {
    cy.visit(url);
    cy.get('input[name=email]').type('fakeUser');
    cy.get('input[name=password]').type('fakePassword');
    cy.get('[data-cy="login-btn"]').should('be.disabled');

    cy.get('input[name=email]').clear().type('fakeUser@test.com');
    cy.get('[data-cy="login-btn"]').should('not.be.disabled');
  });

  it('Should redirect to forgot password page if the user clicks on "Forgot password?" link', () => {
    cy.visit(url);
    cy.contains('Forgot password?').click();
    cy.location('pathname').should('eq', '/forgotpassword/');
  });
});
