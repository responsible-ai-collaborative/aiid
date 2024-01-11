import { buildEntityList, stubEverything } from './processNotificationsUtils';

const { SUBSCRIPTION_TYPE } = require('../../../../../src/utils/subscriptions');

const processNotifications = require('../../../../../../realm/functions/processNotifications');

const { recipients, entities, incidents } = require('./fixtures');

const pendingNotifications = [
  {
    _id: '63616f82d0db19c07d081200',
    type: SUBSCRIPTION_TYPE.entity,
    incident_id: 219,
    entity_id: 'google',
    processed: false,
  },
  {
    _id: '63616f82d0db19c07d081201',
    type: SUBSCRIPTION_TYPE.entity,
    incident_id: 219,
    entity_id: 'facebook',
    isUpdate: true,
    processed: false,
  },
  //Duplicated pending notification
  {
    _id: '63616f82d0db19c07d081202',
    type: SUBSCRIPTION_TYPE.entity,
    incident_id: 219,
    entity_id: 'facebook',
    isUpdate: true,
    processed: false,
  },
  {
    _id: '63616f82d0db19c07d081203',
    type: SUBSCRIPTION_TYPE.entity,
    incident_id: 219,
    entity_id: 'google',
    processed: false,
  },
];

const uniquePendingNotifications = pendingNotifications.slice(0, 2);

const subscriptions = [
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'google',
    userId: '63321072f27421740a80af23',
  },
  {
    _id: '6356e39e863169c997309587',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'facebook',
    userId: '63321072f27421740a80af24',
  },
];

describe('Process Entity Pending Notifications', () => {
  it('Entity - Should process all pending notifications', () => {
    const { notificationsCollection } = stubEverything({
      subscriptionType: SUBSCRIPTION_TYPE.entity,
      pendingNotifications,
      subscriptions,
    });

    cy.wrap(processNotifications()).then((result) => {
      expect(
        notificationsCollection.updateOne.callCount,
        'Mark notification item as processed'
      ).to.be.equal(pendingNotifications.length);

      const sendEmailCalls = global.context.functions.execute
        .getCalls()
        .filter((call) => call.args[0] === 'sendEmail');

      expect(sendEmailCalls.length, 'sendEmail function calls').to.be.equal(
        uniquePendingNotifications.length
      );

      // Check that the emails are sent only once
      for (let i = 0; i < sendEmailCalls.length; i++) {
        const pendingNotification = uniquePendingNotifications[i];

        const sendEmailCallArgs = sendEmailCalls[i].args[1];

        const userIds = subscriptions
          .filter((s) => s.entityId === pendingNotification.entity_id)
          .map((subscription) => subscription.userId);

        const isIncidentUpdate = pendingNotification.isUpdate;

        const incident = incidents.find((i) => i.incident_id == pendingNotification.incident_id);

        const entity = entities.find(
          (entity) => entity.entity_id === pendingNotification.entity_id
        );

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

        expect(sendEmailCallArgs, 'Send email args').to.be.deep.equal(sendEmailParams);
      }

      //No Rollbar error logs
      expect(
        global.context.functions.execute.getCalls().filter((call) => call.args[0] === 'logRollbar')
          .length,
        'logRollbar function calls'
      ).to.be.equal(0);

      expect(result, 'Notifications processed count').to.be.equal(pendingNotifications.length);
    });
  });

  it('Entity - Should send pending notifications', () => {
    const {
      notificationsCollection,
      subscriptionsCollection,
      incidentsCollection,
      entitiesCollection,
    } = stubEverything({
      subscriptionType: SUBSCRIPTION_TYPE.entity,
      pendingNotifications,
      subscriptions,
    });

    cy.wrap(processNotifications()).then(() => {
      expect(notificationsCollection.find.secondCall.args[0]).to.deep.equal({
        processed: false,
        type: SUBSCRIPTION_TYPE.entity,
      });

      expect(entitiesCollection.find.firstCall.args[0]).to.deep.equal({});

      for (let i = 0; i < uniquePendingNotifications.length; i++) {
        const pendingNotification = uniquePendingNotifications[i];

        expect(subscriptionsCollection.find.getCall(i).args[0]).to.deep.equal({
          type: SUBSCRIPTION_TYPE.entity,
          entityId: pendingNotification.entity_id,
        });

        for (const subscription of subscriptions) {
          expect(global.context.functions.execute).to.be.calledWith('getUser', {
            userId: subscription.userId,
          });
        }

        expect(incidentsCollection.findOne.getCall(i).args[0]).to.deep.equal({
          incident_id: pendingNotification.incident_id,
        });

        const userIds = subscriptions
          .filter((s) => s.entityId === pendingNotification.entity_id)
          .map((subscription) => subscription.userId);

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

        expect(global.context.functions.execute, 'Send email').to.be.calledWith(
          'sendEmail',
          sendEmailParams
        );

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

  it('Entity - Should mark pending notifications as processed if there are no subscribers', () => {
    const { notificationsCollection, subscriptionsCollection } = stubEverything({
      subscriptionType: SUBSCRIPTION_TYPE.entity,
      pendingNotifications,
      subscriptions: [],
    });

    cy.wrap(processNotifications()).then(() => {
      expect(notificationsCollection.find.getCall(0).args[0]).to.deep.equal({
        processed: false,
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      expect(notificationsCollection.find.getCall(1).args[0]).to.deep.equal({
        processed: false,
        type: SUBSCRIPTION_TYPE.entity,
      });

      expect(notificationsCollection.find.getCall(2).args[0]).to.deep.equal({
        processed: false,
        type: { $in: ['new-report-incident', 'incident-updated'] },
      });

      expect(notificationsCollection.find.getCall(3).args[0]).to.deep.equal({
        processed: false,
        type: SUBSCRIPTION_TYPE.submissionPromoted,
      });

      expect(global.context.functions.execute).not.to.be.called;

      for (let i = 0; i < uniquePendingNotifications.length; i++) {
        const pendingNotification = uniquePendingNotifications[i];

        expect(subscriptionsCollection.find.getCall(i).args[0]).to.deep.equal({
          type: SUBSCRIPTION_TYPE.entity,
          entityId: pendingNotification.entity_id,
        });

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

      expect(
        notificationsCollection.updateOne.getCalls().length,
        'Notifications marked as processed count'
      ).to.be.equal(pendingNotifications.length);
    });
  });
});
