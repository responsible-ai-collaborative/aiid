import { getUserAdminData, UserAdminData } from "../../server/fields/common";
import config from "../../server/config";
import { Context, DBEntity, DBIncident, DBNotification, DBReport, DBSubscription } from "../../server/interfaces";
import * as reporter from '../../server/reporter';
import { MongoClient } from "mongodb";
import { SendBulkEmailParams, sendBulkEmails } from "../../server/emails";

const usersCache: UserAdminData[] = [];

const getAndCacheRecipients = async (userIds: string[], context: Context) => {

    const recipients = [];

    for (const userId of userIds) {

        let user = usersCache.find((user) => user.userId === userId) ?? null;

        if (!user) {

            user = await getUserAdminData(userId, context) ?? null;

            if (user) {

                usersCache.push(user);
            }
        }

        if (user?.email && user?.userId) {
            recipients.push({ email: user.email, userId: user.userId });
        }
    }

    return recipients;
}

const markNotifications = async (notificationsCollection: any, notifications: any, isProcessed: any) => {
    for (const pendingNotification of notifications) {
        await notificationsCollection.updateOne(
            { _id: pendingNotification._id },
            { $set: { processed: isProcessed, sentDate: new Date() } }
        );
    }
}

const markNotificationsAsProcessed = async (notificationsCollection: any, notifications: any) => {
    await markNotifications(notificationsCollection, notifications, true);
}

const markNotificationsAsNotProcessed = async (notificationsCollection: any, notifications: any) => {
    await markNotifications(notificationsCollection, notifications, false);
}

const buildEntityList = (allEntities: any, entityIds: any) => {
    const entityNames = entityIds.map((entityId: string) => {
        const entity = allEntities.find((entity: any) => entity.entity_id === entityId);
        return entity ? `<a href="${config.SITE_URL}/entities/${entity.entity_id}">${entity.name}</a>` : '';
    });

    if (entityNames.length < 3) { return entityNames.join(' and '); }

    return `${entityNames.slice(0, - 1).join(', ')}, and ${entityNames[entityNames.length - 1]}`;
}

async function notificationsToNewIncidents(context: Context) {

    const notificationsCollection = context.client.db('customData').collection<DBNotification>("notifications");
    const subscriptionsCollection = context.client.db('customData').collection<DBSubscription>("subscriptions");
    const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");
    const entitiesCollection = context.client.db('aiidprod').collection<DBEntity>("entities");

    const pendingNotificationsToNewIncidents: any[] = await notificationsCollection.find({ processed: false, type: 'new-incidents' }).toArray();

    let result = 0;

    if (pendingNotificationsToNewIncidents.length > 0) {

        result += pendingNotificationsToNewIncidents.length;

        const subscriptionsToNewIncidents = await subscriptionsCollection.find<DBSubscription>({ type: 'new-incidents' }).toArray();

        // Process subscriptions to New Incidents
        if (subscriptionsToNewIncidents.length > 0) {

            const allEntities = await entitiesCollection.find({}).toArray();

            const userIds = subscriptionsToNewIncidents.map((subscription) => subscription.userId);

            const uniqueUserIds: string[] = [...new Set(userIds)]!;

            const recipients = await getAndCacheRecipients(uniqueUserIds, context);

            const uniqueNotifications: number[] = [];

            for (const pendingNotification of pendingNotificationsToNewIncidents) {

                // Mark the notification as processed before sending the email
                await markNotificationsAsProcessed(notificationsCollection, [pendingNotification]);

                // Send only one email per Incident
                if (!uniqueNotifications.includes(pendingNotification.incident_id)) {
                    uniqueNotifications.push(pendingNotification.incident_id);

                    try {
                        const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id });

                        if (incident && recipients.length > 0) {

                            const sendEmailParams: SendBulkEmailParams = {
                                recipients,
                                subject: 'New Incident {{incidentId}} was created',
                                dynamicData: {
                                    incidentId: `${incident.incident_id}`,
                                    incidentTitle: incident.title,
                                    incidentUrl: `${config.SITE_URL}/cite/${incident.incident_id}`,
                                    incidentDescription: incident.description ?? undefined,
                                    incidentDate: incident.date,
                                    developers: buildEntityList(allEntities, incident['Alleged developer of AI system']),
                                    deployers: buildEntityList(allEntities, incident['Alleged deployer of AI system']),
                                    entitiesHarmed: buildEntityList(allEntities, incident['Alleged harmed or nearly harmed parties']),
                                    implicatedSystems: buildEntityList(allEntities, incident.implicated_systems),
                                },
                                templateId: 'NewIncident' // Template value from function name sufix from "site/realm/functions/config.json"
                            };

                            await sendBulkEmails(sendEmailParams);
                        }


                    } catch (error: any) {
                        // If there is an error sending the email > Mark the notification as not processed
                        await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

                        error.message = `[Process Pending Notifications: New Incidents]: ${error.message}`;

                        throw error;
                    }
                }
            }

            console.log(`New Incidents: ${pendingNotificationsToNewIncidents.length} pending notifications were processed.`);
        }
        else {
            // If there are no subscribers to New Incidents (edge case) > Mark all pending notifications as processed
            await markNotificationsAsProcessed(notificationsCollection, pendingNotificationsToNewIncidents);
        }
    }
    else {
        console.log('New Incidents: No pending notifications to process.');
    }

    return result;
}

