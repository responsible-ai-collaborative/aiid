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
  const reportsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("reports");
  const subscriptionsToIncident = await subscriptionsCollection.find({ type: 'incident', incident_id: incidentId }).toArray();

  console.log(`There are ${subscriptionsToIncident.length} subscribers to Incident: ${incidentId}`);

  // Process subscriptions to Incident updates
  if (subscriptionsToIncident.length > 0) {

    // Check if the "reports" field was updated
    const isReportListChanged = updatedFields.some(field => field.match(/reports/));

    let newReportNumber;

    if (isReportListChanged) {
      const { reports: newReports } = fullDocument;
      const { reports: oldReports } = fullDocumentBeforeChange;

      if (newReports.length > oldReports.length) {
        newReportNumber = newReports.filter(report => !oldReports.includes(report))[0];
      }
      else { //if a report was deleted
        const deletedReportNumber = oldReports.filter(report => !newReports.includes(report))[0];
        console.log('Report deleted:', deletedReportNumber);
      }
    }

    let notification;
    if (newReportNumber) {
      const newReport = await reportsCollection.findOne({ report_number: newReportNumber });

      // If the new Report is not a Variant > Insert a pending notification to process in the next build
      if (newReport &&
        (!newReport.text_inputs || newReport.text_inputs == '') &&
        (!newReport.text_outputs || newReport.text_outputs == '')) {

        // If there is a new Report > Insert a pending notification to process in the next build
        notification = {
          type: 'new-report-incident',
          incident_id: incidentId,
          report_number: newReportNumber,
          processed: false,
        };
      }
    }
    else {
      // If any other Incident field is updated > Insert a pending notification to process in the next build
      notification = {
        type: 'incident-updated',
        incident_id: incidentId,
        processed: false,
      };
    }

    if (notification) {
      await notificationsCollection.updateOne(
        notification, // filter
        notification, // new document
        { upsert: true }
      );
    }
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
        const notification = {
          type: 'entity',
          incident_id: incidentId,
          entity_id: entityId,
          isUpdate: true,
          processed: false,
        };
        await notificationsCollection.updateOne(
          notification, // filter
          notification, // new document
          { upsert: true }
        )
      }
    }
  }

  return;
};

if (typeof module === 'object') {
  module.exports = exports;
}
