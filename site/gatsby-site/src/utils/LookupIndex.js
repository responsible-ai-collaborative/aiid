const fs = require('fs');

// FNV-1a hash function for URL normalization with longer output
function hashString(str) {
  // Use two 32-bit hashes to create a 64-bit hash
  let h1 = 0x811c9dc5;

  let h2 = 0x811c9dc5;

  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);

    h1 ^= c;
    h2 ^= c;

    h1 = (h1 * 16777619) >>> 0;
    h2 = (h2 * 16777619) >>> 0;
  }

  // Combine the two hashes into a single string
  return h1.toString(36) + h2.toString(36);
}

function normalizeURL(url) {
  try {
    const parsedURL = new URL(url);

    return parsedURL.host + parsedURL.pathname;
  } catch (e) {
    return url;
  }
}

class LookupIndex {
  constructor({ client, filePath, optimized = false }) {
    /**
     * @type {import('mongodb').MongoClient}
     * @public
     */
    this.client = client;
    this.filePath = filePath;
    this.optimized = optimized;
  }

  async run() {
    const incidentsCollection = this.client.db('aiidprod').collection('incidents');
    const reportsCollection = this.client.db('aiidprod').collection('reports');

    const incidentProjection = { incident_id: 1, title: 1, reports: 1 };

    const reportProjection = { report_number: 1, title: 1, url: 1 };

    const incidents = await incidentsCollection
      .find({}, { projection: incidentProjection })
      .toArray();
    const reports = await reportsCollection.find({}, { projection: reportProjection }).toArray();

    if (this.optimized) {
      // Only create URL to incident ID mapping
      const urlIndex = {};

      // Process each incident
      incidents.forEach((incident) => {
        const reportDocs = reports.filter((report) =>
          incident.reports.includes(report.report_number)
        );

        // Process each report URL
        reportDocs.forEach((report) => {
          if (report.url) {
            const normalizedUrl = normalizeURL(report.url);

            const urlHash = hashString(normalizedUrl);

            // Add incident ID to the URL's incident list
            if (!urlIndex[urlHash]) {
              urlIndex[urlHash] = [];
            }
            if (!urlIndex[urlHash].includes(incident.incident_id)) {
              urlIndex[urlHash].push(incident.incident_id);
            }
          }
        });
      });

      fs.writeFileSync(this.filePath, JSON.stringify(urlIndex));
    } else {

      const mappedIncidents = incidents.map((incident) => {
        const reportDocs = reports.filter((report) =>
          incident.reports.includes(report.report_number)
        );

        return {
          incident_id: incident.incident_id,
          title: incident.title,
          reports: reportDocs.map((report) => ({
            report_number: report.report_number,
            title: report.title,
            url: report.url,
          })),
        };
      });

      fs.writeFileSync(this.filePath, JSON.stringify(mappedIncidents));
    }
  }
}

module.exports = LookupIndex;
