import { ApolloServer } from "@apollo/server";
import { makeRequest, seedFixture, startTestServer } from "./utils";
import { pluralize, singularize } from "../utils";
import capitalize from 'lodash/capitalize';

import quickaddsFixture from './fixtures/quickadds';
import reportsFixture from './fixtures/reports';
import entitiesFixture from './fixtures/entities';
import incidentsFixture from './fixtures/incidents';
import usersFixture from './fixtures/users';
import submissionsFixture from './fixtures/submissions';
import classificationsFixture from './fixtures/classifications';

import * as context from '../context';

const fixtures = [
    quickaddsFixture,
    reportsFixture,
    entitiesFixture,
    incidentsFixture,
    usersFixture,
    submissionsFixture,
    classificationsFixture,
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

        if (collection.testSingular) {

            const testData = collection.testSingular!;

            const queryData = {
                query: `
                query ($filter: ${filterTypeName}!) {
                    ${singularName} (filter: $filter) {
                      _id
                      ${collection.query}
                    }
                }
                `,
                variables: { filter: testData.filter },
            };

            it(`${singularName} query`, async () => {

                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, queryData);

                    expect(response.body.data[singularName]).toMatchObject(testData.result);
                }


                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, queryData);

                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testPluralFilter) {

            const testData = collection.testPluralFilter!;

            it(`${pluralName} query with filter`, async () => {

                const queryData = {
                    query: `
                    query ($filter: ${filterTypeName}!) {
                        ${pluralName} (filter: $filter) {
                        _id
                        ${collection.query}
                        }
                    }
                `,
                    variables: { filter: testData.filter },
                };

                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, queryData);


                    expect(response.body.data[pluralName]).toMatchObject(testData.result);
                }


                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, queryData);


                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testPluralSort) {

            const testData = collection.testPluralSort!;

            it(`${pluralName} query with sort`, async () => {

                const queryData = {
                    query: `
                    query ($sort: ${sortTypeName}!) {
                        ${pluralName} (sort: $sort) {
                            _id
                            ${collection.query}
                        }
                    }
                    `,
                    variables: { sort: testData.sort },
                };


                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, queryData);


                    expect(response.body.data[pluralName]).toMatchObject(testData.result);
                }

                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, queryData);


                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testPluralPagination) {

            const testData = collection.testPluralPagination!;

            it(`${pluralName} query with pagination`, async () => {

                const queryData = {
                    query: `
                    query ($pagination: PaginationType, $sort: ${sortTypeName}!) {
                        ${pluralName} (pagination: $pagination, sort: $sort) {
                            _id
                            ${collection.query}
                        }
                    }
                    `,
                    variables: { pagination: testData.pagination, sort: testData.sort }
                };


                for (const user of testData.allowed) {
                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, queryData);


                    expect(response.body.data[pluralName]).toHaveLength(testData.result.length);
                    expect(response.body.data[pluralName]).toMatchObject(testData.result);
                }


                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, queryData);

                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }
    });
})
