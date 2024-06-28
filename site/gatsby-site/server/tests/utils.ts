import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "../schema";
import { MongoClient, ObjectId, WithId } from "mongodb";
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

export function serializeId<T>(obj: WithId<T>) { return ({ ...obj, _id: obj._id.toHexString() }) }

export function removeId<T>(obj: WithId<T>): Omit<T, "_id"> { return ({ ...obj, _id: undefined }) }

export interface Fixture<T> {
    name: string;
    query: string;
    testDocs: T[];
    testSingular: {
        filter: { _id: { EQ: ObjectId } };
        result: T;
    };
    testPluralFilter: {
        filter: { _id: { EQ: ObjectId } };
        result: T[];
    };
    testPluralSort: {
        sort: unknown;
        result: T[];
    };
    testPluralPagination: {
        pagination: { limit: number; skip: number };
        sort: unknown;
        result: T[];
    };
    testUpdateOne: {
        filter: { _id: { EQ: ObjectId } };
        set: Partial<T>;
        result: Partial<T>;
    };
    testUpdateMany: {
        filter: { [key: string]: { EQ: any } };
        set: Partial<T>;
        result: { modifiedCount: number; matchedCount: number };
    };
    testInsertOne: {
        insert: Partial<T>;
        result: Partial<T>;
    };
    testInsertMany: {
        insert: Partial<T>[];
        result: { insertedIds: string[] };
    };
    testDeleteOne: {
        filter: { _id: { EQ: ObjectId } };
        result: { _id: string };
    };
    testDeleteMany: {
        filter: { [key: string]: { EQ: any } };
        result: { deletedCount: number };
    };
    roles: {
        singular: string[];
        plural: string[];
        insertOne: string[];
        insertMany: string[];
        updateOne: string[];
        updateMany: string[];
        deleteOne: string[];
        deleteMany: string[];
    };
}
