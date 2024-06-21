import { ApolloServer } from "@apollo/server";
import request from 'supertest';
import { makeRequest, seedCollection, seedUsers, startTestServer } from "./utils";
import { pluralize, singularize } from "../utils";
import capitalize from 'lodash/capitalize';
import quickaddsFixture from './fixtures/quickadds';
import * as context from '../context';

const fixtures = [
    quickaddsFixture,
]

fixtures.forEach((collection) => {

    const singularName = singularize(collection.name);
    const pluralName = pluralize(collection.name);

    const filterTypeName = `${capitalize(singularName)}FilterType`;
    const sortTypeName = `${capitalize(singularName)}SortType`;

    describe(`${collection.name} - generated query fields`, () => {
        let server: ApolloServer, url: string;

        beforeAll(async () => {
            ({ server, url } = await startTestServer());
        });

        afterAll(async () => {
            await server?.stop();
        });

        it(`${singularName} query`, async () => {

            await seedCollection({ name: collection.name, docs: collection.testDocs })

            await seedUsers([{ userId: 'user1', roles: collection.roles.singular }])

            jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })


            const queryData = {
                query: `
                query ($filter: ${filterTypeName}!) {
                    ${singularName} (filter: $filter) {
                      _id
                      ${collection.query}
                    }
                }
                `,
                variables: { filter: collection.testSingular.filter },
            };

            const response = await makeRequest(url, queryData);

            expect(response.body.data[singularName]).toMatchObject(collection.testSingular.result);


            if (collection.roles.singular.length) {

                await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                const response = await makeRequest(url, queryData);

                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });

        it(`${pluralName} query with filter`, async () => {

            await seedCollection({ name: collection.name, docs: collection.testDocs });

            await seedUsers([{ userId: 'user1', roles: collection.roles.plural }])

            jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })


            const selected = collection.testDocs[1];

            const queryData = {
                query: `
                query ($filter: ${filterTypeName}!) {
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


            if (collection.roles.plural.length) {

                await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                const response = await makeRequest(url, queryData);

                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });

        it(`${pluralName} query with sort`, async () => {

            await seedCollection({ name: collection.name, docs: collection.testDocs });

            await seedUsers([{ userId: 'user1', roles: collection.roles.plural }])

            jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })


            const queryData = {
                query: `
                    query ($sort: ${sortTypeName}!) {
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


            if (collection.roles.plural.length) {

                await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                const response = await makeRequest(url, queryData);

                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });

        it(`${pluralName} query with pagination`, async () => {

            await seedCollection({ name: collection.name, docs: collection.testDocs });

            const queryData = {
                query: `
                    query ($pagination: PaginationType, $sort: ${sortTypeName}!) {
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


            if (collection.roles.plural.length) {

                await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                const response = await makeRequest(url, queryData);

                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });
    });
})
