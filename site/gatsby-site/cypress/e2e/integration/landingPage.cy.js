import { conditionalIt } from '../../support/utils';
const { format } = require('date-fns');

describe('The Landing page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });

  it('Sends a search to the Discover app', () => {
    cy.visit('/');

    cy.waitForStableDOM();

    cy.get('form#quickSearch input').type('Test');
    cy.get('form#quickSearch').submit();

    cy.url().should('include', '/apps/discover');
    cy.url().should('include', 's=Test');
  });

  it('Loads the sponsor modals', () => {
    cy.visit('/');

    cy.waitForStableDOM();

    cy.get('[data-cy="Waking Up Foundation-image"]', { timeout: 15000 }).scrollIntoView();

    cy.waitForStableDOM();

    cy.get('[data-cy="Waking Up Foundation-image"]').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="sponsor-modal"]', { timeout: 15000 }).should('be.visible');
  });

  it('Should submit a report through the Quick Add form', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'InsertQuickAdd',
      'InsertQuickAdd',
      { data: { insertOneQuickadd: { __typename: 'Quickadd', _id: '6271a62068d0c59a372b0c09' } } }
    );

    cy.visit('/');

    cy.get('[data-cy="quick-add"]').within(() => {
      cy.get('[name="url"]').type('https://example.com');

      cy.get('[type="submit"]').click();
    });

    cy.wait('@InsertQuickAdd').then((xhr) => {
      expect(xhr.request.body.variables.quickAdd.url).eq('https://example.com/');
      expect(xhr.request.body.variables.quickAdd.date_submitted).eq(
        format(new Date(), 'yyyy-MM-dd')
      );
    });

    cy.get('.tw-toast')
      .contains('Report successfully added to review queue. You can see your submission here.')
      .should('exist');
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment') && Cypress.env('e2eUsername') && Cypress.env('e2ePassword'),
    'Should redirect to the account page when logged in',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'), { skipSession: true });

      cy.location('pathname', { timeout: 8000 }).should('eq', '/');

      cy.waitForStableDOM();

      cy.get('[data-cy="sidebar-desktop"]')
        .contains('li', 'Account', { timeout: 8000 })
        .scrollIntoView()
        .click();

      cy.waitForStableDOM();

      cy.location('pathname', { timeout: 8000 }).should('eq', '/account/');
    }
  );

  it('Should redirect to the signup page when logged out', () => {
    cy.visit('/');

    cy.get('[data-cy="sidebar-user"] a').first().click({ force: true });

    cy.location('pathname', { timeout: 8000 }).should('eq', '/signup/');
  });

  conditionalIt(
    Cypress.env('isEmptyEnvironment'),
    'Should display empty message on common entities card on empty environment',
    () => {
      cy.visit('/');

      cy.get('[data-cy="common-entities"]')
        .scrollIntoView()
        .should('be.visible')
        .within(() => {
          cy.contains('h2', 'Common Entities').should('exist');
          cy.contains('a', 'View all entities').should('have.attr', 'href', '/entities/');
          cy.contains('There are no entities yet').should('exist').should('be.visible');
        });
    }
  );

  it('Renders rich results config', () => {
    cy.visit('/');

    cy.get('script[type="application/ld+json"]').should('exist');
  });

  conditionalIt(
    Cypress.env('isEmptyEnvironment'),
    'Should not display the Latest Reports section on empty environment',
    () => {
      cy.visit('/');
      cy.get('.latest-reports-carousel').should('not.exist');
    }
  );

  conditionalIt(
    Cypress.env('isEmptyEnvironment'),
    'Should not display the Random Incidents section on empty environment',
    () => {
      cy.visit('/');
      cy.get('[data-cy="random-reports"]').should('not.exist');
    }
  );

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Loads the random incidents carousel', () => {
    cy.visit('/');

    cy.waitForStableDOM();

    cy.get('[data-cy="random-incidents-carousel"]').scrollIntoView().should('exist');

    cy.get('[data-cy="random-incidents-carousel-item"]').should('have.length', 5);
  });

  it('Renders commit sha in the footer', () => {
    cy.visit('/');

    cy.get('[data-cy="commit-sha"]').should('be.visible');
  });
});
