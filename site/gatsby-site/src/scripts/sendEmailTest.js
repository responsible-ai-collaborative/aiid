import { sendEmail } from '../../server/fields/common.ts';

sendEmail({
  recipients: [
    {
      email: 'l.mcnulty@riseup.net',
      userId: 'testId',
    },
  ],
  subject: 'test',
  dynamicData: {
    incidentId: 'test',
    incidentTitle: 'test',
    incidentUrl: 'test',
    incidentDescription: 'test',
    incidentDate: 'test',
    developers: 'test', // HTML string of developers
    deployers: 'test', // HTML string of deployers
    entitiesHarmed: 'test', // HTML string of harmed entities
    //        reportUrl: string,   // URL for a specific report (optional)
    //        reportTitle: string, // Title of the report (optional)
    //        reportAuthor: string, // Author of the report (optional)
    //        entityName: string,   // Entity name (optional)
    //        entityUrl: string,    // Entity URL (optional)
  },
  templateId: 'NewIncident', // Email template ID
});
