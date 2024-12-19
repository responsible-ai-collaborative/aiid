import { sendEmail } from '../../server/emails';

// from site/gatsby-site, run with
// TEST_EMAIL_TO_ADDRESS=<address> dotenv run <path to>/npx ts-node src/scripts/sendEmailTest.js

const email = process.env.TEST_EMAIL_TO_ADDRESS;

if (!email) {
  console.log('Must specify environment variable TEST_EMAIL_TO_ADDRESS');
} else {
  const sendEmailArguments = {
    recipients: [{ email: email, userId: 'testId' }],
    subject: 'New Incident',
    dynamicData: {
      incidentId: '741',
      incidentTitle: "Robin Williams's Voice Deepfaked Without Consent",
      incidentUrl: 'https://incidentdatabase.ai/cite/741',
      incidentDescription:
        "Zelda Williams, the daughter of the late Robin Williams, condemned the misuse of her father's voice in AI-generated productions, having cited some instances where his voice had been deepfaked, along with the potential for further misuse, as such instances do not involve consent.",
      incidentDate: '2023-10-02',
      developers: 'Unknown deepfake creators',
      deployers: 'Unknown deepfake creators',
      entitiesHarmed: 'Zelda Williams , Robin Williams and Family of Robin Williams',
      entityUrl: 'https://incidentdatabase.ai/entities/unknown-deepfake-creators/',
      entityName: 'Unknown deepfake creators',
    },

    // Possible values:
    // 'NewReportAddedToAnIncident' 'NewIncident' 'EntityIncidentUpdated'
    // 'NewEntityIncident' 'SubmissionApproved' 'IncidentUpdate'
    templateId: process.env.TEST_EMAIL_TEMPLATE_ID || 'NewIncident',
  };

  console.log(JSON.stringify(sendEmailArguments, null, 2));

  sendEmail(sendEmailArguments);
}
