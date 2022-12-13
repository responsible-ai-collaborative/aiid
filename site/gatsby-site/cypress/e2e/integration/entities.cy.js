describe('Entities page', () => {
  const url = '/entities';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Displays a list of entities', () => {
    cy.visit(url);

    cy.get('[data-cy="entities"]').should('be.visible');

    cy.get('[data-cy="entities"] tr').should('have.length.at.least', 658);
  });

  it('Filter entities by name', () => {
    cy.visit(url);

    cy.get('[data-cy="input-filter-Entity"]').type('Amazon');

    cy.get('[data-cy="entities"] tr').should('have.length.at.least', 11);
  });

  it('Filter entities by incident title', () => {
    cy.visit(url);

    cy.get('[data-cy="input-filter-As Deployer and Developer"]').type('taxi');

    cy.get('[data-cy="entities"] tr').should('have.length.at.least', 1);

    cy.get('[data-cy="row-cruise"]').should('be.visible');
  });

  it('Entities row should be expandable', () => {
    cy.visit(url);

    cy.get('[data-cy="input-filter-Entity"]').type('Amazon');

    cy.get('[data-cy="row-amazon"]').as('row');

    cy.get('@row').find('[title="Toggle Row Expanded"]').click();

    cy.get('@row').find('[data-cy="cell-incidentsAsBoth"]').as('cell');

    cy.get('@cell').find('ul').should('be.visible');

    cy.get('@cell').find('ul').children().should('have.length.at.least', 14);
  });

  it('Should display Entity responses', () => {
    cy.visit(url);

    cy.get('[data-cy="header-responses"]').should('exist');

    cy.get('[data-cy="cell-responses"]').should('have.length.at.least', 658);

    cy.get('[data-cy="input-filter-Incident Responses"]').type('google');

    cy.get('[data-cy="cell-responses"]').should('have.length.lessThan', 200);
  });

  it('Should be able to sort', () => {
    cy.visit(url);
    cy.get('[data-cy="entities"] tbody tr:nth-child(1) [data-cy="cell-id"]').contains(
      'a',
      'Facebook'
    );
  });
});
