import { maybeIt } from '../../support/utils';
import emptySubscriptionsData from '../../fixtures/subscriptions/empty-subscriptions.json';
import subscriptionsData from '../../fixtures/subscriptions/subscriptions.json';
const { SUBSCRIPTION_TYPE } = require('../../../src/utils/subscriptions');

const entity = {
  entity_id: 'google',
  name: 'Google',
};

const USER_ID = '63320ce63ec803072c9f529c';

describe('Entities page', () => {
  const url = `/entities/${entity.entity_id}`;

  it('Successfully loads', () => {
    cy.visit(url);
  });

  maybeIt('Should subscribe to new Entity incidents (authenticated user)', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      emptySubscriptionsData
    );

    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpsertSubscription' &&
        req.body.variables.query.entityId.entity_id == entity.entity_id &&
        req.body.variables.query.type == SUBSCRIPTION_TYPE.entity &&
        req.body.variables.subscription.entityId.link == entity.entity_id &&
        req.body.variables.subscription.type == SUBSCRIPTION_TYPE.entity,
      'upsertSubscription',
      {
        data: {
          upsertOneSubscription: {
            _id: 'dummyIncidentId',
          },
        },
      }
    );

    cy.contains(`Notify Me of New ${entity.name} Incidents`).scrollIntoView().click();

    cy.get('[data-cy="toast"]', { timeout: 8000 })
      .contains(`You have successfully subscribed to new ${entity.name} incidents`)
      .should('exist');
  });

  maybeIt('Should unsubscribe to new Entity incidents (authenticated user)', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      subscriptionsData
    );

    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'DeleteSubscription' &&
        req.body.variables.query.type == SUBSCRIPTION_TYPE.entity &&
        req.body.variables.query.entityId.entity_id == entity.entity_id,
      'DeleteSubscription',
      {
        data: {
          deleteManySubscriptions: {
            __typename: 'DeleteManyPayload',
            deletedCount: 1,
          },
        },
      }
    );

    cy.contains(`Unsubscribe from New ${entity.name} Incidents`).scrollIntoView().click();

    cy.get('[data-cy="toast"]', { timeout: 8000 })
      .contains(`You have successfully unsubscribed to new ${entity.name} incidents`)
      .should('exist');
  });

  it('Should not subscribe to new Entity incidents (user unauthenticated)', () => {
    cy.conditionalIntercept(
      '**/login',
      (req) => req.body.username == Cypress.env('e2eUsername'),
      'Login',
      {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjYzNDQ5MjFkZmEwMTA1NWE4ZDBmOTBlMCIsImJhYXNfZG9tYWluX2lkIjoiNjMzMjA3ZjEwZDQzOGYxM2FiM2FiNGQ3IiwiZXhwIjoxNjY1NDQwMDM3LCJpYXQiOjE2NjU0MzgyMzcsImlzcyI6IjYzNDQ5MjFkZmEwMTA1NWE4ZDBmOTEwMyIsInN0aXRjaF9kZXZJZCI6IjYzNDQ5MjFkZmEwMTA1NWE4ZDBmOTBlMCIsInN0aXRjaF9kb21haW5JZCI6IjYzMzIwN2YxMGQ0MzhmMTNhYjNhYjRkNyIsInN1YiI6IjYzMzIwY2U2M2VjODAzMDcyYzlmNTI5YyIsInR5cCI6ImFjY2VzcyIsInVzZXJfZGF0YSI6eyJfaWQiOiI2MzMyMGNlNzNlYzgwMzA3MmM5ZjUzZGUiLCJ1c2VySWQiOiI2MzMyMGNlNjNlYzgwMzA3MmM5ZjUyOWMiLCJyb2xlcyI6WyJhZG1pbiJdfX0.QffZbYIyr4BoAUzDOsj6zhTwGhypd45djZNKPui31NA',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RhdGEiOm51bGwsImJhYXNfZGV2aWNlX2lkIjoiNjM0NDkyMWRmYTAxMDU1YThkMGY5MGUwIiwiYmFhc19kb21haW5faWQiOiI2MzMyMDdmMTBkNDM4ZjEzYWIzYWI0ZDciLCJiYWFzX2lkIjoiNjM0NDkyMWRmYTAxMDU1YThkMGY5MTAzIiwiYmFhc19pZGVudGl0eSI6eyJpZCI6IjYzMzIwY2U2M2VjODAzMDcyYzlmNTI5YiIsInByb3ZpZGVyX3R5cGUiOiJsb2NhbC11c2VycGFzcyIsInByb3ZpZGVyX2lkIjoiNjMzMjBiYzhlOTg5OGNlMjIzZTE5ZWUxIn0sImV4cCI6MTY3MDYyMjIzNywiaWF0IjoxNjY1NDM4MjM3LCJzdGl0Y2hfZGF0YSI6bnVsbCwic3RpdGNoX2RldklkIjoiNjM0NDkyMWRmYTAxMDU1YThkMGY5MGUwIiwic3RpdGNoX2RvbWFpbklkIjoiNjMzMjA3ZjEwZDQzOGYxM2FiM2FiNGQ3Iiwic3RpdGNoX2lkIjoiNjM0NDkyMWRmYTAxMDU1YThkMGY5MTAzIiwic3RpdGNoX2lkZW50Ijp7ImlkIjoiNjMzMjBjZTYzZWM4MDMwNzJjOWY1MjliIiwicHJvdmlkZXJfdHlwZSI6ImxvY2FsLXVzZXJwYXNzIiwicHJvdmlkZXJfaWQiOiI2MzMyMGJjOGU5ODk4Y2UyMjNlMTllZTEifSwic3ViIjoiNjMzMjBjZTYzZWM4MDMwNzJjOWY1MjljIiwidHlwIjoicmVmcmVzaCJ9.uXc_xJfePKgcPPzGjLIU9q91a2vTI0cM74aKtmBWbDs',
        user_id: USER_ID,
        device_id: '6344921dfa01055a8d0f90e0',
      }
    );

    cy.visit(url);

    cy.contains(`Notify Me of New ${entity.name} Incidents`, { timeout: 8000 })
      .scrollIntoView()
      .click();

    cy.get('[data-cy="toast"]', { timeout: 8000 })
      .contains(`Please log in to subscribe`)
      .should('exist');
  });
});
