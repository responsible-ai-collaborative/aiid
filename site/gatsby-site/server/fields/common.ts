import { MongoClient } from "mongodb";
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

export const getUserAdminData = async (userId: string) => {

    const userApiResponse = await apiRequest({ path: `/users/${userId}` });

    let user: UserAdminData | null = null;

    if (userApiResponse.data) {

        user = {
            email: userApiResponse.data.email,
            creationDate: new Date(userApiResponse.creation_date * 1000),
            lastAuthenticationDate: new Date(userApiResponse.last_authentication_date * 1000),
            disabled: userApiResponse.disabled,
            userId,
        }
    }

    return user;
}


let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

/**
 * Fetches the access token for the MongoDB Atlas Admin API.
 * 
 * Note: The token is cached to speed up subsequent requests. Tokens expire after 30 minutes.
 * 
 * @returns {Promise<string>} A promise that resolves to the access token.
 */
export const getAccessToken = async () => {

    const refreshDate = tokenExpiration ? tokenExpiration * 1000 - 5 * 60 * 1000 : null;

    // Refresh the authentication token well before expiration to avoid interruptions.

    const now = Date.now();

    if ((cachedToken && refreshDate && now < refreshDate)) {
        return cachedToken;
    }

    const loginResponse = await fetch('https://services.cloud.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: config.REALM_API_PUBLIC_KEY,
            apiKey: config.REALM_API_PRIVATE_KEY,
        }),
    });

    const data = await loginResponse.json();

    if (loginResponse.status != 200) {
        throw new Error(`Login failed: ${data.error}`);
    }

    const decoded = jwt.decode(data.access_token) as { exp: number };

    cachedToken = data.access_token;
    tokenExpiration = decoded.exp;

    return cachedToken;
};

/**
 * Makes an API request to the MongoDB Atlas Admin API, supporting only GET methods.
 * This function handles authentication using a public/private API key pair and returns the response from the API.
 * 
 * Rate limited to 100 calls / minute
 * 
 * **Note:** Use with caution as this function has admin privileges.
 * 
 * @param {Object} params - The parameters for the API request.
 * @param {string} params.path - The API endpoint path.
 * @param {string} [params.method='GET'] - The HTTP method for the request. Currently, only 'GET' is supported.
 * @returns {Promise<any>} - The response from the API or an error object if the request fails.
 * 
 * @throws {Error} Throws an error if an unsupported HTTP method is provided.
 */
export const apiRequest = async ({ path, params = {}, method = "GET" }: { method?: string, params?: Record<string, string>, path: string }) => {

    const accessToken = await getAccessToken();

    const url = new URL(`https://services.cloud.mongodb.com/api/admin/v3.0/groups/${config.REALM_API_GROUP_ID}/apps/${config.REALM_API_APP_ID}${path}`);

    if (Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams(params);
        url.search = searchParams.toString();
    }

    const headers = { "Authorization": `Bearer ${accessToken}` };

    let response = null;

    if (method == 'GET') {

        const result = await fetch(url.toString(), { headers });

        response = await result.json();
    }
    else {

        throw `Unsupported method ${method}`;
    }

    return response;
}

export const createNotificationsOnNewIncident = async (fullDocument: DBIncident, context: Context): Promise<void> => {

    const incidentId = fullDocument.incident_id;

    console.log(`New Incident #${incidentId}`);

    const notificationsCollection = context.client.db('customData').collection<DBNotification>("notifications");

    await notificationsCollection.insertOne({
        type: 'new-incidents',
        incident_id: incidentId,
        processed: false,
    });

    const entityFields: (keyof DBIncident)[] = [
        'Alleged deployer of AI system',
        'Alleged developer of AI system',
        'Alleged harmed or nearly harmed parties',
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
        _id: undefined,
    }

    const reportHistoryCollection = context.client.db('history').collection<DBReportHistory>("reports");

    await reportHistoryCollection.insertOne(reportHistory);
};

export const logIncidentHistory = async (updated: DBIncident, context: Context) => {

    const incidentHistory: DBIncidentHistory = {
        ...updated,
        modifiedBy: context.user?.id ?? '',
        _id: undefined,
    }

    const incidentHistoryCollection = context.client.db('history').collection<DBIncidentHistory>("incidents");

    await incidentHistoryCollection.insertOne(incidentHistory);
}
