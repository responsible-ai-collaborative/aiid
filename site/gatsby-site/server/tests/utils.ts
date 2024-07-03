import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "../schema";
import { MongoClient, ObjectId } from "mongodb";
import { ApolloServer } from "@apollo/server";
import config from '../config';
import supertest from 'supertest';
import * as context from '../context';

export const startTestServer = async () => {

    const server = new ApolloServer({
        schema,
    });

    const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

    const { url } = await startStandaloneServer(server, { context: ({ req }) => context.context({ req, client }), listen: { port: 0 } });

    return { server, url }
}

export const seedCollection = async ({ name, docs, database = 'aiidprod', drop = true }: { name: string, database?: string, docs: Record<string, unknown>[], drop?: boolean }) => {

    const client = new MongoClient(process.env.API_MONGODB_CONNECTION_STRING!);

    const db = client.db(database);
    const collection = db.collection(name);

    if (drop && (await db.listCollections().toArray()).find(c => c.name === name)) {

        await collection.drop();
    }

    if (docs.length) {

        const result = await collection.insertMany(docs);

        return result;
    }
}

export const seedUsers = async (users: { userId: string, roles: string[] }[], { drop } = { drop: true }) => {

    await seedCollection({
        name: 'users',
        database: 'customData',
        docs: users,
        drop,
    });
}

export const makeRequest = async (url: string, data: { variables?: Record<string, unknown>, query: string }) => {

    return supertest(url)
        .post('/')
        .set('Authorization', `Bearer dummyToken`)
        .send(data);
}

export function serializeId<T extends { _id?: { toHexString: () => string } }>(obj: T): T { return ({ ...obj, _id: obj._id?.toHexString() }) }

export function removeId<T extends { _id?: { toHexString: () => string } }>(obj: T): T { return ({ ...obj, _id: undefined }) }


/**
 * Interface representing the structure of a fixture for testing api operations.
 * 
 * @template T - The database object type of the main entity being tested. This usually coincides with the graphql object type, but sometimes they may differ like with Incidents.
 * @template Y - The generated graphql object type of the main entity being tested.
 */
export interface Fixture<T, Y = T> {
    /** The name of the database collection being tested. */
    name: string;

    /** The graphql query used to perform graphql operations. */
    query: string;

    /** Seed data for the database, organized by collection name. */
    seeds: Record<string, Record<string, unknown>[]>;

    /** 
     * Configuration for testing the singular field i.e. incident
     */
    testSingular: {
        /** Filter to identify the document by its ObjectId. */
        filter: { _id: { EQ: ObjectId } };

        /** Expected result for the query. */
        result: Partial<Y>;
    };

    /** 
     * Configuration for testing the plural field i.e. incidents
     */
    testPluralFilter: {
        /** Filter to identify the documents by their ObjectId. */
        filter: { _id: { EQ: ObjectId } };

        /** Expected results for the query. */
        result: Partial<Y>[];
    };

    /** 
     * Configuration for testing the plural field with sorting.
     */
    testPluralSort: {
        /** Sorting criteria for the query. */
        sort: unknown;

        /** Expected results for the query. */
        result: Partial<Y>[];
    };

    /** 
     * Configuration for testing the plural field with pagination.
     */
    testPluralPagination: {
        /** Pagination parameters: limit and skip. */
        pagination: { limit: number; skip: number };

        /** Sorting criteria for the query. */
        sort: unknown;

        /** Expected results for the query. */
        result: Partial<Y>[];
    };

    /** 
     * Configuration for testing the updateOne mutation .
     */
    testUpdateOne: {
        /** Filter to identify the document by its ObjectId. */
        filter: { _id: { EQ: ObjectId } };

        /** Partial update to apply to the document. */
        set: Partial<Y>;

        /** Expected result for the update operation. */
        result: Partial<Y>;
    };

    /** 
     * Configuration for testing the updateMany mutation.
     */
    testUpdateMany: {
        /** Filter to identify the documents by various criteria. */
        filter: { [key: string]: { EQ: any } };

        /** Partial update to apply to the documents. */
        set: Partial<Y>;

        /** Expected result for the update operation, including modified and matched counts. */
        result: { modifiedCount: number; matchedCount: number };
    };

    /** 
     * Configuration for testing the insertOne mutation.
     */
    testInsertOne: {
        /** Object to be inserted. */
        insert: Partial<T>;

        /** Expected result for the insert operation. */
        result: Partial<Y>;
    };

    /** 
     * Configuration for testing the insertMany mutation.
     */
    testInsertMany: {
        /** Objects to be inserted. */
        insert: Partial<T>[];

        /** Expected result for the insert operation, including inserted IDs. */
        result: { insertedIds: string[] };
    };

    /** 
     * Configuration for testing the deleteOne mutation.
     */
    testDeleteOne: {
        /** Filter to identify the document by its ObjectId. */
        filter: { _id: { EQ: ObjectId } };

        /** Expected result for the delete operation, including the ID of the deleted document. */
        result: { _id: string };
    };

    /** 
     * Configuration for testing the deleteMany mutation.
     */
    testDeleteMany: {
        /** Filter to identify the documents by various criteria. */
        filter: { [key: string]: { EQ: any } };

        /** Expected result for the delete operation, including the count of deleted documents. */
        result: { deletedCount: number };
    };

    /** 
     * Roles configuration for generated fields and mutations.
     */
    roles: {
        /** Roles allowed to query the singular field. */
        singular: string[];

        /** Roles allowed to query the plural field. */
        plural: string[];

        /** Roles allowed to call the insertOne mutation. */
        insertOne: string[];

        /** Roles allowed to call the insertMany mutation. */
        insertMany: string[];

        /** Roles allowed to call the updateOne mutation. */
        updateOne: string[];

        /** Roles allowed to call the updateMany mutation. */
        updateMany: string[];

        /** Roles allowed to call the deleteOne mutation. */
        deleteOne: string[];

        /** Roles allowed to call the deleteMany mutation. */
        deleteMany: string[];
    };
}

export const seedFixture = async (seeds: Record<string, Record<string, unknown>[]>) => {

    for (const [collection, docs] of Object.entries(seeds)) {

        await seedCollection({ name: collection, docs });
    }
}