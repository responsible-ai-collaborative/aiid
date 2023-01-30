import { format, getUnixTime } from 'date-fns';
import { maybeIt } from '../../../support/utils';
import { getVariantStatusText, VARIANT_STATUS } from '../../../../src/utils/variants';
import variantIncidents from '../../../fixtures/variants/variantIncidents.json';
import variants from '../../../fixtures/variants/variants.json';

describe('Variants App', () => {
  const url = '/apps/variants';

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it('Should display a list of Unreviewed Variants and their values - Unauthenticated user', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindVariants',
      'findVariants',
      variants
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'findIncidents',
      variantIncidents
    );

    cy.visit(url);

    cy.wait('@findVariants');
    cy.wait('@findIncidents');

    cy.get('[data-cy=input-filter-Status]').should('have.value', 'Unreviewed');

    cy.get('[data-cy="row"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="cell"]').should('have.length', 5);

        const incident = variantIncidents.data.incidents[0];

        cy.get('[data-cy="cell"]').eq(0).should('have.text', `Incident ${incident.incident_id}`);
        cy.get('[data-cy="cell"]')
          .eq(0)
          .find(`a[href="/cite/${incident.incident_id}"]`)
          .should('exist');
        cy.get('[data-cy="cell"]').eq(1).should('have.text', incident.title);
        cy.get('[data-cy="cell"]')
          .eq(2)
          .should('have.text', getVariantStatusText(VARIANT_STATUS.unreviewed));
        cy.get('[data-cy="cell"]').eq(3).should('have.text', 'Test input text with markdown');
        cy.get('[data-cy="cell"]').eq(4).should('have.text', 'Test output text with markdown');
      });
  });

  it('Should display a list of all Variants and their values - Unauthenticated user', () => {
    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindVariants',
      'findVariants',
      variants
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'findIncidents',
      variantIncidents
    );

    cy.visit(url);

    cy.wait('@findVariants');
    cy.wait('@findIncidents');

    cy.get('[data-cy=input-filter-Status]').should('have.value', 'Unreviewed');

    cy.get('[data-cy=input-filter-Status]').clear();

    cy.get('[data-cy="row"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="cell"]').should('have.length', 5);

        const incident = variantIncidents.data.incidents[0];

        cy.get('[data-cy="cell"]').eq(0).should('have.text', `Incident ${incident.incident_id}`);
        cy.get('[data-cy="cell"]')
          .eq(0)
          .find(`a[href="/cite/${incident.incident_id}"]`)
          .should('exist');
        cy.get('[data-cy="cell"]').eq(1).should('have.text', incident.title);
        cy.get('[data-cy="cell"]')
          .eq(2)
          .should('have.text', getVariantStatusText(VARIANT_STATUS.unreviewed));
        cy.get('[data-cy="cell"]').eq(3).should('have.text', 'Test input text with markdown');
        cy.get('[data-cy="cell"]').eq(4).should('have.text', 'Test output text with markdown');
      });

    cy.get('[data-cy="row"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="cell"]').should('have.length', 5);

        const incident = variantIncidents.data.incidents[1];

        const variant = variants.data.reports[1];

        cy.get('[data-cy="cell"]').eq(0).should('have.text', `Incident ${incident.incident_id}`);
        cy.get('[data-cy="cell"]')
          .eq(0)
          .find(`a[href="/cite/${incident.incident_id}"]`)
          .should('exist');
        cy.get('[data-cy="cell"]').eq(1).should('have.text', incident.title);
        cy.get('[data-cy="cell"]')
          .eq(2)
          .should('have.text', getVariantStatusText(VARIANT_STATUS.approved));
        cy.get('[data-cy="cell"]').eq(3).should('have.text', variant.text_inputs);
        cy.get('[data-cy="cell"]').eq(4).should('have.text', variant.text_outputs);
      });

    cy.get('[data-cy="row"]')
      .eq(2)
      .within(() => {
        cy.get('[data-cy="cell"]').should('have.length', 5);

        const incident = variantIncidents.data.incidents[1];

        const variant = variants.data.reports[2];

        cy.get('[data-cy="cell"]').eq(0).should('have.text', `Incident ${incident.incident_id}`);
        cy.get('[data-cy="cell"]')
          .eq(0)
          .find(`a[href="/cite/${incident.incident_id}"]`)
          .should('exist');
        cy.get('[data-cy="cell"]').eq(1).should('have.text', incident.title);
        cy.get('[data-cy="cell"]')
          .eq(2)
          .should('have.text', getVariantStatusText(VARIANT_STATUS.rejected));
        cy.get('[data-cy="cell"]').eq(3).should('have.text', variant.text_inputs);
        cy.get('[data-cy="cell"]').eq(4).should('have.text', variant.text_outputs);
      });
  });

  maybeIt('Should Delete a Variant - Incident Editor user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindVariants',
      'findVariants',
      variants
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'findIncidents',
      variantIncidents
    );

    const variant = variants.data.reports[0];

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

    cy.wait('@findVariants');
    cy.wait('@findIncidents');

    cy.get('[data-cy="row"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="cell"]').eq(5).find('[data-cy=delete-variant-btn]').click();
      });

    cy.wait('@deleteOneVariant');
    cy.wait('@linkReportsToIncidents');

    cy.get('[data-cy="toast"]')
      .contains('Variant successfully deleted. Your changes will be live within 24 hours.')
      .should('exist');

    cy.wait('@findVariants');
  });

  maybeIt('Should Approve a Variant - Incident Editor user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindVariants',
      'findVariants',
      variants
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'findIncidents',
      variantIncidents
    );

    const variant = variants.data.reports[0];

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

    const today = format(new Date(), 'yyyy-MM-dd');

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpdateVariant' &&
        req.body.variables.query.report_number === 2310 &&
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

    cy.wait('@findVariants');
    cy.wait('@findIncidents');

    cy.get('[data-cy="row"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="cell"]').eq(5).find('[data-cy=approve-variant-btn]').click();
      });

    cy.wait('@updateVariant');

    cy.get('[data-cy="toast"]')
      .contains('Variant successfully updated. Your edits will be live within 24 hours.')
      .should('exist');

    cy.wait('@findVariants');
  });

  maybeIt('Should Reject a Variant - Incident Editor user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindVariants',
      'findVariants',
      variants
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'findIncidents',
      variantIncidents
    );

    const variant = variants.data.reports[0];

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

    const today = format(new Date(), 'yyyy-MM-dd');

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpdateVariant' &&
        req.body.variables.query.report_number === variant.report_number &&
        req.body.variables.set.tags.includes(VARIANT_STATUS.rejected) &&
        req.body.variables.set.date_modified == today &&
        req.body.variables.set.epoch_date_modified == getUnixTime(new Date(today)),
      'updateVariant',
      {
        data: {
          updateOneReport: {
            report_number: variant.report_number,
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

    cy.wait('@findVariants');
    cy.wait('@findIncidents');

    cy.get('[data-cy="row"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="cell"]').eq(5).find('[data-cy=reject-variant-btn]').click();
      });

    cy.wait('@updateVariant');

    cy.get('[data-cy="toast"]')
      .contains('Variant successfully updated. Your edits will be live within 24 hours.')
      .should('exist');

    cy.wait('@findVariants');
  });

  maybeIt('Should Edit a Variant - Incident Editor user', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    const new_text_inputs = 'New Input text';

    const new_text_outputs = 'New Output text';

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindVariants',
      'findVariants',
      variants
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncidents',
      'findIncidents',
      variantIncidents
    );

    const variant = variants.data.reports[0];

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
          updateOneReport: {
            report_number: variant.report_number,
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
            title: 'Variant #2310',
            url: 'dummyurl.com',
          },
        },
      }
    );

    cy.visit(url);

    cy.wait('@findVariants');
    cy.wait('@findIncidents');

    cy.get('[data-cy="row"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="cell"]').eq(5).find('[data-cy=edit-variant-btn]').click();
      });

    cy.get('[data-cy=edit-variant-modal]').should('be.visible').as('modal');

    cy.get('#formTextInputs').clear().type(new_text_inputs);
    cy.get('#formTextOutputs').clear().type(new_text_outputs);

    cy.get('[data-cy=edit-variant-modal]').find('[data-cy=approve-variant-btn]').click();

    cy.wait('@updateVariant');

    cy.get('[data-cy="toast"]')
      .contains('Variant successfully updated. Your edits will be live within 24 hours.')
      .should('exist');

    cy.wait('@findVariants');
  });
});
