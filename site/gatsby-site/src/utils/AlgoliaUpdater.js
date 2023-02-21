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

const getClassificationArray = ({ classification, taxonomy }) => {
  const result = [];

  if (classification.attributes) {
    for (const attribute of classification.attributes) {
      const field = taxonomy?.field_list.find((field) => field.short_name == attribute.short_name);

      if (
        attribute.value_json &&
        attribute.value_json.length > 0 &&
        field?.display_type != 'long_string' &&
        (classification.namespace != 'CSET' ||
          includedCSETAttributes.includes(attribute.short_name))
      ) {
        const value = JSON.parse(attribute.value_json);

        const values = Array.isArray(value) ? value : [value];

        for (const v of values) {
          if (v == '' || typeof v === 'object') continue;
          result.push(`${classification.namespace}:${attribute.short_name}:${v}`);
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

  generateIndexEntries = async ({ reports, incidents, classifications, taxa }) => {
    let classificationsHash = {};

    classifications.forEach((classification) => {
      const taxonomy = taxa.find((t) => t.namespace == classification.namespace);

      classificationsHash[classification.incident_id] ||= [];
      classificationsHash[classification.incident_id] = classificationsHash[
        classification.incident_id
      ].concat(getClassificationArray({ classification, taxonomy }));
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
  };

  getClassifications = async () => {
    const classifications = await this.mongoClient
      .db('aiidprod')
      .collection(`classifications`)
      .find({ publish: true })
      .toArray();

    return classifications;
  };

  getTaxa = async () => {
    let taxa = [];

    const aiidprod = await this.mongoClient.db('aiidprod');

    const taxaCollection = await aiidprod.collection(`taxa`);

    if (taxaCollection) {
      const foundItems = await taxaCollection.find({});

      if (foundItems) taxa = await foundItems.toArray();
    }
    return taxa;
  };

  getIncidents = async () => {
    return this.mongoClient.db('aiidprod').collection(`incidents`).find({}).toArray();
  };

  getDuplicates = async () => {
    return this.mongoClient.db('aiidprod').collection(`duplicates`).find({}).toArray();
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
      await this.mongoClient.db('aiidprod').collection(`reports`).find({}, { projection }).toArray()
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
  };

  uploadToAlgolia = async ({ language, entries }) => {
    const indexName = `instant_search-${language}`;

    const featuredReplicaIndexName = indexName + '-featured';

    const incidentDateDescReplicaIndexName = indexName + '_epoch_incident_date_desc';

    const incidentDateAscReplicaIndexName = indexName + '_epoch_incident_date_asc';

    const datePublishedDescReplicaIndexName = indexName + '_epoch_date_published_desc';

    const datePublishedAscReplicaIndexName = indexName + '_epoch_date_published_asc';

    const dateSubmittedDescReplicaIndexName = indexName + '_epoch_date_submitted_desc';

    const dateSubmittedAscReplicaIndexName = indexName + '_epoch_date_submitted_asc';

    const index = await this.algoliaClient.initIndex(indexName);

    await index.replaceAllObjects(entries);

    await index
      .setSettings({
        ...algoliaSettings,
        attributeForDistinct: 'incident_id',
        indexLanguages: [language],
        queryLanguages: [language],
        replicas: [
          featuredReplicaIndexName,
          incidentDateDescReplicaIndexName,
          incidentDateAscReplicaIndexName,
          datePublishedDescReplicaIndexName,
          datePublishedAscReplicaIndexName,
          dateSubmittedDescReplicaIndexName,
          dateSubmittedAscReplicaIndexName,
        ],
      })
      .then(async () => {
        const featuredReplicaIndex = await this.algoliaClient.initIndex(featuredReplicaIndexName);

        await featuredReplicaIndex.setSettings({
          ranking: ['desc(featured)', 'desc(text)'],
        });

        const incidentDateDescReplicaIndex = await this.algoliaClient.initIndex(
          incidentDateDescReplicaIndexName
        );

        await incidentDateDescReplicaIndex.setSettings({
          ranking: ['desc(epoch_incident_date)'],
        });

        const incidentDateAscReplicaIndex = await this.algoliaClient.initIndex(
          incidentDateAscReplicaIndexName
        );

        await incidentDateAscReplicaIndex.setSettings({
          ranking: ['asc(epoch_incident_date)'],
        });

        const datePublishedDescReplicaIndex = await this.algoliaClient.initIndex(
          datePublishedDescReplicaIndexName
        );

        await datePublishedDescReplicaIndex.setSettings({
          ranking: ['desc(epoch_date_published)'],
        });

        const datePublishedAscReplicaIndex = await this.algoliaClient.initIndex(
          datePublishedAscReplicaIndexName
        );

        await datePublishedAscReplicaIndex.setSettings({
          ranking: ['asc(epoch_date_published)'],
        });

        const dateSubmittedDescReplicaIndex = await this.algoliaClient.initIndex(
          dateSubmittedDescReplicaIndexName
        );

        await dateSubmittedDescReplicaIndex.setSettings({
          ranking: ['desc(epoch_date_submitted)'],
        });

        const dateSubmittedAscReplicaIndex = await this.algoliaClient.initIndex(
          dateSubmittedAscReplicaIndexName
        );

        await dateSubmittedAscReplicaIndex.setSettings({
          ranking: ['asc(epoch_date_submitted)'],
        });
      });
  };

  deleteDuplicates = async ({ language }) => {
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
  };

  async generateIndex({ language }) {
    await this.mongoClient.connect();

    const classifications = await this.getClassifications();

    const taxa = await this.getTaxa();

    const incidents = await this.getIncidents();

    const reports = await this.getReports({ language });

    const entries = await this.generateIndexEntries({
      reports,
      incidents,
      classifications,
      taxa,
    });

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

      await this.deleteDuplicates({ language });
    }
  }
}

module.exports = AlgoliaUpdater;
