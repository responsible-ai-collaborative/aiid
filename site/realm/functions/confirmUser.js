const TEMPLATE_ID = "d-bc63fc7a96604d02ae60b49636633840";
const SENDER = "notifications@incidentdatabase.ai";

exports = async ({ token, tokenId, username }) => {

    const sendGridApiUrl = "https://api.sendgrid.com/v3/mail/send";

    const sendGridApiKey = context.values.get("SendGridApiKey");

    var emailData = BuildEmailData(token, tokenId, username);

    const emailResult = await context.http.post({
        url: sendGridApiUrl,
        headers: {
            Authorization: [`Bearer ${sendGridApiKey}`]
        },
        body: emailData,
        encodeBodyAsJSON: true,
    });

    if (emailResult.statusCode == 200 || emailResult.statusCode == 202) {
        return { status: 'pending' };
    } else {
        return { status: 'fail' };
    }
};

/**
 * This function returns a JSON object that respects the format of SendGrid API Request Body
 * 
 * @param {string} token
 * @param {string} tokenId
 * @param {string} username The user email address
 * @return {object} returns a JSON object
 * 
*/
function BuildEmailData(token, tokenId, username) {

    var subject = "Confirm your email address";

    const emailData = {
        "from": {
            "email": SENDER
        },
        "personalizations": [
            {
                "to": [
                    {
                        "email": username
                    }
                ],
                "subject": subject,
                "dynamic_template_data": {
                    "token": token,
                    "tokenId": tokenId
                }
            }
        ],
        "template_id": TEMPLATE_ID
    }

    return emailData;
}
