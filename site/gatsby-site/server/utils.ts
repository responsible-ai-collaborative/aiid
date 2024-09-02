import { GraphQLField, GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLFieldResolver, GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputType, GraphQLList, GraphQLNamedType, GraphQLNonNull, GraphQLObjectType, GraphQLResolveInfo, ThunkObjMap, isNonNullType, isType } from "graphql";
import { getGraphQLInsertType, getGraphQLFilterType, getGraphQLSortType, GraphQLPaginationType, MongoDbOptions, getMongoDbSort, getMongoDbProjection, getMongoDbQueryResolver, validateUpdateArgs, getMongoDbUpdate, GetMongoDbProjectionOptions, UpdateObj } from "graphql-to-mongodb";
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

/**
 * A cache to store GraphQL named type instances, ensuring compliance with GraphQL schema validation requirements.
 * This cache helps maintain consistency by returning the same object type instance for the same name across the schema.
 * 
 * The GraphQL specification requires that the same object type instance must be returned for the same name in order
 * to avoid inconsistencies and potential validation errors. This cache helps to meet that requirement.
 * 
 * @type {Object.<string, GraphQLNamedType>}
 */
const extendedTypesCache: { [key: string]: GraphQLNamedType } = {}


/**
 * Creates a GraphQL input type for a specified field of a base type, adding support for handling relationships.
 * This function is intended to work with types like `Incident` and adds a special `link` property to handle relationships.
 * 
 * @param {GraphQLNamedType} Type - The base GraphQL type from which the input type is derived.
 * @param {string} fieldName - The name of the field for which the input type is being created.
 * @param {GraphQLFieldConfig<any, any>} field - The field configuration object that contains extensions for relationships.
 * @returns {GraphQLInputObjectType} - The created input type with the relationship handling properties.
 * 
 * @throws {Error} Throws an error if the `createType` property in the relationship is encountered, as it is not yet implemented.
 */
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

/**
 * Creates a GraphQL input type from a base type, extending the functionality provided by the `graphql-to-mongodb` package's `getGraphQLInsertType` function.
 * This function adds relationship support to the input type, handling fields that are associated with relationships.
 * 
 * @param {GraphQLObjectType<any, any>} Type - The base GraphQL object type from which the input type is derived.
 * @returns {GraphQLInputObjectType} - The extended input type with added relationship handling properties.
 * 
 * @throws {Error} Throws an error if the `createType` property in the relationship is encountered, as it is not yet implemented.
 */
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

/**
 * Creates a GraphQL input type for updating a base type, extending the functionality provided by the `graphql-to-mongodb` package's `getGraphQLSetType` function.
 * This function adds support for handling relationships within the update input type.
 * 
 * Note: The `setOnInsert` and `inc` update functionalities are not yet supported.
 * 
 * @param {GraphQLObjectType<any, any>} Type - The base GraphQL object type from which the update input type is derived.
 * @returns {GraphQLInputObjectType} - The extended update input type with added relationship handling properties.
 */
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

/**
 * Creates a simplified GraphQL object type by removing relationship configurations from the base type.
 * This function is intended to be used with the `getMongoDbFilter` function from the `graphql-to-mongodb` package,
 * allowing for the derivation of filter types. It addresses the limitation that the package ignores fields with custom
 * resolver functions, thus enabling filtering by fields that handle relationships.
 * 
 * @param {GraphQLObjectType<any, any>} Type - The base GraphQL object type from which the simplified type is derived.
 * @returns {GraphQLObjectType} - The simplified GraphQL object type with relationship configurations removed.
 */
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

/**
 * Extends the `getGraphQLFilterType` function from the `graphql-to-mongodb` package to handle relationships,
 * deriving a filter type from a base GraphQL object type. This function modifies the base type's fields to remove
 * resolver functions and adjust relationship configurations, enabling proper filtering.
 * 
 * @param {GraphQLObjectType<any, any>} Type - The base GraphQL object type from which the filter type is derived.
 * @returns {GraphQLInputObjectType} - The derived filter type with adjustments for handling relationships.
 */
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


        // TODO: this is a hack to silence graphql-to-mongodb warnings
        Object.entries(updatedType.getFields()).forEach(([name, field]) => {

            if ((field as any).resolve) {

                (updatedType.getFields()[name] as any).dependencies = [name];
            }
        });


        const filter = getGraphQLFilterType(updatedType);

        extendedTypesCache[filterTypeName] = filter;

        return filter;
    }
}

