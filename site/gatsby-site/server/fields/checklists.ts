import { GraphQLFieldConfigMap } from "graphql";
import { allow } from "graphql-shield";
import { generateQueryFields } from "../utils";
import { ChecklistType } from "../types/checklist";


export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'checklists', Type: ChecklistType })
    /*testThingie({

        type: CreateVariantPayload,
        args: {
            input: {
                type: new GraphQLNonNull(CreateVariantInput),
            },
        },
        resolve: async (source, { input }, context) => {

            const incidents = context.client.db('aiidprod').collection("incidents");
            const reports = context.client.db('aiidprod').collection("reports");

            const parentIncident = await incidents.findOne({ incident_id: input.incidentId });

            if (!parentIncident) {
                throw `Incident ${input.incidentId} not found`;
            }

            const report_number = (await reports.find({}).sort({ report_number: -1 }).limit(1).next()).report_number + 1;

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
                epoch_date_downloaded: getUnixTime(todayFormated),
                epoch_date_modified: getUnixTime(now.toString()),
                epoch_date_published: getUnixTime(input.variant.date_published ? input.variant.date_published : todayFormated),
                epoch_date_submitted: getUnixTime(todayFormated),
                image_url: '',
                cloudinary_id: '',
                authors: [],
                submitters: input.variant.submitters,
                text: input.variant.text,
                plain_text: '',
                url: '',
                source_domain: '',
                language: 'en',
                tags: ['variant:unreviewed'],
                inputs_outputs: input.variant.inputs_outputs,
            };

            await reports.insertOne({ ...newReport, report_number: newReport.report_number });

            const incident_ids = [input.incidentId];
            const report_numbers = [newReport.report_number];

            await linkReportsToIncidents(context.client, incident_ids, report_numbers);

            return {
                incident_id: input.incidentId,
                report_number,
            }
        }
    )
    */
}


export const permissions = {
    Query: {
        checklist: allow,
        checklists: allow,
    }
}


