import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, seedFixture, startTestServer } from "./utils";
import * as context from '../context';

describe(`Checklists`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`Query`, async () => {
        const mutationData = {
            query: `
              query {
                checklists {
                  name
                }
              }
            `,
            variables: { tags: ["GMF:Known AI Technology:Transformer"] }
        };

        await seedFixture({
            aiidprod: {
                checklists: [
                    {
                        id: "849bd303-261f-4abe-8746-77dad5841dbe"
                    }
                ]
            },
            customData: {
                users: [
                    {
                        userId: "123",
                        roles: ['admin'],
                    }
                ],
            },
        });


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })

        const response = await makeRequest(url, mutationData);

        console.log(JSON.stringify(response.body.data, null, 2));

        expect(response.body.errors).toBe(undefined);
    });

});
