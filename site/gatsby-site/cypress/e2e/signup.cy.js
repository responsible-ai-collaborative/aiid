describe('Signup', () => {
  const url = '/signup';

  it('Should successfully load sign up page', () => {
    cy.visit(url);
  });

  it('Should display success a toast message after a sign up', () => {
    cy.visit(url);

    const email = 'newUser@test.com';

    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type('newUserPassword');
    cy.get('input[name=passwordConfirm]').type('newUserPassword');

    cy.intercept('POST', '**/register', {
      statusCode: 201,
    });

    cy.contains('Sign up').click();
    cy.get('[data-cy="toast"]').contains(`Verification email sent to ${email}`).should('exist');
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

  it('Should redirect to specific page after sign up if redirectTo is provided', () => {
    const redirectTo = '/cite/10';

    cy.visit(`${url}?redirectTo=${redirectTo}`);
    cy.get('input[name=email]').type('newUser@test.com');
    cy.get('input[name=password]').type('newUserPassword');
    cy.get('input[name=passwordConfirm]').type('newUserPassword');

    cy.intercept('POST', '**/register', {
      statusCode: 201,
    });

    cy.contains('Sign up').click();
    cy.location('pathname', { timeout: 8000 }).should('eq', redirectTo);
  });
});
