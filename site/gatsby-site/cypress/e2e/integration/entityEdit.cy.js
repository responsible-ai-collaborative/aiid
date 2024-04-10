import { conditionalIt } from '../../support/utils';
import entity from '../../fixtures/entities/entity.json';
import updateOneEntity from '../../fixtures/entities/updateOneEntity.json';

describe('Edit Entity', () => {
  const entity_id = 'google';

  const url = `/entities/edit?entity_id=${entity_id}`;

  conditionalIt(
    !Cypress.env('isEmptyEnvironment') && Cypress.env('e2eUsername') && Cypress.env('e2ePassword'),
    'Should successfully edit Entity fields',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      cy.visit(url);

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindEntity',
        'FindEntity',
        entity
      );

      cy.wait(['@FindEntity']);

      const values = {
        name: 'Google new',
      };

      Object.keys(values).forEach((key) => {
        cy.get(`[name=${key}]`).clear().type(values[key]);
      });

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'UpdateEntity',
        'UpdateEntity',
        updateOneEntity
      );

      const now = new Date();

      cy.clock(now);

      cy.contains('button', 'Save').click();

      const updatedEntity = {
        name: values.name,
        date_modified: now.toISOString(),
      };

      cy.wait('@UpdateEntity').then((xhr) => {
        expect(xhr.request.body.operationName).to.eq('UpdateEntity');
        expect(xhr.request.body.variables.query.entity_id).to.eq(entity_id);
        expect(xhr.request.body.variables.set).to.deep.eq(updatedEntity);
      });

      cy.get('.tw-toast').contains('Entity updated successfully.').should('exist');
    }
  );

  conditionalIt(
    !Cypress.env('isEmptyEnvironment') && Cypress.env('e2eUsername') && Cypress.env('e2ePassword'),
    'Should display an error message when editing Entity fails',
    () => {
      cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

      cy.visit(url);

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'FindEntity',
        'FindEntity',
        entity
      );

      cy.wait(['@FindEntity']);

      const values = {
        name: 'Google new',
      };

      Object.keys(values).forEach((key) => {
        cy.get(`[name=${key}]`).clear().type(values[key]);
      });

      cy.conditionalIntercept(
        '**/graphql',
        (req) => req.body.operationName == 'UpdateEntity',
        'UpdateEntity',
        {
          data: null,
          errors: [
            {
              message: 'Dummy error message',
            },
          ],
        }
      );

      const now = new Date();

      cy.clock(now);

      cy.contains('button', 'Save').click();

      const updatedEntity = {
        name: values.name,
        date_modified: now.toISOString(),
      };

      cy.wait('@UpdateEntity').then((xhr) => {
        expect(xhr.request.body.operationName).to.eq('UpdateEntity');
        expect(xhr.request.body.variables.query.entity_id).to.eq(entity_id);
        expect(xhr.request.body.variables.set).to.deep.eq(updatedEntity);
      });

      cy.get('.tw-toast').contains('Error updating Entity.').should('exist');
    }
  );
});
