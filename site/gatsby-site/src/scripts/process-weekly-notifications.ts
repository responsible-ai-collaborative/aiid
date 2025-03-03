import { MongoClient } from "mongodb";
import config from "../../server/config";
import { Context, DBEntity, DBIncident, DBSubscription } from "../../server/interfaces";
import { sendBulkEmails, SendBulkEmailParams } from "../../server/emails";
import { UserAdminData, getAndCacheRecipients, buildEntityList } from "../../server/fields/common";
import { gql } from 'graphql-tag';
import { useApolloClient } from '@apollo/client';

const usersCache: UserAdminData[] = [];

async function notificationsToWeeklyIncidents(context: Context) {
  const notificationsCollection = context.client.db('customData').collection("notifications");
  const subscriptionsCollection = context.client.db('customData').collection("subscriptions");
  const entitiesCollection = context.client.db('aiidprod').collection<DBEntity>("entities");
  const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");

  const pendingWeeklyNotificationsToNewIncidents = await notificationsCollection.find({
    processed: false,
    type: 'ai-weekly-briefing'
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

  const recipients = await getAndCacheRecipients(uniqueUserIds, context, usersCache);

  await markNotifications(notificationsCollection, pendingWeeklyNotificationsToNewIncidents, true);

  const incidentIds = pendingWeeklyNotificationsToNewIncidents.map(n => n.incident_id);

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

  let newBlogPosts = [];
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const formattedDate = lastWeek.toISOString().split('T')[0];

  const client = useApolloClient();

  const BLOG_POSTS_QUERY = gql`
    query GetRecentBlogPosts($date: String!) {
      allBlogPost(filter: {data: {date: {gt: $date}}}, sort: {data: {date: DESC}}) {
        nodes {
          id
          title
          date
          slug
        }
      }
    }
  `;

  try {
    const { data } = await client.query({
      query: BLOG_POSTS_QUERY,
      variables: { date: formattedDate }
    });

    newBlogPosts = data.allBlogPost.nodes.map((post: any) => ({
      id: post.id,
      title: post.title,
      url: `${config.SITE_URL}/blog/${post.slug}`,
      date: post.date
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    newBlogPosts = [];
  }

  const UPDATES_QUERY = gql`
    query GetRecentUpdates($date: String!) {
      allUpdate(filter: {first_publication_date: {gt: $date}}) {
        nodes {
          text {
            text
            html
          }
        }
      }
    }
  `;

  let updates = [];

  try {
    const { data } = await client.query({
      query: UPDATES_QUERY,
      variables: { date: formattedDate }
    });

    updates = data.allUpdate.nodes.map((update: any) => ({
      text: update.text.html,
      date: update.first_publication_date
    }));
  } catch (error) {
    console.error('Error fetching updates:', error);
    updates = [];
  }


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
