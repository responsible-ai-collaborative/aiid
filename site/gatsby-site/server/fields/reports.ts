import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { ObjectIdScalar } from "../scalars";
import { generateMutationFields, generateQueryFields } from "../utils";


const EmbeddingType = new GraphQLObjectType({
    name: 'ReportEmbedding',
    fields: {
        from_text_hash: { type: GraphQLString },
        vector: { type: new GraphQLList(GraphQLFloat) }
    }
});

export const ReportType = new GraphQLObjectType({
    name: 'Report',
    fields: {
        _id: { type: ObjectIdScalar },
        authors: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        cloudinary_id: { type: new GraphQLNonNull(GraphQLString) },
        date_downloaded: { type: new GraphQLNonNull(GraphQLString) },
        date_modified: { type: new GraphQLNonNull(GraphQLString) },
        date_published: { type: new GraphQLNonNull(GraphQLString) },
        date_submitted: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        editor_notes: { type: GraphQLString },
        embedding: { type: EmbeddingType },
        epoch_date_downloaded: { type: new GraphQLNonNull(GraphQLInt) },
        epoch_date_modified: { type: new GraphQLNonNull(GraphQLInt) },
        epoch_date_published: { type: new GraphQLNonNull(GraphQLInt) },
        epoch_date_submitted: { type: new GraphQLNonNull(GraphQLInt) },
        flag: { type: GraphQLBoolean },
        image_url: { type: new GraphQLNonNull(GraphQLString) },
        inputs_outputs: { type: new GraphQLList(GraphQLString) },
        is_incident_report: { type: GraphQLBoolean },
        language: { type: new GraphQLNonNull(GraphQLString) },
        plain_text: { type: new GraphQLNonNull(GraphQLString) },
        report_number: { type: new GraphQLNonNull(GraphQLInt) },
        source_domain: { type: new GraphQLNonNull(GraphQLString) },
        submitters: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        tags: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        url: { type: new GraphQLNonNull(GraphQLString) },
        user: { type: GraphQLString },
        quiet: { type: GraphQLBoolean }
    }
});

export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'reports', Type: ReportType })
}

export const mutationFields: GraphQLFieldConfigMap<any, any> = {

    ...generateMutationFields({ collectionName: 'reports', Type: ReportType }),
}

export const permissions = {
    Query: {
        report: allow,
        reports: allow,
    },
    Mutation: {
    }
}