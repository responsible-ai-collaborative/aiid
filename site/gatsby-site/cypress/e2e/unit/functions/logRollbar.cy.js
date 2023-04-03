const logRollbar = require('../../../../../realm/functions/logRollbar');

describe('Functions', () => {
  const rollbarAccessToken = 'dummyToken';

  it('Log Rollbar', () => {
    global.context = {
      // @ts-ignore
      http: {
        post: cy.stub(),
      },
      values: {
        get: cy.stub().returns(rollbarAccessToken),
      },
    };

    const logParams = {
      level: 'info',
      environment: 'production',
      error: {
        message: 'Error test',
      },
      data: {
        userName: 'Pablo',
        incident_id: 12,
      },
    };

    cy.wrap(logRollbar(logParams)).then(() => {
      expect(global.context.http.post).to.be.calledWith({
        url: 'https://api.rollbar.com/api/1/item/',
        headers: {
          'X-Rollbar-Access-Token': [rollbarAccessToken],
          accept: ['application/json'],
          'content-type': ['application/json'],
        },
        body: {
          data: {
            level: logParams.level,
            environment: logParams.environment,
            custom: logParams.data,
            body: {
              message: {
                body: logParams.error.message,
              },
            },
          },
        },
        encodeBodyAsJSON: true,
      });
    });
  });
});
