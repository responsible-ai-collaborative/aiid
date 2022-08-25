describe('Signup', () => {
  const url = '/signup';

  it('Should successfully load sign up page', () => {
    cy.visit(url);
  });

  it('Should display success a toast message after a sign up', () => {
    cy.visit(url);
    cy.get('input[name=email]').type('newUser@test.com');
    cy.get('input[name=password]').type('newUserPassword');
    cy.get('input[name=passwordConfirm]').type('newUserPassword');

    cy.intercept('POST', '**/register', {
      statusCode: 201,
    });

    cy.contains('Sign up').click();
    cy.get('[data-cy="toast"]').contains('Account created').should('exist');
  });

  it('Should display the error toast message if the user already exists', () => {
    cy.visit(url);
    cy.get('input[name=email]').type(Cypress.env('e2eUsername'));
    cy.get('input[name=password]').type('anyPassword');
    cy.get('input[name=passwordConfirm]').type('anyPassword');
    cy.contains('Sign up').click();
    cy.get('[data-cy="toast"]').contains('name already in use').should('exist');
  });

  it('Should display the error toast message if any other sign up error occur', () => {
    cy.visit(url);
    cy.get('input[name=email]').type('test@test.com');
    cy.get('input[name=password]').type('anyPassword');
    cy.get('input[name=passwordConfirm]').type('anyPassword');

    cy.intercept('POST', '**/register', {
      statusCode: 500,
      body: {
        error: 'Something bad happened :(',
      },
    });

    cy.contains('Sign up').click();
    cy.get('[data-cy="toast"]').contains('Something bad happened :(').should('exist');
  });
});
