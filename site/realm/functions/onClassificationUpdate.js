exports = async function (changeEvent) {

  console.log(`changeEvent`, changeEvent);

// curl --request POST   --url https://api.sendgrid.com/v3/mail/send   --header "Authorization: Bearer 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"   --header 'Content-Type: application/json'   --data '{"personalizations": [{"to": [{"email": "sendgrid@lmcnulty.me"}]}],"from": {"email": "sendgrid@lmcnulty.me"},"subject": "Sending with SendGrid is Fun","content": [{"type": "text/plain", "value": "and easy to do anywhere, even with cURL"}]}'
  const http = context.services.get("myHttp");
  http.post({
      url: "https://api.sendgrid.com/v3/mail/send",
      headers: {
        "Authorization": "Bearer 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"
      },
      body: {
        "personalizations": [
          {"to": [{"email": "sendgrid@lmcnulty.me"}]}
        ],
        "from": {"email": "sendgrid@lmcnulty.me"},
        "subject": "Sending with SendGrid is Fun",
        "content": [{"type": "text/plain", "value": "and easy to do anywhere, even with cURL"}]

      },
      encodeBodyAsJSON: true
    });

//  const { updateDescription, fullDocument, fullDocumentBeforeChange } = changeEvent;
//
//  if (!updateDescription || !fullDocumentBeforeChange || !fullDocument) {
//    console.log('Invalid changeEvent:', JSON.stringify(changeEvent));
//    context.functions.execute('logRollbar', {
//      error: '[On Incident Update event]: Invalid changeEvent',
//      data: { changeEvent }
//    });
//    return;
//  }
//
//  const updatedFields = Object.keys(updateDescription.updatedFields);
//
//  const incidentId = fullDocument.incident_id;
//
//  const aiidProd = context.services.get('mongodb-atlas').db('aiidProd');
//  const customData = context.services.get('mongodb-atlas').db('customData');
//
//  const checklistSubscriptions = []; // TODO
//
//  for (const subscription of checklistSubscriptions) {
//
//    const subscriptionMatchesUpdate = false; // TODO
//
//    if (subscriptionMatchesUpdate) {
//
//      const email = ''; // TODO
//
//      const sendEmailParams = {
//          recipients: [{ email }],
//          subject: '', // TODO
//          templateId: '' // TODO: Template value from function name sufix from "site/realm/functions/config.json"
//      };
//
//      const sendEmailresult = await context.functions.execute('sendEmail', sendEmailParams);
//
//      if (sendEmailresult.statusCode != 200 && sendEmailresult.statusCode != 202) {
//        context.functions.execute('logRollbar', {
//          error: '[On Classification Update event]: Could not send email',
//          data: { sendEmailParams, sendEmailresult }
//        });
//      }
//    }
//  }
};

if (typeof module === 'object') {
  module.exports = exports;
}
