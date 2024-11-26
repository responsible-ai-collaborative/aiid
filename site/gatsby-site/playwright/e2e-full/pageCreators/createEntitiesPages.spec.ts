import sinon from 'sinon';
import createEntitiesPages from '../../../page-creators/createEntitiesPages';
import { CreatePagesArgs } from 'gatsby';
import { expect } from '@playwright/test';
import { test } from '../../utils';

test.describe('createEntitiesPages', () => {
  let graphql: sinon.SinonStub;
  let createPage: sinon.SinonSpy;

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
            reports: [{ report_number: 1 }, { report_number: 2 }],
          },
          {
            incident_id: 2,
            title: 'Incident 2',
            Alleged_deployer_of_AI_system: ['ai-deployer-1'],
            Alleged_developer_of_AI_system: ['ai-developer-1'],
            Alleged_harmed_or_nearly_harmed_parties: ['party-1', 'party-2'],
            reports: [{ report_number: 3 }],
          },
          {
            incident_id: 3,
            title: 'Incident 3',
            Alleged_deployer_of_AI_system: ['ai-developer-2', 'ai-deployer-2'],
            Alleged_developer_of_AI_system: ['ai-developer-2'],
            Alleged_harmed_or_nearly_harmed_parties: ['party-2'],
            reports: [{ report_number: 4 }, { report_number: 5 }],
          },
          {
            incident_id: 4,
            title: 'Incident 4',
            Alleged_deployer_of_AI_system: ['ai-deployer-3'],
            Alleged_developer_of_AI_system: ['ai-developer-1', 'ai-developer-2'],
            Alleged_harmed_or_nearly_harmed_parties: ['party-3'],
            reports: [{ report_number: 6 }, { report_number: 7 }, { report_number: 8 }],
          },
        ],
      },
      entities: {
        nodes: [
          { entity_id: 'ai-deployer-1', name: 'AI Deployer 1' },
          { entity_id: 'ai-deployer-2', name: 'AI Deployer 2' },
          { entity_id: 'ai-deployer-3', name: 'AI Deployer 3' },
          { entity_id: 'ai-developer-1', name: 'AI Developer 1' },
          { entity_id: 'ai-developer-2', name: 'AI Developer 2' },
          { entity_id: 'party-1', name: 'Party 1' },
          { entity_id: 'party-2', name: 'Party 2' },
          { entity_id: 'party-3', name: 'Party 3' },
        ],
      },
      responses: {
        nodes: [
          { report_number: 2 },
          { report_number: 3 },
          { report_number: 5 },
        ],
      },
    },
  };

  test.beforeEach(() => {
    graphql = sinon.stub();
    createPage = sinon.spy();
  });

  test.afterEach(() => {
    sinon.restore();
  });

  test('Should parse properly', async () => {
    graphql.resolves(response);

    await createEntitiesPages(graphql as unknown as CreatePagesArgs['graphql'], createPage);

    // Total pages created
    expect(createPage.callCount).toEqual(9);

    // Validate the first entity
    const firstPage = createPage.getCall(0).args[0];
    expect(firstPage.context.id).toBe('ai-developer-1');
    expect(firstPage.path).toBe('/entities/ai-developer-1');
    expect(firstPage.context.name).toBe('AI Developer 1');
    expect(firstPage.context.incidentsAsDeployer).toEqual([]);
    expect(firstPage.context.incidentsAsDeveloper).toEqual([2, 4]);
    expect(firstPage.context.incidentsAsBoth).toEqual([1]);
    expect(firstPage.context.incidentsHarmedBy).toEqual([]);
    expect(firstPage.context.relatedEntities).toEqual([
      'party-1',
      'ai-deployer-1',
      'party-2',
      'ai-deployer-3',
      'ai-developer-2',
      'party-3',
    ]);
    expect(firstPage.context.responses).toEqual([
      { report_number: 2, incident_id: 1 },
      { report_number: 3, incident_id: 2 },
    ]);

    // Validate the last page
    const lastPage = createPage.getCall(8).args[0];
    expect(lastPage.path).toBe('/entities');
    expect(lastPage.context.entities.length).toEqual(8);
  });
});
