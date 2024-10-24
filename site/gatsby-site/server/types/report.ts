import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { DateTimeResolver } from "graphql-scalars";
import { ObjectIdScalar } from "../scalars";
import { getRelationshipConfig } from "../utils";
import { Context } from "../interfaces";
import { UserType } from "./user";
import { EmbeddingType } from "./types";

const ReportTranslationsType = new GraphQLObjectType({
    name: 'ReportTranslations',
    fields: {
        text: { type: GraphQLString },
        title: { type: GraphQLString }
    }
});

export const ReportType = new GraphQLObjectType({
    name: 'Report',
    fields: {
        _id: { type: ObjectIdScalar },
        authors: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        cloudinary_id: { type: new GraphQLNonNull(GraphQLString) },
        date_downloaded: { type: new GraphQLNonNull(DateTimeResolver) },
        date_modified: { type: new GraphQLNonNull(DateTimeResolver) },
        date_published: { type: new GraphQLNonNull(DateTimeResolver) },
        date_submitted: { type: new GraphQLNonNull(DateTimeResolver) },
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
        user: getRelationshipConfig(UserType, GraphQLString, 'user', 'userId', 'users', 'customData'),
        quiet: { type: GraphQLBoolean },
        translations: {
            type: ReportTranslationsType,
            args: {
                input: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (source, args, context: Context, info) => {

                const translations = context.client.db('translations').collection("reports_" + args.input);

                const translation = await translations.findOne({ report_number: source.report_number });

                if (translation) {

                    return { text: translation.text, title: translation.title };
                }

                return { text: "", title: "" }
            },
        }
    }
});

//@ts-ignore
ReportType.getFields().translations.dependencies = [];
//@ts-ignore
ReportType.getFields().user.dependencies = ['user'];