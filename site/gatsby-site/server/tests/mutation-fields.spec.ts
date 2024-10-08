import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { pluralize, singularize } from "../utils";
import capitalize from 'lodash/capitalize';
import { makeRequest, seedFixture, startTestServer } from "./utils";
import * as context from '../context';

import quickaddsFixture from './fixtures/quickadds';
import reportsFixture from './fixtures/reports';
import entitiesFixture from './fixtures/entities';
import usersFixture from './fixtures/users';
import incidentsFixture from './fixtures/incidents';
import submissionsFixture from './fixtures/submissions';
import classificationsFixture from './fixtures/classifications';
import subscriptionsFixture from './fixtures/subscriptions';
import duplicatesFixture from './fixtures/duplicates';

const fixtures = [
    quickaddsFixture,
    reportsFixture,
    entitiesFixture,
    incidentsFixture,
    usersFixture,
    submissionsFixture,
    classificationsFixture,
    subscriptionsFixture,   
    duplicatesFixture,
]

fixtures.forEach((collection) => {

    const singularName = singularize(collection.name);
    const pluralName = pluralize(collection.name);

    const filterTypeName = `${capitalize(singularName)}FilterType`;
    const insertTypeName = `${capitalize(singularName)}InsertType`;
    const updateTypeName = `${capitalize(singularName)}UpdateType`;

    const insertOneFieldName = `insertOne${capitalize(singularName)}`;
    const insertManyFieldName = `insertMany${capitalize(pluralName)}`;

    const updateOneFieldName = `updateOne${capitalize(singularName)}`;
    const updateManyFieldName = `updateMany${capitalize(pluralName)}`;

    const deleteOneFieldName = `deleteOne${capitalize(singularName)}`;
    const deleteManyFieldName = `deleteMany${capitalize(pluralName)}`;

    const upsertOneFieldName = `upsertOne${capitalize(singularName)}`;

    describe(`${collection.name} generated mutation fields`, () => {
        let server: ApolloServer, url: string;

        beforeAll(async () => {
            ({ server, url } = await startTestServer());
        });

        afterAll(async () => {
            await server?.stop();
        });

        if (collection.testInsertOne !== null) {

            const testData = collection.testInsertOne!;

            it(`${insertOneFieldName} mutation`, async () => {

                const mutationData = {
                    query: `
                    mutation ($data: ${insertTypeName}!) {
                        ${insertOneFieldName}(data: $data) {
                            _id
                            ${collection.query}
                        }
                    }
                    `,
                    variables: {
                        data: testData.insert,
                    }
                };

                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);


                    expect(response.body.data[insertOneFieldName]).toMatchObject(testData.result)
                }


                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);


                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testInsertMany !== null) {

            const testData = collection.testInsertMany!;

            it(`${insertManyFieldName} mutation`, async () => {

                const mutationData = {
                    query: `
                mutation ($data: [${insertTypeName}]!) {
                    ${insertManyFieldName}(data: $data) {
                      insertedIds
                    }
                }
                `,
                    variables: { data: testData.insert }
                };


                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);

                    expect(response.body.data[insertManyFieldName]).toMatchObject(testData.result);
                }


                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);

                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testUpdateOne !== null) {

            const testData = collection.testUpdateOne!;

            it(`${updateOneFieldName} mutation`, async () => {

                const mutationData = {
                    query: `
                    mutation($filter: ${filterTypeName}!, $update: ${updateTypeName}!) {
                        ${updateOneFieldName} (filter: $filter, update: $update) {
                            _id
                            ${collection.query}
                        }
                    }
                `,
                    variables: {
                        "filter": testData.filter,
                        "update": testData.update,
                    },
                }

                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);


                    expect(response.body.data[updateOneFieldName]).toMatchObject(testData.result)
                }


                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);

                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testUpdateMany !== null) {

            const testData = collection.testUpdateMany!;

            it(`${updateManyFieldName} mutation`, async () => {

                const mutationData = {
                    query: `
                    mutation($filter: ${filterTypeName}!, $update: ${updateTypeName}!) {
                        ${updateManyFieldName}(filter: $filter, update: $update) {
                            modifiedCount
                            matchedCount
                        }
                    }
                `,
                    variables: {
                        "filter": testData.filter,
                        "update": testData.update,
                    }
                };


                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);


                    expect(response.body.data[updateManyFieldName]).toMatchObject(testData.result);
                }


                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);

                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testDeleteOne !== null) {

            const testData = collection.testDeleteOne!;

            it(`${deleteOneFieldName} mutation`, async () => {

                const mutationData = {
                    query: `
                        mutation Test($filter: ${filterTypeName}!) {
                            ${deleteOneFieldName}(filter: $filter) {
                              _id
                            }
                        }
                        `,
                    variables: { filter: testData.filter }
                };


                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);

                    expect(response.body.data[deleteOneFieldName]).toMatchObject(testData.result);
                }

                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);

                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testDeleteMany !== null) {

            const testData = collection.testDeleteMany!;

            it(`${deleteManyFieldName} mutation`, async () => {

                const mutationData = {
                    query: `
                    mutation Test($filter: ${filterTypeName}!) {
                        ${deleteManyFieldName}(filter: $filter) {
                        deletedCount
                        }
                    }
                    `,
                    variables: { filter: testData.filter }
                };


                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);


                    expect(response.body.data[deleteManyFieldName]).toMatchObject(testData.result);
                }


                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);

                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testUpsertOne !== null) {

            it(`${upsertOneFieldName} (update) - mutation`, async () => {

                const testData = collection.testUpsertOne!.shouldUpdate!;

                const mutationData = {
                    query: `
                    mutation($filter: ${filterTypeName}!, $update: ${insertTypeName}!) {
                        ${upsertOneFieldName} (filter: $filter, update: $update) {
                            _id
                            ${collection.query}
                        }
                    }
                `,
                    variables: {
                        "filter": testData.filter,
                        "update": testData.update,
                    },
                }

                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);


                    expect(response.body.data[upsertOneFieldName]).toMatchObject(testData.result)
                }


                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);

                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });


            it(`${upsertOneFieldName} (insert) - mutation`, async () => {

                const testData = collection.testUpsertOne!.shouldInsert!;

                const mutationData = {
                    query: `
                    mutation($filter: ${filterTypeName}!, $update: ${insertTypeName}!) {
                        ${upsertOneFieldName} (filter: $filter, update: $update) {
                            _id
                            ${collection.query}
                        }
                    }
                `,
                    variables: {
                        "filter": testData.filter,
                        "update": testData.update,
                    },
                }

                for (const user of testData.allowed) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);


                    expect(response.body.data[upsertOneFieldName]).toMatchObject(testData.result)
                }


                for (const user of testData.denied) {

                    await seedFixture(collection.seeds);

                    jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: user.userId })

                    const response = await makeRequest(url, mutationData);

                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

    });
});