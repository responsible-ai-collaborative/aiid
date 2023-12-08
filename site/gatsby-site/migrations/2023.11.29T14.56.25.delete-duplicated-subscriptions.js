const { ObjectID } = require('bson');

const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const db = client.db(config.realm.production_db.db_custom_data);

  const subscriptions = db.collection('subscriptions');

  // Remove duplicates of type "incident", "new-incidents" and "submission-promoted", based on type, incident_id and userId

  const result = await subscriptions
    .aggregate([
      {
        $match: {
          type: { $in: ['incident', 'new-incidents', 'submission-promoted'] },
        },
      },
      {
        $group: {
          _id: { incident_id: '$incident_id', type: '$type', userId: '$userId' },
          uniqueIds: { $addToSet: '$_id' },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ])
    .toArray();

  for (const doc of result) {
    const uniqueIds = doc.uniqueIds.map((id) => new ObjectID(id));

    if (doc._id.incident_id && doc._id.type && doc._id.userId) {
      console.log(
        `Removing ${doc.count - 1} duplicated subscriptions for incident ${
          doc._id.incident_id
        } of type ${doc._id.type} for user ${doc._id.userId}`
      );
      uniqueIds.pop(); // Remove one from the array to keep
      const deleteResult = await subscriptions.deleteMany({
        _id: { $in: uniqueIds },
      });

      console.log('Delete Result: ', deleteResult);
    }
  }

  // Remove duplicates of type "entity", based on type, entityId and userId
  const resultEntities = await subscriptions
    .aggregate([
      {
        $match: {
          type: { $in: ['entity'] },
        },
      },
      {
        $group: {
          _id: { entityId: '$entityId', type: '$type', userId: '$userId' },
          uniqueIds: { $addToSet: '$_id' },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ])
    .toArray();

  for (const doc of resultEntities) {
    const uniqueIds = doc.uniqueIds.map((id) => new ObjectID(id));

    if (doc._id.entityId && doc._id.type && doc._id.userId) {
      console.log(
        `Removing ${doc.count - 1} duplicated subscriptions for entity ${
          doc._id.entityId
        } of type ${doc._id.type} for user ${doc._id.userId}`
      );
      uniqueIds.pop(); // Remove one from the array to keep
      const deleteResult = await subscriptions.deleteMany({ _id: { $in: uniqueIds } });

      console.log('Delete Result: ', deleteResult);
    }
  }
};
