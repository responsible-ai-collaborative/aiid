import { maybeIt } from '../../../support/utils';
import taxa from '../../../fixtures/call/taxa.json';
import classifications from '../../../fixtures/call/classifications.json';
import incident97Classifications from '../../../fixtures/classifications/incident97Classifications.json';

describe('Classifications App', () => {
  const url = '/apps/classifications';

  maybeIt('Successfully edit a CSET classification', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/call',
      (req) => req.body.name == 'find' && req.body.arguments[0].collection == 'taxa',
      'FindTaxa',
      taxa
    );

    cy.conditionalIntercept(
      '**/call',
      (req) => req.body.name == 'find' && req.body.arguments[0].collection == 'classifications',
      'FindClassifications',
      classifications
    );

    cy.visit(url);

    cy.wait(['@FindTaxa', '@FindClassifications']);

    cy.get('select[data-cy="taxonomy"]').select('CSET');

    cy.waitForStableDOM();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindCSETClassifications',
      'FindCSETClassifications',
      incident97Classifications
    );

    cy.get('a[href="/cite/97/#taxa-area"]')
      .parents('tr')
      .find('[data-cy=edit-classification]')
      .click();

    cy.get('[data-cy="taxonomy-form"]').should('exist').as('form');

    cy.get('@form').find('[name="notes"]').clear().type('This is an updated note');

    cy.get('@form').contains('label', 'Annotator').scrollIntoView();

    cy.get('@form').find('#Annotator-5').check();

    cy.contains('label', 'Harm Distribution Basis').scrollIntoView();

    cy.get('@form').find('#HarmDistributionBasis-Race').uncheck();

    cy.get('@form').find('#HarmDistributionBasis-Religion').uncheck();

    cy.get('@form').find('#HarmDistributionBasis-Geography').check();

    cy.contains('label', 'Named Entities').next('[class*="Typeahead"]').as('typeahead');

    cy.get('@typeahead').find('[option="Starbucks"]').should('exist');

    cy.get('@typeahead').find('[option="Starbucks"]').find('button').click();

    cy.get('@typeahead').find('[option="Starbucks"]').should('not.exist');

    cy.get('@typeahead').find('[option="Kronos"]').should('exist');

    cy.get('@typeahead').find('input[type="text"]').clear().type('Something').type('{enter}');

    cy.get('@typeahead').find('[option="Something"]').should('exist');

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
      expect(xhr.request.body.variables.data.classifications.NamedEntities).to.deep.equal([
        'Kronos',
        'Something',
      ]);
    });
  });
});
