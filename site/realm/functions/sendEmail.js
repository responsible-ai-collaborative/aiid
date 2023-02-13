const SENDER = "notifications@incidentdatabase.ai";
const SENDER_NAME = "AIID:Notifications";

exports = async ({ recipients, subject, dynamicData, templateId }) => {

    let emailTemplateBody;
    try {
        emailTemplateBody = await context.functions.execute(`getEmailTemplate${templateId}`);
    } catch (error) {
        return {
          statusCode: 400,
          status: "400 Bad Request - Invalid templateId value",
        }
    }

    const sendGridApiKey = context.values.get("SendGridApiKey");

    if(!sendGridApiKey || sendGridApiKey.trim() === '') {
        return {
            statusCode: 202,
            status: "No email sent. Missing sendGridApiKey value.",
        }
    }

    const userCustomData = context.user.custom_data;

    // Only "system", "server" or "admin" and "incident_editor" roles can send emails
    if (context.user.type != 'system' && context.user.type != 'server') {
        if (!userCustomData.roles || (!userCustomData.roles.includes('admin') && !userCustomData.roles.includes('incident_editor'))) {
            return {
                statusCode: 403,
                status: "403 Forbidden",
            }
        }
    }

    const sendGridApiUrl = "https://api.sendgrid.com/v3/mail/send";    

    var emailData = BuildEmailData(recipients, subject, dynamicData, emailTemplateBody);

    const emailResult = await context.http.post({
        url: sendGridApiUrl,
        headers: {
            Authorization: [`Bearer ${sendGridApiKey}`]
        },
        body: emailData,
        encodeBodyAsJSON: true,
    });

    return emailResult;
};

/**
 * This function returns a JSON object that respects the format of SendGrid API Request Body
 * 
 * @param {string{string, string}} recipients An array of recipients email addresses and userIds
 * @param {string} subject The recipient email address
 * @param {object} dynamicData A JSON object that contains the data to be replaced in the email body
 * @param {string} emailTemplateBody Email template body
 * @return {object} returns a JSON object
 * 
*/
function BuildEmailData(recipients, subject, dynamicData, emailTemplateBody) {

    const personalizations = recipients.map((recipient) => {
        // Wrap dynamicData object keys with {{key}} 
        var newDynamicData = {}
        for (var key in dynamicData) {
            if (dynamicData.hasOwnProperty(key)) {
                newDynamicData[`{{${key}}}`] = dynamicData[key];
            }
        }

        if (recipient.email) {
            newDynamicData['{{email}}'] = recipient.email;
        }

        if (recipient.userId) {
            newDynamicData['{{userId}}'] = recipient.userId;
        }

        return {
            to: [
                {
                    email: recipient.email,
                },
            ],
            subject,
            substitutions: newDynamicData,
        };
    });

    const emailData = {
        from: {
            email: SENDER,
            name: SENDER_NAME,
        },
        personalizations,
        content: [
            {
                type: 'text/html',
                value: emailTemplateBody.replace('\0', ''), // workaround to remove "\0" that is generated by SendGrid HTML export
            }
        ]
    }

    return emailData;
}
