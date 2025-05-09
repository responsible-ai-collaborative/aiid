import { MongoClient, ObjectId } from "mongodb";
import config from "../config";
import { Context, DBIncident, DBIncidentHistory, DBNotification, DBReport, DBReportHistory } from "../interfaces";
import _ from "lodash";
import jwt from 'jsonwebtoken';

export const incidentEmbedding = (reports: Record<string, any>[]) => {
    reports = reports.filter((report) => report.embedding);
    return reports.length == 0
        ? null
        : {
            vector: reports
                .map((report) => report.embedding!.vector)
                .reduce(
                    (sum, vector) => vector!.map((component: number, i: number) => component + sum[i]),
                    Array(reports[0].embedding!.vector!.length).fill(0)
                )
                .map((component: number) => component / reports.length),

            from_reports: reports.map((report) => report.report_number),
        };
};

export const linkReportsToIncidents = async (client: MongoClient, report_numbers: number[], incident_ids: number[]) => {

    const incidentsCollection = client.db('aiidprod').collection("incidents");
    const reportsCollection = client.db('aiidprod').collection("reports");

    // unlink

    const exParentIncidents = await incidentsCollection.find({ reports: { $in: report_numbers } }).toArray();

    for (const incident of exParentIncidents) {

        const reports = await reportsCollection.find({ report_number: { $in: incident.reports.filter((number: number) => !report_numbers.includes(number)) } }).toArray();

        const embedding = incidentEmbedding(reports);

        const operation = embedding == null ? { $unset: { embedding: "" } } : { $set: { embedding } }

        await incidentsCollection.updateOne({ incident_id: incident.incident_id }, operation);
    }

    // @ts-ignore
    await incidentsCollection.updateMany({ reports: { $in: report_numbers } }, { $pull: { reports: { $in: report_numbers } } });


    // link

    if (incident_ids.length > 0) {

        await incidentsCollection.updateMany({ incident_id: { $in: incident_ids } }, { $addToSet: { reports: { $each: report_numbers } } });

        const parentIncidents = await incidentsCollection.find({ reports: { $in: report_numbers } }).toArray();

        for (const incident of parentIncidents) {

            const reports = await reportsCollection.find({ report_number: { $in: incident.reports } }).toArray();

            const embedding = incidentEmbedding(reports);

            const operation = embedding == null ? { $unset: { embedding: "" } } : { $set: { embedding } }

            await incidentsCollection.updateOne({ incident_id: incident.incident_id }, operation);
        }
    }

    //

    await reportsCollection.updateMany(
        {
            report_number: { $in: report_numbers },
            title: { $nin: [""] },
            url: { $nin: [""] },
            source_domain: { $nin: [""] },
        },
        {
            $set: { is_incident_report: incident_ids.length > 0 }
        }
    );
}

export interface UserAdminData {
    email?: string;
    creationDate?: Date;
    lastAuthenticationDate?: Date;
    disabled?: boolean;
    userId?: string;
}

export const getUserAdminData = async (userId: string, context: Context): Promise<UserAdminData | null> => {

    const authUsersCollection = context.client.db('auth').collection("users");
    const authUser = await authUsersCollection.findOne({ _id: new ObjectId(userId) });

    if (authUser) {

        return {
            email: authUser.email,
            creationDate: new Date(), //TODO: find a way to get this data
            lastAuthenticationDate: new Date(), //TODO: find a way to get this data
            disabled: false,
            userId,
        }
    }

    return null;
}

export const createNotificationsOnNewIncident = async (fullDocument: DBIncident, context: Context): Promise<void> => {

    const incidentId = fullDocument.incident_id;

    console.log(`New Incident #${incidentId}`);

    const notificationsCollection = context.client.db('customData').collection<DBNotification>("notifications");

    await notificationsCollection.insertOne({
        type: 'new-incidents',
        incident_id: incidentId,
        processed: false,
        created_at: new Date(),
    });

    const entityFields: (keyof DBIncident)[] = [
        'Alleged deployer of AI system',
        'Alleged developer of AI system',
        'Alleged harmed or nearly harmed parties',
        'implicated_systems'
    ];
    const entities: string[] = [];

    for (const field of entityFields) {
        if (fullDocument[field]) {
            for (const entityId of fullDocument[field]) {
                if (!entities.includes(entityId)) {
                    entities.push(entityId);
                }
            }
        }
    }

    for (const entityId of entities) {

        await notificationsCollection.insertOne({
            type: 'entity',
            incident_id: incidentId,
            entity_id: entityId,
            processed: false,
            created_at: new Date(),
        });
    }
}

