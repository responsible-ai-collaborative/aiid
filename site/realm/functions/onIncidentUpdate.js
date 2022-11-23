exports = async function (changeEvent) {

  // Destructure out fields from the change stream event object
  const { updateDescription, fullDocument, fullDocumentBeforeChange } = changeEvent;

  if (!updateDescription || !fullDocumentBeforeChange || !fullDocument) {
    console.log('Invalid changeEvent:', JSON.stringify(changeEvent));
    return;
  }

  const updatedFields = Object.keys(updateDescription.updatedFields);

  const incidentId = fullDocument.incident_id;

  console.log(`Processing updates on incident ${incidentId}`);
  console.log('updateDescription', JSON.stringify(updateDescription));

  const notificationsCollection = context.services.get('mongodb-atlas').db('customData').collection("notifications");
  const subscriptionsCollection = context.services.get('mongodb-atlas').db('customData').collection("subscriptions");
  const subscriptionsToIncident = await subscriptionsCollection.find({ type: 'incident', incident_id: incidentId }).toArray();

  console.log(`There are ${subscriptionsToIncident.length} subscribers to Incident: ${incidentId}`);

  // Process subscriptions to Incident updates
  if (subscriptionsToIncident.length > 0) {

    const userIds = subscriptionsToIncident.map((subscription) => subscription.userId);

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

    // Check if the "reports" field was updated
    const isReportListChanged = updatedFields.some(field => field.match(/reports/));

    if (isReportListChanged) {
      const { reports: newReports } = fullDocument;
      const { reports: oldReports } = fullDocumentBeforeChange;

      // If a new report is added, send the email notification to all subscribers
      if (newReports.length > oldReports.length) {

        const newReportNumber = newReports.filter(report => !oldReports.includes(report))[0];

        const reportsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("reports");
        const newReport = await reportsCollection.findOne({ report_number: newReportNumber })

        //Send email notification
        const sendEmailParams = {
          recipients,
          subject: 'Incident {{incidentId}} was updated',
          dynamicData: {
            incidentId: `${incidentId}`,
            incidentTitle: fullDocument.title,
            incidentUrl: `https://incidentdatabase.ai/cite/${incidentId}`,
            reportUrl: `https://incidentdatabase.ai/cite/${incidentId}#r${newReportNumber}`,
            reportTitle: newReport.title,
            reportAuthor: newReport.authors[0] ? newReport.authors[0] : '',
          },
          templateId: 'NewReportAddedToAnIncident' // Template value from function name sufix from "site/realm/functions/config.json"
        };
        const sendEmailresult = await context.functions.execute('sendEmail', sendEmailParams);

        console.log('sendEmailParams', JSON.stringify(sendEmailParams));
        console.log(JSON.stringify(sendEmailresult));

        return sendEmailresult;
      }
      else { //if a report was deleted
        const deletedReportNumber = oldReports.filter(report => !newReports.includes(report))[0];
        console.log('Report deleted:', deletedReportNumber);
      }
    }

    //Send email notification
    const sendEmailParams = {
      recipients,
      subject: 'Incident {{incidentId}} was updated',
      dynamicData: {
        incidentId: `${incidentId}`,
        incidentTitle: fullDocument.title,
        incidentUrl: `https://incidentdatabase.ai/cite/${incidentId}`,
      },
      templateId: 'IncidentUpdate' // Template value from function name sufix from "site/realm/functions/config.json"
    };
    const sendEmailresult = await context.functions.execute('sendEmail', sendEmailParams);

    console.log('sendEmailParams', JSON.stringify(sendEmailParams));
    console.log(JSON.stringify(sendEmailresult));

    return sendEmailresult;
  }

  // Check if Entity fields changed
  const entitiesChanged = updatedFields.some(field => field.match(/Alleged deployer of AI system|Alleged developer of AI system|Alleged harmed or nearly harmed parties/));

  if (entitiesChanged) {
    const entityFields = [
      'Alleged deployer of AI system',
      'Alleged developer of AI system',
      'Alleged harmed or nearly harmed parties',
    ];

    let entities = [];

    for (const field of entityFields) {

      const oldEntities = fullDocumentBeforeChange[field];
      const newEntities = fullDocument[field];
      const entitiesAdded = newEntities.filter(x => !oldEntities.includes(x));

      console.log(`-- entities added to '${field}':`, entitiesAdded);

      for (const entity of entitiesAdded) {
        if (!entities.includes(entity)) {
          entities.push(entity);
        }
      }
    }

    for (const entityId of entities) {
      // Find subscriptions to this specific entity
      const subscriptionsToEntity = await subscriptionsCollection.find({
        type: 'entity',
        entityId
      }).toArray();

      console.log(`There are ${subscriptionsToEntity.length} subscribers to Entity: ${entityId}`);

      // If there are subscribers to Entities > Insert a pending notification to process in the next build
      if (subscriptionsToEntity.length > 0) {
        await notificationsCollection.insertOne({
          type: 'entity',
          incident_id: incidentId,
          entity_id: entityId,
          isUpdate: true,
          processed: false,
        })
      }
    }
  }

  return;
};
