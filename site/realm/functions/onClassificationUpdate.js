exports = async function (changeEvent) {

  console.log(`changeEvent`, changeEvent);

  const { updateDescription, fullDocument, fullDocumentBeforeChange } = changeEvent;

  if (!updateDescription || !fullDocumentBeforeChange || !fullDocument) {
    console.log('Invalid changeEvent:', JSON.stringify(changeEvent));
    context.functions.execute('logRollbar', {
      error: '[On Incident Update event]: Invalid changeEvent',
      data: { changeEvent }
    });
    return;
  }

  const updatedFields = Object.keys(updateDescription.updatedFields);

  const incidentId = fullDocument.incident_id;

  const aiidProd = context.services.get('mongodb-atlas').db('aiidProd');
  const customData = context.services.get('mongodb-atlas').db('customData');

  const checklistSubscriptions = []; // TODO

  for (const subscription of checklistSubscriptions) {

    const subscriptionMatchesUpdate = false; // TODO

    if (subscriptionMatchesUpdate) {

      const email = ''; // TODO

      const sendEmailParams = {
          recipients: [{ email }],
          subject: '', // TODO
          templateId: '' // TODO: Template value from function name sufix from "site/realm/functions/config.json"
      };

      const sendEmailresult = await context.functions.execute('sendEmail', sendEmailParams);

      if (sendEmailresult.statusCode != 200 && sendEmailresult.statusCode != 202) {
        context.functions.execute('logRollbar', {
          error: '[On Classification Update event]: Could not send email',
          data: { sendEmailParams, sendEmailresult }
        });
      }
    }
  }

  return;
};

if (typeof module === 'object') {
  module.exports = exports;
}
