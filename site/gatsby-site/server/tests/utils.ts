import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "../schema";
import { MongoClient, ObjectId, WithId } from "mongodb";
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

export const seedUsers = async (users: { userId: string, roles: string[] | null }[], { drop } = { drop: true }) => {

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

export function serializeId<T extends { _id?: { toHexString: () => string } }>(obj: T) {
    return ({ ...obj, _id: obj._id?.toHexString() })
}

export function removeFields<T, K extends keyof T>(obj: T, ...fields: K[]): T {

    let result = { ...obj };

    fields.forEach(field => {
        const { [field]: _, ...rest } = result;
        result = rest as T;
    });

    return result;
}

export function removeField<T, K extends keyof T>(obj: T, field: K): T {
    return removeFields(obj, field);
}

export function removeId<T extends { _id?: { toHexString: () => string } }>(obj: T) {
    return removeField(obj, '_id');
}

export interface Fixture<T, Y = T> {
    name: string;
    query: string;
    seeds: { [database: string]: { [collection: string]: Record<string, unknown>[] } };
    testSingular: {
        allowed: User[];
        denied: User[];
        filter: unknown;
        result: Partial<Y>;
    } | null;
    testPluralFilter: {
        allowed: User[];
        denied: User[];
        filter: unknown;
        result: Partial<Y>[];
    } | null;
    testPluralSort: {
        allowed: User[];
        denied: User[];
        sort: unknown;
        result: Partial<Y>[];
    } | null;
    testPluralPagination: {
        allowed: User[];
        denied: User[];
        pagination: { limit: number; skip: number };
        sort: unknown;
        result: Partial<Y>[];
    } | null;
    testUpdateOne: {
        allowed: User[];
        denied: User[];
        filter: unknown;
        set: Partial<Y>;
        result: Partial<Y>;
    } | null;
    testUpdateMany: {
        allowed: User[];
        denied: User[];
        filter: { [key: string]: unknown };
        set: Partial<Y>;
        result: { modifiedCount: number; matchedCount: number };
    } | null;
    testInsertOne: {
        allowed: User[];
        denied: User[];
        insert: Partial<Y>;
        result: Partial<Y>;
    } | null;
    testInsertMany: {
        allowed: User[];
        denied: User[];
        insert: Partial<Y>[];
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
    roles: {
        singular: string[] | null;
        plural: string[] | null;
        insertOne: string[] | null;
        insertMany: string[] | null;
        updateOne: string[] | null;
        updateMany: string[] | null;
        deleteOne: string[] | null;
        deleteMany: string[] | null;
    };
}

export const seedFixture = async (seeds: Record<string, Record<string, Record<string, unknown>[]>>) => {

    for (const [database, collection] of Object.entries(seeds)) {

        for (const [name, docs] of Object.entries(collection)) {

            await seedCollection({ database, name, docs, });
        }
    }
}
