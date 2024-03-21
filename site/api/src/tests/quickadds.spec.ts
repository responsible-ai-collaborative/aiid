import { ApolloServer } from "@apollo/server";
import request from 'supertest';
import { seedCollection, startTestServer } from "./utils";
import { ObjectId } from "mongodb";

describe('Quickadds', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`quickadds default query`, async () => {

        await seedCollection({
            name: 'quickadd', docs: [
                {
                    "date_submitted": "2020-09-14T00:00:00.000Z",
                    "incident_id": 1,
                    "source_domain": "example.com",
                    "url": "http://example.com"
                }
            ]
        })

        const queryData = {
            query: `
            query {
                quickadds {
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

        expect(response.statusCode).toBe(200);

        expect(response.body.data.quickadds.length).toBe(1);

        const [quickadd] = response.body.data.quickadds;

        expect(quickadd.incident_id).toBe(1);
        expect(quickadd.source_domain).toBe('example.com');
        expect(quickadd.url).toBe('http://example.com');
        expect(quickadd._id).toMatch(/^[0-9a-fA-F]{24}$/);
    });

    it(`quickadds query with incident_id filter`, async () => {

        await seedCollection({
            name: 'quickadd', docs: [
                {
                    _id: new ObjectId('5f5f3e3e3e3e3e3e3e3e3e3e'),
                    date_submitted: "2020-09-14T00:00:00.000Z",
                    incident_id: 1,
                    source_domain: "example1.com",
                    url: "http://example1.com"
                },
                {
                    _id: new ObjectId('5f5f3e3e3e3e3e3e3e3e3e3f'),
                    date_submitted: "2020-09-14T00:00:00.000Z",
                    incident_id: 2,
                    source_domain: "example2.com",
                    url: "http://example2.com"
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
            variables: { query: { _id: '5f5f3e3e3e3e3e3e3e3e3e3f' } },
        };

        const response = await request(url).post('/').send(queryData);

        expect(response.statusCode).toBe(200);

        expect(response.body.data.quickadds.length).toBe(1);

        const [quickadd] = response.body.data.quickadds;

        expect(quickadd.incident_id).toBe(2);
        expect(quickadd.source_domain).toBe('example2.com');
        expect(quickadd.url).toBe('http://example2.com');
        expect(quickadd._id).toMatch(/^[0-9a-fA-F]{24}$/);
    });
});