import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';

import gql from "graphql-tag";

export const typeDefs = gql`
directive @auth(requires: Role = admin) on OBJECT | FIELD_DEFINITION

enum Role {
  admin
  subscriber
}
`

export const transformer = (schema: GraphQLSchema, directiveName: string) => {

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

