import { format } from 'date-fns';
import { maybeIt } from '../../../support/utils';

import newsArticles from '../../../fixtures/candidates/newsArticles.json';

describe('Incidents App', () => {
  const url = '/apps/newsdigest';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should load candidate cards', () => {
    newsArticles.data.candidates[0].date_published = format(new Date(), 'yyyy-MM-dd');
    newsArticles.data.candidates[1].date_published = format(new Date(), 'yyyy-MM-dd');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'NewsArticles',
      'NewsArticles',
      newsArticles
    );

    cy.visit(url);
    cy.get('[data-cy="candidate-card"]', { timeout: 15000 }).should('exist');
  });

  it('Should open submit form on pressing submit', () => {
    newsArticles.data.candidates[0].date_published = format(new Date(), 'yyyy-MM-dd');
    newsArticles.data.candidates[1].date_published = format(new Date(), 'yyyy-MM-dd');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'NewsArticles',
      'NewsArticles',
      newsArticles
    );

    cy.visit(url, {
      onBeforeLoad(window) {
        cy.stub(window, 'open', (url) => {
          expect(url.slice(0, 12)).to.equal('/apps/submit');
        });
      },
    });
    cy.get('[data-cy="candidate-dropdown"] button').first().click();
    cy.get('[data-cy="submit-icon"]', { timeout: 15000 }).first().parent().click();
    cy.window().its('open').should('be.called');
  });

  maybeIt('Should dismiss and restore items', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    newsArticles.data.candidates[0].date_published = format(new Date(), 'yyyy-MM-dd');
    newsArticles.data.candidates[1].date_published = format(new Date(), 'yyyy-MM-dd');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'NewsArticles',
      'NewsArticles',
      newsArticles
    );

    cy.visit(url);

    cy.get('[data-cy="results"] [data-cy="candidate-card"] [data-cy="candidate-dropdown"]', {
      timeout: 15000,
    })
      .first()
      .parent()
      .parent()
      .parent()
      .invoke('attr', 'data-id')
      .then((dataId) => {
        cy.get(`[data-id="${dataId}"] [data-cy="candidate-dropdown"]`).click();

        cy.get(`[data-id="${dataId}"] [data-cy="dismiss-icon"]`).parent().click();

        cy.get(`[data-cy="dismissed"] [data-id="${dataId}"]`).should('exist');

        cy.get(`[data-cy="results"] [data-id="${dataId}"]`).should('not.exist');

        cy.get(`[data-cy="dismissed-summary"]`).click();

        cy.get(`[data-id="${dataId}"] [data-cy="candidate-dropdown"]`).click();

        cy.get(`[data-id="${dataId}"] [data-cy="restore-icon"]`).parent().click();

        cy.get(`[data-cy="results"] [data-id="${dataId}"]`, { timeout: 8000 }).should('exist');

        cy.get(`[data-cy="dismissed"] [data-id="${dataId}"]`).should('not.exist');
      });
  });
});
