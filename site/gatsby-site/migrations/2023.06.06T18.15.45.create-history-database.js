const config = require('../config');

function getUnixTime(dateString) {
  return Math.floor(new Date(dateString).getTime() / 1000);
}
/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  // Clone Reports collection from "aiidprod" to "history" DB
  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  const reportsHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('reports');

  const reportsCursor = reportsCollection.find({});

  while (await reportsCursor.hasNext()) {
    const report = await reportsCursor.next();

    const editor = report.submitters && report.submitters.length > 0 ? report.submitters[0] : '';

    console.log(`Updating report ${report.report_number} with editor "${editor}"`);

    await reportsCollection.updateOne(
      { report_number: report.report_number },
      { $set: { editor: editor } }
    );

    report.editor = editor;

    await reportsHistoryCollection.insertOne(report);
  }

  // Clone Incidents collection from "aiidprod" to "history" DB
  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const incidentsHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('incidents');

  const incidentsCursor = incidentsCollection.find({});

  while (await incidentsCursor.hasNext()) {
    const incident = await incidentsCursor.next();

    const editor = incident.editors && incident.editors.length > 0 ? incident.editors[0] : '';

    const epoch_date_modified = getUnixTime(new Date(incident.date));

    console.log(`Updating incident ${incident.incident_id} with editor "${editor}"`);

    await incidentsCollection.updateOne(
      { incident_id: incident.incident_id },
      {
        $set: {
          editor: editor,
          epoch_date_modified: epoch_date_modified,
        },
      }
    );

    incident.editor = editor;
    incident.epoch_date_modified = epoch_date_modified;

    await incidentsHistoryCollection.insertOne(incident);
  }

  // New epoch_date_modified field on submissions collection
  const submissionsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('submissions');

  const submissionsCursor = submissionsCollection.find({});

  while (await submissionsCursor.hasNext()) {
    const submission = await submissionsCursor.next();

    const epoch_date_modified = getUnixTime(new Date(submission.date_modified));

    console.log(
      `Updating submission ${submission._id} with epoch_date_modified "${epoch_date_modified}"`
    );

    await submissionsCollection.updateOne(
      { _id: submission._id },
      {
        $set: {
          epoch_date_modified: epoch_date_modified,
        },
      }
    );

    submission.epoch_date_modified = epoch_date_modified;
  }
};
