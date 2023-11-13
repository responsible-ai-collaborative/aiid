exports = async ({ token, tokenId, username }) => {

    //Send email notification
    const sendEmailParams = {
        recipients: [{ email: username }],
        subject: 'Confirm your email address',
        dynamicData: {
            token,
            tokenId,
        },
        templateId: 'ConfirmEmail' // Template value from function name sufix from "site/realm/functions/config.json"
    };

    const sendEmailresult = await context.functions.execute('sendEmail', sendEmailParams);

    if (sendEmailresult.statusCode == 200 || sendEmailresult.statusCode == 202) {
        return { status: 'pending' };
    } else {
        return { status: 'fail' };
    }
};
