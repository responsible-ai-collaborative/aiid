import { GraphQLFieldConfigMap, GraphQLList, GraphQLObjectType } from "graphql";
import { getGraphQLInsertType, getGraphQLQueryArgs, getGraphQLUpdateArgs, getMongoDbQueryResolver, getMongoDbUpdateResolver } from "graphql-to-mongodb";
import { Context } from "./interfaces";
import capitalize from 'lodash/capitalize';
import { DeleteManyPayload, InsertManyPayload, UpdateManyPayload } from "./types";

export function generateQueryFields({ collectionName, databaseName = 'aiidprod', Type, }: { collectionName: string, databaseName?: string, Type: GraphQLObjectType<any, any> }): GraphQLFieldConfigMap<any, any> {

    return {
        [`${collectionName}`]: {
            type: Type,
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context: Context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const items = await collection.find(filter, { ...options, projection }).limit(1).toArray();

                return items;
            }),
        },

        [`${collectionName}s`]: {
            type: new GraphQLList(Type),
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context: Context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const items = await collection.find(filter, { ...options, projection }).toArray();

                return items;
            }),
        },
    }
}

export function generateMutationFields({ collectionName, databaseName = 'aiidprod', Type, }: { collectionName: string, databaseName?: string, Type: GraphQLObjectType<any, any> }): GraphQLFieldConfigMap<any, any> {

    return {
        [`deleteOne${capitalize(collectionName)}`]: {
            type: Type,
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context: Context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const target = await collection.findOne(filter);

                await collection.deleteOne(filter);

                return target;
            }),
        },

        [`deleteMany${capitalize(collectionName)}s`]: {
            type: DeleteManyPayload,
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context: Context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const result = await collection.deleteMany(filter);

                return { deletedCount: result.deletedCount! };
            }, {
                differentOutputType: true,
            }),
        },


        [`insertOne${capitalize(collectionName)}`]: {
            type: Type,
            args: { data: { type: getGraphQLInsertType(Type) } },
            resolve: async (_: unknown, { data }, context: Context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const result = await collection.insertOne(data);

                const inserted = await collection.findOne({ _id: result.insertedId });

                return inserted;
            },
        },


        [`insertMany${capitalize(collectionName)}s`]: {
            type: InsertManyPayload,
            args: { data: { type: new GraphQLList(getGraphQLInsertType(Type)) } },
            resolve: async (_: unknown, { data }, context: Context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const result = await collection.insertMany(data);

                return { insertedIds: Object.values(result.insertedIds) };
            },
        },

        [`updateOne${capitalize(collectionName)}`]: {
            type: Type,
            args: getGraphQLUpdateArgs(Type),
            resolve: getMongoDbUpdateResolver(Type, async (filter, update, options, projection, obj, args, context: Context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                await collection.updateOne(filter, update, options);

                const updated = await collection.findOne(filter);

                return updated;
            }),
        },

        [`updateMany${capitalize(collectionName)}s`]: {
            type: UpdateManyPayload,
            args: getGraphQLUpdateArgs(Type),
            resolve: getMongoDbUpdateResolver(Type, async (filter, update, options, projection, obj, args, context: Context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const result = await collection.updateMany(filter, update, options);

                return { modifiedCount: result.modifiedCount!, matchedCount: result.matchedCount };
            }, {
                differentOutputType: true,
                validateUpdateArgs: true,
            }),
        },
    }
}

