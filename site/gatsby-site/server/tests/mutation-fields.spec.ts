import { ApolloServer } from "@apollo/server";
import { makeRequest, readCollection, seedCollection, startTestServer } from "./utils";
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

            expect(response.body.data[insertOneFieldName]).toMatchObject(collection.testInsertOne)
            expect(response.statusCode).toBe(200);

            const list = await readCollection({ name: collection.name });

            expect(list.length).toBe(1);
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
                variables: { data: collection.testInsertMany }
            };

            const response = await makeRequest(url, mutationData, collection.permissions.insertMany);

            expect(response.body.data[insertManyFieldName].insertedIds.length).toEqual(collection.testInsertMany.length);
            expect(response.statusCode).toBe(200);
        });

        it(`${updateOneFieldName} mutation`, async () => {

            await seedCollection({ name: collection.name, docs: collection.testDocs });

            const mutationData = {
                query: `
            mutation($filter: ${filterTypeName}!, $update: ${updateTypeName}!) {
                ${updateOneFieldName} (filter: $filter, update: $update) {
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

            expect(response.body.data[updateOneFieldName]).toMatchObject({ url: 'https://edited.com' })
            expect(response.statusCode).toBe(200);


            const quickadds = await readCollection({ name: 'quickadd' });

            expect(quickadds.length).toBe(collection.testDocs.length);
        });

        it(`${updateManyFieldName} mutation`, async () => {

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

            expect(response.body.data[updateManyFieldName]).toMatchObject({
                modifiedCount: 3,
                matchedCount: 3
            })

            expect(response.statusCode).toBe(200);


            const quickadds = await readCollection({ name: collection.name });

            expect(quickadds.length).toBe(5);
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

            const response = await makeRequest(url, mutationData, collection.permissions.deleteOne);

            expect(response.body.data[deleteOneFieldName]).toMatchObject(collection.testDeleteOne.result);
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

            const response = await makeRequest(url, mutationData, collection.permissions.deleteMany);

            expect(response.body.data[deleteManyFieldName]).toMatchObject(collection.testDeleteMany.result);
        });


    });
});