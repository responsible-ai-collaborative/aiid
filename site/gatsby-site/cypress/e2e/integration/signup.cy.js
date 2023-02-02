describe('Signup', () => {
  const url = '/signup';

  it('Should successfully load sign up page', () => {
    cy.visit(url);
  });

  it('Should display success a toast message after a sign up', () => {
    cy.visit(url);

    const email = 'newUser@test.com';

    const password = 'newUserPassword';

    cy.get('[data-cy="signup-btn"]').click();

    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('input[name=passwordConfirm]').type(password);

    cy.conditionalIntercept(
      '**/register',
      (req) => req.body.email == email && req.body.password == password,
      'Register',
      {
        statusCode: 201,
      }
    );

    cy.get('[data-cy="signup-btn"]').click();
    cy.wait('@Register');
    cy.get('[data-cy="toast"]').contains(`Verification email sent to ${email}`).should('exist');
  });

  it('Should display the error toast message if the user already exists', () => {
    cy.visit(url);

    cy.get('[data-cy="signup-btn"]').click();

    cy.get('input[name=email]').type(Cypress.env('e2eUsername'));
    cy.get('input[name=password]').type('anyPassword');
    cy.get('input[name=passwordConfirm]').type('anyPassword');
    cy.get('[data-cy="signup-btn"]').click();
    cy.get('[data-cy="toast"]').contains('name already in use').should('exist');
  });

  it('Should display the error toast message if any other sign up error occur', () => {
    cy.visit(url);

    cy.get('[data-cy="signup-btn"]').click();

    cy.get('input[name=email]').type('test@test.com');
    cy.get('input[name=password]').type('anyPassword');
    cy.get('input[name=passwordConfirm]').type('anyPassword');

    cy.intercept('POST', '**/register', {
      statusCode: 500,
      body: {
        error: 'Something bad happened :(',
      },
    });

    cy.get('[data-cy="signup-btn"]').click();
    cy.get('[data-cy="toast"]').contains('Something bad happened :(').should('exist');
  });

  it('Should redirect to specific page after sign up if redirectTo is provided', () => {
    const redirectTo = '/cite/10/';

    cy.visit(`${url}?redirectTo=${redirectTo}`);

    cy.get('[data-cy="signup-btn"]').click();

    const email = 'newUser@test.com';

    const password = 'newUserPassword';

    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('input[name=passwordConfirm]').type(password);

    cy.intercept('POST', '**/register', {
      statusCode: 201,
    });

    cy.conditionalIntercept(
      '**/register',
      (req) => req.body.email == email && req.body.password == password,
      'Register',
      {
        statusCode: 201,
      }
    );

    cy.get('[data-cy="signup-btn"]').click();
    cy.wait('@Register');
    cy.location('pathname', { timeout: 8000 }).should('eq', redirectTo);
  });

  it('Should display success a toast message after a subscription to Major updates', () => {
    cy.visit(url);

    const email = 'newUser@test.com';

    cy.get('input[name=emailSubscription]').type(email);

    cy.intercept('POST', '**/register', {
      statusCode: 201,
    });

    cy.conditionalIntercept(
      '**/register',
      (req) => req.body.email == email && req.body.password == '123456',
      'Register',
      {
        statusCode: 201,
      }
    );

    cy.get('[data-cy="subscribe-to-updates-btn"]').click();
    cy.wait('@Register');
    cy.get('[data-cy="toast"]')
      .contains(`Thanks for subscribing to our Newsletter!`)
      .should('exist');
  });
});
