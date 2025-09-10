import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { DateTimeResolver, GraphQLDateTime } from "graphql-scalars";
import { ObjectIdScalar } from "../scalars";
import { getRelationshipConfig } from "../utils";
import { Context } from "../interfaces";
import { UserType } from "./user";
import { EmbeddingType } from "./types";

const ReportTranslationsType = new GraphQLObjectType({
    name: 'ReportTranslations',
    fields: {
        text: { type: GraphQLString },
        title: { type: GraphQLString },
        plain_text: { type: GraphQLString },
        language: { type: new GraphQLNonNull(GraphQLString) },
        dirty: { type: GraphQLBoolean },
    }
});

export const ReportType = new GraphQLObjectType({
    name: 'Report',
    fields: {
        _id: { type: ObjectIdScalar },
        authors: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        cloudinary_id: { type: new GraphQLNonNull(GraphQLString) },
        created_at: { type: GraphQLDateTime },
        date_downloaded: { type: new GraphQLNonNull(DateTimeResolver) },
        date_modified: { type: new GraphQLNonNull(DateTimeResolver) },
        date_published: { type: new GraphQLNonNull(DateTimeResolver) },
        date_submitted: { type: new GraphQLNonNull(DateTimeResolver) },
        description: { type: GraphQLString },
        editor_notes: { type: GraphQLString },
        embedding: { type: EmbeddingType },
        epoch_date_modified: { type: GraphQLInt },
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
            type: new GraphQLList(ReportTranslationsType),
            args: {
                languages: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
            },
            resolve: async (source, args, context: Context) => {
                const translationsCollection = context.client.db('translations').collection("reports");
            
                const translations = await translationsCollection.find({
                    report_number: source.report_number,
                    language: { $in: args.languages }
                }).toArray();
            
                return args.languages.map((language: string) => {
                    const translation = translations.find(t => t.language === language);
                    
                    return translation ? {
                        text: translation.text,
                        title: translation.title,
                        plain_text: translation.plain_text,
                        dirty: translation.dirty,
                        language: language,
                    } : {
                        text: null,
                        title: null,
                        plain_text: null,
                        language: language,
                    };
                });
            },
        }
    }
});

//@ts-ignore
ReportType.getFields().translations.dependencies = [];
//@ts-ignore
ReportType.getFields().user.dependencies = ['user'];