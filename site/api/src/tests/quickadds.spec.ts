import { ApolloServer } from "@apollo/server";
import request from 'supertest';
import { seedCollection, startTestServer } from "./utils";

describe('Quickadds', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`quickadds`, async () => {

        await seedCollection({
            name: 'quickadd', docs: [
                {
                    "_id": "5f5f3a0c8e4b6b001f0d1d1d",
                    "date_submitted": "2020-09-14T00:00:00.000Z",
                    "incident_id": "5f5f3a0c8e4b6b001f0d1d1d",
                    "source_domain": "example.com",
                    "url": "http://example.com"
                }
            ]
        })

        const queryData = {
            query: `
            query ($query: QuickaddQueryInput!) {
                quickadds(query: $query) {
                  __typename
                  _id
                  date_submitted
                  incident_id
                  source_domain
                  url
                }
            }
            `,
            variables: { query: {} },
        };

        const response = await request(url).post('/').send(queryData);


        expect(response.statusCode).toBe(400);
    });
});