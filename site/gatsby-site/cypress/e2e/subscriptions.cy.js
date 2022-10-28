import subscriptionsData from '../fixtures/subscriptions/subscriptions.json';
import emptySubscriptionsData from '../fixtures/subscriptions/empty-subscriptions.json';
import { SUBSCRIPTION_TYPE } from '../../src/utils/subscriptions';

const subscriptions = subscriptionsData.data.subscriptions
  .filter((subscription) => subscription.type === SUBSCRIPTION_TYPE.incident)
  .sort((a, b) => a.incident_id.incident_id - b.incident_id.incident_id);

const USER_ID = '63320ce63ec803072c9f529c';

describe('Subscriptions', () => {
  const url = '/account';

  it('Should display user subscriptions to incident updates', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      subscriptionsData
    );

    cy.visit(url);

    cy.get('[data-cy="subscription-item"]').should('have.length', subscriptions.length);

    subscriptions.forEach((subscription, index) => {
      const incident = subscription.incident_id;

      cy.get('[data-cy="subscription-item"] > div')
        .eq(index)
        .contains(`Updates on incident #${incident.incident_id}: ${incident.title}`);
    });
  });

  it("Should display a information message if the user does't have subscriptions to incident updates", () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      emptySubscriptionsData
    );

    cy.visit(url);

    cy.get('[data-cy="subscription-item"]').should('not.exist');

    cy.contains("You don't have active subscriptions to Incident updates").should('exist');
  });

  it('Delete a user subscription to incident updates', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      subscriptionsData
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'DeleteSubscriptions' &&
        req.body.variables.query._id == subscriptions[0]._id,
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

    cy.visit(url);

    cy.get('[data-cy="delete-btn"]').first().click();

    cy.wait('@DeleteSubscription');

    cy.get('[data-cy="subscription-item"]').should('have.length', subscriptions.length - 1);
  });

  it('Delete the last subscription to incident updates', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      {
        data: {
          subscriptions: [subscriptions[0]],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'DeleteSubscriptions' &&
        req.body.variables.query._id == subscriptions[0]._id,
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

    cy.visit(url);

    cy.get('[data-cy="delete-btn"]').first().click();

    cy.wait('@DeleteSubscription');

    cy.get('[data-cy="subscription-item"]').should('not.exist');

    cy.contains("You don't have active subscriptions to Incident updates").should('exist');
  });

  it.skip("Should display the switch toggle off if user does't have a subscription to new incidents", () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      emptySubscriptionsData
    );

    cy.visit(url);

    cy.get('input[name=subscribe-all]').should('not.exist');

    cy.get('button[role=switch][aria-checked=false]').should('exist');
  });

  it.skip('Should display the switch toggle on if user have a subscription to new incidents', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      subscriptionsData
    );

    cy.visit(url);

    cy.get('input[name=subscribe-all]').should('be.checked');

    cy.get('button[role=switch][aria-checked=true]').should('exist');
  });

  it.skip('Subscribe/Unsubscribe to new incidents', () => {
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
      (req) => req.body.operationName == 'UpsertSubscription',
      'UpsertSubscription',
      {
        data: {
          upsertOneSubscription: {
            _id: 'dummyIncidentId',
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'DeleteSubscriptions' &&
        req.body.variables.query.userId.userId == USER_ID &&
        req.body.variables.query.type == SUBSCRIPTION_TYPE.newIncidents,
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

    cy.wait(1000); // Wait for subscriptions

    // Subscribe to new Incidents
    cy.get('button[role=switch]').scrollIntoView().click();

    cy.wait('@UpsertSubscription');

    cy.get('input[name=subscribe-all]').should('be.checked');

    cy.get('button[role=switch][aria-checked=true]').should('exist');

    // Unsubscribe to new Incidents
    cy.get('button[role=switch]').scrollIntoView().click();

    cy.wait('@DeleteSubscription');

    cy.get('input[name=subscribe-all]').should('not.exist');

    cy.get('button[role=switch][aria-checked=false]').should('exist');
  });
});
