import createEntitiesPages from '../../../page-creators/createEntitiesPages';

const response = {
  data: {
    incidents: {
      nodes: [
        {
          incident_id: 1,
          Alleged_deployer_of_AI_system: ['AI Developer 1'],
          Alleged_developer_of_AI_system: ['AI Developer 1'],
        },
        {
          incident_id: 2,
          Alleged_deployer_of_AI_system: ['AI Deployer 1'],
          Alleged_developer_of_AI_system: ['AI Developer 1'],
        },
        {
          incident_id: 3,
          Alleged_deployer_of_AI_system: ['AI Developer 2', 'AI Deployer 2'],
          Alleged_developer_of_AI_system: ['AI Developer 2'],
        },
        {
          incident_id: 4,
          Alleged_deployer_of_AI_system: ['AI Deployer 3'],
          Alleged_developer_of_AI_system: ['AI Developer 1', 'AI Developer 2'],
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
      expect(createPage.callCount).to.eq(5 + 1);

      cy.wrap(createPage.getCall(0).args[0]).then((page) => {
        expect(page.context.id).eq('ai-developer-1');
        expect(page.path).eq('/entities/ai-developer-1');
        expect(page.context.name).eq('AI Developer 1');
        expect(page.context.incidentsAsDeployer).to.deep.eq([1]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([1, 2, 4]);
        expect(page.context.incidentsAsBoth).to.deep.eq([1]);
        expect(page.context.relatedEntities[0]).to.deep.eq({
          id: 'ai-deployer-1',
          name: 'AI Deployer 1',
          incidents: 1,
        });

        expect(page.context.relatedEntities[1]).to.deep.eq({
          id: 'ai-deployer-3',
          name: 'AI Deployer 3',
          incidents: 1,
        });
        expect(page.context.relatedEntities[2]).to.deep.eq({
          id: 'ai-developer-2',
          name: 'AI Developer 2',
          incidents: 2,
        });
      });

      cy.wrap(createPage.getCall(1).args[0]).then((page) => {
        expect(page.context.id).eq('ai-deployer-1');
        expect(page.path).eq('/entities/ai-deployer-1');
        expect(page.context.name).eq('AI Deployer 1');
        expect(page.context.incidentsAsDeployer).to.deep.eq([2]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([]);
        expect(page.context.incidentsAsBoth).to.deep.eq([]);
        expect(page.context.relatedEntities).to.deep.eq([
          {
            id: 'ai-developer-1',
            name: 'AI Developer 1',
            incidents: 3,
          },
        ]);
        expect(page.context.relatedEntities).to.have.lengthOf(1);
      });

      cy.wrap(createPage.getCall(2).args[0]).then((page) => {
        expect(page.context.id).eq('ai-developer-2');
        expect(page.path).eq('/entities/ai-developer-2');
        expect(page.context.name).eq('AI Developer 2');
        expect(page.context.incidentsAsDeployer).to.deep.eq([3]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([3, 4]);
        expect(page.context.incidentsAsBoth).to.deep.eq([3]);
        expect(page.context.relatedEntities).to.deep.eq([
          {
            id: 'ai-deployer-2',
            name: 'AI Deployer 2',
            incidents: 1,
          },
          {
            id: 'ai-deployer-3',
            name: 'AI Deployer 3',
            incidents: 1,
          },
          {
            id: 'ai-developer-1',
            name: 'AI Developer 1',
            incidents: 3,
          },
        ]);

        expect(page.context.relatedEntities).to.have.lengthOf(3);
      });

      cy.wrap(createPage.getCall(3).args[0]).then((page) => {
        expect(page.context.id).eq('ai-deployer-2');
        expect(page.path).eq('/entities/ai-deployer-2');
        expect(page.context.name).eq('AI Deployer 2');
        expect(page.context.incidentsAsDeployer).to.deep.eq([3]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([]);
        expect(page.context.incidentsAsBoth).to.deep.eq([]);
        expect(page.context.relatedEntities[0]).to.deep.eq({
          id: 'ai-developer-2',
          name: 'AI Developer 2',
          incidents: 2,
        });
        expect(page.context.relatedEntities).to.have.lengthOf(1);
      });

      cy.wrap(createPage.getCall(4).args[0]).then((page) => {
        expect(page.context.id).eq('ai-deployer-3');
        expect(page.path).eq('/entities/ai-deployer-3');
        expect(page.context.name).eq('AI Deployer 3');
        expect(page.context.incidentsAsDeployer).to.deep.eq([4]);
        expect(page.context.incidentsAsDeveloper).to.deep.eq([]);
        expect(page.context.incidentsAsBoth).to.deep.eq([]);
        expect(page.context.relatedEntities[0]).to.deep.eq({
          id: 'ai-developer-1',
          name: 'AI Developer 1',
          incidents: 3,
        });
        expect(page.context.relatedEntities[1]).to.deep.eq({
          id: 'ai-developer-2',
          name: 'AI Developer 2',
          incidents: 2,
        });
        expect(page.context.relatedEntities).to.have.lengthOf(2);
      });

      cy.wrap(createPage.getCall(5).args[0]).then((page) => {
        expect(page.path).eq('/entities');
      });
    });
  });
});
