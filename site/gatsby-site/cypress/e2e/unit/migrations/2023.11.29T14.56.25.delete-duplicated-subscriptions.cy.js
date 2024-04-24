const { ObjectId } = require('bson');

const {
  up,
} = require('../../../../migrations/2023.11.29T14.56.25.delete-duplicated-subscriptions');

describe('Migration Script - Remove Duplicated Subscriptions', () => {
  it('Should remove duplicated subscriptions correctly', () => {
    // Mocked data for all three cases
    const testSubscriptions = {
      incident: [
        {
          _id: {
            type: 'incident',
            userId: '642188372947d07020c1319d',
            incident_id: 600,
          },
          uniqueIds: [
            new ObjectId('5f9f6b9b5f9c4c0001a3b3a3'),
            new ObjectId('5f9f6b9b5f9c4c0001a3b3a4'),
          ],
        },
        {
          _id: {
            type: 'submission-promoted',
            userId: '642188372947d07020c1319d',
            incident_id: 600,
          },
          uniqueIds: [
            new ObjectId('5f9f6b9b5f9c4c0001a3b3a0'),
            new ObjectId('5f9f6b9b5f9c4c0001a3b3a1'),
            new ObjectId('5f9f6b9b5f9c4c0001a3b3a2'),
          ],
        },
      ],
      entity: [
        {
          _id: {
            type: 'entity',
            userId: '642188372947d07020c1319d',
            entity_id: 'trans-women',
          },
          uniqueIds: [
            new ObjectId('5f9f6b9b5f9c4c0001a3b3a5'),
            new ObjectId('5f9f6b9b5f9c4c0001a3b3a6'),
          ],
        },
      ],
      'new-incidents': [
        {
          _id: {
            type: 'new-incidents',
            userId: '642188372947d07020c1319d',
          },
          uniqueIds: [
            new ObjectId('5f9f6b9b5f9c4c0001a3b3a7'),
            new ObjectId('5f9f6b9b5f9c4c0001a3b3a8'),
          ],
        },
      ],
    };

    // Mocked collection with stubbed methods
    const subscriptionsCollection = {
      aggregate: cy.stub().callsFake((query) => {
        const type = query[0].$match.type.$in[0];

        return {
          toArray: cy.stub().resolves(testSubscriptions[type]),
        };
      }),
      deleteMany: cy.stub().callsFake((query) => {
        console.log('deleteMany called with:', query._id.$in[0].toString()); // Log the query
        return Promise.resolve({ deletedCount: 1 });
      }),
    };

    // Mocked context with database client
    const context = {
      client: {
        db: cy.stub().returns({
          collection: cy.stub().withArgs('subscriptions').returns(subscriptionsCollection),
        }),
      },
    };

    // Execute the migration script
    cy.wrap(up({ context })).then(() => {
      // Assertions for each case
      const args = subscriptionsCollection.deleteMany.getCall(0).args[0];

      const argsSubmissionPromoted = subscriptionsCollection.deleteMany.getCall(1).args[0];

      const argsEntity = subscriptionsCollection.deleteMany.getCall(2).args[0];

      const argsNewIncidents = subscriptionsCollection.deleteMany.getCall(3).args[0];

      let modifiedObjectIncident = {
        _id: {
          $in: args._id.$in.map((id) => id.toString()),
        },
      };

      let modifiedObjectSubmissionPromoted = {
        _id: {
          $in: argsSubmissionPromoted._id.$in.map((id) => id.toString()),
        },
      };

      let modifiedObjectEntity = {
        _id: {
          $in: argsEntity._id.$in.map((id) => id.toString()),
        },
      };

      let modifiedObjectNewIncidents = {
        _id: {
          $in: argsNewIncidents._id.$in.map((id) => id.toString()),
        },
      };

      expect(modifiedObjectIncident).to.be.deep.equal({
        _id: {
          $in: testSubscriptions['incident'][0].uniqueIds.slice(0, 1).map((id) => id.toString()),
        },
      });

      expect(modifiedObjectSubmissionPromoted).to.be.deep.equal({
        _id: {
          $in: testSubscriptions['incident'][1].uniqueIds.slice(0, 2).map((id) => id.toString()),
        },
      });

      expect(modifiedObjectEntity).to.be.deep.equal({
        _id: {
          $in: testSubscriptions['entity'][0].uniqueIds.slice(0, 1).map((id) => id.toString()),
        },
      });

      expect(modifiedObjectNewIncidents).to.be.deep.equal({
        _id: {
          $in: testSubscriptions['new-incidents'][0].uniqueIds
            .slice(0, 1)
            .map((id) => id.toString()),
        },
      });
    });
  });
});
