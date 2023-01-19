//import { maybeIt } from '../support/utils';
import variantsIncident from '../fixtures/variants/variantsIncident.json';
import {
  getVariantStatus,
  getVariantStatusText,
  isCompleteReport,
  VARIANT_STATUS,
} from '../../src/utils/variants';
import { format, getUnixTime } from 'date-fns';
const { gql } = require('@apollo/client');

const incidentId = 21;

const getVariants = (callback) => {
  cy.query({
    query: gql`
      query {
        incidents(query: { incident_id: ${incidentId} }, limit: 1) {
          reports {
            report_number
            title
            date_published
            tags
            url
            source_domain
            text_inputs
            text_outputs
          }
        }
      }
    `,
  }).then(({ data: { incidents } }) => {
    const incident = incidents[0];

    const variants = incident.reports
      .filter((r) => !isCompleteReport(r))
      .sort((a, b) => a.report_number - b.report_number);

    callback(variants);
  });
};

describe('Variants pages', () => {
  const url = `/cite/${incidentId}`;

  //it('Successfully loads', () => {
  it.skip('Successfully loads', () => {
    cy.visit(url);

    cy.disableSmoothScroll();
  });

  //it('Should display Variant list', () => {
  it.skip('Should display Variant list', () => {
    cy.visit(url);

    cy.contains('h1', 'Variants').should('exist').scrollIntoView();

    getVariants((variants) => {
      cy.get('[data-cy=variant-card]').should('have.length', variants.length);

      for (let index = 0; index < variants.length; index++) {
        const variant = variants[index];

        cy.get('[data-cy=variant-card]')
          .eq(index)
          .within(() => {
            cy.get('[data-cy=variant-status-badge]').contains(
              getVariantStatusText(getVariantStatus(variant))
            );
            cy.get('[data-cy=variant-text_inputs]').contains(variant.text_inputs);
            cy.get('[data-cy=variant-text_outputs]').contains(variant.text_outputs);
          });
      }
    });
  });

  //it('Should add a new Variant - Unauthenticated user', () => {
  it.skip('Should add a new Variant - Unauthenticated user', () => {
    const text_inputs = 'Input text with **markdown**';

    const text_outputs = 'Output text with **markdown**';

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'CreateVariant' &&
        req.body.variables.input.incidentId === incidentId &&
        req.body.variables.input.variant.text_inputs === text_inputs &&
        req.body.variables.input.variant.text_outputs === text_outputs,
      'createVariant',
      {
        data: {
          createVariant: {
            __typename: 'CreateVariantPayload',
            incident_id: incidentId,
            report_number: 2313,
          },
        },
      }
    );

    cy.visit(url);

    cy.contains('h1', 'Variants').should('exist').scrollIntoView();

    cy.get('[data-cy=variant-form]').should('not.exist');

    cy.get('[data-cy=add-variant-btn]').scrollIntoView().click();

    cy.get('[data-cy=variant-form]', { timeout: 10000 }).should('exist');

    cy.get('#formTextInputs').type(text_inputs);
    cy.get('#formTextOutputs').type(text_outputs);

    cy.get('[data-cy=add-variant-submit-btn]').click();

    cy.wait('@createVariant');

    cy.get('[data-cy=success-message]').contains(
      "Your variant has been added to the review queue and will appear on this page within 12 hours. Please continue submitting when you encounter more variants. Most of the time we won't review it in the same day, but it will appear within a day as unreviewed."
    );

    cy.get('[data-cy="toast"]')
      .contains(
        'Your variant has been added to the review queue and will appear on this page within 12 hours.'
      )
      .should('exist');
  });

  //it("Shouldn't edit a Variant - Unauthenticated user", () => {
  it.skip("Shouldn't edit a Variant - Unauthenticated user", () => {
    cy.visit(url);

    cy.contains('h1', 'Variants').should('exist').scrollIntoView();

    cy.get('[data-cy=edit-variant-btn]').should('not.exist');
  });

  //maybeIt('Should Approve Variant - Incident Editor user', () => {
  it.skip('Should Approve Variant - Incident Editor user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const new_text_inputs = 'New Input text';

    const new_text_outputs = 'New Output text';

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindVariant',
      'findVariant',
      {
        data: {
          report: variantsIncident.data.incident.reports[0],
        },
      }
    );

    cy.visit(url);

    getVariants((variants) => {
      const variant = variants[0];

      const today = format(new Date(), 'yyyy-MM-dd');

      cy.conditionalIntercept(
        '**/graphql',
        (req) =>
          req.body.operationName == 'UpdateVariant' &&
          req.body.variables.query.report_number === variant.report_number &&
          req.body.variables.set.text_inputs === new_text_inputs &&
          req.body.variables.set.text_outputs === new_text_outputs &&
          req.body.variables.set.tags.includes(VARIANT_STATUS.approved) &&
          req.body.variables.set.date_modified == today &&
          req.body.variables.set.epoch_date_modified == getUnixTime(new Date(today)),
        'updateVariant',
        {
          data: {
            updateOneReport: { ...variant, tags: [VARIANT_STATUS.approved] },
          },
        }
      );

      cy.get('[data-cy=variant-card]').should('have.length', variants.length);

      if (variants.length > 0) {
        cy.get('[data-cy=variant-card]')
          .eq(0)
          .within(() => {
            cy.get('[data-cy=edit-variant-btn]').click();
          });

        cy.get('[data-cy=edit-variant-modal]').should('be.visible').as('modal');

        cy.get('#formTextInputs').clear().type(new_text_inputs);
        cy.get('#formTextOutputs').clear().type(new_text_outputs);

        cy.get('[data-cy=approve-variant-btn]').click();

        cy.wait('@updateVariant');

        cy.get('[data-cy="toast"]')
          .contains('Variant successfully updated. Your edits will be live within 24 hours.')
          .should('exist');

        cy.get('[data-cy=edit-variant-modal]').should('not.exist');
      }
    });
  });

  //maybeIt('Should Reject Variant - Incident Editor user', () => {
  it.skip('Should Reject Variant - Incident Editor user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const new_text_inputs = 'New Input text';

    const new_text_outputs = 'New Output text';

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindVariant',
      'findVariant',
      {
        data: {
          report: variantsIncident.data.incident.reports[1],
        },
      }
    );

    cy.visit(url);

    getVariants((variants) => {
      const variant = variants[0];

      const today = format(new Date(), 'yyyy-MM-dd');

      cy.conditionalIntercept(
        '**/graphql',
        (req) =>
          req.body.operationName == 'UpdateVariant' &&
          req.body.variables.query.report_number === variant.report_number &&
          req.body.variables.set.text_inputs === new_text_inputs &&
          req.body.variables.set.text_outputs === new_text_outputs &&
          req.body.variables.set.tags.includes(VARIANT_STATUS.rejected) &&
          req.body.variables.set.date_modified == today &&
          req.body.variables.set.epoch_date_modified == getUnixTime(new Date(today)),
        'updateVariant',
        {
          data: {
            updateOneReport: { ...variant, tags: [VARIANT_STATUS.rejected] },
          },
        }
      );

      cy.get('[data-cy=variant-card]').should('have.length', variants.length);

      if (variants.length > 0) {
        cy.get('[data-cy=variant-card]')
          .eq(0)
          .within(() => {
            cy.get('[data-cy=edit-variant-btn]').click();
          });

        cy.get('[data-cy=edit-variant-modal]').should('be.visible').as('modal');

        cy.get('#formTextInputs').clear().type(new_text_inputs);
        cy.get('#formTextOutputs').clear().type(new_text_outputs);

        cy.get('[data-cy=reject-variant-btn]').click();

        cy.wait('@updateVariant');

        cy.get('[data-cy="toast"]')
          .contains('Variant successfully updated. Your edits will be live within 24 hours.')
          .should('exist');

        cy.get('[data-cy=edit-variant-modal]').should('not.exist');
      }
    });
  });

  //maybeIt('Should Save Variant - Incident Editor user', () => {
  it.skip('Should Save Variant - Incident Editor user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const new_text_inputs = 'New Input text';

    const new_text_outputs = 'New Output text';

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindVariant',
      'findVariant',
      {
        data: {
          report: variantsIncident.data.incident.reports[0],
        },
      }
    );

    cy.visit(url);

    getVariants((variants) => {
      const variant = variants[0];

      const today = format(new Date(), 'yyyy-MM-dd');

      cy.conditionalIntercept(
        '**/graphql',
        (req) =>
          req.body.operationName == 'UpdateVariant' &&
          req.body.variables.query.report_number === variant.report_number &&
          req.body.variables.set.text_inputs === new_text_inputs &&
          req.body.variables.set.text_outputs === new_text_outputs &&
          req.body.variables.set.tags == undefined &&
          req.body.variables.set.date_modified == today &&
          req.body.variables.set.epoch_date_modified == getUnixTime(new Date(today)),
        'updateVariant',
        {
          data: {
            updateOneReport: variant,
          },
        }
      );

      cy.get('[data-cy=variant-card]').should('have.length', variants.length);

      if (variants.length > 0) {
        cy.get('[data-cy=variant-card]')
          .eq(0)
          .within(() => {
            cy.get('[data-cy=edit-variant-btn]').click();
          });

        cy.get('[data-cy=edit-variant-modal]').should('be.visible').as('modal');

        cy.get('#formTextInputs').clear().type(new_text_inputs);
        cy.get('#formTextOutputs').clear().type(new_text_outputs);

        cy.get('[data-cy=save-variant-btn]').click();

        cy.wait('@updateVariant');

        cy.get('[data-cy="toast"]')
          .contains('Variant successfully updated. Your edits will be live within 24 hours.')
          .should('exist');

        cy.get('[data-cy=edit-variant-modal]').should('not.exist');
      }
    });
  });

  //maybeIt('Should Delete Variant - Incident Editor user', () => {
  it.skip('Should Delete Variant - Incident Editor user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    getVariants((variants) => {
      const variant = variants[0];

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindVariant',
        'findVariant',
        {
          data: {
            report: variant,
          },
        }
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) =>
          req.body.operationName == 'DeleteOneVariant' &&
          req.body.variables.query.report_number === variant.report_number,
        'deleteOneVariant',
        {
          data: {
            deleteOneReport: {
              __typename: 'Report',
              report_number: variant.report_number,
            },
          },
        }
      );

      cy.conditionalIntercept(
        '**/graphql',
        (req) =>
          req.body.operationName == 'LinkReportsToIncidents' &&
          req.body.variables.input.incident_ids.length === 0 &&
          req.body.variables.input.report_numbers.includes(variant.report_number),
        'linkReportsToIncidents',
        {
          data: {
            linkReportsToIncidents: [],
          },
        }
      );

      cy.visit(url);

      cy.get('[data-cy=variant-card]').should('have.length', variants.length);

      if (variants.length > 0) {
        cy.get('[data-cy=variant-card]')
          .eq(0)
          .within(() => {
            cy.get('[data-cy=edit-variant-btn]').click();
          });

        cy.get('[data-cy=edit-variant-modal]').should('be.visible').as('modal');

        cy.get('[data-cy=delete-variant-btn]').click();

        cy.wait('@deleteOneVariant');

        cy.wait('@linkReportsToIncidents');

        cy.get('[data-cy="toast"]')
          .contains('Variant successfully deleted. Your changes will be live within 24 hours.')
          .should('exist');

        cy.get('[data-cy=edit-variant-modal]').should('not.exist');
      }
    });
  });
});
