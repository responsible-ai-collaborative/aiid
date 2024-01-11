const { SUBSCRIPTION_TYPE } = require('../../../../../src/utils/subscriptions');

const { recipients, entities, incidents, reports } = require('./fixtures');

export const buildEntityList = (allEntities, entityIds) => {
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

export const stubEverything = ({ subscriptionType, pendingNotifications, subscriptions }) => {
  const notificationsCollection = {
    find: (() => {
      const stub = cy.stub();

      // Initiate empty stubs for all types
      stub
        .withArgs({ processed: false, type: SUBSCRIPTION_TYPE.newIncidents })
        .as(`notifications.find(${SUBSCRIPTION_TYPE.newIncidents})`)
        .returns({ toArray: () => [] });

      stub
        .withArgs({ processed: false, type: SUBSCRIPTION_TYPE.entity })
        .as(`notifications.find(${SUBSCRIPTION_TYPE.entity})`)
        .returns({ toArray: () => [] });

      stub
        .withArgs({ processed: false, type: { $in: ['new-report-incident', 'incident-updated'] } })
        .as(`notifications.find('new-report-incident', 'incident-updated')`)
        .returns({ toArray: () => [] });

      stub
        .withArgs({ processed: false, type: SUBSCRIPTION_TYPE.submissionPromoted })
        .as(`notifications.find(${SUBSCRIPTION_TYPE.submissionPromoted})`)
        .returns({ toArray: () => [] });

      // Override stubs for specific types
      switch (subscriptionType) {
        case SUBSCRIPTION_TYPE.newIncidents:
          stub
            .withArgs({ processed: false, type: SUBSCRIPTION_TYPE.newIncidents })
            .as(`notifications.find(${SUBSCRIPTION_TYPE.newIncidents})`)
            .returns({ toArray: () => pendingNotifications });
          break;

        case SUBSCRIPTION_TYPE.entity:
          stub
            .withArgs({ processed: false, type: SUBSCRIPTION_TYPE.entity })
            .as(`notifications.find(${SUBSCRIPTION_TYPE.entity})`)
            .returns({ toArray: () => pendingNotifications });
          break;

        case SUBSCRIPTION_TYPE.incident:
          stub
            .withArgs({
              processed: false,
              type: { $in: ['new-report-incident', 'incident-updated'] },
            })
            .as(`notifications.find('new-report-incident', 'incident-updated')`)
            .returns({ toArray: () => pendingNotifications });
          break;

        case SUBSCRIPTION_TYPE.submissionPromoted:
          stub
            .withArgs({ processed: false, type: SUBSCRIPTION_TYPE.submissionPromoted })
            .as(`notifications.find(${SUBSCRIPTION_TYPE.submissionPromoted})`)
            .returns({ toArray: () => pendingNotifications });
          break;
      }

      return stub;
    })(),
    updateOne: cy.stub().as('notifications.updateOne').resolves(),
  };

  const subscriptionsCollection = {
    find: (() => {
      const stub = cy.stub();

      switch (subscriptionType) {
        case SUBSCRIPTION_TYPE.newIncidents:
          stub
            .withArgs({ type: SUBSCRIPTION_TYPE.newIncidents })
            .as(`subscriptions.find("${SUBSCRIPTION_TYPE.newIncidents}")`)
            .returns({ toArray: () => subscriptions });
          break;

        case SUBSCRIPTION_TYPE.entity:
          for (const pendingNotification of pendingNotifications) {
            stub
              .withArgs({ type: SUBSCRIPTION_TYPE.entity, entityId: pendingNotification.entity_id })
              .as(
                `subscriptions.find("${SUBSCRIPTION_TYPE.entity}", "${pendingNotification.entity_id}")`
              )
              .returns({
                toArray: () =>
                  subscriptions.filter((s) => s.entityId === pendingNotification.entity_id),
              });
          }
          break;

        case SUBSCRIPTION_TYPE.incident:
          for (const pendingNotification of pendingNotifications) {
            stub
              .withArgs({
                type: SUBSCRIPTION_TYPE.incident,
                incident_id: pendingNotification.incident_id,
              })
              .as(
                `subscriptions.find("${SUBSCRIPTION_TYPE.incident}", "${pendingNotification.incident_id}")`
              )
              .returns({
                toArray: () =>
                  subscriptions.filter((s) => s.incident_id === pendingNotification.incident_id),
              });
          }
          break;

        case SUBSCRIPTION_TYPE.submissionPromoted:
          for (const pendingNotification of pendingNotifications) {
            stub
              .withArgs({
                type: SUBSCRIPTION_TYPE.submissionPromoted,
                incident_id: pendingNotification.incident_id,
              })
              .as(
                `subscriptions.find("${SUBSCRIPTION_TYPE.submissionPromoted}", "${pendingNotification.incident_id}")`
              )
              .returns({
                toArray: () =>
                  subscriptions.filter((s) => s.incident_id === pendingNotification.incident_id),
              });
          }
          break;
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
          .as(`incidents.findOne(${incident.incident_id})`)
          .returns(incidents.find((i) => i.incident_id == incident.incident_id));
      }

      return stub;
    })(),
  };

  const reportsCollection = {
    findOne: (() => {
      const stub = cy.stub();

      for (let index = 0; index < reports.length; index++) {
        const report = reports[index];

        stub
          .withArgs({ report_number: report.report_number })
          .as(`reports.findOne(${report.report_number})`)
          .returns(reports.find((r) => r.report_number == report.report_number));
      }

      return stub;
    })(),
  };

  const entitiesCollection = {
    find: cy.stub().returns({
      toArray: cy.stub().as('entities.find').resolves(entities),
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
            stub.withArgs('reports').returns(reportsCollection);

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
            .as(`getUser(${user.userId})`)
            .returns(recipients.find((r) => r.userId == user.userId));
        }

        stub.withArgs('sendEmail').as('sendEmail').returns({ statusCode: 200 });

        stub.withArgs('logRollbar').as('logRollbar').returns({ statusCode: 200 });

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
    reportsCollection,
  };
};
