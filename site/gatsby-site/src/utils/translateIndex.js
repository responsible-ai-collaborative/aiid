// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

const config = require('../../config');

const cloneDeep = require('lodash.clonedeep');

const translate = new Translate({ key: config.google.translateApikey });

async function getLanguages() {
  return await translate.getLanguages();
}

async function translateDiscoverIndex({ index, to }) {
  const keys = ['description', 'text', 'title'];

  let batch = [];

  const batchSize = 100;

  const translatedIndex = [];

  for (const entry of index) {
    batch.push(entry);

    if (batch.length == batchSize) {
      const texts = [];

      for (const batchEntry of batch) {
        for (const key of keys) {
          texts.push(batchEntry[key]);
        }
      }

      const [results] = await translate.translate(texts, { to });

      for (let i = 0; i < batch.length; i++) {
        const translatedEntry = cloneDeep(batch[i]);

        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];

          const result = results[i * keys.length + j];

          translatedEntry[key] = result;
        }

        translatedIndex.push(translatedEntry);
      }

      batch = [];
    }
  }

  return translatedIndex;
}

module.exports = {
  getLanguages,
  translateDiscoverIndex,
};
