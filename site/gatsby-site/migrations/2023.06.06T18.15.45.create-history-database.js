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

  // Create "reports" collection on "history" DB
  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  const reportsHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('reports');

  const reports = await reportsCollection.find({}, { limit: 1 }).toArray();

  const report = reports[0];

  const reportModifiedBy =
    report.submitters && report.submitters.length > 0 ? report.submitters[0] : '';

  console.log(`Inserting report ${report.report_number} with editor "${reportModifiedBy}"`);

  report.modifiedBy = reportModifiedBy;

  await reportsHistoryCollection.insertOne(report);

  // Create "incidents" collection on "history" DB
  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const incidentsHistoryCollection = client
    .db(config.realm.production_db.db_history_name)
    .collection('incidents');

  const incidents = await incidentsCollection.find({}, { limit: 1 }).toArray();

  const incident = incidents[0];

  const incidentModifiedBy =
    incident.editors && incident.editors.length > 0 ? incident.editors[0] : '';

  const epoch_date_modified = getUnixTime(new Date(incident.date));

  console.log(`Inserting incident ${incident.incident_id} with editor "${incidentModifiedBy}"`);

  incident.modifiedBy = incidentModifiedBy;
  incident.epoch_date_modified = epoch_date_modified;

  await incidentsHistoryCollection.insertOne(incident);
};
