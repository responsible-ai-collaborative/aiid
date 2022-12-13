import createEntitiesPages from '../../../../page-creators/createEntitiesPages';

const response = {
  data: {
    incidents: {
      nodes: [
        {
          incident_id: 1,
          title: 'Incident 1',
          Alleged_deployer_of_AI_system: ['ai-developer-1'],
          Alleged_developer_of_AI_system: ['ai-developer-1'],
          Alleged_harmed_or_nearly_harmed_parties: ['party-1'],
          reports: [1, 2],
        },
        {
          incident_id: 2,
          title: 'Incident 2',
          Alleged_deployer_of_AI_system: ['ai-deployer-1'],
          Alleged_developer_of_AI_system: ['ai-developer-1'],
          Alleged_harmed_or_nearly_harmed_parties: ['party-1', 'party-2'],
          reports: [3],
        },
        {
          incident_id: 3,
          title: 'Incident 3',
          Alleged_deployer_of_AI_system: ['ai-developer-2', 'ai-deployer-2'],
          Alleged_developer_of_AI_system: ['ai-developer-2'],
          Alleged_harmed_or_nearly_harmed_parties: ['party-2'],
          reports: [4, 5],
        },
        {
          incident_id: 4,
          title: 'Incident 4',
          Alleged_deployer_of_AI_system: ['ai-deployer-3'],
          Alleged_developer_of_AI_system: ['ai-developer-1', 'ai-developer-2'],
          Alleged_harmed_or_nearly_harmed_parties: ['party-3'],
          reports: [6, 7, 8],
        },
      ],
    },
    entities: {
      nodes: [
        {
          entity_id: 'ai-deployer-1',
          name: 'AI Deployer 1',
        },
        {
          entity_id: 'ai-deployer-2',
          name: 'AI Deployer 2',
        },
        {
          entity_id: 'ai-deployer-3',
          name: 'AI Deployer 3',
        },
        {
          entity_id: 'ai-developer-1',
          name: 'AI Developer 1',
        },
        {
          entity_id: 'ai-developer-2',
          name: 'AI Developer 2',
        },
        {
          entity_id: 'party-1',
          name: 'Party 1',
        },
        {
          entity_id: 'party-2',
          name: 'Party 2',
        },
        {
          entity_id: 'party-3',
          name: 'Party 3',
        },
      ],
    },
    responses: {
      nodes: [
        {
          report_number: 2,
        },
        {
          report_number: 3,
        },
        {
          report_number: 5,
        },
      ],
    },
  },
};

