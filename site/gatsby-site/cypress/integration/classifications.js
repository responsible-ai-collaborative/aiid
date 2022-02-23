describe('Classifications App', () => {
  const url = '/apps/classifications';

  const maybeIt = Cypress.env('e2eUsername') && Cypress.env('e2ePassword') ? it : it.skip;

  maybeIt('Successfully edit a CSET classification', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.contains('Incident 10').parents('tr').find('[data-cy=edit-classification]').click();

    cy.get('[data-cy="taxonomy-form"]').should('exist').as('form');

    cy.get('@form').find('[name="notes"]').clear().type('This is an updated note');

    cy.get('@form').find('[name="Annotator"]').select('5');

    cy.intercept('POST', '**/graphql', { fixture: 'classifications/upsertCSET.json' }).as(
      'updateClassification'
    );

    cy.get('@form').contains('Submit').click();

    cy.wait('@updateClassification')
      .its('request.body.variables.data')
      .should('deep.include', {
        notes: 'This is an updated note',
      })
      .and('have.deep.nested.property', 'classifications.Annotator', '5');
  });
});
