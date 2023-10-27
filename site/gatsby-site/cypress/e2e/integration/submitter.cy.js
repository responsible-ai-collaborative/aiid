import { conditionalIt } from '../../support/utils';

describe('Submitter Selection', () => {
  let url = '/';

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Should select the first submitter if there is one and load the discover page with a pre-selected submitter in the URL',
    () => {
      cy.visit(url);

      cy.contains('Incident Report Submission Leaderboards').scrollIntoView();

      cy.get('[data-cy="leaderboard-item"] a').its('length').should('be.gt', 1);

      cy.get('[data-cy="leaderboard-item"] a').first().click();

      cy.url().should('include', 'submitters=');
    }
  );

  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Should have the submitter pre-selected on the dropdown',
    () => {
      url = '/apps/discover?submitters=Anonymous';

      cy.visit(url);

      cy.waitForStableDOM();

      cy.contains('Submitters').find('span.badge').first().click();

      cy.waitForStableDOM();

      cy.get('.shadow-lg.card').find('.list-group-item.active').should('contain.text', 'Anonymous');
    }
  );

  conditionalIt(
    Cypress.env('isEmptyEnvironment'),
    'Should display an empty state if there are no submitters',
    () => {
      cy.visit(url);

      cy.contains('Incident Report Submission Leaderboards').scrollIntoView();

      cy.get('[data-cy="leaderboard-item"]').should('not.exist');

      cy.get('[data-cy="leaderboard-empty-item"]').should('have.length', 3);
    }
  );
});
