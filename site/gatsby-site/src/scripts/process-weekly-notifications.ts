import { MongoClient } from "mongodb";
import config from "../../server/config";
import { Context, DBEntity, DBIncident, DBSubscription } from "../../server/interfaces";
import { sendBulkEmails, SendBulkEmailParams } from "../../server/emails";
import { getUserAdminData, UserAdminData } from "../../server/fields/common";

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

async function notificationsToWeeklyIncidents(context: Context) {
    const notificationsCollection = context.client.db('customData').collection("notifications");
    const subscriptionsCollection = context.client.db('customData').collection("subscriptions");
    const entitiesCollection = context.client.db('aiidprod').collection<DBEntity>("entities");
    const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");

    // Find all notifications from the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const pendingWeeklyNotificationsToNewIncidents = await notificationsCollection.find({
        processed: false,
        type: 'ai-weekly-briefing',
        sentDate: { $gte: oneWeekAgo }
    }).toArray();

    if (pendingWeeklyNotificationsToNewIncidents.length === 0) {
        console.log("No new incidents for weekly briefing.");
        return;
    }

    // Get weekly subscribers
    const weeklySubscribers = await subscriptionsCollection.find<DBSubscription>({ type: 'ai-weekly-briefing' }).toArray();

    if (weeklySubscribers.length === 0) {
        console.log("No weekly subscribers found.");
        return;
    }

    const allEntities = await entitiesCollection.find({}).toArray();

    const userIds = weeklySubscribers.map(s => s.userId);

    const uniqueUserIds: string[] = [...new Set(userIds)]!;

    const recipients = await getAndCacheRecipients(uniqueUserIds, context);

    await markNotifications(notificationsCollection, pendingWeeklyNotificationsToNewIncidents, true, true);

    const incidentIds = pendingWeeklyNotificationsToNewIncidents.map(n => n.incident_id);

    const incidents = await incidentsCollection.find({ incident_id: { $in: incidentIds } }).toArray();

    const incidentList = incidents.map(i => ({
        id: i.incident_id,
        title: i.title,
        url: `${config.SITE_URL}/cite/${i.incident_id}`,
        date: i.date,
        description: i.description ?? ''
    }));

    const sendEmailParams: SendBulkEmailParams = {
        recipients,
        subject: "Your Weekly AI Incident Briefing",
        dynamicData: {
            newIncidents: incidentList
        },
        templateId: "AIIncidentBriefing"
    };

    await sendBulkEmails(sendEmailParams);

    console.log(`Sent AI Incident Briefing to ${recipients.length} users.`);
}

export const processWeeklyNotifications = async () => {
    const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);
    const context: Context = { client, user: null, req: {} as any };

    await notificationsToWeeklyIncidents(context);
};

const markNotifications = async (notificationsCollection: any, notifications: any, isProcessed: any) => {
  for (const pendingNotification of notifications) {
      await notificationsCollection.updateOne(
          { _id: pendingNotification._id },
          { $set: { processed: isProcessed, sentDate: new Date() } }
      );
  }
}

export const run = async () => {
    try {
        await processWeeklyNotifications();
        console.log("Process Weekly Notifications: Completed.");
        process.exit(0);
    } catch (error: any) {
        console.error(error);
        process.exit(1);
    }
};

if (require.main === module) {
    run();
}
