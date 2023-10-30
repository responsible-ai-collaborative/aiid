import { maybeIt } from '../../../support/utils';

const { gql } = require('@apollo/client');

describe('Checklists App Index', () => {
  const url = '/apps/checklists';

  const newChecklistButtonQuery = '#new-checklist-button';

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

  it('Should not display New Checklist button as non-logged-in user', () => {
    cy.visit(url);

    cy.get(newChecklistButtonQuery).should('not.exist');
  });

  maybeIt('Should display New Checklist button as logged-in user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.get(newChecklistButtonQuery).should('exist');
  });

  maybeIt('Should show delete buttons only for owned checklists', () => {
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
});
