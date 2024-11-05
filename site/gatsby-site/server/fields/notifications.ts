import { GraphQLFieldConfigMap, GraphQLInt } from 'graphql';
import { generateQueryFields } from '../utils';
import { Context, DBEntity, DBIncident, DBReport, DBSubscription, DBNotification } from '../interfaces';
import { NotificationType } from '../types/notification';
import { getUserAdminData, getUsersAdminData, sendEmail } from './common';
import * as reporter from '../reporter';
import { hasHeaderSecret, isRole } from '../rules';
import config from '../config';

export const queryFields: GraphQLFieldConfigMap<any, Context> = {

    ...generateQueryFields({ databaseName: 'customData', collectionName: 'notifications', Type: NotificationType })
}


const getRecipients = async (userIds: string[]) => {
    const users = await getUsersAdminData();

    const recipients = users
        .filter((user) => userIds.includes(user.userId!))
        .map((user) => ({ email: user.email!, userId: user.userId! }));

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

            const recipients = await getRecipients(uniqueUserIds);

            const uniqueNotifications: number[] = [];

            for (const pendingNotification of pendingNotificationsToNewIncidents) {

                // Mark the notification as processed before sending the email
                await markNotificationsAsProcessed(notificationsCollection, [pendingNotification]);

                // Send only one email per Incident
                if (!uniqueNotifications.includes(pendingNotification.incident_id)) {
                    uniqueNotifications.push(pendingNotification.incident_id);

                    try {
                        const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id });

                        if (incident) {
                            //Send email notification
                            const sendEmailParams = {
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
                                },
                                templateId: 'NewIncident' // Template value from function name sufix from "site/realm/functions/config.json"
                            };

                            await sendEmail(sendEmailParams);
                        }


                    } catch (error: any) {
                        // If there is an error sending the email > Mark the notification as not processed
                        await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

                        error.message = `[Process Pending Notifications: New Incidents]: ${error.message}`;

                        reporter.error(error);
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

                        const recipients = await getRecipients(uniqueUserIds);

                        const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id! });

                        const newReportNumber = pendingNotification.report_number;

                        const newReport = newReportNumber ? await reportsCollection.findOne({ report_number: newReportNumber }) : null;

                        if (incident) {

                            const sendEmailParams = {
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

                            await sendEmail(sendEmailParams);

                            console.log(`Incident ${incident.incident_id} updates: Pending notification was processed.`);
                        }

                    }
                } catch (error: any) {
                    // If there is an error sending the email > Mark the notification as not processed
                    await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

                    error.message = `[Process Pending Notifications: Incidents Updates]: ${error.message}`;

                    reporter.error(error);
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

                        const recipients = await getRecipients(uniqueUserIds);

                        const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id! });

                        const entity = allEntities.find(entity => entity.entity_id === pendingNotification.entity_id);

                        const isIncidentUpdate = pendingNotification.isUpdate;

                        if (incident && entity) {

                            const sendEmailParams = {
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
                                },
                                // Template value from function name sufix from "site/realm/functions/config.json"
                                templateId: isIncidentUpdate ? 'EntityIncidentUpdated' : 'NewEntityIncident'
                            };

                            await sendEmail(sendEmailParams);

                            console.log(`New "${entity.name}" Entity Incidents: pending notification was processed.`);
                        }
                    }
                } catch (error: any) {
                    // If there is an error sending the email > Mark the notification as not processed
                    await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

                    error.message = `[Process Pending Notifications: New Entity Incidents]: ${error.message}`;

                    reporter.error(error);
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

        const recipients = await getRecipients(uniqueUserIds);

        let uniqueNotifications: number[] = [];

        for (const pendingNotification of pendingNotificationsToNewPromotions) {

            // Mark the notification as processed before sending the email
            await markNotificationsAsProcessed(notificationsCollection, [pendingNotification]);

            if (pendingNotification.incident_id && !uniqueNotifications.includes(pendingNotification.incident_id)) {
                uniqueNotifications.push(pendingNotification.incident_id);

                try {
                    const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id });

                    if (incident) {

                        //Send email notification
                        const sendEmailParams = {
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

                        await sendEmail(sendEmailParams);
                    }

                } catch (error: any) {
                    // If there is an error sending the email > Mark the notification as not processed
                    await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

                    error.message = `[Process Pending Notifications: Submission Promoted]: ${error.message}`;

                    reporter.error(error);
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

export const mutationFields: GraphQLFieldConfigMap<any, Context> = {

    processNotifications: {
        type: GraphQLInt,
        resolve: async (source, args, context, info) => {
            let result = 0; // Pending notifications processed count

            try {
                result += await notificationsToNewIncidents(context);
            }
            catch (error: any) {

                error.message = `[Process Pending Notifications: New Incidents]: ${error.message}`;
                reporter.error(error);
            }

            try {
                result += await notificationsToNewEntityIncidents(context);
            }
            catch (error: any) {

                error.message = `[Process Pending Notifications: New Entity Incidents]: ${error.message}`;
                reporter.error(error);
            }

            try {
                result += await notificationsToIncidentUpdates(context);
            }
            catch (error: any) {

                error.message = `[Process Pending Notifications: Incidents Updates]: ${error.message}`;
                reporter.error(error);
            }

            try {
                result += await notificationsToNewPromotions(context);
            }
            catch (error: any) {

                error.message = `[Process Pending Notifications: Submission Promoted]: ${error.message}`;
                reporter.error(error);
            }

            return result;
        }
    }
}

export const permissions = {
    Query: {
        notification: isRole('admin'),
        notifications: isRole('admin'),
    },
    Mutation: {
        processNotifications: hasHeaderSecret("PROCESS_NOTIFICATIONS_SECRET"),
    }
}