/**
 * This function creates arguments for filtering and updating data, based on the provided GraphQL object type.
 * 
 * @param {GraphQLObjectType} graphQLType - The base GraphQL object type for which the update arguments are generated.
 * @returns {Object} An object containing `filter` and `update` arguments, both of which are required (`GraphQLNonNull`).
 *                  - `filter`: The filter type, used to specify which records to update.
 *                  - `update`: The update type, specifying the changes to be made.
 */
export const getUpdateArgs = (graphQLType: GraphQLObjectType) => {
    return {
        filter: { type: new GraphQLNonNull(getFilterType(graphQLType)) as GraphQLNonNull<GraphQLInputObjectType> },
        update: { type: new GraphQLNonNull(getUpdateType(graphQLType)) as GraphQLNonNull<GraphQLInputObjectType> }
    };
}

/**
 * Generates GraphQL arguments for querying data, including filtering, sorting, and pagination.
 * This function creates arguments based on the provided GraphQL object type, allowing for flexible query construction.
 * 
 * @param {GraphQLObjectType} graphQLType - The base GraphQL object type for which the query arguments are generated.
 * @returns {Object} An object containing the following arguments:
 *                  - `filter`: The filter type, used to specify criteria for selecting records.
 *                  - `sort`: The sort type, specifying the order of records.
 *                  - `pagination`: The pagination type, defining the pagination parameters such as limit and offset.
 */
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


/**
 * Creates a GraphQL query resolver for MongoDB, integrating filtering, sorting, and pagination.
 * This resolver is adapted from the `getMongoDbQueryResolver` function in the `graphql-to-mongodb` package.
 * It has been updated to handle relationships by using a simplified base type, ensuring that fields with relationships
 * are not ignored in filtering and projection operations.
 * 
 * @param {GraphQLFieldsType} graphQLType - The GraphQL type defining the structure of the fields to be queried.
 * @param {QueryCallback<TSource, TContext>} queryCallback - A callback function that executes the query and returns the results.
 * @param {QueryOptions} [queryOptions] - Optional configuration for the query, including default projection settings.
 * @returns {GraphQLFieldResolver<TSource, TContext>} - A resolver function to be used in GraphQL schema definitions.
 * 
 * @throws {Error} Throws an error if the `graphQLType` is not a valid GraphQL type or if `queryCallback` is not a function.
 */
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

/**
 * Creates a GraphQL update resolver for MongoDB, facilitating updates with integrated filtering and validation.
 * This resolver is an adaptation of the `getMongoDbUpdateResolver` from the `graphql-to-mongodb` package, 
 * updated to use a simplified base type for handling relationships.
 * It constructs MongoDB update operations and supports filtering by relationship fields.
 * 
 * @param {GraphQLObjectType} graphQLType - The GraphQL object type defining the structure of the fields to be updated.
 * @param {UpdateCallback<TSource, TContext>} updateCallback - A callback function that performs the update operation and returns the results.
 * @param {UpdateOptions} [updateOptions] - Optional configuration for the update operation, including validation and projection settings.
 * @returns {GraphQLFieldResolver<TSource, TContext>} - A resolver function to be used in GraphQL schema definitions for updating data.
 * 
 * @throws {Error} Throws an error if the `graphQLType` is not a valid GraphQL type or if `updateCallback` is not a function.
 */
export function getUpdateResolver<TSource, TContext>(
    graphQLType: GraphQLObjectType,
    updateCallback: UpdateCallback<TSource, TContext>,
    updateOptions?: UpdateOptions,
    isUpsert = false): GraphQLFieldResolver<TSource, TContext> {
    if (!isType(graphQLType)) throw 'getMongoDbUpdateResolver must recieve a graphql type';
    if (typeof updateCallback !== 'function') throw 'getMongoDbUpdateResolver must recieve an updateCallback';
    const requiredUpdateOptions = { ...defaultUpdateOptions, ...updateOptions };

    return async (source: TSource, args: { [argName: string]: any }, context: TContext, info: GraphQLResolveInfo): Promise<any> => {

        // we use different types for filtering and updating to support filtering by relationship fields
        const simpleType = getSimplifiedType(graphQLType as any);

        const filter = getMongoDbFilter(simpleType, args.filter);

        if (requiredUpdateOptions.validateUpdateArgs) validateUpdateArgs(args.update, graphQLType, requiredUpdateOptions);
        const mongoUpdate = getMongoDbUpdate(isUpsert ? { set: args.update } : args.update, requiredUpdateOptions.overwrite);
        const projection = requiredUpdateOptions.differentOutputType ? undefined : getMongoDbProjection(info, graphQLType, requiredUpdateOptions);
        return await updateCallback(filter, mongoUpdate.update, mongoUpdate.options, projection, source, args, context, info);
    };
}

