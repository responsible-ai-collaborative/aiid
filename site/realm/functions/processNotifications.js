const getRecipients = async (userIds) => {
  const recipients = [];

  for (const userId of userIds) {
    const userResponse = await context.functions.execute('getUser', { userId });

    if (userResponse.email) {
      recipients.push({
        email: userResponse.email,
        userId,
      });
    }
  }
  return recipients;
}

const markNotificationsAsProcessed = async (notificationsCollection, notifications) => {
  for (const pendingNotification of notifications) {
    await notificationsCollection.updateOne(
      { _id: pendingNotification._id },
      { $set: { processed: true } }
    );
  }
}

const buildEntityList = (allEntities, entityIds) => {
  const entityNames = entityIds.map(entityId => {
    const entity = allEntities.find(entity => entity.entity_id === entityId);
    return entity ? `<a href="https://incidentdatabase.ai/entities/${entity.entity_id}">${entity.name}</a>` : '';
  });

  if (entityNames.length < 3) { return entityNames.join(' and '); }

  return `${entityNames.slice(0, - 1).join(', ')}, and ${entityNames[entityNames.length - 1]}`;
}

exports = async function () {

  const notificationsCollection = context.services.get('mongodb-atlas').db('customData').collection("notifications");
  const subscriptionsCollection = context.services.get('mongodb-atlas').db('customData').collection("subscriptions");
  const incidentsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("incidents");
  const entitiesCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("entities");

  // Notifications to New Incidents
  const pendingNotificationsToNewIncidents = await notificationsCollection.find({ processed: false, type: 'new-incidents' }).toArray();

  if (pendingNotificationsToNewIncidents.length > 0) {

    const subscriptionsToNewIncidents = await subscriptionsCollection.find({ type: 'new-incidents' }).toArray();

    // Process subscriptions to New Incidents
    if (subscriptionsToNewIncidents.length > 0) {

      const userIds = subscriptionsToNewIncidents.map((subscription) => subscription.userId);

      const recipients = await getRecipients(userIds);

      for (const pendingNotification of pendingNotificationsToNewIncidents) {

        const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id });

        //Send email notification
        const sendEmailParams = {
          recipients,
          subject: 'New Incident {{incidentId}} was created',
          dynamicData: {
            incidentId: `${incident.incident_id}`,
            incidentTitle: incident.title,
            incidentUrl: `https://incidentdatabase.ai/cite/${incident.incident_id}`,
          },
          templateId: 'NewIncident' // Template value from function name sufix from "site/realm/functions/config.json"
        };
        const sendEmailResult = await context.functions.execute('sendEmail', sendEmailParams);

        console.log('sendEmailParams', JSON.stringify(sendEmailParams));
        console.log(JSON.stringify(sendEmailResult));

        //If notification was sucessfully sent > Mark the notification as processed
        if (sendEmailResult.statusCode == 200 || sendEmailResult.statusCode == 202) {
          await notificationsCollection.updateOne(
            { _id: pendingNotification._id },
            { $set: { processed: true, sentDate: new Date() } }
          );
        }
      }

      console.log(`New Incidents: ${pendingNotificationsToNewIncidents.length} pending notifications were processed.`);
    }
    else {
      // If there are no subscribers to New Incidents (edge case) > Mark all pending notifications as processed without "sentDate"
      markNotificationsAsProcessed(notificationsCollection, pendingNotificationsToNewIncidents);
    }
  }
  else {
    console.log('New Incidents: No pending notifications to process.');
  }

  // Notifications to New Entity Incidents
  const pendingNotificationsToNewEntityIncidents = await notificationsCollection.find({ processed: false, type: 'entity' }).toArray();

  if (pendingNotificationsToNewEntityIncidents.length > 0) {

    const allEntities = await entitiesCollection.find({}).toArray();

    for (const pendingNotification of pendingNotificationsToNewEntityIncidents) {

      const subscriptionsToNewEntityIncidents = await subscriptionsCollection.find({
        type: 'entity',
        entityId: pendingNotification.entity_id
      }).toArray();

      // Process subscriptions to New Entity Incidents
      if (subscriptionsToNewEntityIncidents.length > 0) {

        const userIds = subscriptionsToNewEntityIncidents.map((subscription) => subscription.userId);

        const recipients = await getRecipients(userIds);

        const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id });

        const entity = allEntities.find(entity => entity.entity_id === pendingNotification.entity_id);

        const isIncidentUpdate = pendingNotification.isUpdate;

        //Send email notification
        const sendEmailParams = {
          recipients,
          subject: isIncidentUpdate ? 'Update Incident for {{entityName}}'
            : 'New Incident for {{entityName}}',
          dynamicData: {
            incidentId: `${incident.incident_id}`,
            incidentTitle: incident.title,
            incidentUrl: `https://incidentdatabase.ai/cite/${incident.incident_id}`,
            incidentDescription: incident.description,
            incidentDate: incident.date,
            entityName: entity.name,
            entityUrl: `https://incidentdatabase.ai/entities/${entity.entity_id}`,
            developers: buildEntityList(allEntities, incident['Alleged developer of AI system']),
            deployers: buildEntityList(allEntities, incident['Alleged deployer of AI system']),
            entitiesHarmed: buildEntityList(allEntities, incident['Alleged harmed or nearly harmed parties']),
          },
          // Template value from function name sufix from "site/realm/functions/config.json"
          templateId: isIncidentUpdate ? 'EntityIncidentUpdated' : 'NewEntityIncident'
        };
        const sendEmailResult = await context.functions.execute('sendEmail', sendEmailParams);

        console.log('sendEmailParams', JSON.stringify(sendEmailParams));
        console.log(JSON.stringify(sendEmailResult));

        //If notification was sucessfully sent > Mark the notification as processed
        if (sendEmailResult.statusCode == 200 || sendEmailResult.statusCode == 202) {
          await notificationsCollection.updateOne(
            { _id: pendingNotification._id },
            { $set: { processed: true, sentDate: new Date() } }
          );
        }

        console.log(`New Entity Incidents: ${pendingNotificationsToNewEntityIncidents.length} pending notifications were processed.`);
      }
      else {
        // If there are no subscribers to New Entity Incidents (edge case) > Mark all pending notifications as processed without "sentDate"
        markNotificationsAsProcessed(notificationsCollection, pendingNotificationsToNewEntityIncidents);
      }
    }
  }
  else {
    console.log('New Entity Incidents: No pending notifications to process.');
  }

  return true;
};

if (typeof module === 'object') {
  module.exports = exports;
}
