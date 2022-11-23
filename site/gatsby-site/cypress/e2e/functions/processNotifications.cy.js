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
  },
  {
    _id: '63616f82d0db19c07d081303',
    type: SUBSCRIPTION_TYPE.entity,
    incident_id: 219,
    entity_id: 'facebook',
    isUpdate: true,
    processed: false,
  },
];

const subscriptionsToNewIncidents = [
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.newIncidents,
    userId: '63320ce63ec803072c9f5291',
  },
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.newIncidents,
    userId: '63321072f27421740a80af22',
  },
];

const subscriptionsToNewEntityIncidents = [
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'google',
    userId: '63321072f27421740a80af23',
  },
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'facebook',
    userId: '63321072f27421740a80af24',
  },
];

const recipients = [
  {
    email: 'test1@email.com',
    userId: '63320ce63ec803072c9f5291',
  },
  {
    email: 'test2@email.com',
    userId: '63321072f27421740a80af22',
  },
  {
    email: 'test3@email.com',
    userId: '63321072f27421740a80af23',
  },
  {
    email: 'test4@email.com',
    userId: '63321072f27421740a80af24',
  },
];

const incidents = [
  {
    incident_id: 217,
    'Alleged developer of AI system': [],
    'Alleged deployer of AI system': [],
    'Alleged harmed or nearly harmed parties': [],
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
    'Alleged developer of AI system': [],
    'Alleged deployer of AI system': [],
    'Alleged harmed or nearly harmed parties': [],
    __typename: 'Incident',
    date: '2018-11-16',
    description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
    nlp_similar_incidents: [],
    reports: [1, 2],
    title: '218 Amazon workers sent to hospital',
  },
  {
    incident_id: 219,
    'Alleged developer of AI system': ['google', 'facebook'],
    'Alleged deployer of AI system': ['facebook'],
    'Alleged harmed or nearly harmed parties': ['tesla'],
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

const buildEntityList = (allEntities, entityIds) => {
  const entityNames = entityIds.map((entityId) => {
    const entity = allEntities.find((entity) => entity.entity_id === entityId);

    return entity
      ? `<a href="https://incidentdatabase.ai/entities/${entity.entity_id}">${entity.name}</a>`
      : '';
  });

  if (entityNames.length < 3) {
    return entityNames.join(' and ');
  }

  return `${entityNames.slice(0, -1).join(', ')}, and ${entityNames[entityNames.length - 1]}`;
};

const stubEverything = () => {
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
        .returns({ toArray: () => subscriptionsToNewIncidents });

      for (const pendingNotification of pendingNotificationsToNewEntityIncidents) {
        stub
          .withArgs({ type: SUBSCRIPTION_TYPE.entity, entityId: pendingNotification.entity_id })
          .returns({ toArray: () => subscriptionsToNewEntityIncidents });
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

        for (const user of recipients) {
          stub
            .withArgs('getUser', { userId: user.userId })
            .returns(recipients.find((r) => r.userId == user.userId));
          stub.withArgs('sendEmail').returns({ statusCode: 200 });
        }

        return stub;
      })(),
    },
  };

  global.BSON = { Int32: (x) => x };

  return {
    notificationsCollection,
    subscriptionsCollection,
    incidentsCollection,
    entitiesCollection,
  };
};

