const SENDER = "notifications@incidentdatabase.ai";

exports = async ({ token, tokenId, username, password }) => {

    //Send email notification
    const sendEmailParams = {
        recipients: [{ email: username }],
        subject: "Here's a link to reset your password",
        dynamicData: {
            token,
            tokenId,
        },
        templateId: 'PasswordReset' // Template value from function name sufix from "site/realm/functions/config.json"
    };

    const sendEmailresult = await context.functions.execute('sendEmail', sendEmailParams);

    if (sendEmailresult.statusCode == 200 || sendEmailresult.statusCode == 202) {
        return { status: 'pending' };
    } else {
        return { status: 'fail' };
    }
};