type QueryFields = 'plural' | 'singular';

const defaultQueryFields: QueryFields[] = ['plural', 'singular'];

/**
 * Auto-generates GraphQL query fields for a specified collection, providing both singular and plural queries.
 * This function creates fields based on the provided GraphQL object type, enabling queries like `incident` and `incidents`
 * for a collection named `incident`.
 * 
 * @param {Object} params - The parameters for generating the query fields.
 * @param {string} params.collectionName - The name of the collection to query.
 * @param {string} [params.databaseName='aiidprod'] - The name of the database containing the collection.
 * @param {GraphQLObjectType<any, any>} params.Type - The GraphQL object type representing the structure of the collection's documents.
 * @param {QueryFields[]} [params.generateFields=defaultQueryFields] - An array specifying whether to generate singular, plural, or both query fields.
 * @returns {GraphQLFieldConfigMap<any, any>} - A map of GraphQL field configurations for the generated queries.
 */
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

class LinkValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LinkValidationError";
    }
}

/**
 * Validates relationship fields in the update object and returns the parsed MongoDB update object.
 * 
 * This function iterates over the fields of the update object, performs validation on relationship fields,
 * and constructs a new update object with the validated fields.
 * 
 * @param {GraphQLObjectType} Type - The GraphQL object type representing the schema of the object being updated.
 * @param {Record<string, any>} updateArg - The Graphql arguments passed to the mutation.
 * @param {UpdateObj} updateObj - The mongodb update object.
 * @param {Context} context - The current Graphql context.
 * 
 * @returns {Promise<Record<string, any>>} - A promise that resolves to the parsed MongoDB update object, 
 * where relationship fields have been validated and processed.
 * 
 * @async
 */
async function parseRelationshipFields(Type: GraphQLObjectType, updateArg: Record<string, any>, updateObj: UpdateObj, context: Context) {

    const parsedUpdate: any = {};

    const fields = Type.toConfig().fields;

    for (const [key, value] of Object.entries(updateObj.$set as Record<string, any>)) {

        if (key.endsWith('.link')) {

            const name = key.slice(0, -5);
            const field = fields[name];

            await (field.extensions!.relationship as any).linkValidation(updateArg, context);

            parsedUpdate[name] = value;
        }
        else {
            parsedUpdate[key] = value;
        }
    }

    return parsedUpdate;
}

type Data = { [key: string]: any }

type MutationFields = 'deleteOne' | 'deleteMany' | 'insertOne' | 'insertMany' | 'updateOne' | 'updateMany' | 'upsertOne';

