import { MongoClient } from "mongodb";
import templates from "../emails/templates";
import config from "../config";
import * as reporter from '../reporter';
import { Context, DBIncident, DBNotification, DBReport } from "../interfaces";
import _ from "lodash";
import { Recipient, EmailParams, MailerSend } from "mailersend";

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

    const response: UserAdminData = {};

    if (userApiResponse.data) {

        response.email = userApiResponse.data.email;
        response.creationDate = new Date(userApiResponse.creation_date * 1000);
        response.lastAuthenticationDate = new Date(userApiResponse.last_authentication_date * 1000);
        response.disabled = userApiResponse.disabled;
    }

    return response;
}

export const getUsersAdminData = async () => {

    const response = await apiRequest({ path: `/users` });

    const result: UserAdminData[] = [];

    for (const userData of response) {

        if (userData.data?.email) {

            const user: UserAdminData = {};

            user.email = userData.data.email;
            user.creationDate = new Date(userData.creation_date * 1000);
            user.lastAuthenticationDate = new Date(userData.last_authentication_date * 1000);
            user.disabled = userData.disabled;
            user.userId = userData._id;

            result.push(user);
        }
    }

    return result;
}

interface SendEmailParams {
    recipients: {
        email: string;
        userId: string;
    }[];
    subject: string;
    dynamicData: {
        incidentId?: string;
        incidentTitle?: string;
        incidentUrl?: string;
        incidentDescription?: string;
        incidentDate?: string;
        developers?: string; // HTML string of developers
        deployers?: string;   // HTML string of deployers
        entitiesHarmed?: string; // HTML string of harmed entities
        reportUrl?: string;   // URL for a specific report (optional)
        reportTitle?: string; // Title of the report (optional)
        reportAuthor?: string; // Author of the report (optional)
        entityName?: string;   // Entity name (optional)
        entityUrl?: string;    // Entity URL (optional)
    };
    templateId: string; // Email template ID
}

export const replacePlaceholdersWithAllowedKeys = (template: string, data: { [key: string]: string }, allowedKeys: string[]): string => {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        return allowedKeys.includes(key) && key in data ? data[key] : match;
    });
}

export const mailersendBulkSend = async (emails: EmailParams[]) => {

    const mailersend = new MailerSend({
        apiKey: config.MAILERSEND_API_KEY,
    });

    await mailersend.email.sendBulk(emails);
}

export const sendEmail = async ({ recipients, subject, dynamicData, templateId }: SendEmailParams) => {

    const emailTemplateBody = templates[templateId];

    if (!emailTemplateBody) {
        throw new Error(`Template not found: ${templateId}`);
    }

    try {

        const bulk: EmailParams[] = [];

        for (const recipient of recipients) {

            const personalizations = [{
                email: recipient.email,
                data: {
                    ...dynamicData,
                    email: recipient.email,
                    userId: recipient.userId,
                    siteUrl: config.SITE_URL,
                }
            }]

            // We have to do this because MailerSend is escaping the placeholders containing html tags
            const html = replacePlaceholdersWithAllowedKeys(emailTemplateBody, dynamicData, ['developers', 'deployers', 'entitiesHarmed'])

            const emailParams = new EmailParams()
                .setFrom({ email: config.NOTIFICATIONS_SENDER, name: config.NOTIFICATIONS_SENDER_NAME })
                .setTo([new Recipient(recipient.email, '')])
                .setPersonalization(personalizations)
                .setSubject(subject)
                .setHtml(html);
            //TODO: add a text version of the email
            // .setText("Greetings from the team, you got this message through MailerSend.");

            bulk.push(emailParams);
        }

        await mailersendBulkSend(bulk);

    } catch (error: any) {
        error.message = `[Send Email]: ${error.message}`;
        reporter.error(error);

        throw error;
    }
}

/**
 * Makes an API request to the MongoDB Atlas Admin API, supporting only GET methods.
 * This function handles authentication using a public/private API key pair and returns the response from the API.
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
export const apiRequest = async ({ path, method = "GET" }: { method?: string, path: string }) => {

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
        return {
            status: loginResponse.status,
            error: data.error
        }
    }

    let response = null;

    const url = `https://services.cloud.mongodb.com/api/admin/v3.0/groups/${config.REALM_API_GROUP_ID}/apps/${config.REALM_API_APP_ID}${path}`;
    const headers = { "Authorization": `Bearer ${data.access_token}` };

    if (method == 'GET') {

        const result = await fetch(url, { headers });

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