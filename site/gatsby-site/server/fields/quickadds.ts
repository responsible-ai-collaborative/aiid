import { MongoClient } from "mongodb";
import { QuickAdd } from "../generated/graphql";
import { GraphQLFieldConfigMap, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLLong } from "graphql-scalars";
import { getGraphQLInsertType, getGraphQLQueryArgs, getMongoDbQueryResolver } from "graphql-to-mongodb";
import { allow } from "graphql-shield";
import { isAdmin } from "../rules";
import { ObjectIdScalar } from "../scalars";
import { DeleteManyPayload } from "../types";

const QuickAddType = new GraphQLObjectType({
    name: 'QuickAdd',
    fields: {
        _id: {
            type: ObjectIdScalar,
        },
        date_submitted: {
            type: GraphQLString,
        },
        incident_id: {
            type: GraphQLLong,
        },
        source_domain: {
            type: GraphQLString,
        },
        url: {
            type: GraphQLString,
        },
    },
});

export const queryFields: GraphQLFieldConfigMap<any, any> = {

    quickadds: {
        type: new GraphQLList(QuickAddType),
        args: getGraphQLQueryArgs(QuickAddType),
        resolve: getMongoDbQueryResolver(QuickAddType, async (filter, projection, options, obj, args, context) => {

            const db = (context.client as MongoClient).db('aiidprod')
            const collection = db.collection<QuickAdd>('quickadd');

            const items = await collection.find(filter, projection).toArray();

            return items;
        }),
    }
}

export const mutationFields: GraphQLFieldConfigMap<any, any> = {

    deleteManyQuickadds: {
        type: DeleteManyPayload,
        args: getGraphQLQueryArgs(QuickAddType),
        resolve: getMongoDbQueryResolver(
            QuickAddType,
            async (filter, projection, options, obj, args, context) => {

                const db = (context.client as MongoClient).db('aiidprod');
                const collection = db.collection<QuickAdd>('quickadd');

                const result = await collection.deleteMany(filter);

                return { deletedCount: result.deletedCount! };
            },
            {
                differentOutputType: true,
            }
        )
    },

    insertOneQuickadd: {
        type: QuickAddType,
        args: { data: { type: getGraphQLInsertType(QuickAddType) } },
        resolve: async (_: unknown, { data }: { data: QuickAdd }, { client }: { client: MongoClient }) => {

            const db = client.db('aiidprod');
            const collection = db.collection<QuickAdd>('quickadd');

            const result = await collection.insertOne(data);

            const inserted = await collection.findOne({ _id: result.insertedId });

            return inserted;
        }
    }
}

export const permissions = {
    Query: {
        quickadds: allow,
    },
    Mutation: {
        deleteManyQuickadds: isAdmin,
        insertOneQuickadd: allow,
    }
}