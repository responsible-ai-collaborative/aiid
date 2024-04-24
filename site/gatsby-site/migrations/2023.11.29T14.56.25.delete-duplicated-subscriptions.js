const { ObjectId } = require('bson');

const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const db = client.db(config.realm.production_db.db_custom_data);

  const subscriptions = db.collection('subscriptions');

  // Remove duplicates of type "incident" and "submission-promoted", based on type, incident_id and userId

  const result = await subscriptions
    .aggregate([
      {
        $match: {
          type: { $in: ['incident', 'submission-promoted'] },
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

  await removeDuplicates(subscriptions, result);

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

  await removeDuplicates(subscriptions, resultEntities);

  // Remove duplicates of type "new-incidents" based on type, incident_id and userId

  const resultNewIncidents = await subscriptions
    .aggregate([
      {
        $match: {
          type: { $in: ['new-incidents'] },
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

  await removeDuplicates(subscriptions, resultNewIncidents);
};

async function removeDuplicates(subscriptions, results) {
  for (const doc of results) {
    const uniqueIds = doc.uniqueIds.map((id) => new ObjectId(id));

    if (doc._id.type && doc._id.userId) {
      console.log(
        `Removing ${doc.count - 1} duplicated subscriptions of type ${doc._id.type} for user ${
          doc._id.userId
        } ${
          doc._id.incident_id
            ? ' and for incident ' + doc._id.incident_id
            : doc._id.entityId
            ? ' and for entity ' + doc._id.entityId
            : ''
        }`
      );
      uniqueIds.pop(); // Remove one from the array to keep
      const deleteResult = await subscriptions.deleteMany({
        _id: { $in: uniqueIds },
      });

      console.log('Delete Result: ', deleteResult);
    }
  }
}
