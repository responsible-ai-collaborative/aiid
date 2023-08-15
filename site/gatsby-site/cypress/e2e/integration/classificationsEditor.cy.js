import { maybeIt } from '../../support/utils';
import classificationsMock from '../../fixtures/classifications/editor.json';
import classificationsUpsertMock from '../../fixtures/classifications/editorUpsert.json';

describe('Classifications Editor', () => {
  const incidentId = 2;

  const reportNumber = 2658;

  const incidentURL = `/cite/${incidentId}`;

  const reportURL = `/reports/${reportNumber}`;

  function editAndSubmitForm() {
    cy.get('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"]').within(() => {
      cy.contains('Edit').click();

      cy.get('[data-cy="Notes"] textarea').scrollIntoView();

      cy.get('[data-cy="Notes"] textarea').clear({ force: true }).type('Test notes');

      cy.get('[data-cy="Full Description"] input').scrollIntoView();

      cy.get('[data-cy="Full Description"] input').clear({ force: true }).type('Test description');

      cy.contains('Submit').click();

      cy.contains('Submit').should('be.disabled');
    });
  }

  it(`Shouldn't show the classifications editor for unauthenticated users`, () => {
    cy.visit(incidentURL);

    cy.get('[data-cy="classifications-editor"]').should('not.exist');
  });

  maybeIt('Should show classifications editor on incident page and save edited values', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindClassifications',
      'FindClassifications',
      classificationsMock
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertClassification',
      'UpsertClassification',
      classificationsUpsertMock
    );

    cy.visit(incidentURL);

    cy.waitForStableDOM();

    cy.get('[data-cy="classifications-editor"]').should('be.visible');

    cy.get('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"]').should('be.visible');

    editAndSubmitForm();

    cy.wait('@UpsertClassification').then((xhr) => {
      expect(xhr.request.body.variables.query.reports).to.be.undefined;
      expect(xhr.request.body.variables.query.incidents).deep.eq({ incident_id: incidentId });
      expect(xhr.request.body.variables.query.namespace).eq('CSETv0');

      expect(xhr.request.body.variables.data.incidents).to.deep.eq({ link: [incidentId] });
      expect(xhr.request.body.variables.data.reports).to.deep.eq({ link: [reportNumber, 2659] });
      expect(xhr.request.body.variables.data.notes).to.eq('Test notes');
      expect(
        xhr.request.body.variables.data.attributes.find((a) => a.short_name == 'Full Description')
          .value_json
      ).to.eq('"Test description"');
    });
  });

  maybeIt('Should show classifications editor on report page and save edited values', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindClassifications',
      'FindClassifications',
      classificationsMock
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertClassification',
      'UpsertClassification',
      classificationsUpsertMock
    );

    cy.visit(reportURL);

    cy.waitForStableDOM();

    cy.get('[data-cy="classifications-editor"]').should('be.visible');

    cy.get('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"]').should('be.visible');

    editAndSubmitForm();

    cy.wait('@UpsertClassification').then((xhr) => {
      expect(xhr.request.body.variables.query.incidents).to.be.undefined;
      expect(xhr.request.body.variables.query.reports).deep.eq({ report_number: reportNumber });
      expect(xhr.request.body.variables.query.namespace).eq('CSETv0');

      expect(xhr.request.body.variables.data.incidents).to.deep.eq({ link: [] });
      expect(xhr.request.body.variables.data.reports).to.deep.eq({ link: [reportNumber, 2659] });
      expect(xhr.request.body.variables.data.notes).to.eq('Test notes');
      expect(
        xhr.request.body.variables.data.attributes.find((a) => a.short_name == 'Full Description')
          .value_json
      ).to.eq('"Test description"');
    });
  });

  maybeIt('Should show classifications editor on report page and add a new classification', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindClassifications',
      'FindClassifications',
      {
        data: {
          classifications: [],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertClassification',
      'UpsertClassification',
      classificationsUpsertMock
    );

    cy.visit(reportURL);

    cy.waitForStableDOM();

    cy.get('[data-cy="classifications-editor"]').should('be.visible');

    cy.contains('Select a taxonomy').click();

    cy.contains('GMF').click();

    cy.contains('Add').click();

    cy.get('[data-cy="classifications-editor"] [data-cy="taxonomy-GMF"]').should('be.visible');

    cy.get('[data-cy="classifications-editor"] [data-cy="taxonomy-GMF"]').within(() => {
      cy.contains('Edit').click();

      cy.get('[data-cy="Notes"] textarea').scrollIntoView();

      cy.get('[data-cy="Notes"] textarea').clear({ force: true }).type('Test notes');

      cy.contains('Submit').click();
    });

    cy.wait('@UpsertClassification').then((xhr) => {
      expect(xhr.request.body.variables.query.incidents).to.be.undefined;
      expect(xhr.request.body.variables.query.reports).deep.eq({ report_number: reportNumber });
      expect(xhr.request.body.variables.query.namespace).eq('GMF');

      expect(xhr.request.body.variables.data.incidents).to.deep.eq({ link: [] });
      expect(xhr.request.body.variables.data.reports).to.deep.eq({ link: [reportNumber] });
      expect(xhr.request.body.variables.data.notes).to.eq('Test notes');
    });
  });
});
