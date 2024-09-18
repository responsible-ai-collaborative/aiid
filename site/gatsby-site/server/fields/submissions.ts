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
import { Context } from '../interfaces';
import { allow } from 'graphql-shield';
import { ObjectIdScalar } from '../scalars';
import { isRole } from '../rules';
import { linkReportsToIncidents } from './common';
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

            const submissions = context.client.db('aiidprod').collection("submissions");
            const incidents = context.client.db('aiidprod').collection("incidents");
            const reports = context.client.db('aiidprod').collection("reports");
            const notificationsCollection = context.client.db('customData').collection("notifications");
            const incidentsHistory = context.client.db('history').collection("incidents");
            const reportsHistory = context.client.db('history').collection("reports");

            const target = await submissions.findOne({ _id: input.submission_id });

            if (!target) {
                throw new Error('Submission not found');
            }

            const { _id: undefined, ...submission } = target;

            const parentIncidents: Array<Record<string, unknown> & { incident_id?: number, reports?: Record<string, unknown>[] }> = await incidents.find({ incident_id: { $in: input.incident_ids } }).toArray();

            const lastReport = await reports.find({}).sort({ report_number: -1 }).limit(1).next();

            const report_number = lastReport ? lastReport.report_number + 1 : 1;

            if (input.is_incident_report) {

                if (parentIncidents.length == 0) {

                    const lastIncident = await incidents.find({}).sort({ incident_id: -1 }).limit(1).next();

                    const incident_id = lastIncident ? lastIncident.incident_id + 1 : 1;

                    const editors = (!submission.incident_editors || !submission.incident_editors.length)
                        ? ['65031f49ec066d7c64380f5c'] // Default user. For more information refer to the wiki page: https://github.com/responsible-ai-collaborative/aiid/wiki/Special-non%E2%80%90secret-values
                        : submission.incident_editors;

                    const newIncident: Record<string, unknown> = {
                        title: submission.incident_title || submission.title,
                        description: submission.description,
                        incident_id,
                        reports: [],
                        editors,
                        date: submission.incident_date,
                        epoch_date_modified: submission.epoch_date_modified,
                        "Alleged deployer of AI system": submission.deployers || [],
                        "Alleged developer of AI system": submission.developers || [],
                        "Alleged harmed or nearly harmed parties": submission.harmed_parties || [],
                        nlp_similar_incidents: submission.nlp_similar_incidents || [],
                        editor_similar_incidents: submission.editor_similar_incidents || [],
                        editor_dissimilar_incidents: submission.editor_dissimilar_incidents || [],
                        editor_notes: "",
                        flagged_dissimilar_incidents: [],
                    }
                    if (submission.embedding) {
                        newIncident.embedding = {
                            vector: submission.embedding.vector,
                            from_reports: [report_number]
                        }
                    }

                    await incidents.insertOne({ ...newIncident, incident_id: newIncident.incident_id });

                    if (submission.user) {

                        await notificationsCollection.insertOne({
                            type: 'submission-promoted',
                            incident_id: newIncident.incident_id,
                            processed: false,
                            userId: submission.user
                        });
                    }

                    const incidentHistory: Record<string, unknown> = {
                        ...newIncident,
                        reports: [report_number],
                        incident_id: newIncident.incident_id,
                    };

                    if (submission.user) {
                        incidentHistory.modifiedBy = submission.user;
                    }

                    await incidentsHistory.insertOne(incidentHistory);

                    parentIncidents.push(newIncident);

                }
                else if (submission.embedding) {

                    for (const parentIncident of parentIncidents) {

                        const matchingReports = [];

                        if (parentIncident.reports) {

                            for (const report_number of parentIncident.reports) {

                                const report = await reports.findOne({ report_number });

                                if (report) {

                                    matchingReports.push(report);
                                }
                            }
                        }

                        const embeddings = matchingReports
                            .map(report => report.embedding)
                            .filter(e => e != null)
                            .concat([submission.embedding]);

                        const embedding = {
                            vector:
                                embeddings.map(e => e.vector).reduce(
                                    (sum, vector: number[]) => (
                                        vector.map(
                                            (component, i) => component + sum[i]
                                        )
                                    ),
                                    Array(embeddings[0].vector.length).fill(0)
                                ).map((component: number) => component / embeddings.length),

                            from_reports:
                                matchingReports
                                    .map(report => report.report_number)
                                    .concat([report_number])
                        };

                        await incidents.updateOne(
                            { incident_id: parentIncident.incident_id },
                            { $set: { ...parentIncident, embedding } }
                        );

                        let incidentValues = parentIncident;

                        delete incidentValues._id; // Otherwise Mongo complains about duplicate _id in incidentsHistory

                        const incidentHistory: Record<string, unknown> = {
                            ...incidentValues,
                            reports: [...incidentValues.reports!, report_number],
                            embedding,
                        }

                        if (submission.user) {
                            incidentHistory.modifiedBy = submission.user;
                        }
                        await incidentsHistory.insertOne(incidentHistory);
                    }
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
                epoch_date_downloaded: getUnixTime(submission.date_downloaded),
                epoch_date_modified: submission.epoch_date_modified,
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
                quiet: submission.quiet || false
            };
            if (submission.embedding) {
                newReport.embedding = submission.embedding;
            }

            if (submission.user) {
                newReport.user = submission.user;
            }

            await reports.insertOne({ ...newReport, report_number: newReport.report_number });

            const incident_ids: number[] = parentIncidents.map(incident => incident.incident_id!);
            const report_numbers: number[] = [newReport.report_number];

            await linkReportsToIncidents(context.client, report_numbers, incident_ids);

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
        updateOneSubmission: allow,
        insertOneSubmission: allow,
        promoteSubmissionToReport: allow,
    }
}