describe('createEntitiesPages', () => {
  it('Should parse properly', () => {
    const graphql = cy.stub().resolves(response);

    const createPage = cy.stub();

    cy.wrap(createEntitiesPages(graphql, createPage)).then(() => {
      expect(createPage.callCount).to.eq(8 + 1);

      cy.wrap(createPage.getCall(0).args[0]).then((page) => {
        expect(page.context.id).eq('ai-developer-1');
        expect(page.path).eq('/entities/ai-developer-1');
        expect(page.context.name).eq('AI Developer 1');
        expect(page.context.incidentsAsDeployer).to.deep.eq([]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([2, 4]);
        expect(page.context.incidentsAsBoth).to.deep.eq([1]);
        expect(page.context.incidentsHarmedBy).to.deep.eq([]);
        expect(page.context.relatedEntities).to.deep.eq([
          'party-1',
          'ai-deployer-1',
          'party-2',
          'ai-deployer-3',
          'ai-developer-2',
          'party-3',
        ]);
        expect(page.context.responses).to.deep.eq([
          { report_number: 2, incident_id: 1 },
          { report_number: 3, incident_id: 2 },
        ]);
      });

      cy.wrap(createPage.getCall(1).args[0]).then((page) => {
        expect(page.context.id).eq('party-1');
        expect(page.path).eq('/entities/party-1');
        expect(page.context.name).eq('Party 1');
        expect(page.context.incidentsAsDeployer).to.deep.eq([]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([]);
        expect(page.context.incidentsAsBoth).to.deep.eq([]);
        expect(page.context.incidentsHarmedBy).to.deep.eq([1, 2]);
        expect(page.context.relatedEntities).to.deep.eq([
          'ai-developer-1',
          'ai-deployer-1',
          'party-2',
        ]);
        expect(page.context.responses).to.deep.eq([
          { report_number: 2, incident_id: 1 },
          { report_number: 3, incident_id: 2 },
        ]);
      });

      cy.wrap(createPage.getCall(2).args[0]).then((page) => {
        expect(page.context.id).eq('ai-deployer-1');
        expect(page.path).eq('/entities/ai-deployer-1');
        expect(page.context.name).eq('AI Deployer 1');
        expect(page.context.incidentsAsDeployer).to.deep.eq([2]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([]);
        expect(page.context.incidentsAsBoth).to.deep.eq([]);
        expect(page.context.incidentsHarmedBy).to.deep.eq([]);
        expect(page.context.relatedEntities).to.deep.eq(['ai-developer-1', 'party-1', 'party-2']);
        expect(page.context.responses).to.deep.eq([{ report_number: 3, incident_id: 2 }]);
      });

      cy.wrap(createPage.getCall(3).args[0]).then((page) => {
        expect(page.context.id).eq('party-2');
        expect(page.path).eq('/entities/party-2');
        expect(page.context.name).eq('Party 2');
        expect(page.context.incidentsAsDeployer).to.deep.eq([]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([]);
        expect(page.context.incidentsAsBoth).to.deep.eq([]);
        expect(page.context.incidentsHarmedBy).to.deep.eq([2, 3]);
        expect(page.context.relatedEntities).to.deep.eq([
          'ai-deployer-1',
          'ai-developer-1',
          'party-1',
          'ai-developer-2',
          'ai-deployer-2',
        ]);
        expect(page.context.responses).to.deep.eq([
          { report_number: 3, incident_id: 2 },
          { report_number: 5, incident_id: 3 },
        ]);
      });

      cy.wrap(createPage.getCall(4).args[0]).then((page) => {
        expect(page.context.id).eq('ai-developer-2');
        expect(page.path).eq('/entities/ai-developer-2');
        expect(page.context.name).eq('AI Developer 2');
        expect(page.context.incidentsAsDeployer).to.deep.eq([]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([4]);
        expect(page.context.incidentsAsBoth).to.deep.eq([3]);
        expect(page.context.incidentsHarmedBy).to.deep.eq([]);
        expect(page.context.relatedEntities).to.deep.eq([
          'ai-deployer-2',
          'party-2',
          'ai-deployer-3',
          'ai-developer-1',
          'party-3',
        ]);
        expect(page.context.responses).to.deep.eq([{ report_number: 5, incident_id: 3 }]);
      });

      cy.wrap(createPage.getCall(5).args[0]).then((page) => {
        expect(page.context.id).eq('ai-deployer-2');
        expect(page.path).eq('/entities/ai-deployer-2');
        expect(page.context.name).eq('AI Deployer 2');
        expect(page.context.incidentsAsDeployer).to.deep.eq([3]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([]);
        expect(page.context.incidentsAsBoth).to.deep.eq([]);
        expect(page.context.incidentsHarmedBy).to.deep.eq([]);
        expect(page.context.relatedEntities).to.deep.eq(['ai-developer-2', 'party-2']);
        expect(page.context.responses).to.deep.eq([{ report_number: 5, incident_id: 3 }]);
      });

      cy.wrap(createPage.getCall(6).args[0]).then((page) => {
        expect(page.context.id).eq('ai-deployer-3');
        expect(page.path).eq('/entities/ai-deployer-3');
        expect(page.context.name).eq('AI Deployer 3');
        expect(page.context.incidentsAsDeployer).to.deep.eq([4]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([]);
        expect(page.context.incidentsAsBoth).to.deep.eq([]);
        expect(page.context.incidentsHarmedBy).to.deep.eq([]);
        expect(page.context.relatedEntities).to.deep.eq([
          'ai-developer-1',
          'ai-developer-2',
          'party-3',
        ]);
        expect(page.context.responses).to.deep.eq([]);
      });

      cy.wrap(createPage.getCall(7).args[0]).then((page) => {
        expect(page.context.id).eq('party-3');
        expect(page.path).eq('/entities/party-3');
        expect(page.context.name).eq('Party 3');
        expect(page.context.incidentsAsDeployer).to.deep.eq([]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([]);
        expect(page.context.incidentsAsBoth).to.deep.eq([]);
        expect(page.context.incidentsHarmedBy).to.deep.eq([4]);
        expect(page.context.relatedEntities).to.deep.eq([
          'ai-deployer-3',
          'ai-developer-1',
          'ai-developer-2',
        ]);
        expect(page.context.responses).to.deep.eq([]);
      });

      cy.wrap(createPage.getCall(8).args[0]).then((page) => {
        expect(page.path).eq('/entities');
        expect(page.context.entities.length).eq(8);
      });
    });
  });
});
