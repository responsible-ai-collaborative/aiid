import { GraphQLObjectType, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLList } from 'graphql';

export const NlpSimilarIncidentType = new GraphQLObjectType({
    name: 'IncidentNlp_similar_incident', // this name is to prevent merging warnings when stitching schemas
    fields: () => ({
        incident_id: { type: GraphQLInt },
        similarity: { type: GraphQLFloat }
    })
});

export const EmbeddingType = new GraphQLObjectType({
    name: 'ReportEmbedding',
    fields: {
        from_text_hash: { type: GraphQLString },
        vector: { type: new GraphQLList(GraphQLFloat) }
    }
});