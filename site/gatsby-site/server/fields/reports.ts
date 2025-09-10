import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { generateMutationFields, generateQueryFields, getQueryResolver } from "../utils";
import { isRole } from "../rules";
import { linkReportsToIncidents, logReportHistory } from "./common";
import { ReportType } from "../types/report";
import { Context, DBReport } from "../interfaces";


export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'reports', Type: ReportType })
}

function getUnixTime(dateString: string) {

    return Math.floor(new Date(dateString).getTime() / 1000);
}

function formatDate(date: Date) {
    let month = `${date.getMonth() + 1}`;
    let day = `${date.getDate()}`;
    const year = date.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return `${year}-${month}-${day}`;
}

const CreateVariantPayload = new GraphQLObjectType({
    name: 'CreateVariantPayload',
    fields: {
        incident_id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The unique identifier for the incident.'
        },
        report_number: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The unique report number associated with the incident.'
        }
    }
});

const VariantInputType = new GraphQLInputObjectType({
    name: 'CreateVariantInputVariant',
    description: 'Input details for the variant, including publication date, inputs/outputs, submitters, and text.',
    fields: {
        date_published: {
            type: GraphQLString,
            description: 'The date when the variant was published.'
        },
        inputs_outputs: {
            type: new GraphQLList(GraphQLString),
            description: 'List of inputs and outputs related to the variant.'
        },
        submitters: {
            type: new GraphQLList(GraphQLString),
            description: 'List of submitters associated with the variant.'
        },
        text: {
            type: GraphQLString,
            description: 'The textual content of the variant.'
        }
    }
});

const CreateVariantInput = new GraphQLInputObjectType({
    name: 'CreateVariantInput',
    description: 'Input type for creating a variant, including incident ID and variant details.',
    fields: {
        incidentId: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The unique identifier for the incident.'
        },
        variant: {
            type: VariantInputType,
            description: 'Details about the variant.'
        }
    }
});


export const mutationFields: GraphQLFieldConfigMap<any, any> = {

    ...generateMutationFields({
        collectionName: 'reports',
        Type: ReportType,
        generateFields: ['updateOne', 'deleteOne', 'insertOne'],
        onResolve: async (operation, context, params) => {

            const { result } = params!;

            if (operation === 'updateOne' || operation === 'insertOne') {

                await logReportHistory(result, context)
            }

            return result;
        },
    }),

    flagReport: {
        type: ReportType,
        args: {
            report_number: { type: new GraphQLNonNull(GraphQLInt) },
            input: { type: new GraphQLNonNull(GraphQLBoolean) }
        },
        resolve: getQueryResolver(ReportType, async (filter, projection, options, obj, args, context) => {

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
            input: {
                type: new GraphQLNonNull(new GraphQLInputObjectType({
                    name: 'UpdateOneReportTranslationInput',
                    fields: {
                        language: { type: new GraphQLNonNull(GraphQLString) },
                        plain_text: { type: new GraphQLNonNull(GraphQLString) },
                        report_number: { type: new GraphQLNonNull(GraphQLInt) },
                        text: { type: new GraphQLNonNull(GraphQLString) },
                        title: { type: new GraphQLNonNull(GraphQLString) },
                        dirty: { type: GraphQLBoolean },
                    },
                }))
            }
        },
        type: ReportType,
        resolve: getQueryResolver(ReportType, async (filter, projection, options, obj, args, context) => {
            // update the translation in the `reports` collection
            const translationsCollection = context.client.db('translations').collection("reports");

            const translation = {
                title: args.input.title,
                text: args.input.text,
                plain_text: args.input.plain_text,
                language: args.input.language,
                dirty: args.input.dirty,
            };
            
            await translationsCollection.updateOne(
                {
                    report_number: args.input.report_number,
                    language: args.input.language,
                }, 
                {
                    $set: { ...translation }
                }, 
                { upsert: true }
            );

            const reports = context.client.db('aiidprod').collection("reports");

            const report = await reports.findOne({ report_number: args.input.report_number }, options);

            return report;
        }),
    },

    createVariant: {
        type: CreateVariantPayload,
        args: {
            input: {
                type: new GraphQLNonNull(CreateVariantInput),
            },
        },
        resolve: async (source, { input }, context: Context) => {

            const incidents = context.client.db('aiidprod').collection("incidents");
            const reports = context.client.db('aiidprod').collection<DBReport>("reports");

            const parentIncident = await incidents.findOne({ incident_id: input.incidentId });

            if (!parentIncident) {
                throw `Incident ${input.incidentId} not found`;
            }

            const lastReport = await reports.find({}).sort({ report_number: -1 }).limit(1).next();

            const report_number = lastReport ? lastReport.report_number + 1 : 1;

            const now = new Date();

            const todayFormated = formatDate(now);

            const newReport = {
                report_number,
                is_incident_report: false,
                title: '',
                date_downloaded: now,
                date_modified: now,
                date_published: input.variant.date_published ? new Date(input.variant.date_published) : now,
                date_submitted: now,
                epoch_date_modified: getUnixTime(now.toString()),
                epoch_date_published: getUnixTime(input.variant.date_published ? input.variant.date_published : todayFormated),
                epoch_date_submitted: getUnixTime(todayFormated),
                image_url: '',
                cloudinary_id: '',
                authors: [],
                submitters: input.variant.submitters?.length > 0 ? input.variant.submitters : ['Anonymous'],
                text: input.variant.text,
                plain_text: '',
                url: '',
                source_domain: '',
                language: 'en',
                tags: ['variant:unreviewed'],
                inputs_outputs: input.variant.inputs_outputs,
                user: context.user?.id ?? '',
            };

            await reports.insertOne({ ...newReport, report_number: newReport.report_number, created_at: new Date() });

            const incident_ids = [input.incidentId];
            const report_numbers = [newReport.report_number];

            await linkReportsToIncidents(context.client, incident_ids, report_numbers);

            return {
                incident_id: input.incidentId,
                report_number,
            }
        }
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
        createVariant: allow,
    }
}