import { maybeIt } from '../../support/utils';

describe('Account', () => {
  const url = '/account';

  it('Should successfully load account page', () => {
    cy.visit(url);
  });

  maybeIt('Should display account information if the user is logged in', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.waitForStableDOM();

    cy.get('[data-cy="details-table"]').within(() => {
      cy.contains(Cypress.env('e2eUsername')).should('be.visible');
      cy.contains('td', 'Test').should('be.visible');
      cy.contains('td', 'User').should('be.visible');
      cy.contains('td', 'admin').should('be.visible');
    });

    cy.contains('Log out').should('exist');
  });

  maybeIt('Should allow editing user data', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.waitForStableDOM();

    cy.contains('button', 'Edit').click();

    cy.waitForStableDOM();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateUserRoles',
      'UpdateUserRoles',
      {
        data: {
          updateOneUser: {
            __typename: 'User',
            roles: ['subscriber', 'bananas', 'ban', 'admin', 'banana'],
            userId: '6423479655e4bb918a233bda',
          },
        },
      }
    );

    cy.get('[data-cy="edit-user-modal"]').within(() => {
      cy.get('[id="roles"]', { timeout: 30000 }).type('banana{enter}');

      cy.contains('Submit').click();

      cy.wait('@UpdateUserRoles').then((xhr) => {
        expect(xhr.request.body.variables.roles).includes('banana');
      });
    });
  });

  maybeIt('Should show edit modal if query parameter is is set', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url + '?askToCompleteProfile=1');

    cy.waitForStableDOM();

    cy.get('[data-cy="edit-user-modal"]').should('be.visible');
  });
});
