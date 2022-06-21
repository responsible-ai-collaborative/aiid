const algoliaSettings = require('./algoliaSettings');

const remark = require('remark');

const remarkStrip = require('strip-markdown');

const { getUnixTime } = require('date-fns');

const truncate = (doc) => {
  for (const [key, value] of Object.entries(doc)) {
    if (typeof value == 'string') {
      if (value.length > 8000) {
        doc[key] = value.substring(0, 8000);
      }
    }
  }
  return doc;
};

const classificationsWhitelist = [
  'Harm Distribution Basis',
  'Intent',
  'Lives Lost',
  'Location',
  'Named Entities',
  'Near Miss',
  'Severity',
  'AI Applications',
  'AI Techniques',
  'Financial Cost',
  'Harm Type',
  'Infrastructure Sectors',
  'Level of Autonomy',
  'Lives Lost',
  'Nature of End User',
  'Physical System',
  'Problem Nature',
  'Public Sector Deployment',
  'Relevant AI functions',
  'Sector of Deployment',
  'System Developer',
  'Technology Purveyor',
];

const getClassificationArray = (cObj, namespace) => {
  const cArray = [];

  for (const c in cObj) {
    if (cObj[c] !== null && classificationsWhitelist.includes(c)) {
      let valuesToUnpack = null;

      if (typeof cObj[c] === 'object') {
        valuesToUnpack = cObj[c];
      } else {
        valuesToUnpack = [cObj[c]];
      }
      if (cObj[c] !== undefined && cObj[c] !== '' && valuesToUnpack.length > 0) {
        valuesToUnpack.forEach((element) =>
          cArray.push(`${namespace}:${c.replace(/_/g, ' ')}:${element}`)
        );
      }
    }
  }

  return cArray;
};

class AlgoliaUpdater {
  constructor({ mongoClient, algoliaClient, reporter, languages }) {
    /**
     * @type {import('mongodb').MongoClient}
     * @public
     */
    this.mongoClient = mongoClient;
    this.reporter = reporter;
    this.languages = languages;
    this.algoliaClient = algoliaClient;
  }

  generateIndexEntries = async ({ reports, incidents, classifications }) => {
    let classificationsHash = {};

    classifications.forEach((c) => {
      classificationsHash[c.incident_id] = getClassificationArray(c.classifications, c.namespace);
    });

    const downloadData = [];

    for (const incident of incidents) {
      for (const report_number of incident.reports) {
        const report = reports.find((r) => r.report_number == report_number);

        const text = await remark().use(remarkStrip).process(report.text);

        const entry = {
          ...report,
          objectID: report.report_number.toString(),
          text: text.contents.toString().trim(),
          incident_id: incident.incident_id,
          incident_date: incident.date,
          epoch_incident_date: getUnixTime(new Date(incident.date)),
        };

        if (classificationsHash[entry.incident_id]) {
          entry.classifications = classificationsHash[entry.incident_id];
        }

        downloadData.push(entry);
      }
    }

    const truncatedData = downloadData.map(truncate);

    return truncatedData;
  };

  getClassifications = async () => {
    return this.mongoClient
      .db('aiidprod')
      .collection(`classifications`)
      .find({ namespace: 'CSET', 'classifications.Publish': true })
      .toArray();
  };

  getIncidents = async () => {
    return this.mongoClient.db('aiidprod').collection(`incidents`).find({}).toArray();
  };

  getReports = async ({ language }) => {
    const reports = await this.mongoClient.db('aiidprod').collection(`reports`).find({}).toArray();

    const translations = await this.mongoClient
      .db('translations')
      .collection(`reports_${language}`)
      .find({})
      .toArray();

    const fullReports = reports.map((report) => ({
      ...report,
      ...translations.find((t) => t.report_number === report.report_number),
    }));

    return fullReports;
  };

  uploadToAlgolia = async ({ language, entries }) => {
    const indexName = `instant_search-${language}`;

    const index = this.algoliaClient.initIndex(indexName);

    await index.saveObjects(entries);

    await index.setSettings({
      ...algoliaSettings,
      indexLanguages: [language],
      queryLanguages: [language],
    });
  };

  async generateIndex({ language }) {
    await this.mongoClient.connect();

    const classifications = await this.getClassifications();

    const incidents = await this.getIncidents();

    const reports = await this.getReports({ language });

    const entries = await this.generateIndexEntries({ reports, incidents, classifications });

    await this.mongoClient.close();

    return entries;
  }

  async run() {
    for (let { code: language } of this.languages) {
      const entries = await this.generateIndex({ language });

      this.reporter.log(
        `Uploading Algolia index of [${language}] with [${entries.length}] entries`
      );
      await this.uploadToAlgolia({ entries, language });
    }

    await this.mongoClient.close();
  }
}

module.exports = AlgoliaUpdater;
