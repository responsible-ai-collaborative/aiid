const logRollbar = require('../../../../../realm/functions/logRollbar');

describe('Functions', () => {
  it('Log Rollbar', () => {
    global.context = {
      // @ts-ignore
      http: {
        post: cy.stub(),
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
          'X-Rollbar-Access-Token': ['8b2c0e7fb066444b82941cee826619ca'],
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
