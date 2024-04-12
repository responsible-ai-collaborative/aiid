
import { makeExecutableSchema } from '@graphql-tools/schema';
import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { Resolvers } from './generated/graphql';
import { LongResolver, ObjectIDResolver } from 'graphql-scalars';

import localTypeDefs from './localTypeDefs';

import { resolvers as quickAddsResolvers, typeDefs as quickAddsTypeDefs } from './fields/quickadds';


function authDirectiveTransformer(schema: GraphQLSchema, directiveName: string) {

    const typeDirectiveArgumentMaps: Record<string, any> = {}

    return mapSchema(schema, {
        [MapperKind.TYPE]: type => {
            const authDirective = getDirective(schema, type, directiveName)?.[0]
            if (authDirective) {
                typeDirectiveArgumentMaps[type.name] = authDirective
            }
            return undefined
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
            const authDirective =
                getDirective(schema, fieldConfig, directiveName)?.[0] ??
                typeDirectiveArgumentMaps[typeName]
            if (authDirective) {
                const { requires } = authDirective
                if (requires) {

                    const { resolve = defaultFieldResolver } = fieldConfig;

                    fieldConfig.resolve = function (source, args, context, info) {

                        const { user } = context;

                        if (!user || !user.roles || !user.roles.includes(requires)) {

                            throw new Error('not authorized')
                        }

                        return resolve(source, args, context, info)
                    }
                    return fieldConfig
                }
            }
        }
    })
}


export const getSchema = async () => {

    const resolvers: Resolvers = {
        ObjectId: ObjectIDResolver,
        Long: LongResolver,
        Query: {
            ...quickAddsResolvers.Query,
        },
        Mutation: {
            ...quickAddsResolvers.Mutation,
        }
    };


    const schema = makeExecutableSchema({ typeDefs: [localTypeDefs, quickAddsTypeDefs], resolvers });

    const schemaWithAuth = authDirectiveTransformer(schema, 'auth');

    return schemaWithAuth;
}


