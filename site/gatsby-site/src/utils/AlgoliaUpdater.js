const algoliaSettings = require('./algoliaSettings');

const { getUnixTime } = require('date-fns');

const config = require('../../config');

const { isCompleteReport } = require('./variants');

const { merge } = require('lodash');

const MAX_ENTRY_SIZE = 10000;

const MAX_STRING_LENGTH = 8000;

// Fields that should never be truncated
const TRUNCATION_BLACKLIST = [
  'report_number',
  'incident_id',
  'mongodb_id',
  'objectID',
  'url',
  'image_url',
  'cloudinary_id',
  'date',
  'incident_date',
  'epoch_date_modified',
  'epoch_date_published',
  'epoch_date_submitted',
  'epoch_incident_date',
  'language',
  'source_domain',
  'namespace',
];

const calculateEntrySize = (entry) => {
  return Buffer.from(JSON.stringify(entry)).length;
};

const regularTruncate = (doc) => {
  for (const [key, value] of Object.entries(doc)) {
    if (typeof value == 'string' && value.length > MAX_STRING_LENGTH) {
      doc[key] = value.substring(0, MAX_STRING_LENGTH);
    }
  }
  return doc;
};

const findAllStrings = (obj, strings = []) => {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Only include strings that aren't in the blacklist
      if (!TRUNCATION_BLACKLIST.includes(key)) {
        strings.push({ key, length: value.length, ref: obj });
      }
    } else if (typeof value === 'object' && value !== null) {
      findAllStrings(value, strings);
    }
  }
  return strings;
};

const subsetTruncate = (doc) => {
  let size = calculateEntrySize(doc);

  if (size <= MAX_ENTRY_SIZE) return doc;

  // Debug size composition
  const initialStrings = findAllStrings(doc);

  const totalStringLength = initialStrings.reduce((sum, field) => sum + field.length, 0);

  console.warn(
    `[Warning] Large record detected ${doc.report_number} (${size} bytes, ${initialStrings.length} strings, total length: ${totalStringLength})`
  );

  // Log top 5 largest strings
  const topStrings = [...initialStrings].sort((a, b) => b.length - a.length).slice(0, 5);

  console.log('Largest strings:');
  topStrings.forEach((s) => console.log(`${s.key}: ${s.length} chars`));

  let iteration = 0;

  const maxIterations = 10;

  while (size > MAX_ENTRY_SIZE && iteration < maxIterations) {
    iteration++;

    // Find all string fields in the entire object tree
    const stringFields = findAllStrings(doc);

    // Sort by length, longest first
    stringFields.sort((a, b) => b.length - a.length);

    if (stringFields.length === 0) break;

    const reductionFactor = Math.max(0.1, (MAX_ENTRY_SIZE / size) * 0.8); // Try to get to 80% of target

    // Reduce each string field
    for (const field of stringFields) {
      const currentLength = field.ref[field.key].length;

      const newLength = Math.max(Math.floor(currentLength * reductionFactor), 5);

      field.ref[field.key] = field.ref[field.key].substring(0, newLength);
    }

    size = calculateEntrySize(doc);
    console.log(
      `Iteration ${iteration}: reduced to ${size} bytes (target: ${MAX_ENTRY_SIZE}), reduction factor: ${reductionFactor.toFixed(
        2
      )}`
    );
  }

  // If still too big, do one final aggressive pass
  if (size > MAX_ENTRY_SIZE) {
    console.warn(`[Warning] Final aggressive reduction for record ${doc.report_number}`);
    const stringFields = findAllStrings(doc);

    const finalReductionFactor = (MAX_ENTRY_SIZE / size) * 0.5; // Even more aggressive

    for (const field of stringFields) {
      const newLength = Math.max(Math.floor(field.ref[field.key].length * finalReductionFactor), 3);

      field.ref[field.key] = field.ref[field.key].substring(0, newLength);
    }

    size = calculateEntrySize(doc);
  }

  if (size > MAX_ENTRY_SIZE) {
    // Log final state for debugging
    const finalStrings = findAllStrings(doc);

    const finalTotalLength = finalStrings.reduce((sum, field) => sum + field.length, 0);

    console.warn(
      `[Warning] Record ${doc.report_number} is still ${size} bytes after maximum reduction (${finalStrings.length} strings, total length: ${finalTotalLength})`
    );
  }

  return doc;
};

