describe('Classifications App', () => {
  const url = '/apps/classifications';

  const maybeIt = Cypress.env('e2eUsername') && Cypress.env('e2ePassword') ? it : it.skip;

  maybeIt('Successfully edit a CSET classification', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.contains('Incident 10').parents('tr').find('[data-cy=edit-classification]').click();

    cy.get('[data-cy="taxonomy-form"]').should('exist').as('form');

    cy.get('@form').find('[name="notes"]').clear().type('This is an updated note');

    cy.get('@form').contains('label', 'Annotator').scrollIntoView();

    cy.get('@form').find('#Annotator-5').check();

    cy.contains('label', 'Harm Distribution Basis').scrollIntoView();

    cy.get('@form').find('#HarmDistributionBasis-Race').uncheck();

    cy.get('@form').find('#HarmDistributionBasis-Religion').uncheck();

    cy.get('@form').find('#HarmDistributionBasis-Geography').check();

    cy.intercept('POST', '**/graphql', { fixture: 'classifications/upsertCSET.json' }).as(
      'updateClassification'
    );

    cy.get('@form').contains('Submit').click();

    cy.wait('@updateClassification').then((xhr) => {
      expect(xhr.request.body.variables.data.notes).to.equal('This is an updated note');
      expect(xhr.request.body.variables.data.classifications.Annotator).to.equal('5');
      expect(xhr.request.body.variables.data.classifications.HarmDistributionBasis).to.deep.equal([
        'Geography',
      ]);
    });
  });
});
