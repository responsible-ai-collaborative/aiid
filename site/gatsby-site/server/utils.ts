import { GraphQLFieldConfigMap, GraphQLList, GraphQLObjectType } from "graphql";
import { getGraphQLInsertType, getGraphQLQueryArgs, getGraphQLUpdateArgs, getMongoDbQueryResolver, getMongoDbUpdateResolver } from "graphql-to-mongodb";
import { Context } from "./interfaces";
import capitalize from 'lodash/capitalize';
import { DeleteManyPayload, InsertManyPayload, UpdateManyPayload } from "./types";
import { Report } from "./generated/graphql";

export function pluralize(s: string) {
    return s.endsWith('s') ? s : s + 's';
}

export function singularize(s: string) {
    return s.endsWith('s') ? s.slice(0, -1) : s;
}

export function generateQueryFields({ collectionName, databaseName = 'aiidprod', Type, }: { collectionName: string, databaseName?: string, Type: GraphQLObjectType<any, any> }): GraphQLFieldConfigMap<any, any> {

    const singularName = singularize(collectionName);
    const pluralName = pluralize(collectionName);

    const fields: GraphQLFieldConfigMap<any, Context> = {
        [`${singularName}`]: {
            type: Type,
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const item = await collection.findOne(filter, options);

                return item;
            }),
        },

        [`${pluralName}`]: {
            type: new GraphQLList(Type),
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const items = await collection.find(filter, options).toArray();

                return items;
            }),
        },
    }

    return fields;
}

export function generateMutationFields({ collectionName, databaseName = 'aiidprod', Type, }: { collectionName: string, databaseName?: string, Type: GraphQLObjectType<any, any> }): GraphQLFieldConfigMap<any, any> {

    const singularName = capitalize(singularize(collectionName));
    const pluralName = capitalize(pluralize(collectionName));

    const fields: GraphQLFieldConfigMap<any, any> = {
        [`deleteOne${singularName}`]: {
            type: Type,
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const target = await collection.findOne(filter);

                await collection.deleteOne(filter);

                return target;
            }),
        },

        [`deleteMany${pluralName}`]: {
            type: DeleteManyPayload,
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const result = await collection.deleteMany(filter);

                return { deletedCount: result.deletedCount! };
            }, {
                differentOutputType: true,
            }),
        },


        [`insertOne${singularName}`]: {
            type: Type,
            args: { data: { type: getGraphQLInsertType(Type) } },
            resolve: async (_: unknown, { data }, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const result = await collection.insertOne(data);

                const inserted = await collection.findOne({ _id: result.insertedId });

                return inserted;
            },
        },


        [`insertMany${pluralName}`]: {
            type: InsertManyPayload,
            args: { data: { type: new GraphQLList(getGraphQLInsertType(Type)) } },
            resolve: async (_: unknown, { data }, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const result = await collection.insertMany(data);

                return { insertedIds: Object.values(result.insertedIds) };
            },
        },

        [`updateOne${singularName}`]: {
            type: Type,
            args: getGraphQLUpdateArgs(Type),
            resolve: getMongoDbUpdateResolver(Type, async (filter, update, options, projection, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                await collection.updateOne(filter, update, options);

                const updated = await collection.findOne(filter);

                return updated;
            }),
        },

        [`updateMany${pluralName}`]: {
            type: UpdateManyPayload,
            args: getGraphQLUpdateArgs(Type),
            resolve: getMongoDbUpdateResolver(Type, async (filter, update, options, projection, obj, args, context) => {

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

    return fields;
}

export const incidentEmbedding = (reports: Report[]) => {
    reports = reports.filter((report) => report.embedding);
    return reports.length == 0
        ? null
        : {
            vector: reports
                .map((report) => report.embedding!.vector)
                .reduce(
                    (sum, vector) => vector!.map((component, i) => component + sum[i]),
                    Array(reports[0].embedding!.vector!.length).fill(0)
                )
                .map((component) => component / reports.length),

            from_reports: reports.map((report) => report.report_number),
        };
};