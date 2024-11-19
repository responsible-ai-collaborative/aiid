import { ObjectId } from 'bson';
import { up } from '../../../../migrations/2023.11.29T14.56.25.delete-duplicated-subscriptions';
import { test } from '../../../utils';
import sinon from 'sinon';
import { expect } from '@playwright/test';

test('Migration Script - Remove Duplicated Subscriptions', async ({ page }) => {
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

  const subscriptionsCollection = {
    aggregate: sinon.stub().callsFake((query) => {
      const type = query[0].$match.type.$in[0];
      return {
        toArray: sinon.stub().resolves(testSubscriptions[type]),
      };
    }),
    deleteMany: sinon.stub().resolves({ deletedCount: 1 }),
  };

  const context = {
    client: {
      db: sinon.stub().returns({
        collection: sinon.stub().withArgs('subscriptions').returns(subscriptionsCollection),
      }),
    },
  };

  await up({ context });

  const argsIncident = subscriptionsCollection.deleteMany.getCall(0).args[0];
  const argsSubmissionPromoted = subscriptionsCollection.deleteMany.getCall(1).args[0];
  const argsEntity = subscriptionsCollection.deleteMany.getCall(2).args[0];
  const argsNewIncidents = subscriptionsCollection.deleteMany.getCall(3).args[0];

  const modifiedObjectIncident = {
    _id: {
      $in: argsIncident._id.$in.map((id: ObjectId) => id.toString()),
    },
  };

  const modifiedObjectSubmissionPromoted = {
    _id: {
      $in: argsSubmissionPromoted._id.$in.map((id: ObjectId) => id.toString()),
    },
  };

  const modifiedObjectEntity = {
    _id: {
      $in: argsEntity._id.$in.map((id: ObjectId) => id.toString()),
    },
  };

  const modifiedObjectNewIncidents = {
    _id: {
      $in: argsNewIncidents._id.$in.map((id: ObjectId) => id.toString()),
    },
  };

  expect(modifiedObjectIncident).toEqual({
    _id: {
      $in: testSubscriptions['incident'][0].uniqueIds.slice(0, 1).map((id) => id.toString()),
    },
  });

  expect(modifiedObjectSubmissionPromoted).toEqual({
    _id: {
      $in: testSubscriptions['incident'][1].uniqueIds.slice(0, 2).map((id) => id.toString()),
    },
  });

  expect(modifiedObjectEntity).toEqual({
    _id: {
      $in: testSubscriptions['entity'][0].uniqueIds.slice(0, 1).map((id) => id.toString()),
    },
  });

  expect(modifiedObjectNewIncidents).toEqual({
    _id: {
      $in: testSubscriptions['new-incidents'][0].uniqueIds.slice(0, 1).map((id) => id.toString()),
    },
  });
});
