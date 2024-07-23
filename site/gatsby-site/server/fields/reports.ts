import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { ObjectIdScalar } from "../scalars";
import { generateMutationFields, generateQueryFields, getRelationshipExtension, getRelationshipResolver } from "../utils";
import { Context } from "../interfaces";
import { isRole } from "../rules";
import { UserType } from "./users";
import { getMongoDbQueryResolver } from "graphql-to-mongodb";
import { DateTimeResolver } from "graphql-scalars";
import { UpdateOneReportTranslationInput } from "../generated/graphql";


const EmbeddingType = new GraphQLObjectType({
    name: 'ReportEmbedding',
    fields: {
        from_text_hash: { type: GraphQLString },
        vector: { type: new GraphQLList(GraphQLFloat) }
    }
});

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
        user: {
            type: UserType,
            resolve: getRelationshipResolver('user', 'userId', UserType, 'customData', 'users'),
            extensions: {
                relationship: getRelationshipExtension('user', 'userId', GraphQLString, 'customData', 'users')
            },
        },
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

export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'reports', Type: ReportType })
}


const UpdateOneReportTranslationInput = new GraphQLInputObjectType({
    name: 'UpdateOneReportTranslationInput',
    fields: {
        language: { type: new GraphQLNonNull(GraphQLString) },
        plain_text: { type: new GraphQLNonNull(GraphQLString) },
        report_number: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export const mutationFields: GraphQLFieldConfigMap<any, any> = {

    ...generateMutationFields({ collectionName: 'reports', Type: ReportType, generateFields: ['updateOne', 'deleteOne', 'insertOne'] }),

    flagReport: {
        type: ReportType,
        args: {
            report_number: { type: new GraphQLNonNull(GraphQLInt) },
            input: { type: new GraphQLNonNull(GraphQLBoolean) }
        },
        resolve: getMongoDbQueryResolver(ReportType, async (filter, projection, options, obj, args, context) => {

            const reports = context.client.db('aiidprod').collection("reports");

            const report = await reports.findOne({ report_number: args.report_number }, { projection: { report_number: 1 } });

            if (report) {

                const result = await reports.updateOne({ report_number: args.report_number }, {
                    $set: {
                        flag: args.input,
                        date_modified: new Date(),
                        epoch_date_modified: Math.floor(Date.now() / 1000)
                    }
                });

                if (result.matchedCount == 1) {

                    const report = await reports.findOne({ report_number: args.report_number }, options);

                    return report;
                }
                else {

                    throw new Error("Failed to update report");
                }

            } else {

                throw new Error("Report not found");
            }
        }),
    },

    updateOneReportTranslation: {
        args: {
            input: { type: new GraphQLNonNull(UpdateOneReportTranslationInput) }
        },
        type: ReportType,
        resolve: getMongoDbQueryResolver(ReportType, async (filter, projection, options, obj, args, context) => {

            const translations = context.client.db('translations').collection("reports_" + args.input.language);

            const update = {
                title: args.input.title,
                text: args.input.text,
                plain_text: args.input.plain_text
            };

            await translations.updateOne({ report_number: args.input.report_number }, { $set: { ...update } }, { upsert: true });


            const reports = context.client.db('aiidprod').collection("reports");

            const report = await reports.findOne({ report_number: args.input.report_number }, options);

            return report;
        }),
    },
}

export const permissions = {
    Query: {
        report: allow,
        reports: allow,
    },
    Mutation: {
        deleteOneReport: isRole('incident_editor'),
        insertOneReport: isRole('incident_editor'),
        updateOneReport: isRole('incident_editor'),

        flagReport: allow,
        updateOneReportTranslation: isRole('incident_editor'),
    }
}