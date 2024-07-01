import { ApolloServer } from "@apollo/server";
import request from 'supertest';
import { makeRequest, seedFixture, seedUsers, startTestServer } from "./utils";
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

            await seedFixture(collection.seeds);

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

            await seedFixture(collection.seeds);

            await seedUsers([{ userId: 'user1', roles: collection.roles.plural }])

            jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })

            const queryData = {
                query: `
                query ($filter: ${filterTypeName}!) {
                    ${pluralName} (filter: $filter) {
                      _id
                      ${collection.query}
                    }
                }
                `,
                variables: { filter: collection.testPluralFilter.filter },
            };

            const response = await request(url).post('/').send(queryData);

            expect(response.body.data[pluralName]).toMatchObject(collection.testPluralFilter.result);


            if (collection.roles.plural.length) {

                await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                const response = await makeRequest(url, queryData);

                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });

        it(`${pluralName} query with sort`, async () => {

            await seedFixture(collection.seeds);

            await seedUsers([{ userId: 'user1', roles: collection.roles.plural }])

            jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })


            const queryData = {
                query: `
                    query ($sort: ${sortTypeName}!) {
                        ${pluralName} (sort: $sort) {
                            _id
                            ${collection.query}
                        }
                    }
                    `,
                variables: { sort: collection.testPluralSort.sort },
            };

            const response = await request(url).post('/').send(queryData);

            expect(response.body.data[pluralName]).toMatchObject(collection.testPluralSort.result);


            if (collection.roles.plural.length) {

                await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                const response = await makeRequest(url, queryData);

                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });

        it(`${pluralName} query with pagination`, async () => {

            await seedFixture(collection.seeds);

            const queryData = {
                query: `
                    query ($pagination: PaginationType, $sort: ${sortTypeName}!) {
                        ${pluralName} (pagination: $pagination, sort: $sort) {
                            _id
                            ${collection.query}
                        }
                    }
                    `,
                variables: { pagination: collection.testPluralPagination.pagination, sort: collection.testPluralPagination.sort }
            };

            const response = await request(url).post('/').send(queryData);

            expect(response.body.data[pluralName]).toHaveLength(collection.testPluralPagination.result.length);
            expect(response.body.data[pluralName]).toMatchObject(collection.testPluralPagination.result);


            if (collection.roles.plural.length) {

                await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                const response = await makeRequest(url, queryData);

                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });
    });
})
