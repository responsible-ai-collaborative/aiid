import { GraphQLFieldConfigMap, GraphQLList, GraphQLObjectType } from "graphql";
import { getGraphQLInsertType, getGraphQLQueryArgs, getGraphQLUpdateArgs, getMongoDbQueryResolver, getMongoDbUpdateResolver } from "graphql-to-mongodb";
import { Context } from "./interfaces";
import capitalize from 'lodash/capitalize';
import { DeleteManyPayload, InsertManyPayload, UpdateManyPayload } from "./types";
import { Report } from "./generated/graphql";
import pluralizeLib from 'pluralize';

export function pluralize(s: string) {
    return pluralizeLib.plural(s);
}

export function singularize(s: string) {
    return pluralizeLib.singular(s);
}


const defaultQueryFields = ['plural', 'singular'];

export function generateQueryFields({ collectionName, databaseName = 'aiidprod', Type, generateFields = defaultQueryFields }: { collectionName: string, databaseName?: string, Type: GraphQLObjectType<any, any>, generateFields?: string[] }): GraphQLFieldConfigMap<any, any> {

    const singularName = singularize(collectionName);
    const pluralName = pluralize(collectionName);

    const fields: GraphQLFieldConfigMap<any, Context> = {};

    if (generateFields.includes('singular')) {

        fields[`${singularName}`] = {
            type: Type,
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const item = await collection.findOne(filter, options);

                return item;
            }),
        }
    }

    if (generateFields.includes('plural')) {

        fields[`${pluralName}`] = {
            type: new GraphQLList(Type),
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const items = await collection.find(filter, options).toArray();

                return items;
            }),
        }
    }

    return fields;
}


const defaultMutationFields = ['deleteOne', 'deleteMany', 'insertOne', 'insertMany', 'updateOne', 'updateMany'];

export function generateMutationFields({ collectionName, databaseName = 'aiidprod', Type, generateFields = defaultMutationFields }: { collectionName: string, databaseName?: string, Type: GraphQLObjectType<any, any>, generateFields?: string[] }): GraphQLFieldConfigMap<any, any> {

    const singularName = capitalize(singularize(collectionName));
    const pluralName = capitalize(pluralize(collectionName));

    const fields: GraphQLFieldConfigMap<any, any> = {};

    if (generateFields.includes('deleteOne')) {

        fields[`deleteOne${singularName}`] = {
            type: Type,
            args: getGraphQLQueryArgs(Type),
            resolve: getMongoDbQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const target = await collection.findOne(filter);

                await collection.deleteOne(filter);

                return target;
            }),
        };
    }

    if (generateFields.includes('deleteMany')) {

        fields[`deleteMany${pluralName}`] = {
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
        }
    }

    if (generateFields.includes('insertOne')) {

        fields[`insertOne${singularName}`] = {
            type: Type,
            args: { data: { type: getInsertType(Type) } },
            resolve: async (_: unknown, { data }, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const result = await collection.insertOne(data);

                const inserted = await collection.findOne({ _id: result.insertedId });

                return inserted;
            },
        }
    }

    if (generateFields.includes('insertMany')) {

        fields[`insertMany${pluralName}`] = {
            type: InsertManyPayload,
            args: { data: { type: new GraphQLList(getGraphQLInsertType(Type)) } },
            resolve: async (_: unknown, { data }, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const result = await collection.insertMany(data);

                return { insertedIds: Object.values(result.insertedIds) };
            },
        }
    }

    if (generateFields.includes('updateOne')) {

        fields[`updateOne${singularName}`] = {
            type: Type,
            args: getGraphQLUpdateArgs(Type),
            resolve: getMongoDbUpdateResolver(Type, async (filter, update, options, projection, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                await collection.updateOne(filter, update, options);

                const updated = await collection.findOne(filter);

                return updated;
            }),
        }
    }

    if (generateFields.includes('updateMany')) {

        fields[`updateMany${pluralName}`] = {
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
        }
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

export const apiRequest = async ({ path, method = "GET" }: { method?: string, path: string }) => {

    const loginResponse = await fetch('https://services.cloud.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: config.REALM_API_PUBLIC_KEY,
            apiKey: config.REALM_API_PRIVATE_KEY,
        }),
    });

    const data = await loginResponse.json();

    if (loginResponse.status != 200) {
        return {
            status: loginResponse.status,
            error: data.error
        }
    }

    let response = null;

    const url = `https://services.cloud.mongodb.com/api/admin/v3.0/groups/${config.REALM_API_GROUP_ID}/apps/${config.REALM_API_APP_ID}${path}`;
    const headers = { "Authorization": `Bearer ${data.access_token}` };

    if (method == 'GET') {

        const result = await fetch(url, { headers });

        response = await result.json();
    }
    else {

        throw `Unsupported method ${method}`;
    }

    return response;
}