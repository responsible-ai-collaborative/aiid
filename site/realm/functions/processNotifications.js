exports = async function () {

  const notificationsCollection = context.services.get('mongodb-atlas').db('customData').collection("notifications");
  const subscriptionsCollection = context.services.get('mongodb-atlas').db('customData').collection("subscriptions");
  const incidentsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("incidents");

  const pendingNotificationsToNewIncidents = await notificationsCollection.find({ processed: false, type: 'new-incidents' }).toArray();

  if (pendingNotificationsToNewIncidents.length > 0) {

    const subscriptionsToNewIncidents = await subscriptionsCollection.find({ type: 'new-incidents' }).toArray();

    // Process subscriptions to new incidents
    if (subscriptionsToNewIncidents.length > 0) {

      const userIds = subscriptionsToNewIncidents.map((subscription) => subscription.userId);

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
          templateId: 'NewIncident' // Template value from "site/realm/functions/sendEmail.js" EMAIL_TEMPLATES constant
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

      console.log(`${pendingNotificationsToNewIncidents.length} pending notifications were processed.`);
    }
    else {
      // If there are no subscribers to New Incidents (edge case) > Mark all pending notifications as processed without "sentDate"
      for (const pendingNotification of pendingNotificationsToNewIncidents) {
        await notificationsCollection.updateOne(
          { _id: pendingNotification._id },
          { $set: { processed: true } }
        );
      }
    }
  }
  else {
    console.log('No pending notifications to process.');
  }

  return pendingNotificationsToNewIncidents;
};

if (typeof module === 'object') {
  module.exports = exports;
}
