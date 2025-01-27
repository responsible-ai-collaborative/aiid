import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, seedFixture, startTestServer } from "./utils";
import * as context from '../context';

describe(`Entities`, () => {
  let server: ApolloServer, url: string;

  beforeAll(async () => {
    ({ server, url } = await startTestServer());
  });

  afterAll(async () => {
    await server?.stop();
  });


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


    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })

    const response = await makeRequest(url, mutationData);

    expect(response.body.data).toMatchObject({
      updateEntityAndRelationships: {
        entity_id: "entity1",
        name: "Entity 1"
      }
    })
  });
});
