import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { DateTimeResolver, GraphQLDateTime } from "graphql-scalars";
import { ObjectIdScalar } from "../scalars";
import { EmbeddingType } from "./types";

export const ReportHistoryType = new GraphQLObjectType({
    name: 'History_report',
    fields: {
        _id: { type: ObjectIdScalar },
        authors: { type: new GraphQLList(GraphQLString) },
        cloudinary_id: { type: GraphQLString },
        created_at: { type: GraphQLDateTime },
        date_downloaded: { type: new GraphQLNonNull(DateTimeResolver) },
        date_modified: { type: new GraphQLNonNull(DateTimeResolver) },
        date_published: { type: new GraphQLNonNull(DateTimeResolver) },
        date_submitted: { type: new GraphQLNonNull(DateTimeResolver) },
        description: { type: GraphQLString },
        modifiedBy: { type: GraphQLString },
        editor_notes: { type: GraphQLString },
        embedding: { type: EmbeddingType },
        epoch_date_downloaded: { type: GraphQLInt },
        epoch_date_modified: { type: GraphQLInt },
        epoch_date_published: { type: GraphQLInt },
        epoch_date_submitted: { type: GraphQLInt },
        flag: { type: GraphQLBoolean },
        image_url: { type: GraphQLString },
        inputs_outputs: { type: new GraphQLList(GraphQLString) },
        is_incident_report: { type: GraphQLBoolean },
        language: { type: GraphQLString },
        plain_text: { type: GraphQLString },
        report_number: { type: GraphQLInt },
        source_domain: { type: GraphQLString },
        submitters: { type: new GraphQLList(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
        text: { type: GraphQLString },
        title: { type: GraphQLString },
        url: { type: GraphQLString },
        user: { type: GraphQLString },
        quiet: { type: GraphQLBoolean },
    }
});
