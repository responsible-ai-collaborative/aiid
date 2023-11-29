exports = async function (input) {

  const sendEmailParams = {
    recipients: [{email: "test@lmcnulty.me", userId: "63e52ba667a60caf75f80ded" }],
    subject: 'Update to risk checklist "{{checklistTitle}}"',
    dynamicData: {
      checklistId: 'sdlfkjlksajdf',
      checklistTitle: 'ChatGPT',
    },
    templateId: 'ChecklistUpdate' // Template value from function name sufix from "site/realm/functions/config.json"
  };
  const sendEmailResult = await context.functions.execute('sendEmail', sendEmailParams);

  return { msg: JSON.stringify(sendEmailResult)};
};

if (typeof module === 'object') {
  module.exports = exports;
}
