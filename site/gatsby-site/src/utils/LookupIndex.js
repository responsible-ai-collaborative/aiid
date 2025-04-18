const fs = require('fs');

/**
 * Generates a hash string from input using FNV-1a algorithm.
 * WARNING: Must match the implementation in embed.js; changing it will break links
 */
function hashString(str) {
  let h1 = 0x811c9dc5;

  let h2 = 0x811c9dc5;

  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);

    h1 ^= c;
    h2 ^= c;

    h1 = (h1 * 16777619) >>> 0;
    h2 = (h2 * 16777619) >>> 0;
  }

  return h1.toString(36) + h2.toString(36);
}

/**
 * Normalizes a URL to host + pathname, falling back to original string on parse failure.
 */
function normalizeURL(url) {
  try {
    const parsedURL = new URL(url);

    return parsedURL.host + parsedURL.pathname;
  } catch (e) {
    return url;
  }
}

/**
 * Builds a lookup index of incident IDs by report URL.
 * When optimized is true, outputs a hash-based index for fast lookups.
 */
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
      const urlIndex = {};

      incidents.forEach((incident) => {
        const reportDocs = reports.filter((report) =>
          incident.reports.includes(report.report_number)
        );

        reportDocs.forEach((report) => {
          if (report.url) {
            const normalizedUrl = normalizeURL(report.url);

            const urlHash = hashString(normalizedUrl);

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