async function notificationsToIncidentUpdates(context: Context) {

    const notificationsCollection = context.client.db('customData').collection<DBNotification>("notifications");
    const subscriptionsCollection = context.client.db('customData').collection<DBSubscription>("subscriptions");
    const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");
    const reportsCollection = context.client.db('aiidprod').collection<DBReport>("reports");

    let result = 0;

    const pendingNotificationsToIncidentUpdates = await notificationsCollection.find({
        processed: false,
        type: { $in: ['new-report-incident', 'incident-updated'] }
    }).toArray();

    if (pendingNotificationsToIncidentUpdates.length > 0) {

        result += pendingNotificationsToIncidentUpdates.length;

        let uniqueNotifications: DBNotification[] = [];

        for (const pendingNotification of pendingNotificationsToIncidentUpdates) {

            // Mark the notification as processed before sending the email
            await markNotificationsAsProcessed(notificationsCollection, [pendingNotification]);

            // Process each Incident only once
            if (!uniqueNotifications.some(n => n.incident_id === pendingNotification.incident_id && n.type === pendingNotification.type)) {
                uniqueNotifications.push(pendingNotification);

                try {
                    const subscriptionsToIncidentUpdates = await subscriptionsCollection.find({
                        type: 'incident',
                        incident_id: pendingNotification.incident_id!
                    }).toArray();

                    // Process subscriptions to Incident updates
                    if (subscriptionsToIncidentUpdates.length > 0) {

                        const userIds = subscriptionsToIncidentUpdates.map((subscription) => subscription.userId);

                        const uniqueUserIds = [...new Set(userIds)];

                        const recipients = await getAndCacheRecipients(uniqueUserIds, context);

                        const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id! });

                        const newReportNumber = pendingNotification.report_number;

                        const newReport = newReportNumber ? await reportsCollection.findOne({ report_number: newReportNumber }) : null;

                        if (incident && recipients.length > 0) {

                            const sendEmailParams: SendBulkEmailParams = {
                                recipients,
                                subject: 'Incident {{incidentId}} was updated',
                                dynamicData: {
                                    incidentId: `${incident.incident_id}`,
                                    incidentTitle: incident.title,
                                    incidentUrl: `${config.SITE_URL}/cite/${incident.incident_id}`,
                                    reportUrl: `${config.SITE_URL}/cite/${incident.incident_id}#r${newReportNumber}`,
                                    reportTitle: newReport ? newReport.title : '',
                                    reportAuthor: (newReport && newReport.authors[0]) ? newReport.authors[0] : '',
                                },
                                // Template value from function name sufix from "site/realm/functions/config.json"
                                templateId: newReportNumber ? 'NewReportAddedToAnIncident' : 'IncidentUpdate',
                            };

                            await sendBulkEmails(sendEmailParams);

                            console.log(`Incident ${incident.incident_id} updates: Pending notification was processed.`);
                        }

                    }
                } catch (error: any) {
                    // If there is an error sending the email > Mark the notification as not processed
                    await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

                    error.message = `[Process Pending Notifications: Incidents Updates]: ${error.message}`;

                    throw error;
                }
            }
        }
    }
    else {
        console.log('New Updated Incidents: No pending notifications to process.');
    }

    return result;
}

