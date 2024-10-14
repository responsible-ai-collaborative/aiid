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
                query($tags: [String]) {
                  risks(input: { tags: $tags }) {
                    title
                    tags
                  }
                }
            `,
            variables: { tags: ["GMF:Known AI Technology:Transformer"] }
        };

        await seedFixture({
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

        //console.log(`response`, response);

        expect(response.body.errors).toBe(undefined);
//        expect(response.body.errors).toMatchObject([{
//            "extensions": {
//                "code": "INTERNAL_SERVER_ERROR",
//            },
//            "message": "Invalid linked ids: AllegedDeployerOfAISystem -> [entity-1]",
//            "path": [
//                "insertOneIncident",
//            ],
//        }]);
    });

});
