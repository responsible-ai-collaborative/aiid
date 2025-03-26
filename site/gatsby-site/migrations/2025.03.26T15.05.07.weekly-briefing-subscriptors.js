const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const subscriptors = [
    'kevin.paeth@ul.org',
    'clara.youdale@dsri.org',
    'pablo.costa@dsri.org',
    'cesar.varela@dsri.org',
    'luna.mcnulty@dsri.org',
  ];

  const authUsersCollection = client.db(config.realm.production_db.db_auth).collection('users');

  const subscriptionsCollection = client
    .db(config.realm.production_db.db_custom_data)
    .collection('subscriptions');

  const users = await authUsersCollection.find({ email: { $in: subscriptors } }).toArray();

  // Remove objectId from users
  const userIds = users.map((user) => user._id.toString());

  // Create a new subscription for each user
  const results = [];

  for (const userId of userIds) {
    const existingSubscription = await subscriptionsCollection.findOne({
      userId: userId,
      type: 'ai-weekly-briefing',
    });

    if (!existingSubscription) {
      results.push(
        subscriptionsCollection.insertOne({
          userId: userId,
          type: 'ai-weekly-briefing',
          created_at: new Date(),
        })
      );
    }
  }

  await Promise.all(results);

  console.log(`Created ${results.length} ai-weekly-briefing subscriptions`);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
