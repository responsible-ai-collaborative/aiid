const algoliaSettings = require('./algoliaSettings');

const { getUnixTime } = require('date-fns');

const config = require('../../config');

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
        if (reports.some((r) => r.report_number == report_number)) {
          const report = reports.find((r) => r.report_number == report_number) || {};

          const entry = {
            authors: report.authors,
            description: report.description,
            epoch_date_downloaded: report.epoch_date_downloaded,
            epoch_date_modified: report.epoch_date_modified,
            epoch_date_published: report.epoch_date_published,
            epoch_date_submitted: report.epoch_date_submitted,
            image_url: report.image_url,
            language: report.language,
            ref_number: report.ref_number,
            report_number: report.report_number,
            source_domain: report.source_domain,
            submitters: report.submitters,
            title: report.title,
            url: report.url,
            tags: report.tags,
            editor_notes: report.editor_notes,
            cloudinary_id: report.cloudinary_id,

            text: report.plain_text,

            mongodb_id: report._id.toString(),

            objectID: report.report_number.toString(),

            incident_id: incident.incident_id,
            incident_date: incident.date,
            epoch_incident_date: getUnixTime(new Date(incident.date)),
            featured: config?.header?.search?.featured.includes(report.report_number) ? 1 : 0,
          };

          if (classificationsHash[entry.incident_id]) {
            entry.classifications = classificationsHash[entry.incident_id];
          }

          downloadData.push(entry);
        }
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
    const projection = {
      _id: 1,
      authors: 1,
      date_downloaded: 1,
      date_modified: 1,
      date_published: 1,
      date_submitted: 1,
      description: 1,
      epoch_date_downloaded: 1,
      epoch_date_modified: 1,
      epoch_date_published: 1,
      epoch_date_submitted: 1,
      image_url: 1,
      language: 1,
      ref_number: 1,
      report_number: 1,
      source_domain: 1,
      submitters: 1,
      title: 1,
      url: 1,
      plain_text: 1,
      editor_notes: 1,
      cloudinary_id: 1,
    };

    const reports = await this.mongoClient
      .db('aiidprod')
      .collection(`reports`)
      .find({}, { projection })
      .toArray();

    const translations = await this.mongoClient
      .db('translations')
      .collection(`reports_${language}`)
      .find({})
      .toArray();

    const fullReports = reports.map((r) => {
      let report = { ...r };

      if (translations.some((t) => t.report_number === r.report_number)) {
        const { title, plain_text } =
          translations.find((t) => t.report_number === r.report_number) || {};

        report = {
          ...r,
          title,
          plain_text,
        };
      }

      return report;
    });

    return fullReports;
  };

  uploadToAlgolia = async ({ language, entries }) => {
    const indexName = `instant_search-${language}`;

    const featuredReplicaIndexName = indexName + '-featured';

    const index = this.algoliaClient.initIndex(indexName);

    await index.saveObjects(entries);

    index
      .setSettings({
        ...algoliaSettings,
        attributeForDistinct: 'incident_id',
        indexLanguages: [language],
        queryLanguages: [language],
        replicas: [featuredReplicaIndexName],
      })
      .catch((e) => console.error(e))
      .then(() => {
        const featuredReplicaIndex = this.algoliaClient.initIndex(featuredReplicaIndexName);

        featuredReplicaIndex
          .setSettings({
            ranking: ['desc(featured)', 'desc(text)'],
          })
          .catch((e) => console.error(e));
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
  }
}

module.exports = AlgoliaUpdater;
