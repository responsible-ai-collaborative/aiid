const SENDER = "notifications@incidentdatabase.ai";

exports = async ({ recipients, subject, dynamicData, templateId }) => {

    const userCustomData = context.user.custom_data;

    // Only "admin" and "incident_editor" roles can send emails
    if (!userCustomData.roles || (!userCustomData.roles.includes('admin') && !userCustomData.roles.includes('incident_editor'))) {
        return {
            statusCode: 403,
            status: "403 Forbidden",
        }
    }

    const sendGridApiUrl = "https://api.sendgrid.com/v3/mail/send";

    const sendGridApiKey = context.values.get("SendGridApiKey");

    var emailData = BuildEmailData(recipients, subject, dynamicData, templateId);

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
 * @param {string} templateId SendGrid template ID (ie: "d-bc63fc7a96604d02ae60b49636633840")
 * @return {object} returns a JSON object
 * 
*/
function BuildEmailData(recipients, subject, dynamicData, templateId) {

    const personalizations = recipients.map((recipient) => {
        return {
            to: [
                {
                    email: recipient.email,
                },
            ],
            subject,
            dynamic_template_data: { ...dynamicData, email: recipient.email, userId: recipient.userId },
        };
    });

    const emailData = {
        from: {
            email: SENDER
        },
        personalizations,
        template_id: templateId
    }

    return emailData;
}