const truncate = (doc) => {
  return process.env.ALGOLIA_SUBSET ? subsetTruncate(doc) : regularTruncate(doc);
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

/**
 *
 * @returns classifications in both tree and list format:
 *
 * {
 *  tree: {
 *    CSETv0: {
 *      'Sector of Deployment': 'Defense',
 *      'Problem Nature': 'Cybersecurity',
 *    }
 *  },
 *  list: ['CSETv0:Sector of Deployment:Defense', 'CSETv0:Sector of Deployment:Healthcare'],
 * }
 */

const getClassificationObject = ({ classification, taxonomy }) => {
  const attributes = {};

  const list = [];

  if (classification.attributes) {
    for (const attribute of classification.attributes) {
      const field = taxonomy?.field_list.find((field) => field.short_name == attribute.short_name);

      if (
        attribute.value_json &&
        attribute.value_json.length > 0 &&
        field?.display_type != 'long_string' &&
        !field?.hide_search &&
        (classification.namespace != 'CSETv0' ||
          includedCSETAttributes.includes(attribute.short_name))
      ) {
        const value = JSON.parse(attribute.value_json);

        attributes[attribute.short_name] = value;

        const values = Array.isArray(value) ? value : [value];

        for (const v of values) {
          if (v != '' && typeof v != 'object') {
            list.push(`${classification.namespace}:${attribute.short_name}:${v}`);
          }
        }
      }
    }
  }

  return { tree: { [classification.namespace]: attributes }, list };
};

const reportToEntry = ({ incident = null, report, classifications = [{ list: [], tree: [] }] }) => {
  let featuredValue = 0;

  if (config?.header?.search?.featured) {
    const reportIndex = config?.header?.search?.featured.findIndex(
      (f) => f[report.report_number.toString()]
    );

    if (reportIndex > -1) {
      featuredValue = Object.values(
        config?.header?.search?.featured.find((f) => f[report.report_number.toString()])
      )[0];
    }
  }

  const entry = {
    authors: report.authors,
    description: report.description,
    date_downloaded: report.date_downloaded,
    epoch_date_modified: report.epoch_date_modified,
    epoch_date_published: report.epoch_date_published,
    epoch_date_submitted: report.epoch_date_submitted,
    image_url: report.image_url,
    language: report.language,
    report_number: report.report_number,
    source_domain: report.source_domain,
    submitters: report.submitters,
    title: report.title,
    name: report.title,
    url: report.url,
    tags: report.tags,
    editor_notes: report.editor_notes,
    cloudinary_id: report.cloudinary_id,
    text: report.plain_text,
    mongodb_id: report._id.toString(),
    objectID: report.report_number.toString(),
    featured: featuredValue,
    flag: report.flag,
    is_incident_report: report.is_incident_report,
    is_translated: report.is_translated,
    namespaces: classifications.map((c) => {
      return Object.keys(c.tree)[0];
    }),
    classifications: classifications.map((c) => c.list).flat(),
  };

  for (const classification of classifications) {
    merge(entry, classification.tree);
  }

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
    if (process.env.ALGOLIA_SUBSET) {
      console.log('Running in Algolia subset mode - entries will be truncated to fit size limits');
    }

    const downloadData = [];

    for (const incident of incidents) {
      const incidentClassifications = classifications
        .filter((c) => c.incidents.includes(incident.incident_id))
        .map((classification) =>
          getClassificationObject({
            classification,
            taxonomy: taxa.find((t) => t.namespace == classification.namespace),
          })
        );

      for (const report_number of incident.reports) {
        if (reports.some((r) => r.report_number == report_number)) {
          const report = reports.find((r) => r.report_number == report_number) || {};

          const reportClassifications = classifications
            .filter((c) => c.reports.includes(report.report_number))
            .map((classification) =>
              getClassificationObject({
                classification,
                taxonomy: taxa.find((t) => t.namespace == classification.namespace),
              })
            );

          const entry = reportToEntry({
            incident,
            report,
            classifications: [...incidentClassifications, ...reportClassifications],
          });

          downloadData.push(entry);
        }
      }
    }

    for (const report of reports.filter((r) => r.is_incident_report == false)) {
      const entry = reportToEntry({ report });

      downloadData.push(entry);
    }

    const truncatedData = downloadData.map(truncate);

    return truncatedData;
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
      tags: 1,
    };

    const reports = (
      await this.mongoClient.db('aiidprod').collection(`reports`).find({}, { projection }).toArray()
    ).filter((report) => isCompleteReport(report));

    const translations = await this.mongoClient
      .db('translations')
      .collection('reports')
      .find({ language })
      .toArray();

    const fullReports = reports.map((r) => {
      // by default, use the report as is
      let report = {
        ...r,
        is_translated: false,
      };

      // If the report has a translation, use it
      if (translations.some((t) => t.report_number === r.report_number)) {
        const { title, plain_text } =
          translations.find((t) => t.report_number === r.report_number) || {};

        report = {
          ...r,
          title,
          plain_text,
          is_translated: true,
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

    try {
      await index.setSettings(
        {
          ...algoliaSettings,
          attributesForFaceting: [
            ...algoliaSettings.attributesForFaceting,
            ...config.discover.taxa,
          ],
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
        },
        {
          forwardToReplicas: true,
        }
      );

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
    } catch (e) {
      throw 'Error updating Algolia settings ' + e.message;
    }
  };

  deleteDuplicates = async ({ language }) => {
    const indexName = `instant_search-${language}`;

    const index = await this.algoliaClient.initIndex(indexName);

    const duplicates = await this.getDuplicates();

    if (duplicates.length > 0) {
      const filters = duplicates
        .map((d) => d.duplicate_incident_number)
        .map((id) => `incident_id = ${id}`)
        .join(' OR ');

      await index.deleteBy({ filters });
    }
  };

  async generateIndex({ language }) {
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

    return entries;
  }

  async run() {
    await this.mongoClient.connect();

    for (let { code: language } of this.languages) {
      const entries = await this.generateIndex({ language });

      this.reporter.log(
        `Uploading Algolia index of [${language}] with [${entries.length}] entries`
      );

      await this.uploadToAlgolia({ entries, language });

      await this.deleteDuplicates({ language });
    }

    await this.mongoClient.close();
  }
}

module.exports = AlgoliaUpdater;
