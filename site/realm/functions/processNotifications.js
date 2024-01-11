const getRecipients = async (userIds) => {
  const recipients = [];

  for (const userId of userIds) {
    const userResponse = await context.functions.execute('getUser', { userId });

    if (userResponse?.email) {
      recipients.push({
        email: userResponse.email,
        userId,
      });
    }
  }
  return recipients;
}

const markNotifications = async (notificationsCollection, notifications, isProcessed) => {
  for (const pendingNotification of notifications) {
    await notificationsCollection.updateOne(
      { _id: pendingNotification._id },
      { $set: { processed: isProcessed, sentDate: new Date() } }
    );
  }
}

const markNotificationsAsProcessed = async (notificationsCollection, notifications) => {
  await markNotifications(notificationsCollection, notifications, true);
}

const markNotificationsAsNotProcessed = async (notificationsCollection, notifications) => {
  await markNotifications(notificationsCollection, notifications, false);
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

  let result = 0; // Pending notifications processed count

  const notificationsCollection = context.services.get('mongodb-atlas').db('customData').collection("notifications");
  const subscriptionsCollection = context.services.get('mongodb-atlas').db('customData').collection("subscriptions");
  const incidentsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("incidents");
  const entitiesCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("entities");
  const reportsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("reports");

  // Notifications to New Incidents
  try {
    const pendingNotificationsToNewIncidents = await notificationsCollection.find({ processed: false, type: 'new-incidents' }).toArray();

    if (pendingNotificationsToNewIncidents.length > 0) {

      result += pendingNotificationsToNewIncidents.length;

      const subscriptionsToNewIncidents = await subscriptionsCollection.find({ type: 'new-incidents' }).toArray();

      // Process subscriptions to New Incidents
      if (subscriptionsToNewIncidents.length > 0) {

        const allEntities = await entitiesCollection.find({}).toArray();

        const userIds = subscriptionsToNewIncidents.map((subscription) => subscription.userId);

        const uniqueUserIds = [...new Set(userIds)];

        const recipients = await getRecipients(uniqueUserIds);

        let uniqueNotifications = [];

        for (const pendingNotification of pendingNotificationsToNewIncidents) {

          // Mark the notification as processed before sending the email
          await markNotificationsAsProcessed(notificationsCollection, [pendingNotification]);

          // Send only one email per Incident
          if (!uniqueNotifications.includes(pendingNotification.incident_id)) {
            uniqueNotifications.push(pendingNotification.incident_id);

            try {
              const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id });

              //Send email notification
              const sendEmailParams = {
                recipients,
                subject: 'New Incident {{incidentId}} was created',
                dynamicData: {
                  incidentId: `${incident.incident_id}`,
                  incidentTitle: incident.title,
                  incidentUrl: `https://incidentdatabase.ai/cite/${incident.incident_id}`,
                  incidentDescription: incident.description,
                  incidentDate: incident.date,
                  developers: buildEntityList(allEntities, incident['Alleged developer of AI system']),
                  deployers: buildEntityList(allEntities, incident['Alleged deployer of AI system']),
                  entitiesHarmed: buildEntityList(allEntities, incident['Alleged harmed or nearly harmed parties']),
                },
                templateId: 'NewIncident' // Template value from function name sufix from "site/realm/functions/config.json"
              };

              await context.functions.execute('sendEmail', sendEmailParams);

            } catch (error) {
              // If there is an error sending the email > Mark the notification as not processed
              await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

              error.message = `[Process Pending Notifications: New Incidents]: ${error.message}`;
              context.functions.execute('logRollbar', { error });
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

  } catch (error) {
    error.message = `[Process Pending Notifications: New Incidents]: ${error.message}`;
    context.functions.execute('logRollbar', { error });
  }

  // Notifications to New Entity Incidents
  try {
    const pendingNotificationsToNewEntityIncidents = await notificationsCollection.find({ processed: false, type: 'entity' }).toArray();

    if (pendingNotificationsToNewEntityIncidents.length > 0) {

      result += pendingNotificationsToNewEntityIncidents.length;

      const allEntities = await entitiesCollection.find({}).toArray();

      let uniqueNotifications = [];

      for (const pendingNotification of pendingNotificationsToNewEntityIncidents) {

        // Mark the notification as processed before sending the email
        await markNotificationsAsProcessed(notificationsCollection, [pendingNotification]);

        // Process each entity only once
        if (!uniqueNotifications.includes(pendingNotification.entity_id)) {
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

              await context.functions.execute('sendEmail', sendEmailParams);

              console.log(`New "${entity.name}" Entity Incidents: pending notification was processed.`);
            }
          } catch (error) {
            // If there is an error sending the email > Mark the notification as not processed
            await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

            error.message = `[Process Pending Notifications: New Entity Incidents]: ${error.message}`;
            context.functions.execute('logRollbar', { error });
          }
        }
      }
    }
    else {
      console.log('New Entity Incidents: No pending notifications to process.');
    }
  } catch (error) {
    error.message = `[Process Pending Notifications: New Entity Incidents]: ${error.message}`;
    context.functions.execute('logRollbar', { error });
  }

  // Notifications to Incident updates
  try {
    const pendingNotificationsToIncidentUpdates = await notificationsCollection.find({
      processed: false,
      type: { $in: ['new-report-incident', 'incident-updated'] }
    }).toArray();

    if (pendingNotificationsToIncidentUpdates.length > 0) {

      result += pendingNotificationsToIncidentUpdates.length;

      let uniqueNotifications = [];

      for (const pendingNotification of pendingNotificationsToIncidentUpdates) {

        // Mark the notification as processed before sending the email
        await markNotificationsAsProcessed(notificationsCollection, [pendingNotification]);

        // Process each Incident only once
        if (!uniqueNotifications.some(n => n.incident_id === pendingNotification.incident_id && n.type === pendingNotification.type)) {
          uniqueNotifications.push(pendingNotification);

          try {
            const subscriptionsToIncidentUpdates = await subscriptionsCollection.find({
              type: 'incident',
              incident_id: pendingNotification.incident_id
            }).toArray();

            // Process subscriptions to Incident updates
            if (subscriptionsToIncidentUpdates.length > 0) {

              const userIds = subscriptionsToIncidentUpdates.map((subscription) => subscription.userId);

              const uniqueUserIds = [...new Set(userIds)];

              const recipients = await getRecipients(uniqueUserIds);

              const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id });

              const newReportNumber = pendingNotification.report_number;

              const newReport = newReportNumber ? await reportsCollection.findOne({ report_number: newReportNumber }) : null;

              //Send email notification
              const sendEmailParams = {
                recipients,
                subject: 'Incident {{incidentId}} was updated',
                dynamicData: {
                  incidentId: `${incident.incident_id}`,
                  incidentTitle: incident.title,
                  incidentUrl: `https://incidentdatabase.ai/cite/${incident.incident_id}`,
                  reportUrl: `https://incidentdatabase.ai/cite/${incident.incident_id}#r${newReportNumber}`,
                  reportTitle: newReportNumber ? newReport.title : '',
                  reportAuthor: newReportNumber && newReport.authors[0] ? newReport.authors[0] : '',
                },
                // Template value from function name sufix from "site/realm/functions/config.json"
                templateId: newReportNumber ? 'NewReportAddedToAnIncident' : 'IncidentUpdate',
              };

              await context.functions.execute('sendEmail', sendEmailParams);

              console.log(`Incident ${incident.incident_id} updates: Pending notification was processed.`);
            }
          } catch (error) {
            // If there is an error sending the email > Mark the notification as not processed
            await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

            error.message = `[Process Pending Notifications: Incidents Updates]: ${error.message}`;
            context.functions.execute('logRollbar', { error });
          }
        }
      }
    }
    else {
      console.log('New Updated Incidents: No pending notifications to process.');
    }
  } catch (error) {
    error.message = `[Process Pending Notifications: Incidents Updates]: ${error.message}`;
    context.functions.execute('logRollbar', { error });
  }

  // Notifications to New Promotions
  try {

    // Finds all pending notifications to New Promotions
    const pendingNotificationsToNewPromotions = await notificationsCollection.find({ processed: false, type: 'submission-promoted' }).toArray();

    if (pendingNotificationsToNewPromotions.length > 0) {

      result += pendingNotificationsToNewPromotions.length;

      const userIds = pendingNotificationsToNewPromotions.map((subscription) => subscription.userId);

      const uniqueUserIds = [...new Set(userIds)];

      const recipients = await getRecipients(uniqueUserIds);

      let uniqueNotifications = [];

      for (const pendingNotification of pendingNotificationsToNewPromotions) {

        // Mark the notification as processed before sending the email
        await markNotificationsAsProcessed(notificationsCollection, [pendingNotification]);

        if (!uniqueNotifications.includes(pendingNotification.incident_id)) {
          uniqueNotifications.push(pendingNotification.incident_id);

          try {
            const incident = await incidentsCollection.findOne({ incident_id: pendingNotification.incident_id });

            //Send email notification
            const sendEmailParams = {
              recipients,
              subject: 'Your submission has been approved!',
              dynamicData: {
                incidentId: `${incident.incident_id}`,
                incidentTitle: incident.title,
                incidentUrl: `https://incidentdatabase.ai/cite/${incident.incident_id}`,
                incidentDescription: incident.description,
                incidentDate: incident.date,
              },
              templateId: 'SubmissionApproved' // Template value from function name sufix from "site/realm/functions/config.json"
            };

            await context.functions.execute('sendEmail', sendEmailParams);

          } catch (error) {
            // If there is an error sending the email > Mark the notification as not processed
            await markNotificationsAsNotProcessed(notificationsCollection, [pendingNotification]);

            error.message = `[Process Pending Notifications: Submission Promoted]: ${error.message}`;
            context.functions.execute('logRollbar', { error });
          }
        }
      }

      console.log(`New Promotions: ${pendingNotificationsToNewPromotions.length} pending notifications were processed.`);
    }
    else {
      console.log('Submission Promoted: No pending notifications to process.');
    }

  } catch (error) {
    console.log(`[Process Pending Notifications: Submission Promoted]: ${error.message}`)
    error.message = `[Process Pending Notifications: Submission Promoted]: ${error.message}`;
    context.functions.execute('logRollbar', { error });
  }

  return result;
};

if (typeof module === 'object') {
  module.exports = exports;
}
