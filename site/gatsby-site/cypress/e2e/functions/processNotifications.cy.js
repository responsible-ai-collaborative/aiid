const { SUBSCRIPTION_TYPE } = require('../../../src/utils/subscriptions');

const processNotifications = require('../../../../realm/functions/processNotifications');

const pendingNotificationsToNewIncidents = [
  {
    _id: '63616f37d0db19c07d081300',
    type: SUBSCRIPTION_TYPE.newIncidents,
    incident_id: 217,
    processed: false,
  },
  {
    _id: '63616f82d0db19c07d081301',
    type: SUBSCRIPTION_TYPE.newIncidents,
    incident_id: 218,
    processed: false,
  },
];

const pendingNotificationsToNewEntityIncidents = [
  {
    _id: '63616f82d0db19c07d081302',
    type: SUBSCRIPTION_TYPE.entity,
    incident_id: 219,
    entity_id: 'google',
    processed: false,
    sentDate: '1668043573925',
  },
];

const subscriptionsToNewIncidents = [
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.newIncidents,
    userId: '63320ce63ec803072c9f529c',
  },
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.newIncidents,
    userId: '63321072f27421740a80af29',
  },
];

const recipients = [
  {
    email: 'test1@email.com',
    userId: '63320ce63ec803072c9f529c',
  },
  {
    email: 'test2@email.com',
    userId: '63321072f27421740a80af29',
  },
];

const incidents = [
  {
    incident_id: 217,
    AllegedDeployerOfAISystem: [],
    AllegedDeveloperOfAISystem: [],
    AllegedHarmedOrNearlyHarmedParties: [],
    __typename: 'Incident',
    date: '2018-11-16',
    description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
    nlp_similar_incidents: [],
    reports: [1, 2],
    title: '217 Amazon workers sent to hospital',
  },
  {
    incident_id: 218,
    AllegedDeployerOfAISystem: [],
    AllegedDeveloperOfAISystem: [],
    AllegedHarmedOrNearlyHarmedParties: [],
    __typename: 'Incident',
    date: '2018-11-16',
    description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
    nlp_similar_incidents: [],
    reports: [1, 2],
    title: '218 Amazon workers sent to hospital',
  },
];

const entities = [
  {
    entity_id: 'google',
    name: 'Google',
  },
  {
    entity_id: 'facebook',
    name: 'Facebook',
  },
  {
    entity_id: 'boston-university',
    name: 'Boston University',
  },
];

