const sendEmail = require('../../../../../realm/functions/sendEmail');

const stubEverything = (sendGridApiKey) => {
  global.context = {
    // @ts-ignore
    functions: {
      execute: cy.stub().resolves('email template body'),
    },
    values: {
      get: cy.stub().returns(sendGridApiKey),
    },
    user: {
      type: 'system',
    },
    http: {
      post: cy.stub(),
    },
  };

  return;
};

describe('Functions', () => {
  it('Send email', () => {
    stubEverything('sendgridapikey');

    const recipients = [
      {
        email: 'recipient1@test.com',
        userId: '63320ce63ec803072c9f529c',
      },
      {
        email: 'recipient2@test.com',
        userId: '63320ce63ec803072c9f529d',
      },
    ];

    const dynamicData = {
      incidentId: '21',
      incidentTitle: 'Incident Title',
      incidentUrl: 'https://incidentdatabase.ai/cite/21',
    };

    const sendEmailParams = {
      recipients,
      subject: 'New Incident {{incidentId}} was created',
      dynamicData,
      templateId: 'NewIncident',
    };

    cy.wrap(sendEmail(sendEmailParams)).then(() => {
      expect(global.context.functions.execute).to.be.calledWith('getEmailTemplateNewIncident');

      const personalizations = recipients.map((recipient) => {
        // Wrap dynamicData object keys with {{key}}
        var newDynamicData = {};

        newDynamicData[`{{incidentId}}`] = dynamicData.incidentId;
        newDynamicData[`{{incidentTitle}}`] = dynamicData.incidentTitle;
        newDynamicData[`{{incidentUrl}}`] = dynamicData.incidentUrl;
        newDynamicData['{{email}}'] = recipient.email;
        newDynamicData['{{userId}}'] = recipient.userId;

        return {
          to: [
            {
              email: recipient.email,
            },
          ],
          subject: sendEmailParams.subject,
          substitutions: newDynamicData,
        };
      });

      const emailData = {
        from: {
          email: 'notifications@incidentdatabase.ai',
          name: 'AIID:Notifications',
        },
        personalizations,
        content: [
          {
            type: 'text/html',
            value: 'email template body',
          },
        ],
      };

      expect(global.context.http.post).to.be.calledWith({
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers: {
          Authorization: [`Bearer sendgridapikey`],
        },
        body: emailData,
        encodeBodyAsJSON: true,
      });
    });
  });

  it(`Don't send email if no SendGrid API key is defined`, () => {
    stubEverything();

    const recipients = [
      {
        email: 'recipient1@test.com',
        userId: '63320ce63ec803072c9f529c',
      },
      {
        email: 'recipient2@test.com',
        userId: '63320ce63ec803072c9f529d',
      },
    ];

    const dynamicData = {
      incidentId: '21',
      incidentTitle: 'Incident Title',
      incidentUrl: 'https://incidentdatabase.ai/cite/21',
    };

    const sendEmailParams = {
      recipients,
      subject: 'New Incident {{incidentId}} was created',
      dynamicData,
      templateId: 'NewIncident',
    };

    cy.wrap(sendEmail(sendEmailParams)).then((result) => {
      expect(global.context.functions.execute).to.be.calledWith('getEmailTemplateNewIncident');

      expect(global.context.http.post).not.to.be.called;

      expect(result).to.deep.equal({
        statusCode: 202,
        status: 'No email sent. Missing sendGridApiKey value.',
      });
    });
  });
});
