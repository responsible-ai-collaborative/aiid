import gql from "graphql-tag";
import { MongoClient } from "mongodb";
import { QuickAdd } from "../generated/graphql";
import config from "../../../config";
import { convertToObjectID } from "../utils";

export const typeDefs = gql`

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

    extend type Query {
        quickadds(query: QuickaddQueryInput): [QuickAdd]
    }

    extend type Mutation {
        deleteManyQuickadds(query: QuickaddQueryInput): DeleteManyPayload @auth(requires: admin)
    }
`

export const resolvers = {
    Query: {
        async quickadds(_, { query = {} }: { query?: any } = {}) {
            const client = new MongoClient(config.mongodb.connectionString);

            const db = client.db('aiidprod');
            const collection = db.collection<QuickAdd>('quickadd');

            const filter = convertToObjectID<QuickAdd>(query);

            const items = await collection.find(filter).toArray();

            return items;
        }
    },

    Mutation: {
        deleteManyQuickadds: async (_, { query }: { query?: any }) => {
            const client = new MongoClient(config.mongodb.connectionString);

            const db = client.db('aiidprod');
            const collection = db.collection<QuickAdd>('quickadd');

            const filter = convertToObjectID<QuickAdd>(query);

            const result = await collection.deleteMany(filter);

            return { deletedCount: result.deletedCount! };
        }
    }
}