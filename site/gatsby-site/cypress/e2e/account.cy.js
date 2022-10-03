import subscriptionsData from '../fixtures/subscriptions/subscriptions.json';

const subscriptions = subscriptionsData.data.subscriptions.sort(
  (a, b) => a.incident_id.incident_id - b.incident_id.incident_id
);

describe('Account', () => {
  const url = '/account';

  it('Should successfully load account page', () => {
    cy.visit(url);
  });

  it('Should display account information if the user is logged in', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.contains(Cypress.env('e2eUsername')).should('exist');

    cy.contains('Log out').should('exist');
  });

  it('Should display user subscriptions', () => {
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

  it("Should display a information message if the user does't have subscriptions", () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.get('[data-cy="subscription-item"]').should('not.exist');

    cy.contains("You don't have active subscriptions").should('exist');
  });

  it('Delete a user subscription', () => {
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

  it('Delete the last subscription', () => {
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

    cy.contains("You don't have active subscriptions").should('exist');
  });
});
