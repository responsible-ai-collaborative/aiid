import { maybeIt } from '../../../support/utils';
import cssettool from '../../../fixtures/classifications/cssettool.json';
import upsertCSETv1merge from '../../../fixtures/classifications/upsertCSETv1merge.json';

describe('CSET tool', () => {
  const url = '/apps/csettool/52/';

  function getRow(short_name) {
    return cy.get(`[data-cy="column-${short_name}"]`).parent().parent();
  }

  maybeIt('Successfully loads CSET annotator classifications', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindClassifications',
      'FindClassifications',
      cssettool
    );

    cy.visit(url);

    cy.wait(['@FindClassifications']);

    cy.waitForStableDOM();

    getRow('Incident Number').within(() => {
      // same value should resolve automatically
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', '52')
        .should('not.have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', '52')
        .should('not.have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]')
        .should('have.text', '52')
        .should('have.class', 'bg-green-100');
    });

    getRow('Annotator').within(() => {
      // should default to the only set value
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', '"006"')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', 'null')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]')
        .should('have.text', '"006"')
        .should('have.class', 'bg-green-100');
    });

    getRow('Annotation Status').within(() => {
      // should ask for disambiguation and disambiguate on click
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', '"2. Initial annotation complete"')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', '"3. In peer review"')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]')
        .should('have.text', 'Please select a column')
        .should('have.class', 'bg-red-100');

      // select column
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();

      cy.get('[data-cy="column-result"]')
        .should('have.text', '"2. Initial annotation complete"')
        .should('have.class', 'bg-green-100');
    });

    getRow('Harm Distribution Basis').within(() => {
      // should merge arrays automatically
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', '["none"]')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', '["ideology","financial means","disability"]')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]')
        .should('have.text', '["none","ideology","financial means","disability"]')
        .should('have.class', 'bg-green-100');
    });

    getRow('notes').within(() => {
      // should merge arrays automatically
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', 'This a note from the annotator 1')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', 'This a note from the annotator 2')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]')
        .should(
          'have.text',
          'Annotator 1: \n\n This a note from the annotator 1\n\nAnnotator 2: \n\n This a note from the annotator 2'
        )
        .should('have.class', 'bg-green-100');
    });

    getRow('Entities').within(() => {
      //

      cy.get('[data-cy="column-CSETv1_Annotator-1"]').should('have.class', 'bg-red-100');

      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .get('[data-cy="entity-Joshua Brown"]')
        .should('be.visible');
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .get('[data-cy="entity-Tesla Model S"]')
        .should('be.visible');
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .get('[data-cy="entity-Frank Baressi"]')
        .should('be.visible');

      //

      cy.get('[data-cy="column-CSETv1_Annotator-2"]').should('have.class', 'bg-red-100');

      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .get('[data-cy="entity-Joshua Brown"]')
        .should('be.visible');

      //  delete a duplicated entity

      cy.get('[data-cy="column-result"]').find('[data-cy*="entity-"]').should('have.length', 4);

      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .find('[data-cy="entity-Joshua Brown"]')
        .find('button')
        .click();

      cy.get('[data-cy="column-result"]').find('[data-cy*="entity-"]').should('have.length', 3);
    });

    cy.contains('Merge Classifications').should('be.disabled');

    getRow('Physical Objects').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('Entertainment Industry').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('Tangible Harm').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('AI System').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('User Test in Controlled Conditions').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertClassification',
      'UpsertClassification',
      upsertCSETv1merge
    );

    cy.contains('Merge Classifications').click();

    // {"operationName":"UpsertClassification","variables":{"query":{"incident_id":"52","namespace":"CSETv1"},"data":{"incident_id":"52","notes":"Annotator 1: \n\n This a note from the annotator 1\n\nAnnotator 2: \n\n This a note from the annotator 2","namespace":"CSETv1","attributes":[{"short_name":"Incident Number","value_json":"52"},{"short_name":"Annotator","value_json":"\"006\""},{"short_name":"Annotation Status","value_json":"\"2. Initial annotation complete\""},{"short_name":"Peer Reviewer","value_json":"\"weqweq\""},{"short_name":"Quality Control","value_json":"true"},{"short_name":"Physical Objects","value_json":"\"yes\""},{"short_name":"Entertainment Industry","value_json":"\"no\""},{"short_name":"Report, Test, or Study of data","value_json":"\"no\""},{"short_name":"Deployed","value_json":"\"yes\""},{"short_name":"Producer Test in Controlled Conditions","value_json":"\"no\""},{"short_name":"Producer Test in Operational Conditions","value_json":"\"no\""},{"short_name":"User Test in Controlled Conditions","value_json":"\"no\""},{"short_name":"User Test in Operational Conditions","value_json":"\"no\""},{"short_name":"Harm Domain","value_json":"\"yes\""},{"short_name":"Tangible Harm","value_json":"\"tangible harm definitively occurred\""},{"short_name":"AI System","value_json":"\"yes\""},{"short_name":"Clear Link to AI","value_json":"\"yes\""},{"short_name":"There is a potentially identifiable specific entity that experienced the harm","value_json":"true"},{"short_name":"AI Harm Level","value_json":"\"AI tangible harm near-miss\""},{"short_name":"AI Tangible Harm Level Notes","value_json":"\"Annotator 1: \\n\\n The Tesla's autopilot failed to notice the trailer of the trucker and deploy breaks. This could have minimized damage during the crash. However, the crash was ultimately at fault of the Tesla driver.\""},{"short_name":"Impact on Critical Services","value_json":"\"no\""},{"short_name":"Rights Violation","value_json":"\"no\""},{"short_name":"Involving Minor","value_json":"\"no\""},{"short_name":"Detrimental Content","value_json":"\"no\""},{"short_name":"Protected Characteristic","value_json":"\"no\""},{"short_name":"Harm Distribution Basis","value_json":"[\"none\",\"ideology\",\"financial means\",\"disability\"]"},{"short_name":"Notes (special interest intangible harm)","value_json":"\"\""},{"short_name":"Special Interest Intangible Harm","value_json":"\"no\""},{"short_name":"AI Linked to Special Interest Intangible Harm","value_json":"\"no\""},{"short_name":"Harmed Class of Entities","value_json":"true"},{"short_name":"Annotator’s AI special interest intangible harm assessment","value_json":"\"no\""},{"short_name":"Notes (AI special interest intangible harm)","value_json":"\"\""},{"short_name":"Date of Incident Year","value_json":"\"2016\""},{"short_name":"Date of Incident Month","value_json":"\"05\""},{"short_name":"Date of Incident Day","value_json":"\"07\""},{"short_name":"Estimated Date","value_json":"true"},{"short_name":"Multiple AI InShow more

    cy.wait('@UpsertClassification').then((xhr) => {
      expect(xhr.request.body.variables.query).to.deep.eq({
        incident_id: '52',
        namespace: 'CSETv1',
      });
    });
  });
});
