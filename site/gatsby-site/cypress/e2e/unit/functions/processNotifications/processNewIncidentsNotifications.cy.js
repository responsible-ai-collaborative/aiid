import { buildEntityList, stubEverything } from './processNotificationsUtils';

const { SUBSCRIPTION_TYPE } = require('../../../../../src/utils/subscriptions');

const processNotifications = require('../../../../../../realm/functions/processNotifications');

const { recipients, entities, incidents } = require('./fixtures');

const pendingNotifications = [
  {
    _id: '63616f37d0db19c07d081100',
    type: SUBSCRIPTION_TYPE.newIncidents,
    incident_id: 217,
    processed: false,
  },
  {
    _id: '63616f82d0db19c07d081101',
    type: SUBSCRIPTION_TYPE.newIncidents,
    incident_id: 218,
    processed: false,
  },
  //Duplicated pending notification
  {
    _id: '63616f82d0db19c07d081102',
    type: SUBSCRIPTION_TYPE.newIncidents,
    incident_id: 218,
    processed: false,
  },
];

const uniquePendingNotifications = pendingNotifications.slice(0, 2);

const subscriptions = [
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

describe('Process New Incident Pending Notifications', () => {
  it('New Incidents - Should process all pending notifications', () => {
    const { notificationsCollection } = stubEverything({
      subscriptionType: SUBSCRIPTION_TYPE.newIncidents,
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

        const userIds = subscriptions.map((subscription) => subscription.userId);

        const incident = incidents.find((i) => i.incident_id == pendingNotification.incident_id);

        const sendEmailParams = {
          recipients: recipients.filter((r) => userIds.includes(r.userId)),
          subject: 'New Incident {{incidentId}} was created',
          dynamicData: {
            incidentId: `${incident.incident_id}`,
            incidentTitle: incident.title,
            incidentUrl: `https://incidentdatabase.ai/cite/${pendingNotification.incident_id}`,
            incidentDescription: incident.description,
            incidentDate: incident.date,
            developers: buildEntityList(entities, incident['Alleged developer of AI system']),
            deployers: buildEntityList(entities, incident['Alleged deployer of AI system']),
            entitiesHarmed: buildEntityList(
              entities,
              incident['Alleged harmed or nearly harmed parties']
            ),
          },
          templateId: 'NewIncident', // Template value from function name sufix from "site/realm/functions/config.json"
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

  it('New Incidents - Should send pending notifications', () => {
    const { notificationsCollection, subscriptionsCollection, incidentsCollection } =
      stubEverything({
        subscriptionType: SUBSCRIPTION_TYPE.newIncidents,
        pendingNotifications,
        subscriptions,
      });

    cy.wrap(processNotifications()).then(() => {
      expect(notificationsCollection.find.firstCall.args[0]).to.deep.equal({
        processed: false,
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      expect(subscriptionsCollection.find.firstCall.args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      for (const subscription of subscriptions) {
        expect(global.context.functions.execute).to.be.calledWith('getUser', {
          userId: subscription.userId,
        });
      }

      for (let i = 0; i < uniquePendingNotifications.length; i++) {
        const pendingNotification = uniquePendingNotifications[i];

        expect(incidentsCollection.findOne.getCall(i).args[0]).to.deep.equal({
          incident_id: pendingNotification.incident_id,
        });

        const userIds = subscriptions.map((subscription) => subscription.userId);

        const incident = incidents.find((i) => i.incident_id == pendingNotification.incident_id);

        const sendEmailParams = {
          recipients: recipients.filter((r) => userIds.includes(r.userId)),
          subject: 'New Incident {{incidentId}} was created',
          dynamicData: {
            incidentId: `${incident.incident_id}`,
            incidentTitle: incident.title,
            incidentUrl: `https://incidentdatabase.ai/cite/${pendingNotification.incident_id}`,
            incidentDescription: incident.description,
            incidentDate: incident.date,
            developers: buildEntityList(entities, incident['Alleged developer of AI system']),
            deployers: buildEntityList(entities, incident['Alleged deployer of AI system']),
            entitiesHarmed: buildEntityList(
              entities,
              incident['Alleged harmed or nearly harmed parties']
            ),
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

  it('New Incidents - Should mark pending notifications as processed if there are no subscribers', () => {
    const { notificationsCollection, subscriptionsCollection } = stubEverything({
      subscriptionType: SUBSCRIPTION_TYPE.newIncidents,
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

      expect(subscriptionsCollection.find.getCall(0).args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.newIncidents,
      });

      expect(notificationsCollection.find.getCall(3).args[0]).to.deep.equal({
        processed: false,
        type: SUBSCRIPTION_TYPE.submissionPromoted,
      });

      expect(global.context.functions.execute).not.to.be.called;

      for (let i = 0; i < pendingNotifications.length; i++) {
        const pendingNotification = pendingNotifications[i];

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
