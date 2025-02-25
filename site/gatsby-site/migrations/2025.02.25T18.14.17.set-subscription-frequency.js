const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const subscriptionsCollection = client
    .db(config.realm.production_db.db_custom_data)
    .collection('subscriptions');

  // Update all "new-incidents" subscriptions to set frequency to "instant"
  const updateResult = await subscriptionsCollection.updateMany(
    { type: 'new-incidents', frequency: { $exists: false } },
    { $set: { frequency: 'instant' } }
  );

  console.log(
    `Updated ${updateResult.modifiedCount} subscriptions to have frequency set to "instant".`
  );
};
