import { GraphQLObjectType, GraphQLInt, GraphQLFloat } from 'graphql';

export const NlpSimilarIncidentType = new GraphQLObjectType({
    name: 'IncidentNlp_similar_incident', // this name is to prevent merging warnings when stitching schemas
    fields: () => ({
        incident_id: { type: GraphQLInt },
        similarity: { type: GraphQLFloat }
    })
});
