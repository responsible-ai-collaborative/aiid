import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';

export const DeleteManyPayload = new GraphQLObjectType({
    name: 'DeleteManyPayload',
    fields: {
        deletedCount: {
            type: new GraphQLNonNull(GraphQLInt),
        },
    },
});