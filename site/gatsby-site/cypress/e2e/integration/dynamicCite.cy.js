import { maybeIt } from '../../support/utils';
import incident10 from '../../fixtures/incidents/incident10.json';

describe('Dynamic Cite pages', () => {
  const incidentId = 10;

  const url = `/cite/${incidentId}`;

  it('Successfully loads', () => {
    cy.visit(url);
  });

  it("Shouldn't display live data option if it's not logged in", () => {
    cy.visit(url);

    cy.get('[data-cy="toogle-live-data"]').should('not.exist');
  });

  maybeIt('Should load dynamic Incident data', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      incident10
    );

    cy.get('[data-cy="toogle-live-data"]').click();

    cy.wait('@findIncident');

    cy.get('h1')
      .contains(
        'Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees V2'
      )
      .should('exist');
    cy.contains(
      'Kronos’s scheduling algorithm and its use by Starbucks managers allegedly negatively impacted financial and scheduling stability for Starbucks employees, which disadvantaged wage workers. V2'
    ).should('exist');
    cy.get('[data-cy="alleged-entities"]').should(
      'have.text',
      'Alleged: Google and Kronos developed an AI system deployed by Starbucks and Google, which harmed Google and Starbucks employees.'
    );

    cy.get('[data-cy="citation"]').contains('Report Count').next().contains('11').should('exist');
    cy.get('[data-cy="citation"]')
      .contains('Editors')
      .next()
      .contains('Sean McGregor, Pablo Costa')
      .should('exist');
    cy.get('[data-cy="variant-card"]').should('have.length', 1);
  });

  maybeIt('Should display a new Variant if live mode is turned on', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    const new_date_published = '2000-01-01';

    const new_text =
      'New text example with more than 80 characters. Lorem ipsum dolor sit amet, consectetur';

    const new_inputs_outputs_1 = 'New Input text';

    const new_inputs_outputs_2 = 'New Output text';

    const new_submitter = 'New Submitter';

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      incident10
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'CreateVariant' &&
        req.body.variables.input.incidentId === incidentId &&
        req.body.variables.input.variant.date_published === new_date_published &&
        req.body.variables.input.variant.submitters[0] === new_submitter &&
        req.body.variables.input.variant.text === new_text &&
        req.body.variables.input.variant.inputs_outputs[0] === new_inputs_outputs_1 &&
        req.body.variables.input.variant.inputs_outputs[1] === new_inputs_outputs_2,
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

    cy.get('[data-cy="toogle-live-data"]').click();

    cy.wait('@findIncident');

    cy.get('[data-cy=add-variant-btn]').scrollIntoView().click();

    cy.waitForStableDOM();

    cy.get('[data-cy=variant-form]').should('exist');

    cy.get('[data-cy="variant-form-date-published"]').type(new_date_published);
    cy.get('[data-cy="variant-form-submitters"]').type(new_submitter);
    cy.get('[data-cy="variant-form-text"]').clear().type(new_text);
    cy.get('[data-cy="variant-form-inputs-outputs"]:eq(0)').clear().type(new_inputs_outputs_1);
    cy.get('[data-cy="add-text-row-btn"]').click();
    cy.get('[data-cy="variant-form-inputs-outputs"]:eq(1)').clear().type(new_inputs_outputs_2);

    cy.waitForStableDOM();

    cy.get('[data-cy=add-variant-submit-btn]').click();

    cy.waitForStableDOM();

    cy.wait('@createVariant');

    cy.wait('@findIncident');
  });

  maybeIt('There should not be image errors (400)', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url, {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').as('consoleError');
      },
    });

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'findIncident',
      incident10
    );

    cy.waitForStableDOM();

    cy.get('[data-cy="toogle-live-data"]').click();

    cy.wait('@findIncident');

    cy.waitForStableDOM();

    cy.get('@consoleError').then((consoleError) => {
      const noImagesErrors = consoleError
        .getCalls()
        .every((call) =>
          call.args.every(
            (arg) => !(arg.includes('https://res.cloudinary.com') && arg.includes('400'))
          )
        );

      expect(noImagesErrors, 'No images errors').to.be.true;
    });
  });
});
