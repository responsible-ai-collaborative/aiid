import { MongoClient } from "mongodb";
import config from "../../server/config";
import { Context, DBEntity, DBIncident, DBSubscription } from "../../server/interfaces";
import { sendBulkEmails, SendBulkEmailParams } from "../../server/emails";
import * as reporter from '../../server/reporter';
import * as prismic from '@prismicio/client';
import { clearUsersCache, getAndCacheRecipients } from "../../server/fields/common";

async function notificationsToWeeklyIncidents(context: Context) {
  let result = 0;
  const notificationsCollection = context.client.db('customData').collection("notifications");
  const subscriptionsCollection = context.client.db('customData').collection("subscriptions");
  const entitiesCollection = context.client.db('aiidprod').collection<DBEntity>("entities");
  const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");

  const pendingWeeklyNotificationsToNewIncidents = await notificationsCollection.find({
    processed: false,
    type: 'ai-weekly-briefing'
  }).toArray();

  if (pendingWeeklyNotificationsToNewIncidents.length === 0) {
    // If there are no subscribers to New Incidents (edge case) > Mark all pending notifications as processed
    await markNotificationsAsProcessed(notificationsCollection, pendingWeeklyNotificationsToNewIncidents);
    console.log("No new incidents for weekly briefing.");
    return;
  }

  result += pendingWeeklyNotificationsToNewIncidents.length;

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

  const incidentIds = pendingWeeklyNotificationsToNewIncidents.map(n => n.incident_id);

  await markNotificationsAsProcessed(notificationsCollection, pendingWeeklyNotificationsToNewIncidents);

  const incidents = await incidentsCollection.find({ incident_id: { $in: incidentIds } }).toArray();

  const incidentList = incidents.map(i => {
    const developers = buildEntityList(allEntities, i['Alleged developer of AI system']);
    const deployers = buildEntityList(allEntities, i['Alleged deployer of AI system']);
    const entitiesHarmed = buildEntityList(allEntities, i['Alleged harmed or nearly harmed parties']);
    const implicatedSystems = buildEntityList(allEntities, i.implicated_systems);

    return {
      id: i.incident_id,
      title: i.title,
      url: `${config.SITE_URL}/cite/${i.incident_id}`,
      date: i.date,
      description: i.description ?? '',
      developers,
      deployers,
      entitiesHarmed,
      implicatedSystems
    }
  });

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const formattedDate = lastWeek.toISOString().split('T')[0];

  // Initialize the Prismic client
  const prismicClient = await prismic.createClient(config.GATSBY_PRISMIC_REPO_NAME, {
    accessToken: config.PRISMIC_ACCESS_TOKEN, // If you have a private repository
  });

  let newBlogPosts: any[] = [];

  try {

    const response = await prismicClient.getAllByType('blog', {
      orderings: {
        field: "my.blog.date",
      },
      filters: [
        prismic.filter.dateAfter('my.blog.date', formattedDate) // Ensure formattedDate is a valid ISO string
      ]
    });

    newBlogPosts = response.map((blogPost: any) => ({
      url: `${config.SITE_URL}/blog/${blogPost.data.slug}`,
      title: blogPost.data.title[0]?.text ?? '',
      description: blogPost.data.metaDescription[0]?.text ?? '',
      date: blogPost.data.date
    }));
  } catch (error) {
    console.error('Error fetching newBlogPosts:', JSON.stringify(error));
    newBlogPosts = [];
  }

  let updates: any[] = [];

  try {

    const response = await prismicClient.getAllByType('update', {
      orderings: {
        field: "document.first_publication_date",
      },
      filters: [
        prismic.filter.dateAfter('document.first_publication_date', formattedDate)
      ]
    });

    updates = response.map((update: any) => ({
      title: update.data.title,
      description: update.data.text[0]?.text ?? '',
    }));
  } catch (error) {
    console.error('Error fetching updates:', JSON.stringify(error));
    updates = [];
  }


  try {
    if (incidentList.length > 0 && recipients.length > 0) {
      const sendEmailParams: SendBulkEmailParams = {
        recipients,
        subject: "Your Weekly AI Incident Briefing",
        dynamicData: {
          newIncidents: incidentList,
          newBlogPosts: newBlogPosts,
          updates: updates
        },
        templateId: "AIIncidentBriefing"
      };

      await sendBulkEmails(sendEmailParams);
    }
  } catch (error: any) {
    // If there is an error sending the email > Mark the notification as not processed
    await markNotificationsAsNotProcessed(notificationsCollection, pendingWeeklyNotificationsToNewIncidents);

    error.message = `[Process Weekly Notifications: AI Incident Briefing]: ${error.message}`;

    throw error;
  }

  console.log(`Sent AI Incident Briefing to ${recipients.length} users.`);

  return result;
}

export const processWeeklyNotifications = async () => {
  clearUsersCache();

  const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

  const context: Context = { client, user: null, req: {} as any };

  const result = await notificationsToWeeklyIncidents(context);

  console.log(`Processed ${result} notifications.`);

  return result;
};

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

export const run = async () => {
  try {
    await processWeeklyNotifications();
    console.log("Process Weekly Notifications: Completed.");
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    reporter.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  run();
}