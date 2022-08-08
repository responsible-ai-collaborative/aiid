const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const reportsCollection = client.db(config.realm.production_db.db_name).collection('reports');

  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const reportsWithIncidents = new Set();

  const incidentsCursor = incidentsCollection.find({});

  while (await incidentsCursor.hasNext()) {
    const incident = await incidentsCursor.next();

    console.log(`Checking reports of incident #${incident.incident_id}`);
    for (let reportNumber of incident.reports) {
      const reportExists =
        (await reportsCollection
          .find({
            report_number: reportNumber,
          })
          .count()) > 0;

      if (reportExists) {
        reportsWithIncidents.add(reportNumber);
      } else {
        console.log(
          `Incident #${incident.incident_id} has non-existant report #${reportNumber}. Deleting report #${reportNumber}`
        );
        incidentsCollection.updateOne(
          { incident_id: incident.incident_id },
          { $set: { reports: incident.reports.map((r) => r != reportNumber) } }
        );
      }
    }
  }

  const reportsCursor = reportsCollection.find({});

  while (await reportsCursor.hasNext()) {
    const report = await reportsCursor.next();

    if (!reportsWithIncidents.has(report.report_number)) {
      console.log(
        `Report #${report.report_number} is not associated with any incident. Deleting it...`
      );
      reportsCollection.deleteOne({ report_number: report.report_number });
    }
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