describe('Functions', () => {
  it('New Incidents - Should send pending notifications', () => {
    const { notificationsCollection, subscriptionsCollection, incidentsCollection } =
      stubEverything();

    cy.wrap(processNotifications()).then((result) => {
      expect(result, 'Notifications processed count').to.be.equal(4);

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

        const userIds = subscriptionsToNewIncidents.map((subscription) => subscription.userId);

        const incident = incidents.find((i) => i.incident_id == pendingNotification.incident_id);

        const sendEmailParams = {
          recipients: recipients.filter((r) => userIds.includes(r.userId)),
          subject: 'New Incident {{incidentId}} was created',
          dynamicData: {
            incidentId: `${incident.incident_id}`,
            incidentTitle: incident.title,
            incidentUrl: `https://incidentdatabase.ai/cite/${pendingNotification.incident_id}`,
          },
          templateId: 'NewIncident', // Template value from function name sufix from "site/realm/functions/config.json"
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

  it('Entity - Should send pending notifications', () => {
    const {
      notificationsCollection,
      subscriptionsCollection,
      incidentsCollection,
      entitiesCollection,
    } = stubEverything();

    cy.wrap(processNotifications()).then((result) => {
      expect(result, 'Notifications processed count').to.be.equal(4);

      expect(notificationsCollection.find.secondCall.args[0]).to.deep.equal({
        processed: false,
        type: SUBSCRIPTION_TYPE.entity,
      });

      expect(entitiesCollection.find.firstCall.args[0]).to.deep.equal({});

      for (let i = 0; i < pendingNotificationsToNewEntityIncidents.length; i++) {
        const pendingNotification = pendingNotificationsToNewEntityIncidents[i];

        expect(subscriptionsCollection.find.getCall(i + 1).args[0]).to.deep.equal({
          type: SUBSCRIPTION_TYPE.entity,
          entityId: pendingNotification.entity_id,
        });

        for (const subscription of subscriptionsToNewEntityIncidents) {
          expect(global.context.functions.execute).to.be.calledWith('getUser', {
            userId: subscription.userId,
          });
        }

        expect(
          incidentsCollection.findOne.getCall(pendingNotificationsToNewIncidents.length + i).args[0]
        ).to.deep.equal({
          incident_id: pendingNotification.incident_id,
        });

        const userIds = subscriptionsToNewEntityIncidents.map(
          (subscription) => subscription.userId
        );

        const incident = incidents.find((i) => i.incident_id == pendingNotification.incident_id);

        const entity = entities.find(
          (entity) => entity.entity_id === pendingNotification.entity_id
        );

        const isIncidentUpdate = pendingNotification.isUpdate;

        const sendEmailParams = {
          recipients: recipients.filter((r) => userIds.includes(r.userId)),
          subject: isIncidentUpdate
            ? 'Update Incident for {{entityName}}'
            : 'New Incident for {{entityName}}',
          dynamicData: {
            incidentId: `${incident.incident_id}`,
            incidentTitle: incident.title,
            incidentUrl: `https://incidentdatabase.ai/cite/${incident.incident_id}`,
            incidentDescription: incident.description,
            incidentDate: incident.date,
            entityName: entity.name,
            entityUrl: `https://incidentdatabase.ai/entities/${entity.entity_id}`,
            developers: buildEntityList(entities, incident['Alleged developer of AI system']),
            deployers: buildEntityList(entities, incident['Alleged deployer of AI system']),
            entitiesHarmed: buildEntityList(
              entities,
              incident['Alleged harmed or nearly harmed parties']
            ),
          },
          // Template value from function name sufix from "site/realm/functions/config.json"
          templateId: isIncidentUpdate ? 'EntityIncidentUpdated' : 'NewEntityIncident',
        };

        expect(global.context.functions.execute).to.be.calledWith('sendEmail', sendEmailParams);

        expect(
          notificationsCollection.updateOne.getCall(pendingNotificationsToNewIncidents.length + i)
            .args[0]
        ).to.deep.equal({
          _id: pendingNotification._id,
        });

        expect(
          notificationsCollection.updateOne.getCall(pendingNotificationsToNewIncidents.length + i)
            .args[1].$set.processed
        ).to.be.equal(true);
        expect(
          notificationsCollection.updateOne.getCall(pendingNotificationsToNewIncidents.length + i)
            .args[1].$set
        ).to.have.ownProperty('sentDate');
      }
    });
  });

  it('Should mark pending notifications as processed if there are no subscribers', () => {
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

    cy.wrap(processNotifications()).then((result) => {
      expect(result, 'Notifications processed count').to.be.equal(4);

      expect(notificationsCollection.find.firstCall.args[0]).to.deep.equal({
        processed: false,
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      expect(subscriptionsCollection.find.firstCall.args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      expect(global.context.functions.execute).not.to.be.called;

      for (let i = 0; i < pendingNotificationsToNewIncidents.length; i++) {
        const pendingNotification = pendingNotificationsToNewIncidents[i];

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

      for (let i = 0; i < pendingNotificationsToNewEntityIncidents.length; i++) {
        const pendingNotification = pendingNotificationsToNewEntityIncidents[i];

        expect(
          notificationsCollection.updateOne.getCall(pendingNotificationsToNewIncidents.length + i)
            .args[0]
        ).to.deep.equal({
          _id: pendingNotification._id,
        });

        expect(
          notificationsCollection.updateOne.getCall(pendingNotificationsToNewIncidents.length + i)
            .args[1].$set.processed
        ).to.be.equal(true);
        expect(
          notificationsCollection.updateOne.getCall(pendingNotificationsToNewIncidents.length + i)
            .args[1].$set
        ).not.to.have.ownProperty('sentDate');
      }
    });
  });
});
