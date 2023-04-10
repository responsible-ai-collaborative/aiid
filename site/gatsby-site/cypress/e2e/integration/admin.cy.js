const { gql } = require('@apollo/client');

const { maybeIt } = require('../../support/utils');

describe('Admin', () => {
  const baseUrl = '/admin';

  it('Should show not enough permissions message', () => {
    cy.visit(baseUrl);

    cy.contains('Not enough permissions').should('be.visible');
  });

  maybeIt('Should display a list of users, their roles abnd allow edition', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(baseUrl);

    cy.query({
      query: gql`
        {
          users {
            userId
            roles
            adminData {
              email
            }
          }
        }
      `,
    }).then(({ data: { users } }) => {
      for (const user of users) {
        cy.contains('[role="cell"]', user.adminData.email)
          .parent()
          .within(() => {
            for (const role of user.roles) {
              cy.contains(role).should('be.visible');
            }
          });
      }

      const [user] = users;

      cy.log(user.adminData.email);

      cy.contains('[role="cell"]', user.adminData.email)
        .parent()
        .within(() => {
          cy.contains('Edit').click();
        });

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
          expect(xhr.request.body.variables.userId).eq(user.userId);
        });
      });
    });
  });
});
