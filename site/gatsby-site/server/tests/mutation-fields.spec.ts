import { ApolloServer } from "@apollo/server";
import { makeRequest, seedCollection, startTestServer } from "./utils";
import { pluralize, singularize } from "../utils";
import capitalize from 'lodash/capitalize';
import quickaddsFixture from './fixtures/quickadds';

const fixtures = [
    quickaddsFixture,
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

    describe(`${collection.name} - generated mutation fields`, () => {
        let server: ApolloServer, url: string;

        beforeAll(async () => {
            ({ server, url } = await startTestServer());
        });

        afterAll(async () => {
            await server?.stop();
        });

        it(`${insertOneFieldName} mutation`, async () => {

            await seedCollection({
                name: collection.name,
                docs: []
            });

            const mutationData = {
                query: `
            mutation ($data: ${insertTypeName}!) {
                ${insertOneFieldName}(data: $data) {
                  _id
                  ${collection.fields.join('\n')}
                }
            }
            `,
                variables: {
                    data: collection.testInsertOne.insert,
                }
            };


            const response = await makeRequest(url, mutationData, collection.roles.insertOne);

            expect(response.body.data[insertOneFieldName]).toMatchObject(collection.testInsertOne.result)
            expect(response.statusCode).toBe(200);


            if (collection.roles.insertOne.length) {

                const response = await makeRequest(url, mutationData, ['invalid']);
                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });


        it(`${insertManyFieldName} mutation`, async () => {

            await seedCollection({ name: collection.name, docs: [] });

            const mutationData = {
                query: `
            mutation ($data: [${insertTypeName}!]) {
                ${insertManyFieldName}(data: $data) {
                  insertedIds
                }

            }
            `,
                variables: { data: collection.testInsertMany.insert }
            };

            const response = await makeRequest(url, mutationData, collection.roles.insertMany);

            expect(response.body.data[insertManyFieldName]).toMatchObject(collection.testInsertMany.result);
            expect(response.statusCode).toBe(200);


            if (collection.roles.insertMany.length) {

                const response = await makeRequest(url, mutationData, ['invalid']);
                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });

        it(`${updateOneFieldName} mutation`, async () => {

            await seedCollection({ name: collection.name, docs: collection.testDocs });

            const mutationData = {
                query: `
            mutation($filter: ${filterTypeName}!, $update: ${updateTypeName}!) {
                ${updateOneFieldName} (filter: $filter, update: $update) {
                    _id
                    ${collection.fields.join('\n')}
                }
            }
            `,
                variables: {
                    "filter": collection.testUpdateOne.filter,
                    "update": { set: collection.testUpdateOne.set },
                },
            }

            const response = await makeRequest(url, mutationData, collection.roles.updateOne);

            expect(response.body.data[updateOneFieldName]).toMatchObject(collection.testUpdateOne.result)
            expect(response.statusCode).toBe(200);
            

            if (collection.roles.updateOne.length) {

                const response = await makeRequest(url, mutationData, ['invalid']);
                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });

        it(`${updateManyFieldName} mutation`, async () => {

            await seedCollection({ name: collection.name, docs: collection.testDocs });

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
                    "filter": collection.testUpdateMany.filter,
                    "update": { "set": collection.testUpdateMany.set }
                }
            };

            const response = await makeRequest(url, mutationData, collection.roles.updateMany);

            expect(response.body.data[updateManyFieldName]).toMatchObject(collection.testUpdateMany.result);
            expect(response.statusCode).toBe(200);


            if (collection.roles.updateMany.length) {

                const response = await makeRequest(url, mutationData, ['invalid']);
                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });

        it(`${deleteOneFieldName} mutation`, async () => {

            await seedCollection({ name: collection.name, docs: collection.testDocs });

            const mutationData = {
                query: `
            mutation Test($filter: ${filterTypeName}!) {
                ${deleteOneFieldName}(filter: $filter) {
                  _id
                }
            }
            `,
                variables: { filter: collection.testDeleteOne.filter }
            };

            const response = await makeRequest(url, mutationData, collection.roles.deleteOne);

            expect(response.body.data[deleteOneFieldName]).toMatchObject(collection.testDeleteOne.result);

            if (collection.roles.deleteOne.length) {

                const response = await makeRequest(url, mutationData, ['invalid']);
                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });

        it(`${deleteManyFieldName} mutation`, async () => {

            await seedCollection({ name: collection.name, docs: collection.testDocs });

            const mutationData = {
                query: `
            mutation Test($filter: ${filterTypeName}!) {
                ${deleteManyFieldName}(filter: $filter) {
                  deletedCount
                }
            }
            `,
                variables: { filter: collection.testDeleteMany.filter }
            };

            const response = await makeRequest(url, mutationData, collection.roles.deleteMany);

            expect(response.body.data[deleteManyFieldName]).toMatchObject(collection.testDeleteMany.result);


            if (collection.roles.deleteMany.length) {

                const response = await makeRequest(url, mutationData, ['invalid']);
                expect(response.body.errors[0].message).toBe('not authorized');
            }
        });
    });
});