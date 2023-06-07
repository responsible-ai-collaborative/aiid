const config = require('../config');

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

    console.log(`Updating incident ${incident.incident_id} with editor "${editor}"`);

    await incidentsCollection.updateOne(
      { incident_id: incident.incident_id },
      { $set: { editor: editor } }
    );

    incident.editor = editor;

    await incidentsHistoryCollection.insertOne(incident);
  }
};
