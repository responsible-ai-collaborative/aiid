import { maybeIt } from '../../../support/utils';
const { gql } = require('@apollo/client');

describe('Checklists App Form', () => {
  maybeIt('Do all the things', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'insertChecklist',
      'insertChecklist'
    );
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'upsertChecklist',
      'upsertChecklist'
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertSubscription',
      'UpsertSubscription'
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'addChecklistNotifications',
      'addChecklistNotifications'
    );

    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit('/apps/checklists');

    cy.waitForStableDOM();

    cy.wait(1000);

    cy.get('#new-checklist-button').click();

    cy.waitForStableDOM();

    cy.wait(1000);

    cy.get('#tags_goals').type('Content Search');

    cy.wait('@upsertChecklist');
    cy.wait(5000);

    cy.get('[data-cy="subscribe-button"]').click();

    cy.wait('@UpsertSubscription');
    cy.wait(5000);

    cy.location().then((loc) => afterGetLocation({ checklistId: loc.search.replace('?id=', '') }));

    function afterGetLocation(vars) {
      cy.query({
        query: gql`
          {
            subscription(query: { checklistId: { id: "${vars.checklistId}"}}) {
              checklistId {
                id
              }
              type
            }
          }
        `,
      }).then(({ data: { subscription } }) => afterGetSubscriptionData({ ...vars, subscription }));
    }

    function afterGetSubscriptionData(vars) {
      expect(vars.subscription).not.to.be.null;

      cy.visit('/cite/20');

      cy.waitForStableDOM();

      cy.get('body').then((body) => afterGetBodyForGmfDiv({ ...vars, body }));
    }

    function afterGetBodyForGmfDiv(vars) {
      if (vars.body.find('#taxonomy-GMF').length == 0) {
        cy.contains('Select a taxonomy').click();

        cy.wait(1000);

        cy.get('[role="tooltip"]').contains('GMF').click();

        cy.wait(1000);

        cy.get('button').contains('Add').click();
      }
      cy.wait(1000);

      cy.get('#taxonomy-GMF').contains('Edit').click();

      cy.wait(1000);

      cy.get('body').then((body) => afterGetBodyForClearTagInput({ ...vars, body }));
    }

    function afterGetBodyForClearTagInput(vars) {
      if (vars.body.find('.rbt-input-wrapper button.close').length > 0) {
        cy.get('.rbt-input-wrapper button.close').each((clearButton) => clearButton.click());
      }

      cy.wait(1000);

      cy.get('[data-cy="submit-button"]').click();

      cy.wait(1000);

      cy.visit('/cite/20');

      cy.wait(1000);

      cy.contains('Select a taxonomy').click();

      cy.wait(1000);

      cy.get('[role="tooltip"]').contains('GMF').click();

      cy.wait(1000);

      cy.get('button').contains('Add').click();

      cy.get('#taxonomy-GMF').contains('Edit').click();

      cy.get('.rbt-input-main[id="Known AI Goal"]').type('Content Search', { force: true });

      cy.get('.rbt-input-main[id="Known AI Technical Failure"]').type('Test', { force: true });

      cy.get('[data-cy="submit-button"]').click();

      cy.wait(10000);

      cy.query({
        query: gql`
          query {
            notifications(query: { checklist_id: "${vars.checklistId}"}) {
              checklist_id
              incident_id
              processed
              type
              sentDate
            }
          }
        `,
      }).then(({ data: { notifications } }) =>
        afterGetNotificationData({ ...vars, notifications })
      );
    }
    function afterGetNotificationData(vars) {
      cy.wait('@addChecklistNotifications');

      window.alert(JSON.stringify(vars.notifications));

      expect(vars.notifications.length).to.equal(1);

      cy.get('#taxonomy-GMF').contains('Edit').click();
      //cy.get('[data-cy="Known AI Goal"] .rbt-input-wrapper button.close').first().click();
      //cy.get('[data-cy="Known AI Technical Failure"] .rbt-input-wrapper button.close').first().click();
      cy.get('[data-cy="submit-button"]').click();

      cy.wait(100000);
    }
  });
});
