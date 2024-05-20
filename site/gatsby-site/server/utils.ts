import { GraphQLFieldConfigMap, GraphQLList, GraphQLObjectType } from "graphql";
import { getGraphQLQueryArgs, getMongoDbQueryResolver } from "graphql-to-mongodb";
import { Context } from "./interfaces";

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