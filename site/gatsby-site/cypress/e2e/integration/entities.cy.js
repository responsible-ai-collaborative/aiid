import { conditionalIt } from '../../support/utils';

describe('Entities page', () => {
  const url = '/entities';

  it('Successfully loads', () => {
    cy.visit(url);

    cy.get('[data-cy="entities"]').should('be.visible');
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Displays a list of entities', () => {
    cy.visit(url);

    cy.get('[data-cy="entities"]').should('be.visible');

    cy.get('[data-cy="entities"] tr').should('have.length.at.least', 10);
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Filter entities by name', () => {
    cy.visit(url);

    cy.get('[data-cy="input-filter-Entity"]').type('Amazon');

    cy.get('[data-cy="entities"] tr').should('have.length.at.least', 11);
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Filter entities by incident title', () => {
    cy.visit(url);

    cy.get('[data-cy="input-filter-As Deployer and Developer"]').type('taxi');

    cy.get('[data-cy="entities"] tr').should('have.length.at.least', 1);

    cy.contains('[data-cy="row"]', 'Cruise').should('be.visible');
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Entities row should be expandable', () => {
    cy.visit(url);

    cy.get('[data-cy="input-filter-Entity"]').type('Amazon');

    cy.contains('[data-cy="row"]', 'Amazon').as('row');

    cy.get('@row').find('[title="Toggle Row Expanded"]').click();

    cy.get('@row').find('[data-cy="cell-incidentsAsBoth"]').as('cell');

    cy.get('@cell').find('ul').should('be.visible');

    cy.get('@cell').find('ul').children().should('have.length.at.least', 14);
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Should display Entity responses', () => {
    cy.visit(url);

    cy.get('[data-cy="header-responses"]').should('exist');

    cy.get('[data-cy="cell-responses"]').should('have.length.at.least', 10);

    cy.get('[data-cy="input-filter-Entity"]').type('microsoft');

    cy.get('[data-cy="cell-responses"]').first().should('have.text', '3 Incident responses');
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Should be able to sort', () => {
    cy.visit(url);
    cy.get('[data-cy="row"]').first().contains('a', 'Facebook').should('be.visible');
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment') && Cypress.env('e2eUsername') && Cypress.env('e2ePassword'),
    'Should display Edit button only for Admin users',
    () => {
      cy.visit(url);
      cy.get('[data-cy="edit-entity-btn"]').should('not.exist');

      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));
      cy.visit(url);
      cy.get('[data-cy="edit-entity-btn"]')
        .first()
        .should('have.attr', 'href', '/entities/edit?entity_id=facebook');
      cy.get('[data-cy="edit-entity-btn"]').first().click();
      cy.waitForStableDOM();
      cy.location('pathname').should('eq', '/entities/edit/');
      cy.location('search').should('eq', '?entity_id=facebook');
    }
  );
});
