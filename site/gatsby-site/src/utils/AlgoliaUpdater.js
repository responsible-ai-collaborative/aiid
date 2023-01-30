const algoliaSettings = require('./algoliaSettings');

const { getUnixTime } = require('date-fns');

const config = require('../../config');

const { isCompleteReport } = require('./variants');

// Reduce this if a subset of the data is needed
// to fit within the Algolia tier limits.
//
// TODO: Put this configuration in a more convenient place.
const LIMIT = Number.MAX_SAFE_INTEGER;

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

const includedCSETAttributes = [
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

const getClassificationArray = (classification) => {
  const result = [];

  if (classification.attributes) {
    for (const attribute of classification.attributes) {
      if (
        attribute.value_json &&
        attribute.value_json.length > 0 &&
        (classification.namespace != 'CSET' ||
          includedCSETAttributes.includes(attribute.short_name))
      ) {
        try {
          const value = JSON.parse(attribute.value_json);

          result.push(`${classification.namespace}:${attribute.short_name}:${value}`);
        } catch (e) {
          console.log(`attribute.value_json`, attribute.value_json);
          console.error(e);
        }
      }
    }
  }

  return result;
};

const reportToEntry = ({ incident = null, report }) => {
  const entry = {
    authors: report.authors,
    description: report.description,
    epoch_date_downloaded: report.epoch_date_downloaded,
    epoch_date_modified: report.epoch_date_modified,
    epoch_date_published: report.epoch_date_published,
    epoch_date_submitted: report.epoch_date_submitted,
    image_url: report.image_url,
    language: report.language,
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
    featured: config?.header?.search?.featured[report.report_number] || 0,
    flag: report.flag,
    is_incident_report: report.is_incident_report,
  };

  if (incident) {
    entry.incident_id = incident.incident_id;
    entry.incident_date = incident.date;
    entry.epoch_incident_date = getUnixTime(new Date(incident.date));
    entry.incident_title = incident.title;
    entry.incident_description = incident.description;
  }

  return entry;
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
    /**
     * @type {import('algoliasearch').SearchClient}
     * @public
     */
    this.algoliaClient = algoliaClient;
  }

  generateIndexEntries = async ({ reports, incidents, classifications }) => {
    try {
      let classificationsHash = {};

      classifications.forEach((c) => {
        classificationsHash[c.incident_id] = getClassificationArray(c);
      });

      const downloadData = [];

      for (const incident of incidents) {
        for (const report_number of incident.reports) {
          if (reports.some((r) => r.report_number == report_number)) {
            const report = reports.find((r) => r.report_number == report_number) || {};

            const entry = reportToEntry({ incident, report });

            if (classificationsHash[entry.incident_id]) {
              entry.classifications = classificationsHash[entry.incident_id];
            }

            downloadData.push(entry);
          }
        }
      }

      for (const report of reports.filter((r) => r.is_incident_report == false)) {
        const entry = reportToEntry({ report });

        downloadData.push(entry);
      }

      const truncatedData = downloadData.map(truncate);

      const smallData = truncatedData.slice(0, LIMIT);

      return smallData;
    } catch (e) {
      console.error(e);
    }
  };

  getClassifications = async () => {
    try {
      const classifications = await this.mongoClient
        .db('aiidprod')
        .collection(`classifications`)
        .find({})
        .toArray();

      return classifications;
    } catch (e) {
      console.error(e);
    }
  };

  getIncidents = async () => {
    try {
      return this.mongoClient.db('aiidprod').collection(`incidents`).find({}).toArray();
    } catch (e) {
      console.error(e);
    }
  };

  getDuplicates = async () => {
    try {
      return this.mongoClient.db('aiidprod').collection(`duplicates`).find({}).toArray();
    } catch (e) {
      console.error(e);
    }
  };

  getReports = async ({ language }) => {
    try {
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
        report_number: 1,
        source_domain: 1,
        submitters: 1,
        title: 1,
        url: 1,
        plain_text: 1,
        editor_notes: 1,
        cloudinary_id: 1,
        is_incident_report: 1,
        flag: 1,
      };

      const reports = (
        await this.mongoClient
          .db('aiidprod')
          .collection(`reports`)
          .find({}, { projection })
          .toArray()
      ).filter((report) => isCompleteReport(report));

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
    } catch (e) {
      console.error(e);
    }
  };

  uploadToAlgolia = async ({ language, entries }) => {
    try {
      const indexName = `instant_search-${language}`;

      const featuredReplicaIndexName = indexName + '-featured';

      const index = await this.algoliaClient.initIndex(indexName);

      await index.replaceAllObjects(entries);

      await index
        .setSettings({
          ...algoliaSettings,
          attributeForDistinct: 'incident_id',
          indexLanguages: [language],
          queryLanguages: [language],
          replicas: [featuredReplicaIndexName],
        })
        .then(async () => {
          const featuredReplicaIndex = await this.algoliaClient.initIndex(featuredReplicaIndexName);

          await featuredReplicaIndex.setSettings({
            ranking: ['desc(featured)', 'desc(text)'],
          });
        });
    } catch (e) {
      console.error(e);
    }
  };

  deleteDuplicates = async ({ language }) => {
    try {
      await this.mongoClient.connect();

      const indexName = `instant_search-${language}`;

      const index = await this.algoliaClient.initIndex(indexName);

      const duplicates = await this.getDuplicates();

      const filters = duplicates
        .map((d) => d.duplicate_incident_number)
        .map((id) => `incident_id = ${id}`)
        .join(' OR ');

      await index.deleteBy({ filters });

      await this.mongoClient.close();
    } catch (e) {
      console.error(e);
    }
  };

  async generateIndex({ language }) {
    try {
      await this.mongoClient.connect();

      const classifications = await this.getClassifications();

      const incidents = await this.getIncidents();

      const reports = await this.getReports({ language });

      const entries = await this.generateIndexEntries({ reports, incidents, classifications });

      await this.mongoClient.close();

      return entries;
    } catch (e) {
      console.error(e);
    }
  }

  async run() {
    try {
      for (let { code: language } of this.languages) {
        const entries = await this.generateIndex({ language });

        this.reporter.log(
          `Uploading Algolia index of [${language}] with [${entries.length}] entries`
        );

        await this.uploadToAlgolia({ entries, language });

        await this.deleteDuplicates({ language });
      }
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = AlgoliaUpdater;
