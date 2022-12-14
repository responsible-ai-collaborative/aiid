const { SUBSCRIPTION_TYPE } = require('../../../../src/utils/subscriptions');

const onNewIncident = require('../../../../../realm/functions/onNewIncident');

const subscriptionsToNewIncidents = [
  {
    _id: '6356e39e863169c997309500',
    type: SUBSCRIPTION_TYPE.newIncidents,
    userId: '63320ce63ec803072c9f529c',
  },
  {
    _id: '6356e39e863169c997309501',
    type: SUBSCRIPTION_TYPE.newIncidents,
    userId: '63321072f27421740a80af29',
  },
];

const subscriptionsToNewEntityIncidents = [
  {
    _id: '6356e39e863169c997309502',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'google',
    userId: '63321072f27421740a80af23',
  },
  {
    _id: '6356e39e863169c997309503',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'facebook',
    userId: '63321072f27421740a80af24',
  },
  {
    _id: '6356e39e863169c997309504',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'tesla',
    userId: '63321072f27421740a80af25',
  },
];

const fullDocument = {
  'Alleged deployer of AI system': [],
  'Alleged developer of AI system': ['google'],
  'Alleged harmed or nearly harmed parties': ['facebook'],
  __typename: 'Incident',
  date: '2018-11-16',
  description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
  incident_id: 1,
  nlp_similar_incidents: [],
  reports: [1, 2],
  title: '24 Amazon workers sent to hospital after robot accidentally unleashes bear spray',
};

describe('Functions', () => {
  it('New Incidents - Should insert a pending notification to process in the next build', () => {
    const notificationsCollection = {
      insertOne: cy.stub(),
    };

    const subscriptionsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(subscriptionsToNewIncidents),
      }),
    };

    global.context = {
      // @ts-ignore
      services: {
        get: cy.stub().returns({
          db: cy.stub().returns({
            collection: (() => {
              const stub = cy.stub();

              stub.withArgs('notifications').returns(notificationsCollection);
              stub.withArgs('subscriptions').returns(subscriptionsCollection);

              return stub;
            })(),
          }),
        }),
      },
    };

    global.BSON = { Int32: (x) => x };

    cy.wrap(onNewIncident({ fullDocument })).then(() => {
      expect(subscriptionsCollection.find.firstCall.args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      expect(notificationsCollection.insertOne.firstCall.args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.newIncidents,
        incident_id: fullDocument.incident_id,
        processed: false,
      });
    });
  });

  it('Entity - Should insert a pending notification to process in the next build', () => {
    const notificationsCollection = {
      insertOne: cy.stub(),
    };

    const subscriptionsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(subscriptionsToNewEntityIncidents),
      }),
    };

    global.context = {
      // @ts-ignore
      services: {
        get: cy.stub().returns({
          db: cy.stub().returns({
            collection: (() => {
              const stub = cy.stub();

              stub.withArgs('notifications').returns(notificationsCollection);
              stub.withArgs('subscriptions').returns(subscriptionsCollection);

              return stub;
            })(),
          }),
        }),
      },
    };

    global.BSON = { Int32: (x) => x };

    cy.wrap(onNewIncident({ fullDocument })).then(() => {
      expect(subscriptionsCollection.find.firstCall.args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      expect(notificationsCollection.insertOne.getCall(1).args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.entity,
        incident_id: fullDocument.incident_id,
        entity_id: 'google',
        processed: false,
      });

      expect(notificationsCollection.insertOne.getCall(2).args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.entity,
        incident_id: fullDocument.incident_id,
        entity_id: 'facebook',
        processed: false,
      });
    });
  });

  it(`Shouldn't insert a pending notification if there are no active subscribers`, () => {
    const notificationsCollection = {
      insertOne: cy.stub(),
    };

    const subscriptionsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves([]),
      }),
    };

    global.context = {
      // @ts-ignore
      services: {
        get: cy.stub().returns({
          db: cy.stub().returns({
            collection: (() => {
              const stub = cy.stub();

              stub.withArgs('notifications').returns(notificationsCollection);
              stub.withArgs('subscriptions').returns(subscriptionsCollection);

              return stub;
            })(),
          }),
        }),
      },
    };

    global.BSON = { Int32: (x) => x };

    cy.wrap(onNewIncident({ fullDocument })).then(() => {
      expect(subscriptionsCollection.find.firstCall.args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      expect(notificationsCollection.insertOne).not.to.be.calledOnceWith({
        type: SUBSCRIPTION_TYPE.newIncidents,
        incident_id: fullDocument.incident_id,
        processed: false,
      });

      expect(subscriptionsCollection.find.getCall(1).args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.entity,
        entityId: 'google',
      });

      expect(subscriptionsCollection.find.getCall(2).args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.entity,
        entityId: 'facebook',
      });

      expect(notificationsCollection.insertOne).not.to.be.calledOnceWith({
        type: SUBSCRIPTION_TYPE.entity,
        incident_id: fullDocument.incident_id,
        entity_id: 'google',
        processed: false,
      });
    });
  });
});
