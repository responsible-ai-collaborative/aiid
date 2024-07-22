import { GraphQLField, GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLFieldResolver, GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputType, GraphQLList, GraphQLNamedType, GraphQLNonNull, GraphQLObjectType, GraphQLResolveInfo, ThunkObjMap, isNonNullType, isType } from "graphql";
import { getGraphQLInsertType, getGraphQLFilterType, getGraphQLSortType, GraphQLPaginationType, MongoDbOptions, getMongoDbSort, getMongoDbProjection, getMongoDbQueryResolver, validateUpdateArgs, getMongoDbUpdate, GetMongoDbProjectionOptions } from "graphql-to-mongodb";
import { Context } from "./interfaces";
import capitalize from 'lodash/capitalize';
import { DeleteManyPayload, InsertManyPayload, UpdateManyPayload } from "./types";
import pluralizeLib from 'pluralize';
import config from "./config";
import { getGraphQLSetType } from "graphql-to-mongodb/lib/src/graphQLUpdateType";
import { GraphQLFieldsType } from "graphql-to-mongodb/lib/src/common";
import { QueryCallback, QueryOptions } from "graphql-to-mongodb/lib/src/queryResolver";
import { getMongoDbFilter } from "graphql-to-mongodb/lib/src/mongoDbFilter";
import { UpdateCallback } from "graphql-to-mongodb/lib/src/updateResolver";

export function pluralize(s: string) {
    return pluralizeLib.plural(s);
}

export function singularize(s: string) {
    return pluralizeLib.singular(s);
}


type QueryFields = 'plural' | 'singular';

const defaultQueryFields: QueryFields[] = ['plural', 'singular'];