const defaultMutationFields: MutationFields[] = ['deleteOne', 'deleteMany', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne'];

/**
 * Auto-generates GraphQL mutation fields for a specified collection, supporting various operations like delete, insert, update, and upsert.
 * This function creates mutation fields based on the provided GraphQL object type, enabling CRUD operations on the collection.
 * 
 * @param {Object} params - The parameters for generating the mutation fields.
 * @param {string} params.collectionName - The name of the collection to perform mutations on.
 * @param {string} [params.databaseName='aiidprod'] - The name of the database containing the collection.
 * @param {GraphQLObjectType<any, any>} params.Type - The GraphQL object type representing the structure of the collection's documents.
 * @param {MutationFields[]} [params.generateFields=defaultMutationFields] - An array specifying which mutation fields to generate.
 * @returns {GraphQLFieldConfigMap<any, any>} - A map of GraphQL field configurations for the generated mutations.
 */
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

                try {

                    const insert = await parseRelationshipFields(Type, data, getMongoDbUpdate({ set: data }).update, context);

                    const db = context.client.db(databaseName);
                    const collection = db.collection(collectionName);

                    const result = await collection.insertOne(insert);

                    const inserted = await collection.findOne({ _id: result.insertedId });

                    return inserted;
                }
                catch (e) {

                    if (e instanceof LinkValidationError) {

                        return e;
                    }

                    throw e;
                }
            },
        }
    }

    if (generateFields.includes('insertMany')) {

        fields[`insertMany${pluralName}`] = {
            type: InsertManyPayload,
            args: { data: { type: new GraphQLNonNull(new GraphQLList(getInsertType(Type))) } },
            resolve: async (_: unknown, { data }: { data: Array<any> }, context) => {

                try {

                    const db = context.client.db(databaseName);
                    const collection = db.collection(collectionName);

                    const insert = await Promise.all(data.map(async (item) => {
                        return await parseRelationshipFields(Type, item, getMongoDbUpdate({ set: item }).update, context);
                    }));

                    const result = await collection.insertMany(insert);

                    return { insertedIds: Object.values(result.insertedIds) };
                }
                catch (e) {

                    if (e instanceof LinkValidationError) {

                        return e;
                    }

                    throw e;
                }
            },
        }
    }

    if (generateFields.includes('updateOne')) {

        fields[`updateOne${singularName}`] = {
            type: Type,
            args: getUpdateArgs(Type),
            resolve: getUpdateResolver(Type, async (filter, mongoUpdate, options, projection, obj, args, context) => {

                try {

                    const db = context.client.db(databaseName);
                    const collection = db.collection(collectionName);

                    const update = await parseRelationshipFields(Type, args.update.set, mongoUpdate, context);

                    await collection.updateOne(filter, { $set: update }, options);

                    const updated = await collection.findOne(filter);

                    return updated;
                }
                catch (e) {

                    if (e instanceof LinkValidationError) {

                        return e;
                    }

                    throw e;
                }
            }),
        }
    }

    if (generateFields.includes('updateMany')) {

        fields[`updateMany${pluralName}`] = {
            type: UpdateManyPayload,
            args: getUpdateArgs(Type),
            resolve: getUpdateResolver(Type, async (filter, mongoUpdate, options, projection, obj, args, context) => {

                try {

                    const db = context.client.db(databaseName);
                    const collection = db.collection(collectionName);

                    const update = await parseRelationshipFields(Type, args.update.set, mongoUpdate, context);

                    const result = await collection.updateMany(filter, { $set: update }, options);

                    return { modifiedCount: result.modifiedCount!, matchedCount: result.matchedCount };
                }
                catch (e) {

                    if (e instanceof LinkValidationError) {

                        return e;
                    }
                }
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
            resolve: getUpdateResolver(Type, async (filter, mongoUpdate, options, projection, obj, args, context: Context) => {

                try {

                    const db = context.client.db(databaseName);
                    const collection = db.collection(collectionName);

                    const update: any = await parseRelationshipFields(Type, args.update, mongoUpdate, context);

                    await collection.updateOne(filter, { $set: update }, { ...projection, upsert: true });

                    const updated = await collection.findOne(filter);

                    return updated;
                }
                catch (e) {
                    if (e instanceof LinkValidationError) {

                        return e;
                    }

                    throw e;
                }
            }, {}, true),
        }
    }

    return fields;
}

/**
 * Makes an API request to the MongoDB Atlas Admin API, supporting only GET methods.
 * This function handles authentication using a public/private API key pair and returns the response from the API.
 * 
 * **Note:** Use with caution as this function has admin privileges.
 * 
 * @param {Object} params - The parameters for the API request.
 * @param {string} params.path - The API endpoint path.
 * @param {string} [params.method='GET'] - The HTTP method for the request. Currently, only 'GET' is supported.
 * @returns {Promise<any>} - The response from the API or an error object if the request fails.
 * 
 * @throws {Error} Throws an error if an unsupported HTTP method is provided.
 */
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
 * Returns a GraphQL field extension used to configure relationships between base types.
 * This function is useful for setting up list-based relationships in GraphQL schemas, ensuring that linked entities are valid.
 * 
 * @param {string} sourceField - The field in the source GraphQL object containing the list of linked entity IDs.
 * @param {string} targetField - The field in the target documents that matches the sourceField values.
 * @param {GraphQLNamedType} LinkType - The GraphQL type representing the linked entities.
 * @param {string} databaseName - The name of the database containing the collection.
 * @param {string} collectionName - The name of the collection where the linked entities are stored.
 * @returns {Object} - An object containing `linkType` and `linkValidation` properties.
 *                     - `linkType`: The expected type for the relationship.
 *                     - `linkValidation`: A function that checks if the supplied IDs for the relationship are valid by verifying their existence in the specified collection.
 * 
 * @throws {LinkValidationError} Throws an error if the linked IDs are invalid or do not exist in the specified collection.
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

                throw new LinkValidationError(`Invalid linked ids: ${sourceField} -> [${source[sourceField].link.join(',')}]`);
            }
        }
    }
}

/**
 * Generates a resolver function that fetches documents targeted by a relationship.
 * 
 * @param {string} sourceField - The field in the source GraphQL object containing the list of linked entity IDs.
 * @param {string} targetField - The field in the target documents that matches the sourceField values.
 * @param {GraphQLObjectType} ReferencedType - The GraphQL object type representing the structure of the linked entities.
 * @param {string} databaseName - The name of the database containing the collection of linked entities.
 * @param {string} collectionName - The name of the collection where the linked entities are stored.
 * @param {string} [sourceFieldOnDatabase] - An optional parameter specifying an alternative field in the database to use for matching the relationship.
 * @returns {GraphQLFieldResolver<any, Context>} - A resolver function that queries the database to fetch the documents related by the specified relationship.
 */
