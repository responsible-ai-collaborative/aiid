import { sendBulkEmails } from '../../server/emails';

// from site/gatsby-site, run with
// TEST_EMAIL_TO_ADDRESS=<email> npx tsx --env-file=.env src/scripts/sendEmailTest.ts
//
// Sends the consolidated notifications digest to a single address so the
// `Notifications` template can be previewed end-to-end (including whether
// MailerSend renders the entity-link HTML in developers/deployers/entitiesHarmed
// rather than escaping it). Each section is populated below; delete the ones you
// don't want to preview.

const email = process.env.TEST_EMAIL_TO_ADDRESS;

if (!email) {
  console.log('Must specify environment variable TEST_EMAIL_TO_ADDRESS');
} else {
  // Mirrors the UserDigest shape produced by src/scripts/process-notifications.ts.
  const digest = {
    newIncidents: [
      {
        incidentId: '741',
        incidentTitle: "Robin Williams's Voice Deepfaked Without Consent",
        incidentUrl: 'https://incidentdatabase.ai/cite/741',
        incidentDescription:
          "Zelda Williams, the daughter of the late Robin Williams, condemned the misuse of her father's voice in AI-generated productions.",
        incidentDate: '2023-10-02',
        developers: '<a href="https://incidentdatabase.ai/entities/unknown-deepfake-creators">Unknown deepfake creators</a>',
        deployers: '<a href="https://incidentdatabase.ai/entities/unknown-deepfake-creators">Unknown deepfake creators</a>',
        entitiesHarmed: '<a href="https://incidentdatabase.ai/entities/zelda-williams">Zelda Williams</a>',
        implicatedSystems: '',
      },
    ],
    entityEvents: [
      {
        incidentId: '741',
        incidentTitle: "Robin Williams's Voice Deepfaked Without Consent",
        incidentUrl: 'https://incidentdatabase.ai/cite/741',
        incidentDescription: 'An incident involving an entity you follow.',
        incidentDate: '2023-10-02',
        developers: '<a href="https://incidentdatabase.ai/entities/openai">OpenAI</a>',
        deployers: '<a href="https://incidentdatabase.ai/entities/openai">OpenAI</a>',
        entitiesHarmed: '<a href="https://incidentdatabase.ai/entities/zelda-williams">Zelda Williams</a>',
        implicatedSystems: '',
        entityName: 'OpenAI',
        entityUrl: 'https://incidentdatabase.ai/entities/openai',
        isUpdate: false,
      },
    ],
    incidentUpdates: [
      {
        incidentId: '1',
        incidentTitle: 'Incident 1',
        incidentUrl: 'https://incidentdatabase.ai/cite/1',
        reportUrl: 'https://incidentdatabase.ai/cite/1#r2172',
        reportTitle: 'A newly added report',
        reportAuthor: 'Jane Doe',
      },
    ],
    submissionsPromoted: [
      {
        incidentId: '742',
        incidentTitle: 'Your Submitted Incident',
        incidentUrl: 'https://incidentdatabase.ai/cite/742',
        incidentDescription: 'The submission you sent in has been approved.',
        incidentDate: '2023-11-15',
      },
    ],
  };

  const sendEmailArguments = {
    recipients: [{ email: email, userId: 'testId', dynamicData: digest }],
    subject: 'AI Incident Database Notifications',
    templateId: 'Notifications',
  };

  console.log(JSON.stringify(sendEmailArguments, null, 2));

  sendBulkEmails(sendEmailArguments);
}
