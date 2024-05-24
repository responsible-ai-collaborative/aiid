import { ApolloServer } from "@apollo/server";
import request from 'supertest';
import { login, makeRequest, readCollection, seedCollection, startTestServer } from "./utils";
import { ObjectId } from "mongodb";
import config from "../config";
import { pluralize, singularize } from "../utils";
import capitalize from 'lodash/capitalize';

const collections = [{
    name: 'quickadd',
    fields: [
        'date_submitted',
        'incident_id',
        'source_domain',
        'url',
    ],
    testUpdateOne:
    {
        url: 'https://edited.com',
    },
    testUpdateMany: {
        filter: { incident_id: { EQ: 2 } },
        set: { url: 'https://edited.com' },
    },
    testInsertOne:
    {
        date_submitted: "2020-09-14T00:00:00.000Z",
        incident_id: 1,
        source_domain: "example.com",
        url: "http://example.com"
    },
    testInsertMany: [
        {
            date_submitted: "2020-09-14T00:00:00.000Z",
            incident_id: 1,
            source_domain: "example.com",
            url: "http://example.com"
        },
        {
            date_submitted: "2020-09-14T00:00:00.000Z",
            incident_id: 2,
            source_domain: "example2.com",
            url: "http://example2.com"
        }
    ],
    testDocs: [
        {
            _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
            "date_submitted": "2020-09-14T00:00:00.000Z",
            "incident_id": 1,
            "source_domain": "example.com",
            "url": "http://example.com"
        },
        {
            _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
            date_submitted: "2020-09-14T00:00:00.000Z",
            incident_id: 2,
            source_domain: "example2.com",
            url: "http://example2.com"
        },
        {
            _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
            date_submitted: "2021-09-14T00:00:00.000Z",
            incident_id: 2,
            source_domain: "example3.com",
            url: "http://example3.com"
        },
        {
            _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e7'),
            date_submitted: "2021-09-14T00:00:00.000Z",
            incident_id: 2,
            source_domain: "example4.com",
            url: "http://example4.com"
        },
        {
            _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e8'),
            date_submitted: "2024-09-14T00:00:00.000Z",
            incident_id: 3,
            source_domain: "example5.com",
            url: "http://example5.com"
        },
    ],
    permissions: {
        insertOne: [],
        insertMany: ['admin'],
        updateOne: ['admin'],
        updateMany: ['admin'],
        deleteOne: ['admin'],
        deleteMany: ['admin'],
    }
}]

const collection = collections[0];
const singularName = singularize(collection.name);
const pluralName = pluralize(collection.name);
const filterName = `${capitalize(singularName)}FilterType`;
const insertName = `${capitalize(singularName)}InsertType`;
const updateName = `${capitalize(singularName)}UpdateType`;

const insertOneName = `insertOne${capitalize(singularName)}`;
const insertManyName = `insertMany${capitalize(pluralName)}`;

const updateOneName = `updateOne${capitalize(singularName)}`;
const updateManyName = `updateMany${capitalize(pluralName)}`;

describe('Generated mutation fields', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`${insertOneName} mutation`, async () => {

        await seedCollection({
            name: collection.name,
            docs: []
        });

        const mutationData = {
            query: `
            mutation ($data: ${insertName}!) {
                insertOne${capitalize(singularName)}(data: $data) {
                  _id
                  ${collection.fields.join('\n')}
                }
            }
            `,
            variables: {
                data: collection.testInsertOne,
            }
        };


        const response = await makeRequest(url, mutationData, collection.permissions.insertOne);

        expect(response.body.data[insertOneName]).toMatchObject(collection.testInsertOne)
        expect(response.statusCode).toBe(200);

        const list = await readCollection({ name: collection.name });

        expect(list.length).toBe(1);
    });

    it(`${insertManyName} mutation`, async () => {

        await seedCollection({ name: collection.name, docs: [] });

        const mutationData = {
            query: `
            mutation ($data: [${insertName}!]) {
                ${insertManyName}(data: $data) {
                  insertedIds
                }
            }
            `,
            variables: { data: collection.testInsertMany }
        };

        const response = await makeRequest(url, mutationData, collection.permissions.insertMany);

        expect(response.body.data[insertManyName].insertedIds.length).toEqual(collection.testInsertMany.length);
        expect(response.statusCode).toBe(200);
    });

    it(`${updateOneName} mutation`, async () => {

        await seedCollection({ name: collection.name, docs: collection.testDocs });

        const mutationData = {
            query: `
            mutation($filter: ${filterName}!, $update: ${updateName}!) {
                ${updateOneName} (filter: $filter, update: $update) {
                    url
                }
            }
            `,
            variables: {
                "filter": { "_id": { EQ: collection.testDocs[0]._id }, },
                "update": { set: collection.testUpdateOne },
            },
        }

        const response = await makeRequest(url, mutationData, collection.permissions.updateOne);

        expect(response.body.data[updateOneName]).toMatchObject({ url: 'https://edited.com' })
        expect(response.statusCode).toBe(200);


        const quickadds = await readCollection({ name: 'quickadd' });

        expect(quickadds.length).toBe(collection.testDocs.length);
    });

    it(`${updateManyName} mutation`, async () => {

        await seedCollection({ name: collection.name, docs: collection.testDocs });

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
                "filter": collection.testUpdateMany.filter,
                "update": { "set": collection.testUpdateMany.set }
            }
        };

        const response = await makeRequest(url, mutationData, collection.permissions.updateMany);

        expect(response.body.data[updateManyName]).toMatchObject({
            modifiedCount: 3,
            matchedCount: 3
        })

        expect(response.statusCode).toBe(200);


        const quickadds = await readCollection({ name: collection.name });

        expect(quickadds.length).toBe(5);
    });
});