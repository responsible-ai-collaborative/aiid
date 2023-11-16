const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const usersCollection = client.db(config.realm.production_db.db_custom_data).collection('users');

  // Replace 'editor' with 'incident_editor' in the 'roles' array
  const replaceResult = await usersCollection.updateMany(
    { roles: { $all: ['editor'], $nin: ['incident_editor'] } },
    { $set: { 'roles.$': 'incident_editor' } }
  );

  console.log('"editor" role updated to "incident_editor"', replaceResult);

  // Remove 'editor' role if the user already has 'incident_editor' role
  const removeResult = await usersCollection.updateMany(
    { roles: { $all: ['editor', 'incident_editor'] } },
    { $pull: { roles: 'editor' } }
  );

  console.log('"editor" role removed', removeResult);
};

exports.down = async () => {};
