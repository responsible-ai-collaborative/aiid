const config = require('../../config');

const MongoClient = require('mongodb').MongoClient;

const { getLanguages } = require('./translateIncidents');

const client = new MongoClient(config.mongodb.translationsConnectionString);

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
  return client.db('translations').collection(`incidents-${language}`).find({}).toArray();
};

const uploadToAlgolia = async ({ language, entries }) => {
  const indexName = `instant_search-${language}`;

  const index = algoliaClient.initIndex(indexName);

  await index.saveObjects(entries);

  await index.setSettings(algoliaSettings);
};

async function uploadIndexes() {
  try {
    await client.connect();

    const classifications = await getClassifications();

    const [languages] = await getLanguages();

    for (let { code: language } of languages) {
      const incidents = await getIncidents({ language });

      const entries = generateIndexEntries({ incidents, classifications });

      await uploadToAlgolia({ entries, language });
    }
  } finally {
    await client.close();
  }
}

module.exports = {
  generateIndexEntries,
  uploadIndexes,
};
