import { maybeIt } from '../support/utils';
import variantsIncident from '../fixtures/variants/variants.json';
import { VARIANT_STATUS } from '../../src/utils/variants';
import { format, getUnixTime } from 'date-fns';

describe('Variants pages', () => {
  const incidentId = 10;

  const url = `/cite/${incidentId}`;

  it('Successfully loads', () => {
    cy.visit(url);

    cy.disableSmoothScroll();
  });

  it('Should display Variant list', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentVariants',
      'findIncidentVariants',
      variantsIncident
    );

    cy.visit(url);

    cy.wait('@findIncidentVariants');

    cy.contains('h1', 'Variants').should('exist').scrollIntoView();

    cy.get('[data-cy=variant-card]').should('have.length', 3);

    cy.get('[data-cy=variant-card]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy=variant-status-badge]').contains('unreviewed');
        cy.get('[data-cy=variant-text_inputs]').contains('Test input text with markdown');
        cy.get('[data-cy=variant-text_outputs]').contains('Test output text with markdown');
      });

    cy.get('[data-cy=variant-card]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy=variant-status-badge]').contains('approved');
        cy.get('[data-cy=variant-text_inputs]').contains('Test input text without markdown');
        cy.get('[data-cy=variant-text_outputs]').contains('Test output text without markdown');
      });

    cy.get('[data-cy=variant-card]')
      .eq(2)
      .within(() => {
        cy.get('[data-cy=variant-status-badge]').contains('rejected');
        cy.get('[data-cy=variant-text_inputs]').contains(
          'Test input text without markdown (rejected)'
        );
        cy.get('[data-cy=variant-text_outputs]').contains(
          'Test output text without markdown (rejected)'
        );
      });
  });

  it('Should add a new Variant - Unauthenticated user', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentVariants',
      'findIncidentVariants',
      variantsIncident
    );

    const text_inputs = 'Input text with **markdown**';

    const text_outputs = 'Output text with **markdown**';

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'CreateVariant' &&
        req.body.variables.input.incidentId === 10 &&
        req.body.variables.input.variant.text_inputs === text_inputs &&
        req.body.variables.input.variant.text_outputs === text_outputs,
      'createVariant',
      {
        data: {
          createVariant: {
            __typename: 'CreateVariantPayload',
            incident_id: 10,
            report_number: 2313,
          },
        },
      }
    );

    cy.visit(url);

    cy.wait('@findIncidentVariants');

    cy.contains('h1', 'Variants').should('exist').scrollIntoView();

    cy.get('[data-cy=variant-form]').should('not.exist');

    cy.get('[data-cy=add-variant-btn]').scrollIntoView().click();

    cy.get('[data-cy=variant-form]').should('exist');

    cy.get('#formTextInputs').type(text_inputs);
    cy.get('#formTextOutputs').type(text_outputs);

    cy.get('[data-cy=add-variant-submit-btn]').click();

    cy.wait('@createVariant');

    cy.get('[data-cy=success-message]').contains(
      "Your variant has been added to the review queue and will appear on this page within 12 hours. Please continue submitting when you encounter more variants. Most of the time we won't review it in the same day, but it will appear within a day as unreviewed."
    );

    cy.get('[data-cy="toast"]').contains('Variant successfully added.').should('exist');
  });

  it("Shouldn't edit a Variant - Unauthenticated user", () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentVariants',
      'findIncidentVariants',
      variantsIncident
    );

    cy.visit(url);

    cy.wait('@findIncidentVariants');

    cy.contains('h1', 'Variants').should('exist').scrollIntoView();

    cy.get('[data-cy=edit-variant-btn]').should('not.exist');
  });

  maybeIt('Should Approve Variant - Incident Editor user', () => {
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

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentVariants',
      'findIncidentVariants',
      variantsIncident
    );

    const today = format(new Date(), 'yyyy-MM-dd');

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpdateVariant' &&
        req.body.variables.query.report_number === 2310 &&
        req.body.variables.set.text_inputs === new_text_inputs &&
        req.body.variables.set.text_outputs === new_text_outputs &&
        req.body.variables.set.tags.includes(VARIANT_STATUS.approved) &&
        req.body.variables.set.date_modified == today &&
        req.body.variables.set.epoch_date_modified == getUnixTime(new Date(today)),
      'updateVariant',
      {
        data: {
          updateOneReport: {
            report_number: 2310,
            tags: [VARIANT_STATUS.approved],
            __typename: 'Report',
            authors: ['Anonymous'],
            date_downloaded: '2022-12-12',
            date_modified: '2022-12-12',
            date_published: '2022-12-12',
            editor_notes: null,
            epoch_date_downloaded: 1670803200,
            epoch_date_modified: 1670803200,
            epoch_date_published: 1670803200,
            flag: null,
            image_url: '',
            language: 'en',
            plain_text: 'Dummy text',
            submitters: ['Anonymous'],
            text: 'Dummy text',
            title: 'Variant #2319',
            url: 'dummyurl.com',
          },
        },
      }
    );

    cy.visit(url);

    cy.get('[data-cy=variant-card]').should('have.length', 3);

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

    cy.wait('@findIncidentVariants');

    cy.get('[data-cy="toast"]').contains('Variant successfully updated.').should('exist');

    cy.get('[data-cy=edit-variant-modal]').should('not.exist');
  });

  maybeIt('Should Reject Variant - Incident Editor user', () => {
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

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentVariants',
      'findIncidentVariants',
      variantsIncident
    );

    const today = format(new Date(), 'yyyy-MM-dd');

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpdateVariant' &&
        req.body.variables.query.report_number === 2311 &&
        req.body.variables.set.text_inputs === new_text_inputs &&
        req.body.variables.set.text_outputs === new_text_outputs &&
        req.body.variables.set.tags.includes(VARIANT_STATUS.rejected) &&
        req.body.variables.set.date_modified == today &&
        req.body.variables.set.epoch_date_modified == getUnixTime(new Date(today)),
      'updateVariant',
      {
        data: {
          updateOneReport: {
            report_number: 2311,
            tags: [VARIANT_STATUS.rejected],
            __typename: 'Report',
            authors: ['Anonymous'],
            date_downloaded: '2022-12-12',
            date_modified: '2022-12-12',
            date_published: '2022-12-12',
            editor_notes: null,
            epoch_date_downloaded: 1670803200,
            epoch_date_modified: 1670803200,
            epoch_date_published: 1670803200,
            flag: null,
            image_url: '',
            language: 'en',
            plain_text: 'Dummy text',
            submitters: ['Anonymous'],
            text: 'Dummy text',
            title: 'Variant #2319',
            url: 'dummyurl.com',
          },
        },
      }
    );

    cy.visit(url);

    cy.get('[data-cy=variant-card]').should('have.length', 3);

    cy.get('[data-cy=variant-card]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy=edit-variant-btn]').click();
      });

    cy.get('[data-cy=edit-variant-modal]').should('be.visible').as('modal');

    cy.get('#formTextInputs').clear().type(new_text_inputs);
    cy.get('#formTextOutputs').clear().type(new_text_outputs);

    cy.get('[data-cy=reject-variant-btn]').click();

    cy.wait('@updateVariant');

    cy.wait('@findIncidentVariants');

    cy.get('[data-cy="toast"]').contains('Variant successfully updated.').should('exist');

    cy.get('[data-cy=edit-variant-modal]').should('not.exist');
  });

  maybeIt('Should Delete Variant - Incident Editor user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindVariant',
      'findVariant',
      {
        data: {
          report: variantsIncident.data.incident.reports[2],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidentVariants',
      'findIncidentVariants',
      variantsIncident
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'DeleteOneVariant' &&
        req.body.variables.query.report_number === 2312,
      'deleteOneVariant',
      {
        data: {
          deleteOneReport: {
            __typename: 'Report',
            report_number: 2312,
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'LinkReportsToIncidents' &&
        req.body.variables.input.incident_ids.length === 0 &&
        req.body.variables.input.report_numbers.includes(2312),
      'linkReportsToIncidents',
      {
        data: {
          linkReportsToIncidents: [],
        },
      }
    );

    cy.visit(url);

    cy.get('[data-cy=variant-card]').should('have.length', 3);

    cy.get('[data-cy=variant-card]')
      .eq(2)
      .within(() => {
        cy.get('[data-cy=edit-variant-btn]').click();
      });

    cy.get('[data-cy=edit-variant-modal]').should('be.visible').as('modal');

    cy.get('[data-cy=delete-variant-btn]').click();

    cy.wait('@deleteOneVariant');

    cy.wait('@linkReportsToIncidents');

    cy.get('[data-cy="toast"]').contains('Variant successfully deleted.').should('exist');

    cy.wait('@findIncidentVariants');

    cy.get('[data-cy=edit-variant-modal]').should('not.exist');
  });
});
