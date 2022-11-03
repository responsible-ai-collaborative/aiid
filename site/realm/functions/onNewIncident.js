exports = async function (changeEvent) {

  // Destructure out fields from the change stream event object
  const { fullDocument } = changeEvent;

  if (!fullDocument) {
    console.log('Invalid changeEvent:', JSON.stringify(changeEvent));
    return;
  }

  const incidentId = fullDocument.incident_id;

  console.log(`New Incident #${incidentId}`);

  const notificationsCollection = context.services.get('mongodb-atlas').db('customData').collection("notifications");
  const subscriptionsCollection = context.services.get('mongodb-atlas').db('customData').collection("subscriptions");
  const subscriptionsToNewIncidents = await subscriptionsCollection.find({ type: 'new-incidents' }).toArray();

  console.log(`There are ${subscriptionsToNewIncidents.length} subscribers to New Incidents.`);

  // If there are subscribers to New Incidents > Insert a pending notification to process in the next build
  if (subscriptionsToNewIncidents.length > 0) {

    await notificationsCollection.insertOne({
      type: 'new-incidents',
      incident_id: incidentId,
      processed: false,
    })
  }

  return;
};

if (typeof module === 'object') {
  module.exports = exports;
}