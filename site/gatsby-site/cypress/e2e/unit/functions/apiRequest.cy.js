const apiRequest = require('../../../../../realm/functions/apiRequest');

const stubEverything = () => {
  global.context = {
    // @ts-ignore
    functions: {
      execute: cy.stub().resolves('email template body'),
    },
    values: {
      get: (() => {
        const stub = cy.stub();

        stub.withArgs('publicApiKey').returns('public');
        stub.withArgs('privateApiKey').returns('private');
        stub.withArgs('groupId').returns('1');
        stub.withArgs('appId').returns('1');
        return stub;
      })(),
    },
    user: {
      type: 'system',
    },
    http: {
      post: cy
        .stub()
        .resolves({ statusCode: 200, body: { text: () => '{"access_token": "test" }' } }),
      get: cy
        .stub()
        .resolves({ statusCode: 200, body: { text: () => '{"result": "This is it" }' } }),
    },
  };

  global.EJSON = JSON;

  return;
};

describe('Functions', () => {
  it('Api Request GET', () => {
    stubEverything();

    cy.wrap(apiRequest({ method: 'GET', path: '/something' })).then((result) => {
      expect(global.context.http.post.getCall(0).args[0]).to.deep.nested.include({
        url: 'https://realm.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login',
        body: {
          username: 'public',
          apiKey: 'private',
        },
        encodeBodyAsJSON: true,
      });

      expect(global.context.http.get.getCall(0).args[0]).to.deep.nested.include({
        url: 'https://realm.mongodb.com/api/admin/v3.0/groups/1/apps/1/something',
        headers: {
          Authorization: [`Bearer test`],
        },
      });

      expect(result).to.deep.nested.include({ result: 'This is it' });
    });
  });
});
