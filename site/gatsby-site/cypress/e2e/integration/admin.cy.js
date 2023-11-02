import { conditionalIt } from '../../support/utils';
import users from '../../fixtures/users/users.json';

describe('Admin', () => {
  const baseUrl = '/admin';

  it('Should show not enough permissions message', () => {
    cy.visit(baseUrl);

    cy.contains('Not enough permissions').should('be.visible');
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment') && Cypress.env('e2eUsername') && Cypress.env('e2ePassword'),
    'Should display a list of users, their roles and allow edition',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindUsers',
        'findUsers',
        users
      );

      users.data.users.forEach((user, index) => {
        cy.conditionalIntercept(
          '**/graphql',
          (req) =>
            req.body.operationName == 'FindUser' &&
            req.body?.variables?.query.userId == user.userId,
          'findUser' + index,
          { data: { user } }
        );
      });

      cy.visit(baseUrl);

      cy.waitForStableDOM();

      for (const user of users.data.users.slice(0, 5)) {
        cy.get('[data-cy="input-filter-Id"]').clear();
        cy.get('[data-cy="input-filter-Id"]').type(user.userId);

        if (user.adminData.email) {
          cy.contains('[data-cy="cell"]', user.userId)
            .parent()
            .within(() => {
              cy.contains(user.adminData.email).scrollIntoView().should('be.visible');

              for (const role of user.roles) {
                cy.contains(role).scrollIntoView().should('be.visible');
              }
            });
        } else {
          cy.contains('[data-cy="cell"]', user.userId)
            .parent()
            .within(() => {
              cy.contains('Not found').scrollIntoView().should('be.visible');

              for (const role of user.roles) {
                cy.contains(role).scrollIntoView().should('be.visible');
              }
            });
        }
      }

      const [user] = users.data.users;

      cy.get('[data-cy="input-filter-Id"]').clear();
      cy.get('[data-cy="input-filter-Id"]').type(user.userId);

      cy.contains('[data-cy="cell"]', user.adminData.email)
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

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'UpdateUserProfile',
        'UpdateUserProfile',
        {
          data: {
            users: [
              {
                __typename: 'User',
                adminData: {
                  __typename: 'UserAdminDatum',
                  creationDate: '2023-03-28T20:01:26Z',
                  disabled: false,
                  email: 'mail@cesarvarela.com',
                  lastAuthenticationDate: '2023-05-04T22:03:06Z',
                },
                first_name: 'TestEdited',
                last_name: 'User',
                roles: ['subscriber', 'admin', 'banana'],
                userId: '6423479655e4bb918a233bda',
              },
              {
                __typename: 'User',
                adminData: {
                  __typename: 'UserAdminDatum',
                  creationDate: '2023-03-30T19:04:55Z',
                  disabled: false,
                  email: 'aiidsubscriber@cesarvarela.com',
                  lastAuthenticationDate: '2023-04-28T00:33:58Z',
                },
                first_name: 'cesarito',
                last_name: 'test',
                roles: ['subscriber', 'incident_editor'],
                userId: '6425dd57ea44a80bf1443b33',
              },
              {
                __typename: 'User',
                adminData: {
                  __typename: 'UserAdminDatum',
                  creationDate: null,
                  disabled: null,
                  email: null,
                  lastAuthenticationDate: null,
                },
                first_name: null,
                last_name: null,
                roles: ['subscriber', 'admin'],
                userId: '6425dd79c505cc40eb65661e',
              },
            ],
          },
        }
      );

      cy.get('[data-cy="edit-user-modal"]').within(() => {
        cy.get('[id="roles"]', { timeout: 30000 }).type('banana{enter}');

        cy.get('[name="first_name"]').clear().type('Edited');

        cy.contains('Submit').click();

        cy.wait('@UpdateUserRoles').then((xhr) => {
          expect(xhr.request.body.variables.roles).includes('banana');
          expect(xhr.request.body.variables.userId).eq(user.userId);
        });

        cy.wait('@UpdateUserProfile').then((xhr) => {
          expect(xhr.request.body.variables.first_name).eq('Edited');
          expect(xhr.request.body.variables.userId).eq(user.userId);
        });
      });
    }
  );

  conditionalIt(
    !Cypress.env('isEmptyEnvironment') && Cypress.env('e2eUsername') && Cypress.env('e2ePassword'),
    'Should display New Incident button',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindUsers',
        'findUsers',
        users
      );

      cy.visit(baseUrl);

      cy.waitForStableDOM();

      cy.wait('@findUsers');

      cy.contains('New Incident').click();

      cy.waitForStableDOM();

      cy.url({ timeout: 30000 }).should('include', '/incidents/new');
    }
  );

  conditionalIt(
    !Cypress.env('isEmptyEnvironment') && Cypress.env('e2eUsername') && Cypress.env('e2ePassword'),
    'Should filter results',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindUsers',
        'findUsers',
        users
      );

      users.data.users.forEach((user) => {
        cy.conditionalIntercept(
          '**/graphql',
          (req) => {
            return (
              req.body.operationName == 'FindUser' &&
              req.body?.variables?.query.userId == user.userId
            );
          },
          'findUser',
          { data: { user } }
        );
      });

      cy.visit(baseUrl);

      cy.waitForStableDOM();

      cy.wait('@findUsers');

      cy.wait('@findUser');

      cy.get('[data-cy="input-filter-First Name"]').clear().type('Test');

      cy.get('[data-cy="input-filter-Last Name"]').clear().type('User');

      cy.get('[data-cy="input-filter-Roles"]').clear().type('admin');

      cy.get('[data-cy="input-filter-Email"]').clear().type('pablo@botsfactory.io');

      cy.get('[data-cy="header-adminData.creationDate"] input')
        .clear()
        .type('01/09/2022 - 30/09/2022');

      cy.get('[data-cy="header-adminData.lastAuthenticationDate"] input')
        .clear()
        .type('06/06/2023 - 06/06/2023');

      cy.get('[data-cy="row"]').should('have.length', 1);
    }
  );
});
