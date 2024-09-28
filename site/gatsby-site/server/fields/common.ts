import { MongoClient } from "mongodb";
import templates from "../emails/templates";
import config from "../config";
import * as reporter from '../reporter';
import { Context, DBIncident, DBNotification, DBSubscription } from "../interfaces";

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

interface SendEmailParams {
    recipients: {
        email: string;
        userId: string;
    }[]; // An array of recipient objects, each with an email and userId
    subject: string; // The subject of the email
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

function buildEmailData(recipients: Record<string, string>[], subject: string, dynamicData: Record<string, string | Date>, emailTemplateBody: string) {

    const personalizations = recipients.map((recipient) => {

        const newDynamicData: any = {}

        for (var key in dynamicData) {
            if (dynamicData.hasOwnProperty(key)) {
                newDynamicData[`{{${key}}}`] = dynamicData[key];
            }
        }

        if (recipient.email) {
            newDynamicData['{{email}}'] = recipient.email;
        }

        if (recipient.userId) {
            newDynamicData['{{userId}}'] = recipient.userId;
        }

        return {
            to: [
                {
                    email: recipient.email,
                },
            ],
            subject,
            substitutions: newDynamicData,
        };
    });

    const emailData = {
        from: {
            email: config.SENDGRID_SENDER,
            name: config.SENDGRID_SENDER_NAME,
        },
        personalizations,
        content: [
            {
                type: 'text/html',
                value: emailTemplateBody.replace('\0', ''), // workaround to remove "\0" that is generated by SendGrid HTML export
            }
        ]
    }

    return emailData;
}


export const sendEmail = async ({ recipients, subject, dynamicData, templateId }: SendEmailParams) => {

    const emailTemplateBody = templates[templateId];

    if (!emailTemplateBody) {
        throw new Error(`Template not found: ${templateId}`);
    }

    const sendGridApiUrl = "https://api.sendgrid.com/v3/mail/send";

    try {
        const emailData = buildEmailData(recipients, subject, dynamicData, emailTemplateBody);

        const response = await fetch(sendGridApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to send email: ${response.status} ${response.statusText} - ${errorData.message}`);
        }

        const emailResult = await response.json();

        return emailResult;

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

export const createNotificationsOnNewIncident = async (fullDocument: DBIncident, context: Context): Promise<DBIncident> => {

    const incidentId = fullDocument.incident_id;

    console.log(`New Incident #${incidentId}`);

    const notificationsCollection = context.client.db('customData').collection<DBNotification>("notifications");
    const subscriptionsCollection = context.client.db('customData').collection<DBSubscription>("subscriptions");

    const subscriptionsToNewIncidents = await subscriptionsCollection.find({ type: 'new-incidents' }).toArray();

    console.log(`There are ${subscriptionsToNewIncidents.length} subscribers to New Incidents.`);

    // If there are subscribers to New Incidents > Insert a pending notification to process in the next build

    if (subscriptionsToNewIncidents.length > 0) {
        await notificationsCollection.insertOne({
            type: 'new-incidents',
            incident_id: incidentId,
            processed: false,
        });
    }

    // Process Entity Subscriptions
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
        // Find subscriptions to this specific entity
        const subscriptionsToEntity = await subscriptionsCollection.find({
            type: 'entity',
            entityId
        }).toArray();

        console.log(`There are ${subscriptionsToEntity.length} subscribers to Entity:`, entityId);

        // If there are subscribers to Entities > Insert a pending notification to process in the next build
        if (subscriptionsToEntity.length > 0) {
            await notificationsCollection.insertOne({
                type: 'entity',
                incident_id: incidentId,
                entity_id: entityId,
                processed: false,
            });
        }
    }

    return fullDocument;
}
