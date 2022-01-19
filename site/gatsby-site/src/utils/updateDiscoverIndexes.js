const config = require('../../config');

const { getLanguages } = require('../components/i18n/languages');

const MongoClient = require('mongodb').MongoClient;

const client = config.mongodb.translationsConnectionString
  ? new MongoClient(config.mongodb.translationsConnectionString)
  : null;

const algoliasearch = require('algoliasearch');

const algoliaClient = algoliasearch(
  config.header.search.algoliaAppId,
  config.header.search.algoliaAdminKey
);

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

function generateIndexEntries({ incidents, classifications }) {
  let classificationsHash = {};

  classifications.map((c) => {
    classificationsHash[c.incident_id] = getClassificationArray(c.classifications, c.namespace);
  });

  const downloadData = [];

  incidents.map((i) => {
    const finalDataNode = {
      objectID: i._id.toString(),
      ...i,
    };

    if (classificationsHash[i.incident_id]) {
      finalDataNode.classifications = classificationsHash[i.incident_id];
    }

    downloadData.push(finalDataNode);
  });

  const truncatedData = downloadData.map(truncate);

  return truncatedData;
}

const getClassifications = async () => {
  return client
    .db('aiidprod')
    .collection(`classifications`)
    .find({ namespace: 'CSET', 'classifications.Publish': true })
    .toArray();
};

const getIncidents = async ({ language }) => {
  const reports = await client.db('aiidprod').collection(`incidents`).find({}).toArray();

  const translations = await client
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

const uploadToAlgolia = async ({ language, entries }) => {
  const indexName = `instant_search-${language}`;

  const index = algoliaClient.initIndex(indexName);

  await index.saveObjects(entries);

  await index.setSettings({
    ...algoliaSettings,
    indexLanguages: [language],
    queryLanguages: [language],
  });
};

async function run({ reporter }) {
  try {
    await client.connect();

    const classifications = await getClassifications();

    for (let { code: language } of getLanguages()) {
      const incidents = await getIncidents({ language });

      const entries = generateIndexEntries({ incidents, classifications });

      reporter.log(`Uploading Algolia index of [${language}] with [${entries.length}] entries`);
      await uploadToAlgolia({ entries, language });
    }
  } finally {
    await client.close();
  }
}

module.exports = {
  run,
};