export const getListRelationshipResolver = (
    sourceField: string,
    targetField: string,
    ReferencedType: GraphQLObjectType,
    databaseName: string,
    collectionName: string,
    sourceFieldOnDatabase?: string
) => {

    return getMongoDbQueryResolver(ReferencedType, async (filter, projection, options, source: any, args, context: Context) => {

        const db = context.client.db(databaseName);

        const collection = db.collection(collectionName);

        const result = source[sourceFieldOnDatabase ?? sourceField]?.length
            ? await collection.find({ [targetField]: { $in: source[sourceFieldOnDatabase ?? sourceField] } }, options).toArray()
            : []

        return result;
    })
}

/**
 * Creates a configuration object for a GraphQL field that represents a list-based relationship.
 * This configuration includes the type, resolver, and extensions needed to handle the relationship between GraphQL objects.
 * 
 * @param {GraphQLObjectType} ReferencedType - The GraphQL object type representing the linked entities.
 * @param {GraphQLNamedType} ReferencedFieldType - The GraphQL type of the field in the linked entities.
 * @param {string} sourceField - The field in the source GraphQL object containing the list of linked entity IDs.
 * @param {string} targetField - The field in the target documents that matches the sourceField values.
 * @param {string} targetCollection - The name of the collection where the linked entities are stored.
 * @param {string} targetDatabase - The name of the database containing the collection of linked entities.
 * @returns {GraphQLFieldConfig<any, Context>} - A GraphQL field configuration object, including type, resolver, and extensions.
 */
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

/**
 * Creates a GraphQL field extension for configuring a single entity relationship.
 * This extension includes a type definition and validation function to ensure the integrity of the relationship.
 * 
 * @param {string} sourceField - The field in the source GraphQL object containing the ID of the linked entity.
 * @param {string} targetField - The field in the target document that matches the sourceField value.
 * @param {GraphQLNamedType} LinkType - The GraphQL type representing the linked entity.
 * @param {string} databaseName - The name of the database containing the collection of the linked entity.
 * @param {string} collectionName - The name of the collection where the linked entity is stored.
 * @returns {Object} - An object containing `linkType` and `linkValidation` properties.
 *                     - `linkType`: The GraphQL type of the linked entity, indicating the expected type for the relationship.
 *                     - `linkValidation`: A function that checks if the supplied ID for the relationship is valid by verifying its existence in the specified collection.
 * 
 * @throws {Error} Throws an error if the linked entity ID is invalid or does not exist in the specified collection.
 */
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

                throw new LinkValidationError(`Invalid linked id: ${sourceField} -> ${source[sourceField].link}`);
            }
        }
    }
}

/**
 * Creates a resolver function for fetching a single related document in a GraphQL schema.
 * This resolver is used to resolve fields that represent single entity relationships between GraphQL objects.
 * 
 * @param {string} sourceField - The field in the source GraphQL object containing the ID of the linked entity.
 * @param {string} targetField - The field in the target document that matches the sourceField value.
 * @param {GraphQLObjectType} ReferencedType - The GraphQL object type representing the structure of the linked entity.
 * @param {string} databaseName - The name of the database containing the collection of the linked entity.
 * @param {string} collectionName - The name of the collection where the linked entity is stored.
 * @returns {GraphQLFieldResolver<any, Context>} - A resolver function that queries the database to fetch the document related by the specified relationship.
 */
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

/**
 * Creates a configuration object for a GraphQL field that represents a single entity relationship.
 * This configuration includes the type, resolver, and extensions needed to handle the relationship between GraphQL objects.
 * 
 * @param {GraphQLObjectType} ReferencedType - The GraphQL object type representing the linked entity.
 * @param {GraphQLNamedType} ReferencedFieldType - The GraphQL type of the field in the linked entity.
 * @param {string} sourceField - The field in the source GraphQL object containing the ID of the linked entity.
 * @param {string} targetField - The field in the target document that matches the sourceField value.
 * @param {string} targetCollection - The name of the collection where the linked entity is stored.
 * @param {string} targetDatabase - The name of the database containing the collection of the linked entity.
 * @returns {GraphQLFieldConfig<any, Context>} - A GraphQL field configuration object, including type, resolver, and extensions for handling the relationship.
 */
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