export function generateQueryFields({ collectionName, databaseName = 'aiidprod', Type, generateFields = defaultQueryFields }: { collectionName: string, databaseName?: string, Type: GraphQLObjectType<any, any>, generateFields?: QueryFields[] }): GraphQLFieldConfigMap<any, any> {

    const singularName = singularize(collectionName);
    const pluralName = pluralize(collectionName);

    const fields: GraphQLFieldConfigMap<any, Context> = {};

    if (generateFields.includes('singular')) {

        fields[`${singularName}`] = {
            type: Type,
            args: getQueryArgs(Type) as any,
            resolve: getQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                const bue = await collection.find({}, options).toArray();

                bue;

                const item = await collection.findOne(filter, options);

                return item;
            }),
        }
    }

    if (generateFields.includes('plural')) {

        fields[`${pluralName}`] = {
            type: new GraphQLList(Type),
            args: getQueryArgs(Type) as any,
            resolve: getQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

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

type MutationFields = 'deleteOne' | 'deleteMany' | 'insertOne' | 'insertMany' | 'updateOne' | 'updateMany' | 'upsertOne';

const defaultMutationFields: MutationFields[] = ['deleteOne', 'deleteMany', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne'];

export function generateMutationFields({ collectionName, databaseName = 'aiidprod', Type, generateFields = defaultMutationFields }: { collectionName: string, databaseName?: string, Type: GraphQLObjectType<any, any>, generateFields?: MutationFields[] }): GraphQLFieldConfigMap<any, any> {

    const singularName = capitalize(singularize(collectionName));
    const pluralName = capitalize(pluralize(collectionName));

    const fields: GraphQLFieldConfigMap<any, any> = {};

    if (generateFields.includes('deleteOne')) {

        fields[`deleteOne${singularName}`] = {
            type: Type,
            args: getQueryArgs(Type) as any,
            resolve: getQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

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
            args: getQueryArgs(Type) as any,
            resolve: getQueryResolver(Type, async (filter, projection, options, obj, args, context) => {

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
            args: { data: { type: new GraphQLNonNull(getInsertType(Type)) } },
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
            args: { data: { type: new GraphQLNonNull(new GraphQLList(getInsertType(Type))) } },
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
            args: getUpdateArgs(Type),
            resolve: getUpdateResolver(Type, async (filter, mongoUpdate, options, projection, obj, args, context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);


                const update: any = {};

                const fields = Type.toConfig().fields;

                for (const [key, value] of Object.entries(mongoUpdate.$set as Record<string, any>)) {

                    if (key.endsWith('.link')) {

                        const name = key.slice(0, -5);
                        const field = fields[name];

                        await (field.extensions!.relationship as any).linkValidation(args.update.set, context);

                        update[name] = value;
                    }
                    else {
                        update[key] = value;
                    }
                }

                await collection.updateOne(filter, { $set: update }, options);

                const updated = await collection.findOne(filter);

                return updated;
            }),
        }
    }

    if (generateFields.includes('updateMany')) {

        fields[`updateMany${pluralName}`] = {
            type: UpdateManyPayload,
            args: getUpdateArgs(Type),
            resolve: getUpdateResolver(Type, async (filter, update, options, projection, obj, args, context) => {

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
            args: { filter: { type: new GraphQLNonNull(getFilterType(Type)) as any }, update: { type: new GraphQLNonNull(getInsertType(Type)) } },
            resolve: getUpdateResolver(Type, async (filter, _, options, projection, obj, { update }, context: Context) => {

                const db = context.client.db(databaseName);
                const collection = db.collection(collectionName);

                await collection.updateOne(filter, { $set: update }, { ...projection, upsert: true });

                const updated = await collection.findOne(filter);

                return updated;
            }),
        }
    }

    return fields;
}

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

export const getListRelationshipConfig = (
    ReferencedType: GraphQLObjectType,
    ReferencedFieldType: GraphQLNamedType,
    sourceField: string,
    targetField: string,
    targetCollection: string,
    targetDatabase: string,
): GraphQLFieldConfig<any, Context> => {

    return {
        type: new GraphQLList(ReferencedType),
        resolve: getListRelationshipResolver(sourceField, targetField, ReferencedType, targetDatabase, targetCollection),
        extensions: {
            relationship: getListRelationshipExtension(sourceField, targetField, ReferencedFieldType, targetDatabase, targetCollection)
        },
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

export const getRelationshipConfig = (
    ReferencedType: GraphQLObjectType,
    ReferencedFieldType: GraphQLNamedType,
    sourceField: string,
    targetField: string,
    targetCollection: string,
    targetDatabase: string,
): GraphQLFieldConfig<any, Context> => {

    return {
        type: ReferencedType,
        resolve: getRelationshipResolver(sourceField, targetField, ReferencedType, targetDatabase, targetCollection),
        extensions: {
            relationship: getRelationshipExtension(sourceField, targetField, ReferencedFieldType, targetDatabase, targetCollection)
        },
    }
}



const extendedTypesCache: { [key: string]: GraphQLNamedType } = {}


const getRelationInputType = (Type: GraphQLNamedType, fieldName: string, field: GraphQLFieldConfig<any, any>) => {

    const typeName = `${Type.name}${capitalize(fieldName)}RelationInput`;

    if (extendedTypesCache[typeName]) {

        return extendedTypesCache[typeName] as GraphQLInputObjectType;
    }
    else {

        const relationship = field.extensions!.relationship as { linkType: GraphQLInputType, createType: GraphQLInputType };

        const config: { name: string, fields: Record<string, any> } = {
            name: typeName,
            fields: {},
        }

        if (relationship.linkType) {

            config.fields.link = { type: relationship.linkType };
        }

        if (relationship.createType) {

            throw 'Not implemented';
        }

        const inputType = new GraphQLInputObjectType(config);

        extendedTypesCache[typeName] = inputType;

        return inputType;
    }
}

export function getInsertType(Type: GraphQLObjectType<any, any>) {

    const inputTypeName = `${Type.name}InsertType`;

    if (extendedTypesCache[inputTypeName]) {

        return extendedTypesCache[inputTypeName] as GraphQLInputObjectType;
    }
    else {

        const relationFields: ThunkObjMap<GraphQLInputFieldConfig> = {};

        for (const [key, field] of Object.entries(Type.toConfig().fields)) {

            if (field.extensions?.relationship) {

                const inputType = getRelationInputType(Type, key, field);

                relationFields[key] = { type: isNonNullType(field.type) ? new GraphQLNonNull(inputType) : inputType };
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
        });

        extendedTypesCache[inputTypeName] = extended;

        return extended;
    }
}

export const getUpdateType = (Type: GraphQLObjectType<any, any>) => {

    const updateTypeName = `${Type.name}UpdateType`;

    if (extendedTypesCache[updateTypeName]) {

        return extendedTypesCache[updateTypeName];
    }
    else {

        const relationFields: ThunkObjMap<GraphQLInputFieldConfig> = {};

        for (const [key, field] of Object.entries(Type.toConfig().fields)) {

            if (field.extensions?.relationship) {

                const inputType = getRelationInputType(Type, key, field);

                relationFields[key] = { type: inputType };
            }
        }

        const base = getGraphQLSetType(Type);
        const config = base.toConfig();

        const SetType = new GraphQLInputObjectType({
            name: `${Type.name}SetType`,
            fields: {
                ...config.fields,
                ...relationFields,
            },
        })

        const extended = new GraphQLInputObjectType({
            name: updateTypeName,
            fields: {
                set: { type: SetType },

                // TODO: add support for set on insert
                // setOnInsert: { type: getGraphQLSetOnInsertType(graphQLType, ...excludedFields) },

                // TODO: add support for inc updates
                // inc: { type: getGraphQLIncType(graphQLType, ...excludedFields) }
            },
        });

        extendedTypesCache[updateTypeName] = extended;

        return extended;
    }
}

export const getSimplifiedType = (Type: GraphQLObjectType<any, any>) => {

    const sourceConfig = Type.toConfig();
    const updatedConfig: ThunkObjMap<GraphQLFieldConfig<any, any, any>> = {}

    for (const [key, field] of Object.entries(sourceConfig.fields)) {

        if (field.extensions?.relationship) {

            updatedConfig[key] = {
                type: (field.extensions.relationship as any).linkType,
            }
        }
        else {
            updatedConfig[key] = field;
        }
    }

    const simplifiedType = new GraphQLObjectType({
        name: `${Type.name}Simple`,
        fields: updatedConfig,
    });

    return simplifiedType;
}

export const getFilterType = (Type: GraphQLObjectType<any, any>) => {

    const filterTypeName = `${Type.name}FilterType`;

    if (extendedTypesCache[filterTypeName]) {

        return extendedTypesCache[filterTypeName]
    }
    else {

        const sourceConfig = Type.toConfig();

        for (const [key, field] of Object.entries(sourceConfig.fields)) {

            if (field.extensions?.relationship) {

                sourceConfig.fields[key] = {
                    ...field,
                    resolve: undefined,
                    type: (field.extensions.relationship as any).linkType,
                }
            }
        }

        const updatedType = new GraphQLObjectType(sourceConfig);
        const filter = getGraphQLFilterType(updatedType);

        extendedTypesCache[filterTypeName] = filter;

        return filter;
    }
}


export const getUpdateArgs = (graphQLType: GraphQLObjectType) => {
    return {
        filter: { type: new GraphQLNonNull(getFilterType(graphQLType)) as GraphQLNonNull<GraphQLInputObjectType> },
        update: { type: new GraphQLNonNull(getUpdateType(graphQLType)) as GraphQLNonNull<GraphQLInputObjectType> }
    };
}

export function getQueryArgs(graphQLType: GraphQLObjectType) {
    return {
        filter: { type: getFilterType(graphQLType) },
        sort: { type: getGraphQLSortType(graphQLType) },
        pagination: { type: GraphQLPaginationType }
    };
}

const defaultQueryOptions: Required<QueryOptions> = {
    differentOutputType: false,
    excludedFields: [],
    isResolvedField: (field: GraphQLField<any, any>) => !!field.resolve
};

export function getQueryResolver<TSource, TContext>(
    graphQLType: GraphQLFieldsType,
    queryCallback: QueryCallback<TSource, TContext>,
    queryOptions?: QueryOptions): GraphQLFieldResolver<TSource, TContext> {
    if (!isType(graphQLType)) throw 'getMongoDbQueryResolver must recieve a graphql type';
    if (typeof queryCallback !== 'function') throw 'getMongoDbQueryResolver must recieve a queryCallback function';
    const requiredQueryOptions = { ...defaultQueryOptions, ...queryOptions };

    return async (source: TSource, args: { [argName: string]: any }, context: TContext, info: GraphQLResolveInfo): Promise<any> => {

        // we use different types for filtering and updating to support filtering by relationship fields
        const simpleType = getSimplifiedType(graphQLType as any);

        const filter = getMongoDbFilter(simpleType, args.filter);

        const projection = requiredQueryOptions.differentOutputType ? undefined : getMongoDbProjection(info, graphQLType, requiredQueryOptions);
        const options: MongoDbOptions = { projection };
        if (args.sort) options.sort = getMongoDbSort(args.sort);
        if (args.pagination && args.pagination.limit) options.limit = args.pagination.limit;
        if (args.pagination && args.pagination.skip) options.skip = args.pagination.skip;

        return await queryCallback(filter, projection!, options, source, args, context, info);
    }
}


export type UpdateOptions = {
    differentOutputType?: boolean;
    validateUpdateArgs?: boolean;
    overwrite?: boolean;
} & Partial<GetMongoDbProjectionOptions>;

const defaultUpdateOptions: Required<UpdateOptions> = {
    differentOutputType: false,
    validateUpdateArgs: false,
    overwrite: false,
    excludedFields: [],
    isResolvedField: undefined as any // TODO this needs to be updated on the package itself 
};

export function getUpdateResolver<TSource, TContext>(
    graphQLType: GraphQLObjectType,
    updateCallback: UpdateCallback<TSource, TContext>,
    updateOptions?: UpdateOptions): GraphQLFieldResolver<TSource, TContext> {
    if (!isType(graphQLType)) throw 'getMongoDbUpdateResolver must recieve a graphql type';
    if (typeof updateCallback !== 'function') throw 'getMongoDbUpdateResolver must recieve an updateCallback';
    const requiredUpdateOptions = { ...defaultUpdateOptions, ...updateOptions };

    return async (source: TSource, args: { [argName: string]: any }, context: TContext, info: GraphQLResolveInfo): Promise<any> => {

        // we use different types for filtering and updating to support filtering by relationship fields
        const simpleType = getSimplifiedType(graphQLType as any);

        const filter = getMongoDbFilter(simpleType, args.filter);

        if (requiredUpdateOptions.validateUpdateArgs) validateUpdateArgs(args.update, graphQLType, requiredUpdateOptions);
        const mongoUpdate = getMongoDbUpdate(args.update, requiredUpdateOptions.overwrite);
        const projection = requiredUpdateOptions.differentOutputType ? undefined : getMongoDbProjection(info, graphQLType, requiredUpdateOptions);
        return await updateCallback(filter, mongoUpdate.update, mongoUpdate.options, projection, source, args, context, info);
    };
}