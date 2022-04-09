const algoliaSettings = require('./algoliaSettings');

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

const getClassificationArray = (cObj, namespace) => {
  const cArray = [];

  for (const c in cObj) {
    if (cObj[c] !== null) {
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

  generateIndexEntries({ reports, classifications }) {
    let classificationsHash = {};

    classifications.map((c) => {
      classificationsHash[c.incident_id] = getClassificationArray(c.classifications, c.namespace);
    });

    const downloadData = reports.map((report) => {
      const finalDataNode = {
        objectID: report.report_number.toString(),
        ...report,
      };

      if (classificationsHash[report.incident_id]) {
        finalDataNode.classifications = classificationsHash[report.incident_id];
      }

      return finalDataNode;
    });

    const truncatedData = downloadData.map(truncate);

    return truncatedData;
  }

  getClassifications = async () => {
    return this.mongoClient
      .db('aiidprod')
      .collection(`classifications`)
      .find({ namespace: 'CSET', 'classifications.Publish': true })
      .toArray();
  };

  getReports = async ({ language }) => {
    const reports = await this.mongoClient.db('aiidprod').collection(`reports`).find({}).toArray();

    const translations = await this.mongoClient
      .db('translations')
      .collection(`incident_reports_${language}`)
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

  async run() {
    await this.mongoClient.connect();

    const classifications = await this.getClassifications();

    for (let { code: language } of this.languages) {
      const reports = await this.getReports({ language });

      const entries = this.generateIndexEntries({ reports, classifications });

      this.reporter.log(
        `Uploading Algolia index of [${language}] with [${entries.length}] entries`
      );
      await this.uploadToAlgolia({ entries, language });
    }

    await this.mongoClient.close();
  }
}

module.exports = AlgoliaUpdater;
