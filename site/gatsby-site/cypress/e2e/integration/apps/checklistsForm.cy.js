import { maybeIt } from '../../../support/utils';
const { gql } = require('@apollo/client');

describe('Checklists App Form', () => {
  const url = '/apps/checklists?id=testChecklist';

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

  it('Should have read-only access for non-logged-in users', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'findChecklist',
      'findChecklist',
      {
        data: {
          checklist: {
            __typename: 'Checklist',
            about: '',
            id: 'testChecklist',
            name: 'Test Checklist',
            owner_id: 'a-fake-user-id-that-does-not-exist',
            risks: [],
            tags_goals: [],
            tags_methods: [],
            tags_other: [],
          },
        },
      }
    );

    cy.visit(url);

    cy.wait(['@findChecklist']);

    cy.waitForStableDOM();

    cy.get('[data-cy="checklist-form"] textarea:not([disabled])').should('not.exist');

    cy.get('[data-cy="checklist-form"] input:not([disabled]):not([readonly])').should('not.exist');
  });

  maybeIt('Should have read-only access for logged-in non-owners', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'findChecklist',
      'findChecklist',
      {
        data: {
          checklist: {
            __typename: 'Checklist',
            about: '',
            id: 'testChecklist',
            name: 'Test Checklist',
            owner_id: 'a-fake-user-id-that-does-not-exist',
            risks: [],
            tags_goals: [],
            tags_methods: [],
            tags_other: [],
          },
        },
      }
    );

    cy.visit(url);

    cy.wait(['@findChecklist']);

    cy.waitForStableDOM();

    cy.get('[data-cy="checklist-form"] textarea:not([disabled])').should('not.exist');

    cy.get('[data-cy="checklist-form"] input:not([disabled]):not([readonly])').should('not.exist');
  });

  maybeIt('Should allow editing for owner', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.query(usersQuery).then(({ data: { users } }) => {
      const user = users.find((user) => user.adminData.email == Cypress.env('e2eUsername'));

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'findChecklist',
        'findChecklist',
        {
          data: {
            checklist: {
              __typename: 'Checklist',
              about: '',
              id: 'testChecklist',
              name: 'Test Checklist',
              owner_id: user.userId,
              risks: [],
              tags_goals: [],
              tags_methods: [],
              tags_other: [],
            },
          },
        }
      );
      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'upsertChecklist',
        'upsertChecklist',
        {
          data: {
            checklist: {
              __typename: 'Checklist',
              about: "It's a system that does something probably.",
              id: 'testChecklist',
              name: 'Test Checklist',
              owner_id: user.userId,
              risks: [],
              tags_goals: [],
              tags_methods: [],
              tags_other: [],
            },
          },
        }
      );

      cy.visit(url);

      cy.wait(['@findChecklist']);

      cy.waitForStableDOM();

      cy.get('[data-cy="about"]').type("It's a system that does something probably.");

      cy.wait(['@upsertChecklist']);
    });
  });
});
