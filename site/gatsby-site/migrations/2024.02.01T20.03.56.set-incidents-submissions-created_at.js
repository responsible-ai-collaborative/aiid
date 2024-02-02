const config = require('../config');
/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  // New created_at field on incidents and submissions collections
  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  const incidentsHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('incidents');

  const submissionsHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('submissions');

  const incidentsCursor = incidentsCollection.find({});

  const incidentsHistoryCursor = incidentsHistoryCollection.find({});

  const submissionsCursor = submissionsCollection.find({});

  const submissionsHistoryCursor = submissionsHistoryCollection.find({});

  let updatedCount = 0;

  while (await incidentsCursor.hasNext()) {
    const incident = await incidentsCursor.next();

    const created_at = new Date(incident.date);

    await incidentsCollection.updateOne(
      { _id: incident._id },
      {
        $set: {
          created_at: created_at,
        },
      }
    );

    incident.created_at = created_at;

    updatedCount++;
  }

  console.log(`Updated ${updatedCount} incidents`);

  updatedCount = 0;

  while (await incidentsHistoryCursor.hasNext()) {
    const incident = await incidentsHistoryCursor.next();

    const created_at = new Date(incident.date);

    await incidentsHistoryCollection.updateOne(
      { _id: incident._id },
      {
        $set: {
          created_at: created_at,
        },
      }
    );

    incident.created_at = created_at;

    updatedCount++;
  }

  console.log(`Updated ${updatedCount} incidents history`);

  updatedCount = 0;

  while (await submissionsCursor.hasNext()) {
    const submission = await submissionsCursor.next();

    const created_at = new Date(submission.date_submitted);

    await submissionsCollection.updateOne(
      { _id: submission._id },
      {
        $set: {
          created_at: created_at,
        },
      }
    );

    submission.created_at = created_at;

    updatedCount++;
  }

  console.log(`Updated ${updatedCount} submissions`);

  updatedCount = 0;

  while (await submissionsHistoryCursor.hasNext()) {
    const submission = await submissionsHistoryCursor.next();

    const created_at = new Date(submission.date_submitted);

    await submissionsHistoryCollection.updateOne(
      { _id: submission._id },
      {
        $set: {
          created_at: created_at,
        },
      }
    );

    submission.created_at = created_at;

    updatedCount++;
  }

  console.log(`Updated ${updatedCount} submissions history`);
};
