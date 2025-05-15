import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "../schema";
import { MongoClient, ObjectId } from "mongodb";
import { ApolloServer } from "@apollo/server";
import config from '../config';
import supertest from 'supertest';
import * as context from '../context';
import { User } from "../generated/graphql";

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

export const makeRequest = async (url: string, data: { query: string, variables?: Record<string, unknown> }, headers?: Record<string, string>) => {

    const request = supertest(url).post('/')

    if (headers) {

        request.set(headers)
    }

    return request.send(data);
}

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export interface Fixture<T, U, I = any> {
    name: string;
    fieldName?: string ;
    query: string;
    seeds: { [database: string]: { [collection: string]: Record<string, unknown>[] } };
    testSingular: {
        allowed: User[];
        denied: User[];
        filter: unknown;
        result: DeepPartial<T>;
    } | null;
    testPluralFilter: {
        allowed: User[];
        denied: User[];
        filter: unknown;
        result: DeepPartial<T>[];
    } | null;
    testPluralSort: {
        allowed: User[];
        denied: User[];
        sort: unknown;
        filter?: unknown;
        result: DeepPartial<T>[];
    } | null;
    testPluralPagination: {
        allowed: User[];
        denied: User[];
        pagination: { limit: number; skip: number };
        sort: unknown;
        result: DeepPartial<T>[];
    } | null;
    testUpdateOne: {
        allowed: User[];
        denied: User[];
        filter: unknown;
        update: U;
        result: DeepPartial<T>;
    } | null;
    testUpdateMany: {
        allowed: User[];
        denied: User[];
        filter: { [key: string]: unknown };
        update: U;
        result: { modifiedCount: number; matchedCount: number };
    } | null;
    testInsertOne: {
        allowed: User[];
        denied: User[];
        insert: I;
        result: DeepPartial<T>;
    } | null;
    testInsertMany: {
        allowed: User[];
        denied: User[];
        insert: I[];
        result: { insertedIds: string[] };
    } | null;
    testDeleteOne: {
        allowed: User[];
        denied: User[];
        filter: { _id: { EQ: ObjectId } };
        result: { _id: string };
    } | null;
    testDeleteMany: {
        allowed: User[];
        denied: User[];
        filter: { [key: string]: unknown };
        result: { deletedCount: number };
    } | null;
    testUpsertOne: {
        shouldUpdate: {
            allowed: User[];
            denied: User[];
            filter: unknown;
            update: I;
            result: DeepPartial<T>;
        },
        shouldInsert: {
            allowed: User[];
            denied: User[];
            filter: unknown;
            update: I;
            result: DeepPartial<T>;
        },
    } | null;
}

export const seedFixture = async (seeds: Record<string, Record<string, Record<string, unknown>[]>>) => {

    for (const [database, collection] of Object.entries(seeds)) {

        for (const [name, docs] of Object.entries(collection)) {

            await seedCollection({ database, name, docs, });
        }
    }
}

export const mockSession = (userId: string) => {

    const client = new MongoClient(process.env.API_MONGODB_CONNECTION_STRING!);

    const db = client.db('customData');
    const collection = db.collection('users');

    jest.spyOn(context, 'verifyToken').mockImplementation(async () => {

        const user = await collection.findOne<{ userId: string, roles: string[] }>({ userId: userId });

        return user ? { id: user.userId, roles: user.roles } : null;
    })
}

export const getCollection = (databaseName: string, collectionName: string) => {

    const client = new MongoClient(process.env.API_MONGODB_CONNECTION_STRING!);
    const collection = client.db(databaseName).collection(collectionName);

    return collection;
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);