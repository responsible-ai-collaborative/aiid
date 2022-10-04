exports = async function (changeEvent) {

  // Destructure out fields from the change stream event object
  const { updateDescription, fullDocument, fullDocumentBeforeChange } = changeEvent;

  // Check if the "reports" field was updated
  const updatedFields = Object.keys(updateDescription.updatedFields);

  const isReportListChanged = updatedFields.some(field => field.match(/reports/));

  if (isReportListChanged) {
    const { reports: newReports } = fullDocument;
    const { reports: oldReports } = fullDocumentBeforeChange;

    // If a new report is added, send the email notification to all subscribers
    if (newReports.length > oldReports.length) {

      const newReportNumber = newReports.filter(report => !oldReports.includes(report))[0];

      const reportsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("reports");
      const newReport = await reportsCollection.findOne({ report_number: newReportNumber })

      const incidentId = fullDocument.incident_id;
      const subscriptionsCollection = context.services.get('mongodb-atlas').db('customData').collection("subscriptions");
      const subscriptions = await subscriptionsCollection.find({ type: 'incident', incident_id: incidentId }).toArray();

      // Process subscriptions to incident updates
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
          subject: 'Incident {{incidentId}} was updated',
          dynamicData: {
            incidentId: `${incidentId}`,
            incidentTitle: fullDocument.title,
            incidentUrl: `https://incidentdatabase.ai/cite/${incidentId}`,
            reportUrl: `https://incidentdatabase.ai/cite/${incidentId}#r${newReportNumber}`,
            reportTitle: newReport.title,
            reportAuthor: newReport.authors[0],
          },
          templateId: 'IncidentUpdate' // Template value from "site/realm/functions/sendEmail.js" EMAIL_TEMPLATES constant
        };
        const sendEmailresult = await context.functions.execute('sendEmail', sendEmailParams);

        console.log('sendEmailParams', JSON.stringify(sendEmailParams));
        console.log(JSON.stringify(sendEmailresult));
        return sendEmailresult;
      }
    }
    else { //if a report was deleted
      const deletedReportNumber = oldReports.filter(report => !newReports.includes(report))[0];
      console.log('Report deleted:', deletedReportNumber);
    }
  }
};
