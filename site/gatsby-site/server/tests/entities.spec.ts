import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, mockSession, seedFixture, startTestServer, getCollection } from "./utils";
import { ObjectId, MongoClient } from 'mongodb';
import { findSimilarEntities, SimilarEntityPair, mergeEntities } from '../shared/entities';
import { Entity } from '../generated/graphql';

describe(`Entities`, () => {
  let server: ApolloServer, url: string;

  beforeAll(async () => {
    ({ server, url } = await startTestServer());
  });

  afterAll(async () => {
    await server?.stop();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it(`Update Entity and its relationships`, async () => {

    const mutationData = {
      query: `
              mutation UpdateEntity($input: UpdateOneEntityInput!) {
                  updateEntityAndRelationships(input: $input) {
                    entity_id
                    name
                  }
              }
                    `,
      variables: {

        "input": {
          "entity_id": "entity1",
          "name": "Entity 1",
          "entity_relationships_to_add": [{ id: "entity3", label: "Entity3" }],
          "entity_relationships_to_remove": [{ id: "entity2", label: "Entity2" }]
        }
      }
    };


    await seedFixture({
      customData: {
        users: [
          {
            userId: "123",
            roles: [],
          }
        ],
      },
      aiidprod: {
        entities: [
          {
            entity_id: "entity1",
            name: "Entity 1",

          },
          {
            entity_id: "entity2",
            name: "Entity 2",

          }
        ],
        entity_relationships: [
          {
            sub: "entity1",
            obj: "entity2",
            is_symmetric: true,
            pred: "related"
          }
        ]

      }
    });


    mockSession("123");

    const response = await makeRequest(url, mutationData);

    expect(response.body.data).toMatchObject({
      updateEntityAndRelationships: {
        entity_id: "entity1",
        name: "Entity 1"
      }
    })
  });

  it(`Merge Entities`, async () => {

    await seedFixture({
      customData: { users: [{ userId: "123", roles: ["incident_editor"] }] },
      aiidprod: {
        entities: [
          { entity_id: "entityA", name: "Entity A" },
          { entity_id: "entityB", name: "Entity B" }, // To be merged/deleted
          { entity_id: "entityC", name: "Entity C" },
          { entity_id: "entityD", name: "Entity D" }
        ],
        entity_relationships: [
          { sub: "entityB", obj: "entityC", is_symmetric: true, pred: "related" }, // Should become A->C
          { sub: "entityD", obj: "entityB", is_symmetric: true, pred: "related" }  // Should become D->A
        ],
        incidents: [
          { incident_id: 1, date: "2024-01-01", title: "Incident 1", description: "Desc 1", 'Alleged developer of AI system': ["entityB"], 'Alleged harmed or nearly harmed parties': ["entityC"], implicated_systems: ["entityB", "entityD"] },
          { incident_id: 2, date: "2024-01-02", title: "Incident 2", description: "Desc 2", 'Alleged developer of AI system': ["entityA"], 'Alleged harmed or nearly harmed parties': ["entityB"] },
        ],
        submissions: [
          { _id: new ObjectId("aaaaaaaaaaaaaaaaaaaaaaa1"), date_submitted: "2024-01-01", url: "http://example.com/sub1", source_domain: "example.com", title: "Sub 1", text: "Text 1", authors: [], submitters: [], tags: [], developers: ["entityB"], harmed_parties: ["entityC"] },
          { _id: new ObjectId("aaaaaaaaaaaaaaaaaaaaaaa2"), date_submitted: "2024-01-02", url: "http://example.com/sub2", source_domain: "example.com", title: "Sub 2", text: "Text 2", authors: [], submitters: [], tags: [], deployers: ["entityA", "entityB"] },
        ],
        subscriptions: [
          { _id: new ObjectId("bbbbbbbbbbbbbbbbbbbbbbb1"), type: "entity", entityId: "entityB", userId: "user1" }, // Should be updated
          { _id: new ObjectId("bbbbbbbbbbbbbbbbbbbbbbb2"), type: "entity", entityId: "entityA", userId: "user2" }, // Should remain
          { _id: new ObjectId("bbbbbbbbbbbbbbbbbbbbbbb3"), type: "incident", incident_id: 1, userId: "user1" } // Should remain
        ]
      }
    });

    mockSession("123");

    const client = new MongoClient(process.env.API_MONGODB_CONNECTION_STRING!);
    await client.connect();
    await mergeEntities("entityA", "entityB", 1, client);
    await client.close();

    // Verify entityB was deleted

    const entityListResponse = await makeRequest(
      url,
      {
        query: `
          query {
            entities {
              entity_id
            }
          }
        `
      }
    );
    
    const finalEntityIds = entityListResponse.body.data.entities.map((e: any) => e.entity_id).sort();
    
    expect(finalEntityIds).toEqual(["entityA", "entityC", "entityD"]); // entityB should be gone

    
    // Verify entity_relationships were updated

    const relListResp = await makeRequest(
      url,
      {
        query: `
          query {
            entity_relationships {
              sub { entity_id }
              obj { entity_id }
            }
          }
        `
      }
    );

    const finalRels = relListResp.body.data.entity_relationships
      .map((r: any) => [r.sub.entity_id, r.obj.entity_id].sort().join('-'))
      .sort();

    expect(finalRels).toEqual(["entityA-entityC", "entityA-entityD"]); // B->C became A->C, D->B became D->A


    // Verify incidents were updated

    const incident1Resp = await makeRequest(
      url,
      {
        query: `
          query {
            incident(filter: { incident_id: { EQ: 1 } }) {
              AllegedDeveloperOfAISystem { entity_id }
              AllegedHarmedOrNearlyHarmedParties { entity_id }
              implicated_systems { entity_id }
            }
          }
        `
      }
    );
    expect(incident1Resp.body.data.incident.AllegedDeveloperOfAISystem.map((e: any) => e.entity_id)).toEqual(["entityA"]); // Was ["entityB"]
    expect(incident1Resp.body.data.incident.AllegedHarmedOrNearlyHarmedParties.map((e: any) => e.entity_id)).toEqual(["entityC"]); // Unchanged
    expect(incident1Resp.body.data.incident.implicated_systems.map((e: any) => e.entity_id).sort()).toEqual(["entityA", "entityD"]); // Was ["entityB", "entityD"]

    const incident2Resp = await makeRequest(
      url,
      {
        query: `
          query {
            incident(filter: { incident_id: { EQ: 2 } }) {
              AllegedDeveloperOfAISystem { entity_id }
              AllegedHarmedOrNearlyHarmedParties { entity_id }
            }
          }
        `
      }
    );
    expect(incident2Resp.body.data.incident.AllegedDeveloperOfAISystem.map((e: any) => e.entity_id)).toEqual(["entityA"]); // Unchanged
    expect(incident2Resp.body.data.incident.AllegedHarmedOrNearlyHarmedParties.map((e: any) => e.entity_id)).toEqual(["entityA"]); // Was ["entityB"]

    // Verify submissions were updated

    const sub1Resp = await makeRequest(
      url,
      {
        query: `
          query {
            submission(filter: { _id: { EQ: "aaaaaaaaaaaaaaaaaaaaaaa1" } }) {
              developers { entity_id }
              harmed_parties { entity_id }
            }
          }
        `
      }
    );
    expect(sub1Resp.body.data.submission.developers.map((e: any) => e.entity_id)).toEqual(["entityA"]); // Was ["entityB"]
    expect(sub1Resp.body.data.submission.harmed_parties.map((e: any) => e.entity_id)).toEqual(["entityC"]); // Unchanged

    const sub2Resp = await makeRequest(
      url,
      {
        query: `
          query {
            submission(filter: { _id: { EQ: "aaaaaaaaaaaaaaaaaaaaaaa2" } }) {
              deployers { entity_id }
            }
          }
        `
      }
    );
    expect(sub2Resp.body.data.submission.deployers.map((e: any) => e.entity_id).sort()).toEqual(["entityA"]); // Was ["entityA", "entityB"] - should now only contain A once

    // Verify subscriptions were updated using direct DB check due to GraphQL query resolution issues

    const subscriptionsColl = getCollection('aiidprod', 'subscriptions');
    const updatedSubscr1 = await subscriptionsColl.findOne({ _id: new ObjectId("bbbbbbbbbbbbbbbbbbbbbbb1") });
    expect(updatedSubscr1?.entityId).toEqual("entityA"); // Was "entityB"

    // Verify duplicate record was added
    const duplicatesColl = getCollection('aiidprod', 'entity_duplicates');
    const dupRecord = await duplicatesColl.findOne({ duplicate_entity_id: "entityB" });
    expect(dupRecord?.duplicate_entity_id).toEqual("entityB");
    expect(dupRecord?.true_entity_id).toEqual("entityA");
  });

  it('findSimilarEntities returns correct pairs based on threshold', () => {
    const entities: Entity[] = [
      { entity_id: '1', name: 'Apple Inc' },
      { entity_id: '2', name: 'Apple Incorporated' },
      { entity_id: '3', name: 'Google LLC' },
      { entity_id: '4', name: 'Go ogle LLC' },
      { entity_id: '5', name: 'Tesla' }
    ];
    const result: SimilarEntityPair[] = findSimilarEntities(entities, 60);
    // Expect two high-similarity pairs
    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        {
          entityId1: '1',
          entityName1: 'Apple Inc',
          entityId2: '2',
          entityName2: 'Apple Incorporated',
          similarity: expect.any(Number),
        },
        {
          entityId1: '3',
          entityName1: 'Google LLC',
          entityId2: '4',
          entityName2: 'Go ogle LLC',
          similarity: expect.any(Number),
        },
      ])
    );
  });
});

describe(`Entity error handling`, () => {
  it('throws when merging an entity with itself', async () => {
    const client = new MongoClient(process.env.API_MONGODB_CONNECTION_STRING!);
    await client.connect();
    await expect(
      mergeEntities('entitySame', 'entitySame', 1, client)
    ).rejects.toThrow('Cannot merge an entity with itself.');
    await client.close();
  });

  it('throws when keepEntity value is invalid', async () => {
    const client = new MongoClient(process.env.API_MONGODB_CONNECTION_STRING!);
    await client.connect();
    await expect(
      mergeEntities('entityA', 'entityB', 3 as any, client)
    ).rejects.toThrow(
      'Invalid keepEntity value: 3 for entityId1: entityA and entityId2: entityB.'
    );
    await client.close();
  });
});
