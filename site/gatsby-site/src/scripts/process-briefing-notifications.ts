import { MongoClient } from "mongodb";
import config from "../../server/config";
import { Context, DBEntity, DBIncident, DBReport, DBSubscription } from "../../server/interfaces";
import { sendBulkEmails, SendBulkEmailParams } from "../../server/emails";
import * as reporter from '../../server/reporter';
import * as prismic from '@prismicio/client';
import { UserCacheManager } from "../../server/fields/userCacheManager";

async function notificationsToBriefingIncidents(context: Context) {
  let result = 0;
  const notificationsCollection = context.client.db('customData').collection("notifications");
  const subscriptionsCollection = context.client.db('customData').collection("subscriptions");
  const entitiesCollection = context.client.db('aiidprod').collection<DBEntity>("entities");
  const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");
  const reportsCollection = context.client.db('aiidprod').collection<DBReport>("reports");

  const pendingBriefingNotificationsToNewIncidents = await notificationsCollection.find({
    processed: false,
    type: 'ai-briefing'
  }).toArray();

  if (pendingBriefingNotificationsToNewIncidents.length === 0) {
    // If there are no subscribers to New Incidents (edge case) > Mark all pending notifications as processed
    await markNotificationsAsProcessed(notificationsCollection, pendingBriefingNotificationsToNewIncidents);
    console.log("No new incidents for briefing.");
    return result;
  }

  result += pendingBriefingNotificationsToNewIncidents.length;

  // Get briefing subscribers
  const briefingSubscribers = await subscriptionsCollection.find<DBSubscription>({ type: 'ai-briefing' }).toArray();

  if (briefingSubscribers.length === 0) {
    console.log("No briefing subscribers found.");
    return;
  }

  const allEntities = await entitiesCollection.find({}).toArray();

  const userIds = briefingSubscribers.map(s => s.userId);

  const uniqueUserIds: string[] = [...new Set(userIds)]!;

  const userCacheManager = new UserCacheManager();

  const recipients = await userCacheManager.getAndCacheRecipients(uniqueUserIds, context);

  const incidentIds = pendingBriefingNotificationsToNewIncidents.map(n => n.incident_id);

  await markNotificationsAsProcessed(notificationsCollection, pendingBriefingNotificationsToNewIncidents);

  const incidents = await incidentsCollection.find({ incident_id: { $in: incidentIds } }).toArray();

  // Find first report for each incident
  const firstReports = await Promise.all(incidents.map(async (incident) => {
    if (incident.reports && incident.reports.length > 0) {
      const firstReportNumber = incident.reports[0];
      const report = await reportsCollection.findOne({ report_number: firstReportNumber });

      return {
        incident_id: incident.incident_id,
        report_number: report?.report_number,
        image_url: report?.image_url
      };
    }
    return null; // Return null or handle the case where there are no reports
  }).filter(report => report !== null)); // Filter out null values

  const incidentList = incidents.map(i => {
    const developers = buildEntityList(allEntities, i['Alleged developer of AI system']);
    const deployers = buildEntityList(allEntities, i['Alleged deployer of AI system']);
    const entitiesHarmed = buildEntityList(allEntities, i['Alleged harmed or nearly harmed parties']);
    const implicatedSystems = buildEntityList(allEntities, i.implicated_systems);
    const reportImageUrl = firstReports.find(r => r && r.incident_id === i.incident_id)?.image_url;
    return {
      id: i.incident_id,
      title: i.title,
      url: `${config.SITE_URL}/cite/${i.incident_id}`,
      date: i.date,
      description: i.description ?? '',
      developers,
      deployers,
      entitiesHarmed,
      implicatedSystems,
      reportImageUrl
    }
  });

  // Initialize the Prismic client
  const prismicClient = await prismic.createClient(config.GATSBY_PRISMIC_REPO_NAME, {
    accessToken: config.PRISMIC_ACCESS_TOKEN,
  });

  const now = new Date();
  const lastWeek = new Date(now);
  lastWeek.setUTCDate(now.getUTCDate() - 7); // Move to 7 days ago
  lastWeek.setUTCHours(15, 0, 0, 0); // Set to start of the day

  const lastWeekDate = lastWeek.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  const nowDate = now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  const lastWeekISOString = lastWeek.toISOString().split('.')[0] + 'Z';
  const nowISOString = now.toISOString().split('.')[0] + 'Z';

  let newBlogPosts: any[] = [];

  try {
    const response = await prismicClient.getAllByType('blog', {
      orderings: {
        field: "my.blog.date",
        direction: "desc"
      },
      filters: [
        prismic.filter.dateAfter('my.blog.date', lastWeekDate),
        prismic.filter.dateBefore('my.blog.date', nowDate)
      ]
    });

    newBlogPosts = response.map((blogPost: any) => ({
      url: `${config.SITE_URL}/blog/${blogPost.data.slug}`,
      title: blogPost.data.title[0]?.text ?? '',
      description: blogPost.data.metadescription ?? '',
      date: blogPost.data.date,
      image: blogPost.data.image.url ?? '',
      author: blogPost.data.author ?? ''
    }));
  } catch (error: any) {
    console.error('Error fetching newBlogPosts:', JSON.stringify(error), JSON.stringify(error.message));
    newBlogPosts = [];
  }

  let updates: any[] = [];

  try {
    const response = await prismicClient.getAllByType('update', {
      orderings: {
        field: "document.first_publication_date",
      },
      filters: [
        prismic.filter.dateAfter('document.first_publication_date', lastWeekISOString),
        prismic.filter.dateBefore('document.first_publication_date', nowISOString)
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
        subject: "Your AI Incident Briefing",
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
    await markNotificationsAsNotProcessed(notificationsCollection, pendingBriefingNotificationsToNewIncidents);

    error.message = `[Process Briefing Notifications: AI Incident Briefing]: ${error.message}`;

    throw error;
  }

  console.log(`Sent AI Incident Briefing to ${recipients.length} users.`);

  return result;
}

export const processBriefingNotifications = async () => {
  const userCacheManager = new UserCacheManager();

  userCacheManager.clearUsersCache();

  const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

  const context: Context = { client, user: null, req: {} as any };

  const result = await notificationsToBriefingIncidents(context);

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
    await processBriefingNotifications();
    console.log("Process Briefing Notifications: Completed.");
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