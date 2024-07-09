import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { pluralize, singularize } from "../utils";
import capitalize from 'lodash/capitalize';
import { makeRequest, seedFixture, seedUsers, startTestServer } from "./utils";
import * as context from '../context';

import quickaddsFixture from './fixtures/quickadds';
import reportsFixture from './fixtures/reports';
import entitiesFixture from './fixtures/entities';

const fixtures = [
    quickaddsFixture,
    reportsFixture,
    entitiesFixture,
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

                await seedFixture(collection.seeds);

                await seedUsers([{ userId: 'user1', roles: collection.roles.insertOne }])

                jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })

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


                const response = await makeRequest(url, mutationData);

                expect(response.body.data[insertOneFieldName]).toMatchObject(testData.result)


                if (collection.roles.insertOne?.length) {

                    await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                    const response = await makeRequest(url, mutationData);
                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testInsertMany !== null) {

            const testData = collection.testInsertMany!;

            it(`${insertManyFieldName} mutation`, async () => {

                await seedFixture(collection.seeds);

                await seedUsers([{ userId: 'user1', roles: collection.roles.insertMany }])

                jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })

                const mutationData = {
                    query: `
                mutation ($data: [${insertTypeName}!]) {
                    ${insertManyFieldName}(data: $data) {
                      insertedIds
                    }
    
                }
                `,
                    variables: { data: testData.insert }
                };

                const response = await makeRequest(url, mutationData);

                expect(response.body.data[insertManyFieldName]).toMatchObject(testData.result);


                if (collection.roles.insertMany?.length) {

                    await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                    const response = await makeRequest(url, mutationData);
                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testUpdateOne !== null) {

            const testData = collection.testUpdateOne!;

            it(`${updateOneFieldName} mutation`, async () => {

                await seedFixture(collection.seeds);

                await seedUsers([{ userId: 'user1', roles: collection.roles.updateOne }])

                jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })

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
                        "update": { set: testData.set },
                    },
                }

                const response = await makeRequest(url, mutationData);

                expect(response.body.data[updateOneFieldName]).toMatchObject(testData.result)
                expect(response.statusCode).toBe(200);


                if (collection.roles.updateOne?.length && !collection.roles.updateOne.includes('self')) {

                    await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                    const response = await makeRequest(url, mutationData);
                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testUpdateMany !== null) {

            const testData = collection.testUpdateMany!;

            it(`${updateManyFieldName} mutation`, async () => {

                await seedFixture(collection.seeds);

                await seedUsers([{ userId: 'user1', roles: collection.roles.updateMany }])

                jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })


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
                        "update": { "set": testData.set }
                    }
                };

                const response = await makeRequest(url, mutationData);

                expect(response.body.data[updateManyFieldName]).toMatchObject(testData.result);
                expect(response.statusCode).toBe(200);


                if (collection.roles.updateMany?.length) {

                    await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                    const response = await makeRequest(url, mutationData);
                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testDeleteOne !== null) {

            const testData = collection.testDeleteOne!;

            it(`${deleteOneFieldName} mutation`, async () => {

                await seedFixture(collection.seeds);

                await seedUsers([{ userId: 'user1', roles: collection.roles.deleteOne }])

                jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })


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

                const response = await makeRequest(url, mutationData);

                expect(response.body.data[deleteOneFieldName]).toMatchObject(testData.result);

                if (collection.roles.deleteOne?.length) {

                    await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                    const response = await makeRequest(url, mutationData);
                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }

        if (collection.testDeleteMany !== null) {

            const testData = collection.testDeleteMany!;

            it(`${deleteManyFieldName} mutation`, async () => {

                await seedFixture(collection.seeds);

                await seedUsers([{ userId: 'user1', roles: collection.roles.deleteOne }])

                jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: 'user1' })


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

                const response = await makeRequest(url, mutationData);

                expect(response.body.data[deleteManyFieldName]).toMatchObject(testData.result);


                if (collection.roles.deleteMany?.length) {

                    await seedUsers([{ userId: 'user1', roles: ['invalid'] }])

                    const response = await makeRequest(url, mutationData);
                    expect(response.body.errors[0].message).toBe('not authorized');
                }
            });
        }
    });
});