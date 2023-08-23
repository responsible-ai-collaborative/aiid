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

  // Purge all previous history data
  await reportsHistoryCollection.deleteMany({});

  const reportsCursor = reportsCollection.find({});

  while (await reportsCursor.hasNext()) {
    const report = await reportsCursor.next();

    // Set the first modifier as the user who created the report or the default user (Sean McGregor)
    const modifiedBy = report.user && report.user != '' ? report.user : '619b47ea5eed5334edfa3bbc';

    console.log(`Inserting Report history ${report.report_number} with modifiedBy "${modifiedBy}"`);

    report.modifiedBy = modifiedBy;

    await reportsHistoryCollection.insertOne(report);
  }

  // Clone Incidents collection from "aiidprod" to "history" DB
  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const incidentsHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('incidents');

  // Purge all previous history data
  await incidentsHistoryCollection.deleteMany({});

  const incidentsCursor = incidentsCollection.find({});

  while (await incidentsCursor.hasNext()) {
    const incident = await incidentsCursor.next();

    // Set the first modifier as the first submitter or the default user (Sean McGregor)
    const modifiedBy =
      incident.editors && incident.editors.length > 0
        ? incident.editors[0]
        : '619b47ea5eed5334edfa3bbc';

    console.log(
      `Inserting Incident history ${incident.incident_id} with modifiedBy "${modifiedBy}"`
    );

    incident.modifiedBy = modifiedBy;

    await incidentsHistoryCollection.insertOne(incident);
  }
};
