import gql from "graphql-tag";
import { MongoClient } from "mongodb";
import { QuickAdd, Resolvers } from "../generated/graphql";
import config from "../../config";
import { convertToObjectID } from "../utils";

export default gql`

    type QuickAdd {
        _id: ObjectId
        date_submitted: String!
        incident_id: Long
        source_domain: String
        url: String!
    }

    input QuickaddQueryInput {
        _id: ObjectId
    }

    input QuickaddInsertInput {
        date_submitted: String!
        incident_id: Long
        source_domain: String
        url: String!
    }

    extend type Query {
        quickadds(query: QuickaddQueryInput): [QuickAdd]
    }

    extend type Mutation {
        deleteManyQuickadds(query: QuickaddQueryInput): DeleteManyPayload @auth(requires: admin)
        insertOneQuickadd(data: QuickaddInsertInput!): QuickAdd
    }
`

export const resolvers: Resolvers = {
    Query: {
        async quickadds(_: unknown, { query = {} }: { query?: any } = {}) {
            const client = new MongoClient(config.mongodb.connectionString!);

            const db = client.db('aiidprod');
            const collection = db.collection<QuickAdd>('quickadd');

            const filter = convertToObjectID<QuickAdd>(query);

            const items = await collection.find(filter).toArray();

            return items;
        }
    },

    Mutation: {
        deleteManyQuickadds: async (_: unknown, { query }: { query?: any }) => {
            const client = new MongoClient(config.mongodb.connectionString!);

            const db = client.db('aiidprod');
            const collection = db.collection<QuickAdd>('quickadd');

            const filter = convertToObjectID<QuickAdd>(query);

            const result = await collection.deleteMany(filter);

            return { deletedCount: result.deletedCount! };
        },
        insertOneQuickadd: async (_: unknown, { data }: { data: QuickAdd }) => {
            const client = new MongoClient(config.mongodb.connectionString!);

            const db = client.db('aiidprod');
            const collection = db.collection<QuickAdd>('quickadd');

            const result = await collection.insertOne(data);

            const inserted = await collection.findOne({ _id: result.insertedId });

            return inserted;
        }
    }
}