function compareWithLodash(value: any, other: any): boolean | undefined {

    if (Array.isArray(value) && Array.isArray(other)) {

        return _.isEqual(_.sortBy(value), _.sortBy(other));
    }

    return undefined; // have lodash use its default comparison
}

export function hasRelevantUpdates(before: DBIncident, after: DBIncident): boolean {

    const monitoredFields: (keyof DBIncident | "embedding.vector" | "embedding.from_reports" | "tsne.x" | "tsne.y")[] = [
        "_id",
        "date",
        "description",
        "editor_notes",
        "title",
        "Alleged deployer of AI system",
        "Alleged developer of AI system",
        "Alleged harmed or nearly harmed parties",
        "reports",
        "editors",
        "embedding.vector",
        "embedding.from_reports",
        "tsne.x",
        "tsne.y",
        "editor_dissimilar_incidents",
        "editor_similar_incidents",
        "flagged_dissimilar_incidents",
        "nlp_similar_incidents",
        "implicated_systems"
    ];

    const hasMonitoredUpdates = monitoredFields.some((field) => {
        const beforeValue = _.get(before, field);
        const afterValue = _.get(after, field);
        return !_.isEqualWith(beforeValue, afterValue, compareWithLodash);
    });

    return hasMonitoredUpdates;
}

export const createNotificationsOnUpdatedIncident = async (fullDocument: DBIncident, fullDocumentBeforeChange: DBIncident, context: Context): Promise<void> => {

    const incidentId: number = fullDocument.incident_id;

    const notificationsCollection = context.client.db('customData').collection<DBNotification>("notifications");
    const reportsCollection = context.client.db('aiidprod').collection<DBReport>("reports");


    // TODO: make it work for multiple reports?
    const newReportNumber = _.difference(fullDocument.reports, fullDocumentBeforeChange.reports)[0];

    let notification: DBNotification | undefined;

    if (newReportNumber) {
        const newReport = await reportsCollection.findOne({ report_number: newReportNumber });

        // If the new Report is not a Variant > Insert a pending notification to process in the next build
        if (newReport &&
            newReport.title && newReport.title !== '' &&
            newReport.url && newReport.url !== '' &&
            newReport.source_domain && newReport.source_domain !== '') {

            // If there is a new Report > Insert a pending notification to process in the next build
            notification = {
                type: 'new-report-incident',
                incident_id: incidentId,
                report_number: newReportNumber,
                processed: false,
            };
        }
    } else {
        // If any other Incident field is updated > Insert a pending notification to process in the next build
        notification = { type: 'incident-updated', incident_id: incidentId, processed: false };
    }

    if (notification) {
        await notificationsCollection.updateOne(notification, { $set: notification }, { upsert: true });
    }


    const entityFields: (keyof DBIncident)[] = [
        'Alleged deployer of AI system',
        'Alleged developer of AI system',
        'Alleged harmed or nearly harmed parties',
        'implicated_systems'
    ];

    const entities: string[] = [];

    for (const field of entityFields) {
        const entitiesAdded: string[] = _.difference(fullDocument[field], fullDocumentBeforeChange[field]);

        for (const entity of entitiesAdded) {
            if (!entities.includes(entity)) {
                entities.push(entity);
            }
        }
    }

    for (const entityId of entities) {

        const notification: DBNotification = {
            type: 'entity',
            incident_id: incidentId,
            entity_id: entityId,
            isUpdate: true,
            processed: false,
        };
        await notificationsCollection.updateOne(notification, { $set: notification }, { upsert: true });
    }
}

export const logReportHistory = async (updated: DBReport, context: Context) => {

    const reportHistory: DBReportHistory = {
        ...updated,
        modifiedBy: context.user?.id ?? '',
        created_at: new Date(),
        _id: undefined,
    }

    const reportHistoryCollection = context.client.db('history').collection<DBReportHistory>("reports");

    await reportHistoryCollection.insertOne(reportHistory);
};

export const logIncidentHistory = async (updated: DBIncident, context: Context) => {

    const incidentHistory: DBIncidentHistory = {
        ...updated,
        modifiedBy: context.user?.id ?? '',
        created_at: new Date(),
        _id: undefined,
    }

    const incidentHistoryCollection = context.client.db('history').collection<DBIncidentHistory>("incidents");

    await incidentHistoryCollection.insertOne(incidentHistory);
}
