import incident10 from '../../fixtures/incidents/incident10.json';

describe('Dynamic Cite pages', () => {
  const incidentId = 10;

  const url = `/cite/${incidentId}`;

  it('Successfully loads', () => {
    cy.visit(url);

    cy.get('[data-cy="toogle-live-data"]').should('exist');
  });

  it('Should load dynamic Incident data', () => {
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

  it('Should display a new Variant if live mode is turned on', () => {
    cy.visit(url);

    const text_inputs = 'Input text';

    const text_outputs = 'Output text';

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

    cy.get('[data-cy="toogle-live-data"]').click();

    cy.wait('@findIncident');

    cy.get('[data-cy=add-variant-btn]').scrollIntoView().click();

    cy.waitForStableDOM();

    cy.get('[data-cy=variant-form]').should('exist');

    cy.get('[data-cy="variant-form-text-inputs"]').type(text_inputs);
    cy.get('[data-cy="variant-form-text-outputs"]').type(text_outputs);

    cy.waitForStableDOM();

    cy.get('[data-cy=add-variant-submit-btn]').click();

    cy.waitForStableDOM();

    cy.wait('@createVariant');

    cy.wait('@findIncident');
  });

  it('There should not be image errors (400)', () => {
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
