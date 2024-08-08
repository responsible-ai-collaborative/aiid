import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLFloat } from 'graphql';
import { ObjectIdScalar } from './scalars';


export const DeleteManyPayload = new GraphQLObjectType({
    name: 'DeleteManyPayload',
    fields: {
        deletedCount: {
            type: new GraphQLNonNull(GraphQLInt),
        },
    },
});

export const InsertManyPayload = new GraphQLObjectType({
    name: 'InsertManyPayload',
    fields: {
        insertedIds: {
            type: new GraphQLNonNull(new GraphQLList(ObjectIdScalar)),
        },
    },
});


export const UpdateManyPayload = new GraphQLObjectType({
    name: 'UpdateManyPayload',
    fields: {
        modifiedCount: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        matchedCount: {
            type: new GraphQLNonNull(GraphQLInt),
        },
    },
});

export const NlpSimilarIncidentType = new GraphQLObjectType({
    name: 'IncidentNlp_similar_incident', // this name is to prevent merging warnings when stitching schemas
    fields: () => ({
        incident_id: { type: GraphQLInt },
        similarity: { type: GraphQLFloat }
    })
});
