const { SUBSCRIPTION_TYPE } = require('../../src/utils/subscriptions');

const entity = {
  entity_id: 'google',
  name: 'Google',
};

describe('Entities page', () => {
  const url = `/entities/${entity.entity_id}`;

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should subscribe to new Entity incidents (authenticated user)', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

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

    cy.wait(1000);

    cy.get('[data-cy="toast"]')
      .contains(`You have successfully subscribed to new ${entity.name} incidents`)
      .should('exist');
  });

  it('Should not subscribe to new Entity incidents (user unauthenticated)', () => {
    cy.visit(url);

    cy.contains(`Notify Me of New ${entity.name} Incidents`).scrollIntoView().click();

    cy.get('[data-cy="toast"]').contains(`Please log in to subscribe`).should('exist');
  });
});
