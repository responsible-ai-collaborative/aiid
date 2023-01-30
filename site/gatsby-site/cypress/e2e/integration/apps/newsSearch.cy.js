import { format } from 'date-fns';

import newsArticles from '../../../fixtures/candidates/newsArticles.json';

describe('Incidents App', () => {
  const url = '/apps/newsSearch';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should loads candidate cards', () => {
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

    cy.visit(url);
    cy.get('[data-cy="candidate-card"] [data-cy="submit-button"]', { timeout: 15000 })
      .first()
      .click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/apps/submit/');
    });
  });

  it('Should dismiss and restore items', () => {
    newsArticles.data.candidates[0].date_published = format(new Date(), 'yyyy-MM-dd');
    newsArticles.data.candidates[1].date_published = format(new Date(), 'yyyy-MM-dd');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'NewsArticles',
      'NewsArticles',
      newsArticles
    );

    cy.visit(url);

    cy.get('[data-cy="results"] [data-cy="candidate-card"]', { timeout: 15000 })
      .first()
      .invoke('attr', 'data-id')
      .then((dataId) => {
        cy.get(`[data-id="${dataId}"] [data-cy="dismiss-button"]`).click();

        cy.get(`[data-cy="dismissed"] [data-id="${dataId}"]`).should('exist');

        cy.get(`[data-cy="results"] [data-id="${dataId}"]`).should('not.exist');

        cy.get(`[data-cy="dismissed-summary"]`).click();

        cy.get(`[data-cy="dismissed"] [data-id="${dataId}"] [data-cy="restore-button"]`).click();

        cy.get(`[data-cy="results"] [data-id="${dataId}"]`, { timeout: 8000 }).should('exist');

        cy.get(`[data-cy="dismissed"] [data-id="${dataId}"]`).should('not.exist');
      });
  });
});
