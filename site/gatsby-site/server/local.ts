
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Resolvers } from './generated/graphql';
import { LongResolver, ObjectIDResolver } from 'graphql-scalars';
import localTypeDefs from './localTypeDefs';

import quickAddsTypeDefs, { resolvers as quickAddsResolvers } from './fields/quickadds';
import { transformer as authDirectiveTransformer, typeDefs as authTypeDefs } from './directives/auth';

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


    const schema = makeExecutableSchema({ typeDefs: [localTypeDefs, authTypeDefs, quickAddsTypeDefs], resolvers });

    const schemaWithAuth = authDirectiveTransformer(schema, 'auth');

    return schemaWithAuth;
}
