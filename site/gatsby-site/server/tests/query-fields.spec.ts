import { ApolloServer } from "@apollo/server";
import request from 'supertest';
import { seedCollection, startTestServer } from "./utils";
import { ObjectId } from "mongodb";
import { pluralize, singularize } from "../utils";
import capitalize from 'lodash/capitalize';

const collections = [{
    name: 'quickadd',
    fields: [
        'date_submitted',
        'incident_id',
        'source_domain',
        'url   ',
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
    ]
}]

const collection = collections[0];
const singularName = singularize(collection.name);
const pluralName = pluralize(collection.name);
const filterName = `${capitalize(singularName)}FilterType`;
const sortName = `${capitalize(singularName)}SortType`;

describe('Generated query fields', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`singular query`, async () => {

        await seedCollection({
            name: collection.name, docs: collection.testDocs
        })

        const [selected] = collection.testDocs;

        const queryData = {
            query: `
            query ($filter: ${filterName}!) {
                ${singularName} (filter: $filter) {
                  _id
                  ${collection.fields.join('\n')}
                }
            }
            `,
            variables: { filter: { _id: { EQ: selected._id } } },
        };

        const response = await request(url).post('/').send(queryData);

        expect(response.body.data[singularName]).toMatchObject({ ...selected, _id: selected._id.toHexString() });
    });

    it(`plural query with filter`, async () => {

        await seedCollection({ name: collection.name, docs: collection.testDocs });

        const selected = collection.testDocs[1];

        const queryData = {
            query: `
            query ($filter: ${filterName}!) {
                ${pluralName} (filter: $filter) {
                  _id
                  ${collection.fields.join('\n')}
                }
            }
            `,
            variables: { filter: { _id: { EQ: selected._id } } },
        };

        const response = await request(url).post('/').send(queryData);

        expect(response.body.data[pluralName].length).toBe(1);
        expect(response.body.data[pluralName][0]).toMatchObject({ ...selected, _id: selected._id.toHexString() });
    });

    it(`plural query with sort`, async () => {

        await seedCollection({ name: collection.name, docs: collection.testDocs });

        const queryData = {
            query: `
                query ($sort: ${sortName}!) {
                    ${pluralName} (sort: $sort) {
                        _id
                        ${collection.fields.join('\n')}
                    }
                }
                `,
            variables: { sort: { "date_submitted": "DESC" } },
        };

        const response = await request(url).post('/').send(queryData);

        expect(response.body.data[pluralName].length).toBe(collection.testDocs.length);
        expect(response.body.data[pluralName][0]).toMatchObject({
            ...collection.testDocs[collection.testDocs.length - 1],
            _id: collection.testDocs[collection.testDocs.length - 1]._id.toHexString()
        });
    });

    it(`plural query with pagination`, async () => {

        await seedCollection({ name: collection.name, docs: collection.testDocs });

        const queryData = {
            query: `
                query ($pagination: PaginationType, $sort: ${sortName}!) {
                    ${pluralName} (pagination: $pagination, sort: $sort) {
                        _id
                        ${collection.fields.join('\n')}
                    }
                }
                `,
            variables: { pagination: { skip: 2, limit: 2, }, sort: { _id: "ASC" } }
        };

        const response = await request(url).post('/').send(queryData);

        expect(response.body.data[pluralName].length).toBe(2);
        expect(response.body.data[pluralName][0]).toMatchObject({
            ...collection.testDocs[2],
            _id: collection.testDocs[2]._id.toHexString()
        });
        expect(response.body.data[pluralName][1]).toMatchObject({
            ...collection.testDocs[3],
            _id: collection.testDocs[3]._id.toHexString()
        });
    });
});