async function notificationsToNewEntityIncidents(context: Context) {

    const notificationsCollection = context.client.db('customData').collection<DBNotification>("notifications");
    const subscriptionsCollection = context.client.db('customData').collection<DBSubscription>("subscriptions");
    const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");
    const entitiesCollection = context.client.db('aiidprod').collection<DBEntity>("entities");

    let result = 0;

    const pendingNotificationsToNewEntityIncidents = await notificationsCollection.find({ processed: false, type: 'entity' }).toArray();

    if (pendingNotificationsToNewEntityIncidents.length > 0) {

        result += pendingNotificationsToNewEntityIncidents.length;

        const allEntities = await entitiesCollection.find({}).toArray();

        let uniqueNotifications: string[] = [];

        for (const pendingNotification of pendingNotificationsToNewEntityIncidents) {

            // Mark the notification as processed before sending the email
            await markNotificationsAsProcessed(notificationsCollection, [pendingNotification]);

            // Process each entity only once
            if (pendingNotification.entity_id && !uniqueNotifications.includes(pendingNotification.entity_id)) {
                uniqueNotifications.push(pendingNotification.entity_id);

                try {

                    const subscriptionsToNewEntityIncidents = await subscriptionsCollection.find({
                        type: 'entity',
                        entityId: pendingNotification.entity_id
                    }).toArray();

                    // Process subscriptions to New Entity Incidents
                    if (subscriptionsToNewEntityIncidents.length > 0) {

                        const userIds = subscriptionsToNewEntityIncidents.map((subscription) => subscription.userId);

                        const uniqueUserIds = [...new Set(userIds)];

                        const recipients = await getAndCacheRecipients(uniqueUserIds, context);

                        const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id! });

                        const entity = allEntities.find(entity => entity.entity_id === pendingNotification.entity_id);

                        const isIncidentUpdate = pendingNotification.isUpdate;

                        if (incident && entity && recipients.length > 0) {

                            const sendEmailParams: SendBulkEmailParams = {
                                recipients,
                                subject: isIncidentUpdate ? 'Update Incident for {{entityName}}' : 'New Incident for {{entityName}}',
                                dynamicData: {
                                    incidentId: `${incident.incident_id}`,
                                    incidentTitle: incident.title,
                                    incidentUrl: `${config.SITE_URL}/cite/${incident.incident_id}`,
                                    incidentDescription: incident.description ?? undefined,
                                    incidentDate: incident.date,
                                    entityName: entity.name,
                                    entityUrl: `${config.SITE_URL}/entities/${entity.entity_id}`,
                                    developers: buildEntityList(allEntities, incident['Alleged developer of AI system']),
                                    deployers: buildEntityList(allEntities, incident['Alleged deployer of AI system']),
                                    entitiesHarmed: buildEntityList(allEntities, incident['Alleged harmed or nearly harmed parties']),
                                    implicatedSystems: buildEntityList(allEntities, incident.implicated_systems),
                                },
                                // Template value from function name sufix from "site/realm/functions/config.json"
                                templateId: isIncidentUpdate ? 'EntityIncidentUpdated' : 'NewEntityIncident'
                            };

                            await sendBulkEmails(sendEmailParams);

                            console.log(`New "${entity.name}" Entity Incidents: pending notification was processed.`);
                        }
                    }
                } catch (error: any) {
                    // If there is an error sending the email > Mark the notification as not processed
                    await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

                    error.message = `[Process Pending Notifications: New Entity Incidents]: ${error.message}`;

                    throw error;
                }
            }
        }
    }
    else {
        console.log('New Entity Incidents: No pending notifications to process.');
    }

    return result;
}

async function notificationsToNewPromotions(context: Context) {

    const notificationsCollection = context.client.db('customData').collection<DBNotification>("notifications");
    const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");

    let result = 0;

    const pendingNotificationsToNewPromotions = await notificationsCollection.find({ processed: false, type: 'submission-promoted' }).toArray();

    if (pendingNotificationsToNewPromotions.length > 0) {

        result += pendingNotificationsToNewPromotions.length;

        const userIds = pendingNotificationsToNewPromotions
            .filter(s => s.userId)
            .map(s => s.userId) as string[];

        const uniqueUserIds = [...new Set(userIds)];

        const recipients = await getAndCacheRecipients(uniqueUserIds, context);

        let uniqueNotifications: number[] = [];

        for (const pendingNotification of pendingNotificationsToNewPromotions) {

            // Mark the notification as processed before sending the email
            await markNotificationsAsProcessed(notificationsCollection, [pendingNotification]);

            if (pendingNotification.incident_id && !uniqueNotifications.includes(pendingNotification.incident_id)) {
                uniqueNotifications.push(pendingNotification.incident_id);

                try {
                    const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id });

                    if (incident && recipients.length > 0) {

                        const sendEmailParams: SendBulkEmailParams = {
                            recipients,
                            subject: 'Your submission has been approved!',
                            dynamicData: {
                                incidentId: `${incident.incident_id}`,
                                incidentTitle: incident.title,
                                incidentUrl: `${config.SITE_URL}/cite/${incident.incident_id}`,
                                incidentDescription: incident.description ?? undefined,
                                incidentDate: incident.date,
                            },
                            templateId: 'SubmissionApproved' // Template value from function name sufix from "site/realm/functions/config.json"
                        };

                        await sendBulkEmails(sendEmailParams);
                    }

                } catch (error: any) {
                    // If there is an error sending the email > Mark the notification as not processed
                    await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

                    error.message = `[Process Pending Notifications: Submission Promoted]: ${error.message}`;

                    throw error;
                }
            }
        }

        console.log(`New Promotions: ${pendingNotificationsToNewPromotions.length} pending notifications were processed.`);
    }
    else {
        console.log('Submission Promoted: No pending notifications to process.');
    }

    return result;
}

export const processNotifications = async () => {

    usersCache.length = 0;

    const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

    const context: Context = { client, user: null, req: {} as any };

    let result = 0; // Pending notifications processed count

    result += await notificationsToNewIncidents(context);

    result += await notificationsToNewEntityIncidents(context);

    result += await notificationsToIncidentUpdates(context);

    result += await notificationsToNewPromotions(context);

    return result;
}

export const run = async () => {
    try {
        await processNotifications();
        console.log('Process Pending Notifications: Completed.');
        process.exit(0);
    } catch (error: any) {
        console.error(error);
        reporter.error(error);
        process.exit(1);
    }
}

if (require.main === module) {

    run();
}