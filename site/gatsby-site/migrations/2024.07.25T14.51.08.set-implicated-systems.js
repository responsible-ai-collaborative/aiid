const config = require('../config');
/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  // New implicated_systems field on submissions and incidents collections from production db and history db

  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  const submissionsHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('submissions');

  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const incidentsHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('incidents');

  const submissionsUpdates = await submissionsCollection.updateMany(
    {},
    {
      $set: {
        implicated_systems: [],
      },
    }
  );

  console.log(
    `Updated ${submissionsUpdates.modifiedCount} submissions with new implicated_systems field`
  );

  const submissionsHistoryUpdates = await submissionsHistoryCollection.updateMany(
    {},
    {
      $set: {
        implicated_systems: [],
      },
    }
  );

  console.log(
    `Updated ${submissionsHistoryUpdates.modifiedCount} submissions history with new created_at field`
  );

  const incidentsUpdates = await incidentsCollection.updateMany(
    {},
    {
      $set: {
        implicated_systems: [],
      },
    }
  );

  console.log(
    `Updated ${incidentsUpdates.modifiedCount} incidents with new implicated_systems field`
  );

  const incidentsHistoryUpdates = await incidentsHistoryCollection.updateMany(
    {},
    {
      $set: {
        implicated_systems: [],
      },
    }
  );

  console.log(
    `Updated ${incidentsHistoryUpdates.modifiedCount} incidents history with new created_at field`
  );
};
