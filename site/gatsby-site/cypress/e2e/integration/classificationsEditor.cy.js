import { maybeIt } from '../../support/utils';
import classificationsMock from '../../fixtures/classifications/editor.json';
import classificationsUpsertMock from '../../fixtures/classifications/editorUpsert.json';
import editorCSETV1Mock from '../../fixtures/classifications/editorCSETV1.json';
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

      cy.get('[data-cy="Notes"] textarea').clear().type('Test notes');

      cy.get('[data-cy="Full Description"] input').scrollIntoView();

      cy.get('[data-cy="Full Description"] input').clear().type('Test description');

      cy.contains('Submit').click();

      cy.contains('Submit').should('be.disabled');
    });
  }

  function setField({ short_name, display_type, permitted_values }) {
    let value = permitted_values?.length > 0 ? permitted_values[0] : 'Test';

    cy.get(`[data-cy="${short_name}"]`).first().scrollIntoView();

    return cy
      .get(`[data-cy="${short_name}"]`)
      .first()
      .within(() => {
        switch (display_type) {
          case 'enum':
            permitted_values.length <= 5
              ? cy.get(`[value="${value}"]`).check()
              : cy.get(`select`).select(value);

            break;

          case 'bool':
            cy.get(`[id="${short_name}-yes"]`).click();
            value = true;

            break;

          case 'string':
            cy.get(`input`).type(value);

            break;

          case 'date':
            cy.get(`input`).type('2023-01-01');
            value = '2023-01-01';

            break;

          case 'location':
            cy.get(`input`).type(`${value}{enter}`);

            break;

          case 'list':
            cy.get(`input[type="text"]`).type(`${value}{enter}`);
            value = [value];

            break;

          case 'multi':
            cy.get(`input[value="${value}"]`).click();
            value = [value];

            break;

          case 'long_string':
            cy.get(`textarea`).type(value);

            break;

          case 'int':
            cy.get(`input`).type('1');
            value = 1;

            break;

          //TODO: skip data type for now
          case 'object-list':
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

  maybeIt(
    'Should show classifications editor on incident page and save edited values',
    { scrollBehavior: 'center' },
    () => {
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
    }
  );

  maybeIt(
    'Should show classifications editor on report page and save edited values',
    { scrollBehavior: 'center' },
    () => {
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
    }
  );

  maybeIt(
    'Should show classifications editor on report page and add a new classification',
    { scrollBehavior: 'center' },
    () => {
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

        cy.get('[data-cy="Notes"] textarea').clear().type('Test notes');

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
    }
  );

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
  ].forEach(({ namespace }) => {
    maybeIt(
      `Should properly display and store ${namespace} classification values`,
      { scrollBehavior: 'center' },
      () => {
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

            cy.contains(namespace).click();

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

                    const skippedFields = [
                      'Known AI Technology Snippets',
                      'Known AI Technical Failure Snippets',
                      'Entities',
                      'Known AI Goal Snippets',
                      'Potential AI Goal Snippets',
                      'Potential AI Technology Snippets',
                      'Potential AI Technical Failure Snippets',
                    ];

                    if (!skippedFields.includes(field.short_name)) {
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
      }
    );
  });

  maybeIt('Should synchronize duplicate fields', { scrollBehavior: 'center' }, () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindClassifications',
      'FindClassifications',
      editorCSETV1Mock
    );

    cy.visit(incidentURL);

    cy.waitForStableDOM();

    cy.get('[data-cy="taxonomy-CSETv1"]').first().scrollIntoView();

    cy.get('[data-cy="taxonomy-CSETv1"]').contains('Edit').click();

    cy.waitForStableDOM();

    cy.get('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"]').first().scrollIntoView();

    cy.get('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"]').first().contains('yes').click();

    cy.waitForStableDOM();

    cy.waitForStableDOM();

    cy.get('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]').first().check();

    cy.waitForStableDOM();

    cy.get('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]')
      .last()
      .should('be.checked');

    // Clicking unchecks the input for both fields
    cy.get('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]').last().click();

    cy.waitForStableDOM();

    cy.get('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]')
      .first()
      .should('not.be.checked');
  });
});
