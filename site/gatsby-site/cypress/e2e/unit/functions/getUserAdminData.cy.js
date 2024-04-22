const getUserAdminData = require('../../../../../realm/functions/getUserAdminData');

describe('getUserAdminData', () => {
  it('Should not return data if different user id and no permissions', () => {
    global.context = {
      // @ts-ignore
      functions: {
        execute: cy.stub().resolves({}),
      },
      user: {
        id: '2',
        custom_data: {
          roles: ['subscriber'],
        },
      },
    };

    cy.wrap(getUserAdminData({ userId: '1' })).then((response) => {
      expect(global.context.functions.execute).to.not.called;
      expect(response.email).to.be.null;
    });
  });

  it('Should return data if user id is the same as current user', () => {
    global.context = {
      // @ts-ignore
      functions: {
        execute: cy.stub().resolves({ data: { email: 'test@test.com' } }),
      },
      user: {
        id: '1',
        custom_data: {
          roles: ['subscriber'],
        },
      },
    };

    cy.wrap(getUserAdminData({ userId: '1' })).then((response) => {
      expect(global.context.functions.execute).to.have.been.calledOnce;
      expect(response.email).to.equal('test@test.com');
    });
  });

  it('Should return data if user is admin', () => {
    global.context = {
      // @ts-ignore
      functions: {
        execute: cy.stub().resolves({ data: { email: 'test@test.com' } }),
      },
      user: {
        id: '1',
        custom_data: {
          roles: ['admin'],
        },
      },
    };

    cy.wrap(getUserAdminData({ userId: '3211231' })).then((response) => {
      expect(global.context.functions.execute).to.have.been.calledOnce;
      expect(response.email).to.equal('test@test.com');
    });
  });
});
