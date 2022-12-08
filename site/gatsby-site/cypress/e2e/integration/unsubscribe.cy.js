const { SUBSCRIPTION_TYPE } = require('../../../src/utils/subscriptions');

describe('Unsubscribe pages', () => {
  const userId = '6304204e580ff154aefea0c6';

  const incidentId = 10;

  const url = `/unsubscribe`;

  it('Successfully loads', () => {
    cy.visit(url);

    cy.contains('Invalid parameters').should('exist');
  });

  it('Should display an Invalid Params message if userId param is not present', () => {
    cy.visit(`${url}?type=incident`);

    cy.contains('Invalid parameters').should('exist');
  });

  it('Should display an Invalid Params message if type param is not present', () => {
    cy.visit(`${url}?userId=${userId}`);

    cy.contains('Invalid parameters').should('exist');
  });

  it('Should display an Invalid Params message if type param incident but incidentId is not present', () => {
    cy.visit(`${url}?type=incident&userId=${userId}`);

    cy.contains('Invalid parameters').should('exist');
  });

  it('Should not display an Invalid Params message if "all" subscription params are OK', () => {
    cy.visit(`${url}?type=all&userId=${userId}`);

    cy.contains('Invalid parameters').should('not.exist');
  });

  it('Should not display an Invalid Params message if "incident" subscription params are OK', () => {
    cy.visit(`${url}?type=incident&userId=${userId}&incidentId=${incidentId}`);

    cy.contains('Invalid parameters').should('not.exist');
  });

  it('Should not display an Invalid Params message if "new-incidents" subscription params are OK', () => {
    cy.visit(`${url}?type=${SUBSCRIPTION_TYPE.newIncidents}&userId=${userId}`);

    cy.contains('Invalid parameters').should('not.exist');
  });

  it('Should unsubscribe from all subscriptions', () => {
    cy.visit(`${url}?type=all&userId=${userId}`);

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'DeleteSubscriptions' &&
        req.body.variables.query.userId.userId == userId &&
        !req.body.variables.query.incident_id,
      'DeleteSubscriptions',
      {
        data: {
          deleteManySubscriptions: {
            __typename: 'DeleteManyPayload',
            deletedCount: 0,
          },
        },
      }
    );

    cy.contains('Confirm').click();

    cy.wait('@DeleteSubscriptions');

    cy.contains('You have successfully unsubscribed.').should('exist');

    cy.contains('Continue').click();

    cy.location('pathname', { timeout: 8000 }).should('eq', '/');
  });

  it('Should unsubscribe from an incident subscription', () => {
    cy.visit(`${url}?type=${SUBSCRIPTION_TYPE.incident}&userId=${userId}&incidentId=${incidentId}`);

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'DeleteSubscriptions' &&
        req.body.variables.query.type == SUBSCRIPTION_TYPE.incident &&
        req.body.variables.query.userId.userId == userId &&
        req.body.variables.query.incident_id.incident_id == `${incidentId}`,
      'DeleteSubscriptions',
      {
        data: {
          deleteManySubscriptions: {
            __typename: 'DeleteManyPayload',
            deletedCount: 0,
          },
        },
      }
    );

    cy.contains('Confirm').click();

    cy.wait('@DeleteSubscriptions');

    cy.contains('You have successfully unsubscribed.').should('exist');

    cy.contains('Continue').click();

    cy.location('pathname', { timeout: 8000 }).should('eq', '/');
  });

  it('Should unsubscribe from new incidents subscription', () => {
    cy.visit(`${url}?type=${SUBSCRIPTION_TYPE.newIncidents}&userId=${userId}`);

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'DeleteSubscriptions' &&
        req.body.variables.query.type == SUBSCRIPTION_TYPE.newIncidents &&
        req.body.variables.query.userId.userId == userId &&
        !req.body.variables.query.incident_id,
      'DeleteSubscriptions',
      {
        data: {
          deleteManySubscriptions: {
            __typename: 'DeleteManyPayload',
            deletedCount: 0,
          },
        },
      }
    );

    cy.contains('Confirm').click();

    cy.wait('@DeleteSubscriptions');

    cy.contains('You have successfully unsubscribed.').should('exist');

    cy.contains('Continue').click();

    cy.location('pathname', { timeout: 8000 }).should('eq', '/');
  });
});
