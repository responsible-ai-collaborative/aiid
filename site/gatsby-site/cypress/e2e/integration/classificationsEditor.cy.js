import { maybeIt } from '../../support/utils';
import classificationsMock from '../../fixtures/classifications/editor.json';
import classificationsUpsertMock from '../../fixtures/classifications/editorUpsert.json';
import { gql } from '@apollo/client';

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

  function setField({ short_name, display_type, permitted_values }) {
    let value = permitted_values?.length > 0 ? permitted_values[0] : 'Test';

    //TODO: offset isn't working for some reason, so {click: force} is needed
    cy.get(`[data-cy="${short_name}"]`)
      .first()
      .scrollIntoView({ offset: { top: 200, left: 0 } });

    return cy
      .get(`[data-cy="${short_name}"]`)
      .first()
      .within(() => {
        switch (display_type) {
          case 'enum':
            permitted_values.length <= 5
              ? cy.get(`[value="${value}"]`).check({ force: true })
              : cy.get(`select`).select(value, { force: true });

            break;

          case 'bool':
            cy.get(`[id="${short_name}-yes"]`).click({ force: true });
            value = true;

            break;

          case 'string':
            cy.get(`input`).type(value, { force: true });

            break;

          case 'date':
            cy.get(`input`).type('2023-01-01', { force: true });
            value = '2023-01-01';

            break;

          case 'location':
            cy.get(`input`).type(`${value}{enter}`, { force: true });

            break;

          case 'list':
            cy.get(`input[type="text"]`).type(`${value}{enter}`, { force: true });
            value = [value];

            break;

          case 'multi':
            cy.get(`input[value="${value}"]`).click({ force: true });
            value = [value];

            break;

          case 'long_string':
            cy.get(`textarea`).type(value, { force: true });

            break;

          case 'int':
            cy.get(`input`).type('1', { force: true });
            value = 1;

            break;

          //TODO: skip data type for now
          case 'object-list':
            value = [];
            break;

          default:
            throw new Error(`Unknown display type: ${display_type} for ${short_name}`);
        }
      })
      .then(() => {
        return cy.wrap(value);
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

  [
    {
      namespace: 'CSETv0',
    },
    {
      namespace: 'GMF',
    },
    {
      namespace: 'CSETv1',
    },
    {
      namespace: 'CSETv1_Annotator-1',
    },
    {
      namespace: 'CSETv1_Annotator-2',
    },
    {
      namespace: 'CSETv1_Annotator-3',
    },
  ].forEach(({ namespace }) => {
    maybeIt(`Should properly display and store ${namespace} classification values`, () => {
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

      cy.visit(incidentURL);

      cy.waitForStableDOM();

      cy.query({
        query: gql`
          query TaxasQuery($namespace: String) {
            taxas(query: { namespace: $namespace }) {
              namespace
              field_list {
                permitted_values
                display_type
                short_name
                mongo_type
              }
            }
          }
        `,
        variables: { namespace },
      }).then(({ data: { taxas } }) => {
        for (const taxa of taxas) {
          const { namespace } = taxa;

          cy.contains('Select a taxonomy').scrollIntoView();

          cy.contains('Select a taxonomy').click();

          cy.contains(namespace).click({ force: true });

          cy.contains('Add').click();

          cy.waitForStableDOM();

          cy.conditionalIntercept(
            '**/graphql',
            (req) =>
              req.body.operationName == 'UpsertClassification' &&
              req.body.variables.query.namespace == namespace,
            `Upsert-${namespace}`,
            classificationsUpsertMock
          );

          cy.get(`[data-cy="classifications-editor"] [data-cy="taxonomy-${namespace}"]`).within(
            () => {
              cy.contains('Edit').click();

              const selectedValues = {};

              for (const field of taxa.field_list) {
                setField({
                  short_name: field.short_name,
                  display_type: field.display_type,
                  permitted_values: field.permitted_values,
                }).then((value) => {
                  selectedValues[field.short_name] = value;
                });
              }

              cy.contains('Submit').click();

              cy.wait(`@Upsert-${namespace}`, { timeout: 20000 }).then((xhr) => {
                expect(xhr.request.body.variables.query.namespace).eq(namespace);

                for (const field of taxa.field_list) {
                  expect(
                    xhr.request.body.variables.data.attributes.filter(
                      (a) => a.short_name == field.short_name
                    )
                  ).to.have.lengthOf(1);

                  if (field.short_name !== 'Entities') {
                    expect(
                      xhr.request.body.variables.data.attributes.find(
                        (a) => a.short_name == field.short_name
                      )
                    ).to.deep.eq({
                      short_name: field.short_name,
                      value_json: JSON.stringify(selectedValues[field.short_name]),
                    });
                  }
                }
              });

              cy.waitForStableDOM();
            }
          );
        }
      });
    });
  });

  it.skip('Should synchronize duplicate fields', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(incidentURL);

    cy.waitForStableDOM();

    cy.get('#taxonomy-CSETv1').contains('Edit').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="CSETv1"] [data-cy="AI System"]').first().contains('yes').click();

    cy.waitForStableDOM();

    cy.waitForStableDOM();

    cy.get('[data-cy="CSETv1"] [data-cy="AI System"] [value="yes"]').first().check();

    cy.waitForStableDOM();

    cy.get('[data-cy="CSETv1"] [data-cy="AI System"] [value="yes"]').last().should('be.checked');

    // Clicking unchecks the input for both fields
    cy.get('[data-cy="CSETv1"] [data-cy="AI System"] [value="yes"]').last().click();

    cy.waitForStableDOM();

    cy.get('[data-cy="CSETv1"] [data-cy="AI System"] [value="yes"]')
      .first()
      .should('not.be.checked');
  });
});
