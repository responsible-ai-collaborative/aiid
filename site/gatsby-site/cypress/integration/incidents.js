import { maybeIt } from '../support/utils';

import incident from '../fixtures/incidents/incident.json';

import updateOneIncident from '../fixtures/incidents/updateOneIncident.json';

describe('Incidents', () => {
  const url = '/incidents/edit?incident_id=10';

  maybeIt('Should successfully edit incident fields', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindIncident',
      'FindIncident',
      incident
    );

    cy.wait('@FindIncident');

    const values = {
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
    };

    Object.keys(values).forEach((key) => {
      cy.get(`[name=${key}]`).clear().type(values[key]);
    });

    cy.contains('label', 'Alleged Deployer of AI System')
      .next()
      .find('[type="text"]')
      .type('Test Deployer{enter}');

    cy.contains('label', 'Editors').next().find('[type="text"]').type('Test Editor{enter}');

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateIncident',
      'UpdateIncident',
      updateOneIncident
    );

    cy.contains('button', 'Save').click();

    cy.wait('@UpdateIncident').then((xhr) => {
      expect(xhr.request.body.operationName).to.eq('UpdateIncident');
      expect(xhr.request.body.variables.query.incident_id).to.eq(10);
      expect(xhr.request.body.variables.set.title).to.eq('Test title');
      expect(xhr.request.body.variables.set.description).to.eq('Test description');
      expect(xhr.request.body.variables.set.date).to.eq('2021-01-02');
      expect(xhr.request.body.variables.set.AllegedDeployerOfAISystem).to.deep.eq([
        'YouTube',
        'Test Deployer',
      ]);
      expect(xhr.request.body.variables.set.AllegedDeveloperOfAISystem).to.deep.eq(['YouTube']);
      expect(xhr.request.body.variables.set.AllegedHarmedOrNearlyHarmedParties).to.deep.eq([]);
      expect(xhr.request.body.variables.set.editors).to.deep.eq(['Sean McGregor', 'Test Editor']);
    });

    cy.get('div[class^="ToastContext"]')
      .contains('Incident 10 updated successfully.')
      .should('exist');
  });
});
