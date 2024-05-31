import {
    queryFields as quickAddsQueryFields,
    mutationFields as quickAddsMutationFields,
    permissions as quickAddsPermissions,
} from './fields/quickadds';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { shield, deny } from 'graphql-shield';
import { applyMiddleware } from 'graphql-middleware';
import { ObjectIdScalar } from './scalars';

export const getSchema = () => {

    const query = new GraphQLObjectType({
        name: 'Query',
        fields: {
            ObjectId: {
                type: ObjectIdScalar,
                description: 'Custom scalar for MongoDB ObjectID',
            },
            ...quickAddsQueryFields,
        }
    });

    const mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            ...quickAddsMutationFields,
        }
    });

    const schema = new GraphQLSchema({
        query,
        mutation,
    })

    // graphql-shield, allows us to define wildcard fields and mutations. Every field starts private, and its permissions need to be set explicitly.

    const permissions = shield(
        {
            Query: {
                "*": deny,
                ...quickAddsPermissions.Query,

            },
            Mutation: {
                "*": deny,
                ...quickAddsPermissions.Mutation,
            },
        },
        {
            allowExternalErrors: process.env.NODE_ENV !== 'production',
        }
    );

    const schemaWithAuth = applyMiddleware(schema, permissions)

    return schemaWithAuth;
}
