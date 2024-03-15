const fs = require('fs');

class LookupIndex {
  constructor({ client, filePath }) {
    /**
     * @type {import('mongodb').MongoClient}
     * @public
     */
    this.client = client;
    this.filePath = filePath;
  }

  async run() {
    const incidentsCollection = this.client.db('aiidprod').collection('incidents');

    const reportsCollection = this.client.db('aiidprod').collection('reports');

    const incidents = await incidentsCollection.find({}).toArray();

    const reports = await reportsCollection.find({}).toArray();

    const data = incidents.map((incident) => {
      const reportDocs = reports.filter((report) =>
        incident.reports.includes(report.report_number)
      );

      const reportsData = reportDocs.map((report) => {
        return {
          report_number: report.report_number,
          title: report.title,
          url: report.url,
        };
      });

      return {
        incident_id: incident.incident_id,
        title: incident.title,
        reports: reportsData,
      };
    });

    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }
}

module.exports = LookupIndex;
