import { maybeIt } from '../../../support/utils';

const { gql } = require('@apollo/client');

describe('Checklists App Index', () => {
  const url = '/apps/checklists';

  const newChecklistButtonQuery = '#new-checklist-button';

  const testError = {
    0: {
      message: 'Test error',
      locations: [{ line: 1, column: 1 }],
    },
  };

  const usersQuery = {
    query: gql`
      {
        users(limit: 9999) {
          userId
          roles
          adminData {
            email
          }
        }
      }
    `,
    timeout: 120000, // mongodb admin api is extremely slow
  };

  it('Should sort checklists', () => {
    cy.query(usersQuery).then(({ data: { users } }) => {
      const user = users.find((user) => user.adminData.email == Cypress.env('e2eUsername'));

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'findChecklists',
        'findChecklists',
        {
          data: {
            checklists: [
              {
                about: '',
                id: 'fakeChecklist1',
                name: 'My Checklist',
                owner_id: user.userId,
                risks: [],
                tags_goals: ['GMF:Known AI Goal:Translation'],
                tags_methods: [],
                tags_other: [],
                date_created: '2024-01-01T00:26:02.959+00:00',
                date_updated: '2024-01-05T00:26:02.959+00:00',
              },
              {
                about: '',
                id: 'fakeChecklist2',
                name: 'Another checklist',
                owner_id: user.userId,
                risks: [],
                tags_goals: [],
                tags_methods: [],
                tags_other: [],
                date_created: '2024-01-03T00:26:02.959+00:00',
                date_updated: '2024-01-03T00:26:02.959+00:00',
              },
            ],
          },
        }
      );

      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      cy.visit(url);

      cy.get('#sort-by').select('newest-first');

      cy.get('[data-cy="checklist-card"]').first().contains('Another checklist');

      cy.get('#sort-by').select('last-updated');

      cy.get('[data-cy="checklist-card"]').first().contains('My Checklist');

      cy.get('#sort-by').select('alphabetical');

      cy.get('[data-cy="checklist-card"]').first().contains('Another checklist');

      cy.get('#sort-by').select('oldest-first');

      cy.get('[data-cy="checklist-card"]').first().contains('My Checklist');
    });
  });

  it('Should not display New Checklist button as non-logged-in user', () => {
    cy.visit(url);

    cy.get(newChecklistButtonQuery).should('not.exist');
  });

  maybeIt('Should display New Checklist button as logged-in user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.get(newChecklistButtonQuery).should('exist');
  });

  /* We're now showing only the user's owned checklists,
   * so we can't test that the delete button doesn't show up on unowned ones.
   * Eventually, we'll probably have public checklists show up here too,
   * so this can be skipped with a TODO to activate it
   * once there are unowned checklists displayed.
   */
  it.skip('Should show delete buttons only for owned checklists', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.query(usersQuery).then(({ data: { users } }) => {
      const user = users.find((user) => user.adminData.email == Cypress.env('e2eUsername'));

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'findChecklists',
        'findChecklists',
        {
          data: {
            checklists: [
              {
                about: '',
                id: 'fakeChecklist1',
                name: 'My Checklist',
                owner_id: user.userId,
                risks: [],
                tags_goals: [],
                tags_methods: [],
                tags_other: [],
              },
              {
                about: '',
                id: 'fakeChecklist2',
                name: "Somebody Else's Checklist",
                owner_id: 'aFakeUserId',
                risks: [],
                tags_goals: [],
                tags_methods: [],
                tags_other: [],
              },
            ],
          },
        }
      );

      cy.visit(url);

      cy.wait(['@findChecklists']);

      cy.waitForStableDOM();

      cy.get('[data-cy="checklist-card"]:first-child button').contains('Delete').should('exist');

      cy.get('[data-cy="checklist-card"]:last-child button').contains('Delete').should('not.exist');
    });
  });

  it('Should show toast on error fetching checklists', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'findChecklists',
      'findChecklists',
      { errors: [testError] }
    );

    cy.visit(url);

    cy.get('[data-cy="toast"]').contains('Could not fetch checklists').should('exist');
  });

  it('Should show toast on error fetching risks', () => {
    cy.query(usersQuery).then(({ data: { users } }) => {
      const user = users.find((user) => user.adminData.email == Cypress.env('e2eUsername'));

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'findChecklists',
        'findChecklists',
        {
          data: {
            checklists: [
              {
                about: '',
                id: 'fakeChecklist1',
                name: 'My Checklist',
                owner_id: user.userId,
                risks: [],
                tags_goals: ['GMF:Known AI Goal:Translation'],
                tags_methods: [],
                tags_other: [],
              },
              {
                about: '',
                id: 'fakeChecklist2',
                name: "Somebody Else's Checklist",
                owner_id: 'aFakeUserId',
                risks: [],
                tags_goals: [],
                tags_methods: [],
                tags_other: [],
              },
            ],
          },
        }
      );

      cy.conditionalIntercept('**/graphql', (req) => req.body.query.includes('GMF'), 'risks', {
        errors: [testError],
      });

      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      cy.visit(url);

      cy.get('[data-cy="toast"]').contains('Failure searching for risks').should('exist');
    });
  });

  maybeIt('Should show toast on error creating checklist', () => {
    cy.query(usersQuery).then(({ data: { users } }) => {
      const user = users.find((user) => user.adminData.email == Cypress.env('e2eUsername'));

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'insertChecklist',
        'insertChecklist',
        { errors: [testError] }
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'findChecklists',
        'findChecklists',
        {
          data: {
            checklists: [
              {
                about: '',
                id: 'fakeChecklist1',
                name: 'My Checklist',
                owner_id: user.userId,
                risks: [],
                tags_goals: [],
                tags_methods: [],
                tags_other: [],
              },
              {
                about: '',
                id: 'fakeChecklist2',
                name: "Somebody Else's Checklist",
                owner_id: 'aFakeUserId',
                risks: [],
                tags_goals: [],
                tags_methods: [],
                tags_other: [],
              },
            ],
          },
        }
      );

      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      cy.visit(url);

      cy.get(newChecklistButtonQuery).click();

      cy.get('[data-cy="toast"]').contains('Could not create checklist.').should('exist');
    });
  });
});