describe('Functions', () => {
  it('New Incidents - Should send pending notifications', () => {
    const notificationsCollection = {
      find: (() => {
        const stub = cy.stub();

        stub
          .withArgs({ processed: false, type: SUBSCRIPTION_TYPE.newIncidents })
          .returns({ toArray: () => pendingNotificationsToNewIncidents });

        stub
          .withArgs({ processed: false, type: SUBSCRIPTION_TYPE.entity })
          .returns({ toArray: () => pendingNotificationsToNewEntityIncidents });

        return stub;
      })(),
      updateOne: cy.stub().resolves(),
    };

    const subscriptionsCollection = {
      find: (() => {
        const stub = cy.stub();

        stub
          .withArgs({ type: SUBSCRIPTION_TYPE.newIncidents })
          .returns({
            toArray: () =>
              subscriptionsToNewIncidents.filter((n) => n.type == SUBSCRIPTION_TYPE.newIncidents),
          });

        for (const pendingNotification of pendingNotificationsToNewEntityIncidents) {
          stub
            .withArgs({ type: SUBSCRIPTION_TYPE.entity, entityId: pendingNotification.entity_id })
            .returns({
              toArray: () =>
                subscriptionsToNewIncidents.filter((n) => n.type == SUBSCRIPTION_TYPE.entity),
            });
        }

        return stub;
      })(),
    };

    const incidentsCollection = {
      findOne: (() => {
        const stub = cy.stub();

        for (let index = 0; index < incidents.length; index++) {
          const incident = incidents[index];

          stub
            .withArgs({ incident_id: incident.incident_id })
            .returns(incidents.find((i) => i.incident_id == incident.incident_id));
        }

        return stub;
      })(),
    };

    const entitiesCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(entities),
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
              stub.withArgs('incidents').returns(incidentsCollection);
              stub.withArgs('entities').returns(entitiesCollection);

              return stub;
            })(),
          }),
        }),
      },
      functions: {
        execute: (() => {
          const stub = cy.stub();

          for (let index = 0; index < subscriptionsToNewIncidents.length; index++) {
            const subscription = subscriptionsToNewIncidents[index];

            stub
              .withArgs('getUser', { userId: subscription.userId })
              .returns(recipients.find((r) => r.userId == subscription.userId));
            stub.withArgs('sendEmail').returns({ statusCode: 200 });
          }

          return stub;
        })(),
      },
    };

    global.BSON = { Int32: (x) => x };

    cy.wrap(processNotifications()).then(() => {
      expect(notificationsCollection.find.firstCall.args[0]).to.deep.equal({
        processed: false,
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      expect(subscriptionsCollection.find.firstCall.args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      for (const subscription of subscriptionsToNewIncidents) {
        expect(global.context.functions.execute).to.be.calledWith('getUser', {
          userId: subscription.userId,
        });
      }

      for (let i = 0; i < pendingNotificationsToNewIncidents.length; i++) {
        const pendingNotification = pendingNotificationsToNewIncidents[i];

        expect(incidentsCollection.findOne.getCall(i).args[0]).to.deep.equal({
          incident_id: pendingNotification.incident_id,
        });

        const sendEmailParams = {
          recipients,
          subject: 'New Incident {{incidentId}} was created',
          dynamicData: {
            incidentId: `${pendingNotification.incident_id}`,
            incidentTitle: incidents.find((i) => i.incident_id == pendingNotification.incident_id)
              .title,
            incidentUrl: `https://incidentdatabase.ai/cite/${pendingNotification.incident_id}`,
          },
          templateId: 'NewIncident', // Template value from "site/realm/functions/sendEmail.js" EMAIL_TEMPLATES constant
        };

        expect(global.context.functions.execute).to.be.calledWith('sendEmail', sendEmailParams);

        expect(notificationsCollection.updateOne.getCall(i).args[0]).to.deep.equal({
          _id: pendingNotification._id,
        });

        expect(notificationsCollection.updateOne.getCall(i).args[1].$set.processed).to.be.equal(
          true
        );
        expect(notificationsCollection.updateOne.getCall(i).args[1].$set).to.have.ownProperty(
          'sentDate'
        );
      }
    });
  });

  it('New Incidents - Should mark pending notifications as processed if there are no subscribers', () => {
    const notificationsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(pendingNotificationsToNewIncidents),
      }),
      updateOne: cy.stub().resolves(),
    };

    const subscriptionsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves([]),
      }),
    };

    const entitiesCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(entities),
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
              stub.withArgs('entities').returns(entitiesCollection);

              return stub;
            })(),
          }),
        }),
      },
      functions: {
        execute: (() => {
          const stub = cy.stub();

          for (let index = 0; index < subscriptionsToNewIncidents.length; index++) {
            const subscription = subscriptionsToNewIncidents[index];

            stub
              .withArgs('getUser', { userId: subscription.userId })
              .returns(recipients.find((r) => r.userId == subscription.userId));
            stub.withArgs('sendEmail').returns({ statusCode: 200 });
          }

          return stub;
        })(),
      },
    };

    global.BSON = { Int32: (x) => x };

    cy.wrap(processNotifications()).then(() => {
      expect(notificationsCollection.find.firstCall.args[0]).to.deep.equal({
        processed: false,
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      expect(subscriptionsCollection.find.firstCall.args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      for (let i = 0; i < pendingNotificationsToNewIncidents.length; i++) {
        const pendingNotification = pendingNotificationsToNewIncidents[i];

        expect(global.context.functions.execute).not.to.be.called;

        expect(notificationsCollection.updateOne.getCall(i).args[0]).to.deep.equal({
          _id: pendingNotification._id,
        });

        expect(notificationsCollection.updateOne.getCall(i).args[1].$set.processed).to.be.equal(
          true
        );
        expect(notificationsCollection.updateOne.getCall(i).args[1].$set).not.to.have.ownProperty(
          'sentDate'
        );
      }
    });
  });
});
