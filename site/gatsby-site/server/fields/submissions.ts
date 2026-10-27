import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLFieldConfigMap,
    GraphQLInputObjectType
} from 'graphql';
import { generateMutationFields, generateQueryFields } from '../utils';
import { Context, DBIncident, DBNotification, DBSubmission } from '../interfaces';
import { allow, or } from 'graphql-shield';
import { ObjectIdScalar } from '../scalars';
import { isRole } from '../rules';
import { createNotificationsOnNewIncident, linkReportsToIncidents } from './common';
import { SubmissionType } from '../types/submission';


export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ collectionName: 'submissions', Type: SubmissionType })
}


const PromoteSubmissionToReportPayload = new GraphQLObjectType({
    name: 'PromoteSubmissionToReportPayload',
    fields: {
        incident_ids: { type: new GraphQLList(GraphQLInt) },
        report_number: { type: GraphQLInt },
    },
});

const PromoteSubmissionToReportInput = new GraphQLInputObjectType({
    name: 'PromoteSubmissionToReportInput',
    fields: {
        incident_ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) },
        is_incident_report: { type: GraphQLBoolean },
        submission_id: { type: new GraphQLNonNull(ObjectIdScalar) },
    },
});

function getUnixTime(dateString: string) {

    return Math.floor(new Date(dateString).getTime() / 1000);
}


export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateMutationFields({ collectionName: 'submissions', Type: SubmissionType, generateFields: ['deleteOne', 'updateOne', 'insertOne'] }),

    promoteSubmissionToReport: {
        type: new GraphQLNonNull(PromoteSubmissionToReportPayload),
        args: {
            input: { type: new GraphQLNonNull(PromoteSubmissionToReportInput) },
        },

        resolve: async (source, { input }, context) => {

            const submissions = context.client.db('aiidprod').collection<DBSubmission>("submissions");
            const incidents = context.client.db('aiidprod').collection<DBIncident>("incidents");

            // TODO: Strictly type these collections using the DB* types
            const reports = context.client.db('aiidprod').collection("reports");
            const notificationsCollection = context.client.db('customData').collection<DBNotification>("notifications");
            const incidentsHistory = context.client.db('history').collection("incidents");
            const reportsHistory = context.client.db('history').collection("reports");

            const target = await submissions.findOne({ _id: input.submission_id });

            if (!target) {
                throw new Error('Submission not found');
            }

            const { _id: undefined, ...submission }: DBSubmission = target;

            const parentIncidents: DBIncident[] = await incidents.find({ incident_id: { $in: input.incident_ids } }).toArray();

            const lastReport = await reports.find({}).sort({ report_number: -1 }).limit(1).next();

            const report_number = lastReport ? lastReport.report_number + 1 : 1;

            if (input.is_incident_report) {

                if (parentIncidents.length == 0) {

                    const lastIncident = await incidents.find({}).sort({ incident_id: -1 }).limit(1).next();

                    const incident_id = lastIncident ? lastIncident.incident_id + 1 : 1;

                    const editors = (!submission.incident_editors || !submission.incident_editors.length)
                        ? ['65031f49ec066d7c64380f5c'] // Default user. For more information refer to the wiki page: https://github.com/responsible-ai-collaborative/aiid/wiki/Special-non%E2%80%90secret-values
                        : submission.incident_editors;

                    const newIncident: DBIncident = {
                        title: submission.incident_title || submission.title,
                        description: submission.description,
                        incident_id,
                        reports: [],
                        editors,
                        date: submission.incident_date!,
                        "Alleged deployer of AI system": submission.deployers || [],
                        "Alleged developer of AI system": submission.developers || [],
                        "Alleged harmed or nearly harmed parties": submission.harmed_parties || [],
                        nlp_similar_incidents: submission.nlp_similar_incidents || [],
                        editor_similar_incidents: submission.editor_similar_incidents || [],
                        editor_dissimilar_incidents: submission.editor_dissimilar_incidents || [],
                        implicated_systems: submission.implicated_systems || [],
                        editor_notes: submission.editor_notes ?? '',
                        flagged_dissimilar_incidents: [],
                        created_at: new Date(),
                        date_modified: submission.date_modified ? new Date(submission.date_modified) : new Date(), // Default to today in YYYY-MM-DD format
                    }

                    await incidents.insertOne({ ...newIncident, incident_id: newIncident.incident_id, created_at: new Date() });


                    await createNotificationsOnNewIncident(newIncident, context);


                    if (submission.user) {

                        await notificationsCollection.insertOne({
                            type: 'submission-promoted',
                            incident_id: newIncident.incident_id,
                            processed: false,
                            userId: submission.user,
                            created_at: new Date(),
                        });
                    }

                    parentIncidents.push(newIncident);

                }
            }

            const newReport: Record<string, unknown> & { report_number: number } = {
                report_number,
                is_incident_report: input.is_incident_report,
                title: submission.title,
                date_downloaded: new Date(submission.date_downloaded),
                date_modified: new Date(submission.date_modified),
                date_published: new Date(submission.date_published),
                date_submitted: new Date(submission.date_submitted),
                epoch_date_published: getUnixTime(submission.date_published),
                epoch_date_submitted: getUnixTime(submission.date_submitted),
                image_url: submission.image_url,
                cloudinary_id: submission.cloudinary_id,
                authors: submission.authors,
                submitters: submission.submitters,
                text: submission.text,
                plain_text: submission.plain_text,
                url: submission.url,
                source_domain: submission.source_domain,
                language: submission.language,
                tags: submission.tags,
                quiet: submission.quiet || false,
                snippet_max_characters: submission.snippet_max_characters || 1000000,
            };

            if (submission.user) {
                newReport.user = submission.user;
            }

            await reports.insertOne({ ...newReport, report_number: newReport.report_number, created_at: new Date() });

            const incident_ids: number[] = parentIncidents.map(incident => incident.incident_id!);
            const report_numbers: number[] = [newReport.report_number];

            await linkReportsToIncidents(context.client, report_numbers, incident_ids);

            // Snapshot the actual linked incident, without creating/recomputing legacy vectors.
            if (input.is_incident_report) {
                for (const incident_id of incident_ids) {
                    const linked = await incidents.findOne({ incident_id });
                    if (!linked) continue;
                    const { _id, ...values } = linked;
                    const incidentHistory: Record<string, unknown> = { ...values, created_at: new Date() };
                    if (submission.user) incidentHistory.modifiedBy = submission.user;
                    await incidentsHistory.insertOne(incidentHistory);
                }
            }

            const reportHistory: Record<string, unknown> = {
                ...newReport,
                report_number: newReport.report_number,
            };

            if (submission.user) {
                reportHistory.modifiedBy = submission.user;
            }

            await reportsHistory.insertOne(reportHistory);

            await submissions.deleteOne({ _id: input.submission_id });

            return {
                incident_ids,
                report_number,
            };
        }
    }
}

export const permissions = {
    Query: {
        submission: allow,
        submissions: allow,
    },
    Mutation: {
        deleteOneSubmission: isRole('incident_editor'),

        // Editing a queued submission is a review-queue action. The client already
        // limits it to these roles (`canEditSubmissions` in SubmissionEditForm.js);
        // `isRole` additionally lets admins through.
        updateOneSubmission: or(isRole('submitter'), isRole('incident_editor')),

        // Anyone may put a report into the review queue...
        insertOneSubmission: allow,

        // ...but only an editor may publish one out of it.
        promoteSubmissionToReport: isRole('incident_editor'),
    }
}
