const onNewIncident = require('../../../../realm/functions/onNewIncident');

//should be on its own /cypress/unit folder or something

const subscriptionsToNewIncidents = [
  {
    _id: '6356e39e863169c997309586',
    type: 'new-incidents',
    userId: '63320ce63ec803072c9f529c',
  },
  {
    _id: '6356e39e863169c997309586',
    type: 'new-incidents',
    userId: '63321072f27421740a80af29',
  },
];

const fullDocument = {
  AllegedDeployerOfAISystem: [],
  AllegedDeveloperOfAISystem: [],
  AllegedHarmedOrNearlyHarmedParties: [],
  __typename: 'Incident',
  date: '2018-11-16',
  description:
    'Twenty-four Amazon workers in New Jersey were hospitalized after a robot punctured a can of bear repellent spray in a warehouse.',
  incident_id: 1,
  nlp_similar_incidents: [],
  reports: [1, 2],
  title: '24 Amazon workers sent to hospital after robot accidentally unleashes bear spray',
};

describe('Functions', () => {
  it('Should insert a pending notification to process in the next build', () => {
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
        type: 'new-incidents',
      });

      expect(notificationsCollection.insertOne.firstCall.args[0]).to.deep.equal({
        type: 'new-incidents',
        incident_id: fullDocument.incident_id,
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
        type: 'new-incidents',
      });

      expect(notificationsCollection.insertOne).not.to.be.calledOnceWith({
        type: 'new-incidents',
        incident_id: fullDocument.incident_id,
        processed: false,
      });
    });
  });
});
