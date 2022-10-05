const { format } = require('date-fns');

describe('The Landing page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });

  it('Sends a search to the Discover app', () => {
    cy.visit('/');
    cy.get('form#quickSearch input').type('Test');
    cy.get('form#quickSearch').submit();

    cy.url().should('include', '/apps/discover');
    cy.url().should('include', 's=Test');
  });

  it('Loads the sponsor modals', () => {
    cy.visit('/');
    cy.get('[data-cy="wu-modal-click"]').click();
    cy.get('[data-cy="sponsor-modal"]').should('be.visible');
    cy.get('[data-cy="close-modal"]').click();
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

    cy.get('div[class^="ToastContext"]')
      .contains(
        'Report successfully added to review queue. It will appear on the review queue page within an hour.'
      )
      .should('exist');
  });

  it('Should display common entities card', () => {
    cy.visit('/');

    cy.get('[data-cy="common-entities"]')
      .scrollIntoView()
      .should('be.visible')
      .within(() => {
        cy.contains('h2', 'Common Entities').should('exist');
        cy.get('.grid > div').should('have.length', 3);
      });
  });

  it('Should redirect to the account page when logged in', () => {
    cy.visit('/');

    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.location('pathname', { timeout: 8000 }).should('eq', '/');

    cy.get('[data-cy="account-btn"]').filter(':visible').first().click();

    cy.location('pathname', { timeout: 8000 }).should('eq', '/account');
  });

  it('Should redirect to the signup page when logged out', () => {
    cy.visit('/');

    cy.get('[data-cy="subscribe-btn"]').filter(':visible').click();

    cy.location('pathname', { timeout: 8000 }).should('eq', '/signup');
  });
});
