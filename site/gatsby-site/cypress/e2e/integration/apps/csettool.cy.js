import { maybeIt } from '../../../support/utils';
import cssettool from '../../../fixtures/classifications/cssettool.json';
import upsertCSETv1merge from '../../../fixtures/classifications/upsertCSETv1merge.json';

describe('CSET tool', () => {
  const url = '/apps/csettool/52/';

  function getRow(short_name) {
    return cy.get(`[data-cy="column-${short_name}"]`).parent().parent();
  }

  maybeIt('Successfully loads CSET annotator classifications', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'FindClassifications',
      'FindClassifications',
      cssettool
    );

    cy.visit(url);

    cy.wait(['@FindClassifications']);

    cy.waitForStableDOM();

    getRow('Incident Number').within(() => {
      // same value should resolve automatically
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', '52')
        .should('not.have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', '52')
        .should('not.have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]')
        .should('have.text', '52')
        .should('have.class', 'bg-green-100');
    });

    getRow('Annotator').within(() => {
      // should be skipped
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', '"006"')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', 'null')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]').should('have.text', 'skipped');
    });

    getRow('Physical Objects').within(() => {
      // should  ask for disambiguation
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', '"yes"')
        .should('have.class', 'bg-red-100');

      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', '"maybe"')
        .should('have.class', 'bg-red-100');

      cy.get('[data-cy="column-result"]').should('have.text', 'Please select a column');
    });

    getRow('Harm Distribution Basis').within(() => {
      // should merge arrays automatically
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', '["none"]')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', '["ideology","financial means","disability"]')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]')
        .should('have.text', '["none","ideology","financial means","disability"]')
        .should('have.class', 'bg-green-100');
    });

    getRow('notes').within(() => {
      // should merge arrays automatically
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', 'This a note from the annotator 1')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', 'This a note from the annotator 2')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]')
        .should(
          'have.text',
          'Annotator 1: \n\n This a note from the annotator 1\n\nAnnotator 2: \n\n This a note from the annotator 2'
        )
        .should('have.class', 'bg-green-100');
    });

    getRow('Notes (special interest intangible harm)').within(() => {
      // should not mix annotator numbers
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', '')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', 'This is a note from Annotator 2')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]')
        .should('have.text', 'Annotator 2: \n\n This is a note from Annotator 2')
        .should('have.class', 'bg-green-100');
    });

    getRow('Entities').within(() => {
      //

      cy.get('[data-cy="column-CSETv1_Annotator-1"]').should('have.class', 'bg-red-100');

      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .get('[data-cy="entity-Joshua Brown"]')
        .should('be.visible');
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .get('[data-cy="entity-Tesla Model S"]')
        .should('be.visible');
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .get('[data-cy="entity-Frank Baressi"]')
        .should('be.visible');

      //

      cy.get('[data-cy="column-CSETv1_Annotator-2"]').should('have.class', 'bg-red-100');

      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .get('[data-cy="entity-Joshua Brown"]')
        .should('be.visible');

      //  delete a duplicated entity

      cy.get('[data-cy="column-result"]').find('[data-cy*="entity-"]').should('have.length', 4);

      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .find('[data-cy="entity-Joshua Brown"]')
        .find('button')
        .click();

      cy.get('[data-cy="column-result"]').find('[data-cy*="entity-"]').should('have.length', 3);
    });

    getRow('Estimated Harm Quantities').within(() => {
      // should ask for disambiguation for different boolean values
      cy.get('[data-cy="column-CSETv1_Annotator-1"]')
        .should('have.text', 'true')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-CSETv1_Annotator-2"]')
        .should('have.text', 'false')
        .should('have.class', 'bg-red-100');
      cy.get('[data-cy="column-result"]')
        .should('have.text', 'Please select a column')
        .should('have.class', 'bg-red-100');
    });

    cy.contains('Merge Classifications').should('be.disabled');

    // disambiguate and submit

    getRow('Physical Objects').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('Entertainment Industry').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('Tangible Harm').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('AI System').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('User Test in Controlled Conditions').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('Estimated Harm Quantities').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('Quality Control').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-2"]').click();
    });

    getRow('There is a potentially identifiable specific entity that experienced the harm').within(
      () => {
        cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
      }
    );

    getRow('Harmed Class of Entities').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    getRow('Estimated Date').within(() => {
      cy.get('[data-cy="column-CSETv1_Annotator-1"]').click();
    });

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpsertClassification',
      'UpsertClassification',
      upsertCSETv1merge
    );

    cy.contains('Merge Classifications').click();

    cy.wait('@UpsertClassification').then((xhr) => {
      expect(xhr.request.body.variables.query).to.deep.eq({
        incident_id: '52',
        namespace: 'CSETv1',
      });

      expect(xhr.request.body.variables.data).to.deep.eq({
        incident_id: '52',
        notes:
          'Annotator 1: \n\n This a note from the annotator 1\n\nAnnotator 2: \n\n This a note from the annotator 2',
        namespace: 'CSETv1',
        attributes: [
          {
            short_name: 'Incident Number',
            value_json: '52',
          },
          {
            short_name: 'Quality Control',
            value_json: 'true',
          },
          {
            short_name: 'Physical Objects',
            value_json: '"yes"',
          },
          {
            short_name: 'Entertainment Industry',
            value_json: '"no"',
          },
          {
            short_name: 'Report, Test, or Study of data',
            value_json: '"no"',
          },
          {
            short_name: 'Deployed',
            value_json: '"yes"',
          },
          {
            short_name: 'Producer Test in Controlled Conditions',
            value_json: '"no"',
          },
          {
            short_name: 'Producer Test in Operational Conditions',
            value_json: '"no"',
          },
          {
            short_name: 'User Test in Controlled Conditions',
            value_json: '"no"',
          },
          {
            short_name: 'User Test in Operational Conditions',
            value_json: '"no"',
          },
          {
            short_name: 'Harm Domain',
            value_json: '"yes"',
          },
          {
            short_name: 'Tangible Harm',
            value_json: '"tangible harm definitively occurred"',
          },
          {
            short_name: 'AI System',
            value_json: '"yes"',
          },
          {
            short_name: 'Clear Link to AI',
            value_json: '"yes"',
          },
          {
            short_name:
              'There is a potentially identifiable specific entity that experienced the harm',
            value_json: 'true',
          },
          {
            short_name: 'AI Harm Level',
            value_json: '"AI tangible harm near-miss"',
          },
          {
            short_name: 'AI Tangible Harm Level Notes',
            value_json:
              '"Annotator 1: \\n\\n The Tesla\'s autopilot failed to notice the trailer of the trucker and deploy breaks. This could have minimized damage during the crash. However, the crash was ultimately at fault of the Tesla driver."',
          },
          {
            short_name: 'Impact on Critical Services',
            value_json: '"no"',
          },
          {
            short_name: 'Rights Violation',
            value_json: '"no"',
          },
          {
            short_name: 'Involving Minor',
            value_json: '"no"',
          },
          {
            short_name: 'Detrimental Content',
            value_json: '"no"',
          },
          {
            short_name: 'Protected Characteristic',
            value_json: '"no"',
          },
          {
            short_name: 'Harm Distribution Basis',
            value_json: '["none","ideology","financial means","disability"]',
          },
          {
            short_name: 'Notes (special interest intangible harm)',
            value_json: '"Annotator 2: \\n\\n This is a note from Annotator 2"',
          },
          {
            short_name: 'Special Interest Intangible Harm',
            value_json: '"no"',
          },
          {
            short_name: 'AI Linked to Special Interest Intangible Harm',
            value_json: '"no"',
          },
          {
            short_name: 'Harmed Class of Entities',
            value_json: 'true',
          },
          {
            short_name: 'Annotator’s AI special interest intangible harm assessment',
            value_json: '"no"',
          },
          {
            short_name: 'Notes (AI special interest intangible harm)',
            value_json: '""',
          },
          {
            short_name: 'Date of Incident Year',
            value_json: '"2016"',
          },
          {
            short_name: 'Date of Incident Month',
            value_json: '"05"',
          },
          {
            short_name: 'Date of Incident Day',
            value_json: '"07"',
          },
          {
            short_name: 'Estimated Date',
            value_json: 'true',
          },
          {
            short_name: 'Multiple AI Interaction',
            value_json: '"no"',
          },
          {
            short_name: 'Embedded',
            value_json: '"yes"',
          },
          {
            short_name: 'Location City',
            value_json: '"Williston"',
          },
          {
            short_name: 'Location State/Province (two letters)',
            value_json: '"FL"',
          },
          {
            short_name: 'Location Country (two letters)',
            value_json: '"US"',
          },
          {
            short_name: 'Location Region',
            value_json: '"North America"',
          },
          {
            short_name: 'Infrastructure Sectors',
            value_json: '[]',
          },
          {
            short_name: 'Operating Conditions',
            value_json: '""',
          },
          {
            short_name: 'Notes (Environmental and Temporal Characteristics)',
            value_json: '""',
          },
          {
            short_name: 'Entities',
            value_json:
              '[{"attributes":[{"short_name":"Entity","value_json":"\\"Joshua Brown\\""},{"short_name":"Named Entity","value_json":"true"},{"short_name":"Entity type","value_json":"\\"individual\\""},{"short_name":"Entity Relationship to the AI","value_json":"[\\"user\\"]"},{"short_name":"Harm Category Experienced","value_json":"\\"AI tangible harm event\\""},{"short_name":"Harm Type Experienced","value_json":"\\"physical health/safety\\""},{"short_name":"Notes (Characterizing Entities and the Harm)","value_json":"\\"Tesla Autopilot failed to detected truck and deploy its breaks. This could have minimized damaged during the crash. Ultimately, the Tesla was responsible for the crash\\""}]},{"attributes":[{"short_name":"Entity","value_json":"\\"Tesla Model S\\""},{"short_name":"Named Entity","value_json":"true"},{"short_name":"Entity type","value_json":"\\"product\\""},{"short_name":"Entity Relationship to the AI","value_json":"[\\"product containing AI\\"]"},{"short_name":"Harm Category Experienced","value_json":"\\"AI tangible harm event\\""},{"short_name":"Harm Type Experienced","value_json":"\\"physical property\\""},{"short_name":"Notes (Characterizing Entities and the Harm)","value_json":"\\"Autopilot failed to deploy breaks which could have minimized damage in the crash\\""}]},{"attributes":[{"short_name":"Entity","value_json":"\\"Frank Baressi\\""},{"short_name":"Named Entity","value_json":"true"},{"short_name":"Entity type","value_json":"\\"individual\\""},{"short_name":"Entity Relationship to the AI","value_json":"[\\"user\\"]"},{"short_name":"Harm Category Experienced","value_json":"\\"AI tangible harm event\\""},{"short_name":"Harm Type Experienced","value_json":"\\"physical property\\""},{"short_name":"Notes (Characterizing Entities and the Harm)","value_json":"\\"Truck driver hit by Tesla. Damage to truck could have been minimized by the deployment of breaks\\""}]}]',
          },
          {
            short_name: 'Lives Lost',
            value_json: '1',
          },
          {
            short_name: 'Injuries',
            value_json: '-2',
          },
          {
            short_name: 'Estimated Harm Quantities',
            value_json: 'true',
          },
          {
            short_name: 'Notes ( Tangible Harm Quantities Information)',
            value_json: '""',
          },
          {
            short_name: 'AI System Description',
            value_json: '"Tesla Autopilot. "',
          },
          {
            short_name: 'Data Inputs',
            value_json:
              '["video input","navigation","sensor data","tra","road data","traffic","GPS"]',
          },
          {
            short_name: 'Sector of Deployment',
            value_json: '["transportation and storage"]',
          },
          {
            short_name: 'Public Sector Deployment',
            value_json: '"no"',
          },
          {
            short_name: 'Autonomy Level',
            value_json: '"Autonomy2"',
          },
          {
            short_name: 'Notes (Information about AI System)',
            value_json: '""',
          },
          {
            short_name: 'Intentional Harm',
            value_json: '"No. Not intentionally designed to perform harm"',
          },
          {
            short_name: 'Physical System Type',
            value_json: '"Automobile"',
          },
          {
            short_name: 'AI Task',
            value_json: '["navigation","transportation"]',
          },
          {
            short_name: 'AI tools and methods',
            value_json: '["Autonomous Driving"]',
          },
          {
            short_name: 'Notes (AI Functionality and Techniques)',
            value_json: '""',
          },
        ],
      });
    });
  });
});
