const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const db = client.db(config.realm.production_db.db_custom_data);

  const notifications = db.collection('notifications');

  // Mark all pending notifications as processed
  const result = await notifications.updateMany(
    { processed: false },
    { $set: { processed: true } }
  );

  console.log(`All pending notifications marked as processed. Total: ${result.modifiedCount}`);
};
