import { GraphQLFieldConfigMap, GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputType, GraphQLList, GraphQLNamedType, GraphQLNonNull, GraphQLObjectType, GraphQLResolveInfo, ThunkObjMap } from "graphql";
import { getGraphQLInsertType, getGraphQLQueryArgs, getGraphQLUpdateArgs, getMongoDbQueryResolver, getMongoDbUpdateResolver } from "graphql-to-mongodb";
import { Context } from "./interfaces";
import capitalize from 'lodash/capitalize';
import { DeleteManyPayload, InsertManyPayload, UpdateManyPayload } from "./types";
import { Report } from "./generated/graphql";
import pluralizeLib from 'pluralize';
import config from "./config";

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

type Data = { [key: string]: any }

const defaultMutationFields = ['deleteOne', 'deleteMany', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne'];

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
            resolve: async (_: unknown, { data }: { data: Data }, context, info) => {

                const insert: any = {};

                const fields = Type.toConfig().fields;

                for (const [name, value] of Object.entries(data)) {

                    if (value.link && typeof value.link !== 'function') {

                        const field = fields[name];

                        await (field.extensions!.relationship as any).linkValidation(data, context);

                        insert[name] = value.link;
                    }
                    else {
                        insert[name] = value;
                    }
                }


                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const result = await collection.insertOne(insert);

                const inserted = await collection.findOne({ _id: result.insertedId });

                return inserted;
            },
        }
    }

    if (generateFields.includes('insertMany')) {

        fields[`insertMany${pluralName}`] = {
            type: InsertManyPayload,
            args: { data: { type: new GraphQLList(getInsertType(Type)) } },
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

    if (generateFields.includes('upsertOne')) {

        fields[`upsertOne${singularName}`] = {
            type: Type,
            args: { data: { type: getInsertType(Type) } },
            resolve: getMongoDbUpdateResolver(Type, async (filter, update, options, projection, obj, args, context: Context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                await collection.updateOne(filter, update, { ...options, upsert: true });

                const updated = await collection.findOne(filter);

                return updated;
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

/**
 * Generates an extension for managing a list relationship between entities in a GraphQL schema.
 *
 * @param {string} sourceField - The field in the source entity that contains the list of linked entity IDs.
 * @param {string} targetField - The field in the target entity that is used to match the linked entity IDs.
 * @param {GraphQLNamedType} LinkType - The GraphQL type of the linked entities.
 * @param {string} databaseName - The name of the database where the entities are stored.
 * @param {string} collectionName - The name of the collection where the entities are stored.
 * @returns {object} An object containing the GraphQL list type and a validation function.
 * 
 * The returned object has the following structure:
 * - linkType: A new GraphQLList of the specified LinkType.
 * - linkValidation: An asynchronous validation function that checks if all linked entity IDs exist in the database.
 * 
 * The validation function performs the following steps:
 * 1. Retrieves the database and collection from the context.
 * 2. Queries the collection to find documents where the targetField matches any of the linked entity IDs from the sourceField.
 * 3. Throws an error if the number of found documents does not match the number of linked entity IDs.
 * 
 * Example usage:
 * 
 * const extension = getListRelationshipExtension(
 *     'linkedIds',       // The field in the source entity containing the list of linked IDs
 *     '_id',             // The field in the target entity to match against the linked IDs
 *     GraphQLString,     // The GraphQL type of the linked entities
 *     'myDatabase',      // The name of the database
 *     'myCollection'     // The name of the collection
 * );
 * 
 * const { linkType, linkValidation } = extension;
 */
export const getListRelationshipExtension = (
    sourceField: string,
    targetField: string,
    LinkType: GraphQLNamedType,
    databaseName: string,
    collectionName: string
) => {

    return {
        linkType: new GraphQLNonNull(new GraphQLList(LinkType)),
        linkValidation: async (source: any, context: Context) => {

            const db = context.client.db(databaseName);
            const collection = db.collection(collectionName);

            const result = await collection.find({ [targetField]: { $in: source[sourceField].link } }).toArray();

            if (result.length !== source[sourceField].link.length) {

                throw new Error(`Invalid entity ids`);
            }
        }
    }
}

export const getRelationshipExtension = (
    sourceField: string,
    targetField: string,
    LinkType: GraphQLNamedType,
    databaseName: string,
    collectionName: string
) => {

    return {
        linkType: LinkType,
        linkValidation: async (source: any, context: Context) => {

            const db = context.client.db(databaseName);
            const collection = db.collection(collectionName);

            const result = await collection.findOne({ [targetField]: source[sourceField].link });

            if (!result) {

                throw new Error(`Invalid entity id`);
            }
        }
    }
}


export const getListRelationshipResolver = (
    sourceField: string,
    targetField: string,
    ReferencedType: GraphQLObjectType,
    databaseName: string,
    collectionName: string,
) => {

    return getMongoDbQueryResolver(ReferencedType, async (filter, projection, options, source: any, args, context: Context) => {

        const db = context.client.db(databaseName);

        const collection = db.collection(collectionName);

        const result = source[sourceField]?.length
            ? await collection.find({ [targetField]: { $in: source[sourceField] } }, options).toArray()
            : []

        return result;
    })
}

export const getRelationshipResolver = (
    sourceField: string,
    targetField: string,
    ReferencedType: GraphQLObjectType,
    databaseName: string,
    collectionName: string,
) => {

    return getMongoDbQueryResolver(ReferencedType, async (filter, projection, options, source: any, args, context: Context) => {

        const db = context.client.db(databaseName);

        const collection = db.collection(collectionName);

        const result = source[sourceField]
            ? await collection.findOne({ [targetField]: source[sourceField] }, options)
            : null

        return result;
    })
}


const extendedTypesCache: { [key: string]: GraphQLNamedType } = {}

export function getInsertType(Type: GraphQLObjectType<any, any>) {

    const inputTypeName = `${Type.name}InsertType`;

    if (extendedTypesCache[inputTypeName]) {

        return extendedTypesCache[inputTypeName] as GraphQLInputObjectType;
    }
    else {

        const relationFields: ThunkObjMap<GraphQLInputFieldConfig> = {};

        for (const [key, field] of Object.entries(Type.toConfig().fields)) {

            if (field.extensions?.relationship) {

                const relationship = field.extensions.relationship as { linkType: GraphQLInputType, createType: GraphQLInputType };

                const config: { name: string, fields: Record<string, any> } = {
                    name: `${Type.name}${capitalize(key)}RelationInput`,
                    fields: {},
                }

                if (relationship.linkType) {

                    config.fields.link = { type: relationship.linkType };
                }

                if (relationship.createType) {

                    throw 'Not implemented';
                }

                // non null should depend if the field is non null or not

                const inputType = new GraphQLNonNull(new GraphQLInputObjectType(config));

                relationFields[key] = { type: inputType };
            }
        }

        const base = getGraphQLInsertType(Type);
        const config = base.toConfig();

        const extended = new GraphQLInputObjectType({
            ...config,
            name: inputTypeName,
            fields: {
                ...config.fields,
                ...relationFields,
            },
            extensions: {
                updated: true,
            }
        });

        extendedTypesCache[inputTypeName] = extended;

        return extended;
    }
}
