import { ApolloServer } from "@apollo/server";
import request from 'supertest';
import { login, readCollection, seedCollection, startTestServer } from "./utils";
import { ObjectId } from "mongodb";
import config from "../config";

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
            query ($filter: QuickaddFilterType!) {
                quickadds(filter: $filter) {
                  _id
                  date_submitted
                  incident_id
                  source_domain
                  url
                }
            }
            `,
            variables: { filter: { _id: { EQ: '5f5f3e3e3e3e3e3e3e3e3e3f' } } },
        };

        const response = await request(url).post('/').send(queryData);


        expect(response.body.data.quickadds.length).toBe(1);

        const [quickadd] = response.body.data.quickadds;

        expect(quickadd.incident_id).toBe(2);
        expect(quickadd.source_domain).toBe('example2.com');
        expect(quickadd.url).toBe('http://example2.com');
        expect(quickadd._id).toMatch(/^[0-9a-fA-F]{24}$/);
    });

    it(`deleteManyQuickadds mutation throws if missing roles`, async () => {

        const mutationData = {
            query: `
            mutation {
                deleteManyQuickadds(filter: { _id: { EQ: "5f5f3e3e3e3e3e3e3e3e3e3f" } }) {
                  deletedCount
                }
            }
            `,
        };

        const response = await request(url).post('/').send(mutationData);

        expect(response.body.errors[0].message).toBe('not authorized');

        expect(response.body.errors.length).toBe(1);

        expect(response.statusCode).toBe(200);
    });

    it(`deleteOneQuickadd mutation`, async () => {

        const authData = await login(config.E2E_ADMIN_USERNAME!, config.E2E_ADMIN_PASSWORD!);

        await seedCollection({
            name: 'quickadd',
            docs: [
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
        });

        await seedCollection({
            name: 'users',
            database: 'customData',
            docs: [
                {
                    userId: authData.user_id,
                    roles: ['admin']
                }
            ]
        });

        const mutationData = {
            query: `
            mutation {
                deleteOneQuickadd(filter: { _id: { EQ: "5f5f3e3e3e3e3e3e3e3e3e3e" } }) {
                  _id
                }
            }
            `,
        };

        const response = await request(url)
            .post('/')
            .set('Authorization', `Bearer ${authData.access_token}`)
            .send(mutationData)

        expect(response.body.data).toMatchObject({
            deleteOneQuickadd: {
                _id: "5f5f3e3e3e3e3e3e3e3e3e3e",
            }
        });

        const quickadds = await readCollection({ name: 'quickadd' });

        expect(quickadds.length).toBe(1);
    });

    it(`deleteManyQuickadds mutation`, async () => {

        const authData = await login(config.E2E_ADMIN_USERNAME!, config.E2E_ADMIN_PASSWORD!);

        await seedCollection({
            name: 'quickadd',
            docs: [
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
        });

        await seedCollection({
            name: 'users',
            database: 'customData',
            docs: [
                {
                    userId: authData.user_id,
                    roles: ['admin']
                }
            ]
        });

        const mutationData = {
            query: `
            mutation {
                deleteManyQuickadds(filter: {}) {
                  deletedCount
                }
            }
            `,
        };

        const response = await request(url)
            .post('/')
            .set('Authorization', `Bearer ${authData.access_token}`)
            .send(mutationData)

        expect(response.body.data).toMatchObject({
            deleteManyQuickadds: {
                deletedCount: 2
            }
        });

        const quickadds = await readCollection({ name: 'quickadd' });

        expect(quickadds.length).toBe(0);

    });

    it(`insertOneQuickadd mutation`, async () => {

        await seedCollection({
            name: 'quickadd',
            docs: []
        });

        const mutationData = {
            query: `
            mutation Test($data: QuickaddInsertType!) {
                insertOneQuickadd(data: $data) {
                  _id
                  date_submitted
                  incident_id
                  source_domain
                  url
                }
            }
            `,
            variables: {
                data: {
                    date_submitted: "2020-09-14T00:00:00.000Z",
                    incident_id: 1,
                    source_domain: "example.com",
                    url: "http://example.com"
                }
            }
        };

        const response = await request(url)
            .post('/')
            .send(mutationData);

        expect(response.body.data.insertOneQuickadd).toMatchObject({
            date_submitted: '2020-09-14T00:00:00.000Z',
            incident_id: 1,
            source_domain: 'example.com',
            url: 'http://example.com'
        })

        expect(response.statusCode).toBe(200);


        const quickadds = await readCollection({ name: 'quickadd' });

        expect(quickadds.length).toBe(1);
    });

    it(`insertManyQuickadd mutation`, async () => {

        const authData = await login(config.E2E_ADMIN_USERNAME!, config.E2E_ADMIN_PASSWORD!);

        await seedCollection({
            name: 'quickadd',
            docs: []
        });

        await seedCollection({
            name: 'users',
            database: 'customData',
            docs: [
                {
                    userId: authData.user_id,
                    roles: ['admin']
                }
            ]
        });

        const mutationData = {
            query: `
            mutation Test($data: [QuickaddInsertType!]) {
                insertManyQuickadds(data: $data) {
                  insertedIds
                }
            }
            `,
            variables: {
                data: [
                    {
                        _id: "664bdd9342edb1903a9e4764",
                        date_submitted: "2020-09-14T00:00:00.000Z",
                        incident_id: 1,
                        source_domain: "example.com",
                        url: "http://example.com"
                    },
                    {
                        _id: "664bdd9342edb1903a9e4765",
                        date_submitted: "2020-09-14T00:00:00.000Z",
                        incident_id: 2,
                        source_domain: "example2.com",
                        url: "http://example2.com"
                    },
                ]
            }
        };

        const response = await request(url)
            .post('/')
            .set('Authorization', `Bearer ${authData.access_token}`)
            .send(mutationData);

        expect(response.body.data.insertManyQuickadds).toEqual({
            insertedIds: [
                "664bdd9342edb1903a9e4764",
                "664bdd9342edb1903a9e4765",
            ],
        })

        expect(response.statusCode).toBe(200);


        const quickadds = await readCollection({ name: 'quickadd' });

        expect(quickadds.length).toBe(2);
    });

    it(`updateOneQuickadd mutation`, async () => {

        const authData = await login(config.E2E_ADMIN_USERNAME!, config.E2E_ADMIN_PASSWORD!);

        await seedCollection({
            name: 'quickadd',
            docs: [
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
        });

        await seedCollection({
            name: 'users',
            database: 'customData',
            docs: [
                {
                    userId: authData.user_id,
                    roles: ['admin']
                }
            ]
        });

        const mutationData = {
            query: `
            mutation($filter: QuickaddFilterType!, $update: QuickaddUpdateType!) {
                updateOneQuickadd(filter: $filter, update: $update) {
                    url
                }
            }
            `,
            variables: {
                "filter": {
                    "_id": { EQ: '5f5f3e3e3e3e3e3e3e3e3e3f' },
                },
                "update": {
                    "set": {
                        "url": "https://edited.com"
                    }
                }
            }
        };

        const response = await request(url)
            .post('/')
            .set('Authorization', `Bearer ${authData.access_token}`)
            .send(mutationData);

        expect(response.body.data.updateOneQuickadd).toMatchObject({
            url: 'https://edited.com'
        })

        expect(response.statusCode).toBe(200);


        const quickadds = await readCollection({ name: 'quickadd' });

        expect(quickadds.length).toBe(2);
    });

    it(`updateManyQuickadds mutation`, async () => {

        const authData = await login(config.E2E_ADMIN_USERNAME!, config.E2E_ADMIN_PASSWORD!);

        await seedCollection({
            name: 'quickadd',
            docs: [
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
                    incident_id: 1,
                    source_domain: "example2.com",
                    url: "http://example2.com"
                },
                {
                    _id: new ObjectId('5f5f3e3e3e3e3e3e3e3e3e33'),
                    date_submitted: "2020-09-14T00:00:00.000Z",
                    incident_id: 2,
                    source_domain: "example3.com",
                    url: "http://shouldbeignored.com"
                },
            ],

        });

        await seedCollection({
            name: 'users',
            database: 'customData',
            docs: [
                {
                    userId: authData.user_id,
                    roles: ['admin']
                }
            ]
        });

        const mutationData = {
            query: `
            mutation($filter: QuickaddFilterType!, $update: QuickaddUpdateType!) {
                updateManyQuickadds(filter: $filter, update: $update) {
                    modifiedCount
                    matchedCount
                }
            }
            `,
            variables: {
                "filter": {
                    "incident_id": { EQ: 1 },
                },
                "update": {
                    "set": {
                        "url": "https://edited.com"
                    }
                }
            }
        };

        const response = await request(url)
            .post('/')
            .set('Authorization', `Bearer ${authData.access_token}`)
            .send(mutationData);

        expect(response.body.data.updateManyQuickadds).toMatchObject({
            modifiedCount: 2,
            matchedCount: 2
        })

        expect(response.statusCode).toBe(200);


        const quickadds = await readCollection({ name: 'quickadd' });

        expect(quickadds.length).toBe(3);
    });
});