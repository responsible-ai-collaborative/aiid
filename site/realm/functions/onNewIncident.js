exports = async function (changeEvent) {

  // Destructure out fields from the change stream event object
  const { fullDocument } = changeEvent;

  if (!fullDocument) {
    console.log('Invalid changeEvent:', JSON.stringify(changeEvent));
    return;
  }

  const incidentId = fullDocument.incident_id;

  console.log(`Processing subscriptions to new incident ${incidentId}`);

  const subscriptionsCollection = context.services.get('mongodb-atlas').db('customData').collection("subscriptions");
  const subscriptions = await subscriptionsCollection.find({ type: 'new-incidents' }).toArray();

  // Process subscriptions to new incidents
  if (subscriptions.length > 0) {

    const userIds = subscriptions.map((subscription) => subscription.userId);

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

    //Send email notification
    const sendEmailParams = {
      recipients,
      subject: 'New Incident {{incidentId}} was created',
      dynamicData: {
        incidentId: `${incidentId}`,
        incidentTitle: fullDocument.title,
        incidentUrl: `https://incidentdatabase.ai/cite/${incidentId}`,
      },
      templateId: 'NewIncident' // Template value from "site/realm/functions/sendEmail.js" EMAIL_TEMPLATES constant
    };
    const sendEmailresult = await context.functions.execute('sendEmail', sendEmailParams);

    console.log('sendEmailParams', JSON.stringify(sendEmailParams));
    console.log(JSON.stringify(sendEmailresult));

    return sendEmailresult;
  }

  console.log('No email subscriptions to process');
  return;
};
