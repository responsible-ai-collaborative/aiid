import subscriptionsData from '../../fixtures/subscriptions/subscriptions.json';
import emptySubscriptionsData from '../../fixtures/subscriptions/empty-subscriptions.json';
import { SUBSCRIPTION_TYPE } from '../../../src/utils/subscriptions';

const incidentSubscriptions = subscriptionsData.data.subscriptions
  .filter((subscription) => subscription.type === SUBSCRIPTION_TYPE.incident)
  .sort((a, b) => a.incident_id.incident_id - b.incident_id.incident_id);

const entitySubscriptions = subscriptionsData.data.subscriptions
  .filter((subscription) => subscription.type === SUBSCRIPTION_TYPE.entity)
  .sort((a, b) => a.entityId.name - b.entityId.name);

describe('Subscriptions', () => {
  const url = '/account';

  it('Incident Updates: Should display user subscriptions', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      subscriptionsData
    );

    cy.visit(url);

    cy.get('[data-cy="incident-subscription-item"]').should(
      'have.length',
      incidentSubscriptions.length
    );

    incidentSubscriptions.forEach((subscription, index) => {
      const incident = subscription.incident_id;

      cy.get('[data-cy="incident-subscription-item"] > div')
        .eq(index)
        .contains(`Updates on incident #${incident.incident_id}: ${incident.title}`);
    });
  });

  it("Incident Updates: Should display a information message if the user does't have subscriptions", () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      emptySubscriptionsData
    );

    cy.visit(url);

    cy.get('[data-cy="incident-subscription-item"]').should('not.exist');

    cy.contains("You don't have active subscriptions to Incident updates").should('exist');
  });

  it('Incident Updates: Delete a user subscription', () => {
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
        req.body.variables.query._id == incidentSubscriptions[0]._id,
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

    cy.get('[data-cy="incident-delete-btn"]').first().click();

    cy.wait('@DeleteSubscription');

    cy.get('[data-cy="incident-subscription-item"]').should(
      'have.length',
      incidentSubscriptions.length - 1
    );
  });

  it('Incident Updates: Delete the last subscription', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      {
        data: {
          subscriptions: [incidentSubscriptions[0]],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'DeleteSubscriptions' &&
        req.body.variables.query._id == incidentSubscriptions[0]._id,
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

    cy.get('[data-cy="incident-delete-btn"]').first().click();

    cy.wait('@DeleteSubscription');

    cy.get('[data-cy="incident-subscription-item"]').should('not.exist');

    cy.contains("You don't have active subscriptions to Incident updates").should('exist');
  });

  it("New Incidents: Should display the switch toggle off if user does't have a subscription", () => {
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

  it('New Incidents: Should display the switch toggle on if user have a subscription', () => {
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

  // mocking userId does not work
  it('New Incidents: Subscribe/Unsubscribe', () => {
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

  it('Entity: Should display user subscriptions', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      subscriptionsData
    );

    cy.visit(url);

    cy.get('[data-cy="entity-subscription-item"]').should(
      'have.length',
      entitySubscriptions.length
    );

    entitySubscriptions.forEach((subscription, index) => {
      const entity = subscription.entityId;

      cy.get('[data-cy="entity-subscription-item"] > div')
        .eq(index)
        .contains(`New ${entity.name} Entity incidents`);
    });
  });

  it("Entity: Should display a information message if the user does't have subscriptions", () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      emptySubscriptionsData
    );

    cy.visit(url);

    cy.get('[data-cy="entity-subscription-item"]').should('not.exist');

    cy.contains("You don't have active subscriptions to Entities").should('exist');
  });

  it('Entity: Delete a user subscription', () => {
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
        req.body.variables.query._id == entitySubscriptions[0]._id,
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

    cy.get('[data-cy="entity-delete-btn"]').first().click();

    cy.wait('@DeleteSubscription');

    cy.get('[data-cy="entity-subscription-item"]').should(
      'have.length',
      entitySubscriptions.length - 1
    );
  });

  it('Entity: Delete the last subscription', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindUserSubscriptions',
      'FindUserSubscriptions',
      {
        data: {
          subscriptions: [entitySubscriptions[0]],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'DeleteSubscriptions' &&
        req.body.variables.query._id == entitySubscriptions[0]._id,
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

    cy.get('[data-cy="entity-delete-btn"]').first().click();

    cy.wait('@DeleteSubscription');

    cy.get('[data-cy="entity-subscription-item"]').should('not.exist');

    cy.contains("You don't have active subscriptions to Entities").should('exist');
  });
});
