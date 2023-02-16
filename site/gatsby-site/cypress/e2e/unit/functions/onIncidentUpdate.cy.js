const { SUBSCRIPTION_TYPE } = require('../../../../src/utils/subscriptions');

const onIncidentUpdate = require('../../../../../realm/functions/onIncidentUpdate');

const subscriptionsToIncidentUpdates = [
  {
    userId: '63320ce63ec803072c9f5291',
    type: SUBSCRIPTION_TYPE.incident,
    incident_id: 1,
  },
  {
    userId: '63321072f27421740a80af22',
    type: SUBSCRIPTION_TYPE.incident,
    incident_id: 1,
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

const fullDocumentBeforeChange = {
  incident_id: 1,
  reports: [1, 2],
  title: '24 Amazon workers sent to hospital after robot accidentally unleashes bear spray',
  'Alleged deployer of AI system': [],
  'Alleged developer of AI system': [],
  'Alleged harmed or nearly harmed parties': [],
  date: '2018-11-16',
  description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
  nlp_similar_incidents: [],
};

const fullDocument = {
  incident_id: 1,
  reports: [1, 2, 3],
  title: '24 Amazon workers sent to hospital after robot accidentally unleashes bear spray',
  'Alleged deployer of AI system': ['google', 'openai'],
  'Alleged developer of AI system': [],
  'Alleged harmed or nearly harmed parties': ['facebook'],
  date: '2018-11-16',
  description: 'New description',
  nlp_similar_incidents: [],
};

const updateDescription = {
  updatedFields: {
    description: 'New description',
  },
};

const updateDescriptionWithReports = {
  updatedFields: {
    reports: [3],
  },
};

const updateDescriptionWithEntities = {
  updatedFields: {
    'Alleged deployer of AI system': ['google', 'openai'],
    'Alleged harmed or nearly harmed parties': ['facebook'],
  },
};

const report = {
  report_number: 2000,
  title: 'Report title',
  authors: ['Pablo Costa'],
};

const variant = {
  report_number: 2001,
  title: 'Variant #2001',
  authors: ['Pablo Costa'],
  text_inputs: 'Input text',
  text_outputs: 'Output text',
};

const stubEverything = (isVariant = false) => {
  const notificationsCollection = {
    updateOne: cy.stub().as('notifications.updateOne'),
  };

  const subscriptionsCollection = {
    find: (() => {
      const stub = cy.stub();

      stub
        .withArgs({ type: SUBSCRIPTION_TYPE.incident, incident_id: fullDocument.incident_id })
        .as(`subscriptions.find("${SUBSCRIPTION_TYPE.incident}", "${fullDocument.incident_id}")`)
        .returns({ toArray: () => subscriptionsToIncidentUpdates });

      for (const entityId of ['google', 'facebook', 'tesla', 'openai']) {
        stub
          .withArgs({ type: SUBSCRIPTION_TYPE.entity, entityId })
          .as(`subscriptions.find("${SUBSCRIPTION_TYPE.entity}", "${entityId}")`)
          .returns({
            toArray: () => subscriptionsToNewEntityIncidents.filter((s) => s.entityId == entityId),
          });
      }

      return stub;
    })(),
  };

  const reportsCollection = {
    findOne: cy.stub().resolves(isVariant ? variant : report),
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
            stub.withArgs('reports').returns(reportsCollection);

            return stub;
          })(),
        }),
      }),
    },
  };

  global.BSON = { Int32: (x) => x };

  return {
    notificationsCollection,
    subscriptionsCollection,
  };
};

describe('Functions', () => {
  it('Incident Updated - Should insert a pending notification to process in the next build', () => {
    const { notificationsCollection, subscriptionsCollection } = stubEverything();

    cy.wrap(onIncidentUpdate({ updateDescription, fullDocument, fullDocumentBeforeChange })).then(
      () => {
        expect(subscriptionsCollection.find.getCall(0).args[0]).to.deep.equal({
          type: SUBSCRIPTION_TYPE.incident,
          incident_id: fullDocument.incident_id,
        });

        const notification = {
          type: 'incident-updated',
          incident_id: 1,
          processed: false,
        };

        expect(notificationsCollection.updateOne.getCall(0).args).to.deep.equal([
          notification, // filter
          notification, // new document
          { upsert: true },
        ]);
      }
    );
  });

  it('New Incident Report - Should insert a pending notification to process in the next build', () => {
    const { notificationsCollection, subscriptionsCollection } = stubEverything();

    cy.wrap(
      onIncidentUpdate({
        updateDescription: updateDescriptionWithReports,
        fullDocument,
        fullDocumentBeforeChange,
      })
    ).then(() => {
      expect(subscriptionsCollection.find.getCall(0).args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.incident,
        incident_id: fullDocument.incident_id,
      });

      const notification = {
        type: 'new-report-incident',
        incident_id: 1,
        report_number: 3,
        processed: false,
      };

      expect(notificationsCollection.updateOne.getCall(0).args).to.deep.equal([
        notification, // filter
        notification, // new document
        { upsert: true },
      ]);
    });
  });

  it('Entity - Should insert a pending notification to process in the next build', () => {
    const { notificationsCollection, subscriptionsCollection } = stubEverything();

    cy.wrap(
      onIncidentUpdate({
        updateDescription: updateDescriptionWithEntities,
        fullDocument,
        fullDocumentBeforeChange,
      })
    ).then(() => {
      expect(subscriptionsCollection.find.callCount).to.be.equal(4);

      expect(subscriptionsCollection.find.getCall(0).args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.incident,
        incident_id: fullDocument.incident_id,
      });

      expect(subscriptionsCollection.find.getCall(1).args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.entity,
        entityId: 'google',
      });

      expect(notificationsCollection.updateOne.callCount).to.be.equal(3);

      const notification = {
        type: SUBSCRIPTION_TYPE.entity,
        incident_id: 1,
        entity_id: 'google',
        isUpdate: true,
        processed: false,
      };

      expect(notificationsCollection.updateOne.getCall(1).args).to.deep.equal([
        notification, // filter
        notification, // new document
        { upsert: true },
      ]);

      notification.entity_id = 'facebook';

      expect(notificationsCollection.updateOne.getCall(2).args).to.deep.equal([
        notification, // filter
        notification, // new document
        { upsert: true },
      ]);
    });
  });

  it(`Shouldn't insert a pending notification if there are no active subscribers`, () => {
    const notificationsCollection = {
      updateOne: cy.stub().as('notifications.updateOne'),
    };

    const subscriptionsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().as('subscriptions.find.toArray').resolves([]),
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

    cy.wrap(
      onIncidentUpdate({
        updateDescription: updateDescriptionWithEntities,
        fullDocument,
        fullDocumentBeforeChange,
      })
    ).then(() => {
      expect(subscriptionsCollection.find.firstCall.args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.incident,
        incident_id: 1,
      });

      expect(notificationsCollection.updateOne.callCount).to.be.equal(0);
    });
  });

  it(`New Variant - Shouldn't insert a pending notification if a New Variant is added`, () => {
    const { notificationsCollection, subscriptionsCollection } = stubEverything(true);

    cy.wrap(
      onIncidentUpdate({
        updateDescription: updateDescriptionWithReports,
        fullDocument,
        fullDocumentBeforeChange,
      })
    ).then(() => {
      expect(subscriptionsCollection.find.firstCall.args[0]).to.deep.equal({
        type: SUBSCRIPTION_TYPE.incident,
        incident_id: 1,
      });

      expect(notificationsCollection.updateOne.callCount).to.be.equal(0);
    });
  });
});
