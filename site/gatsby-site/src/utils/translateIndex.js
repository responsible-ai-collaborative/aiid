const { Translate } = require('@google-cloud/translate').v2;

const { queue } = require('async');

const config = require('../../config');

const cloneDeep = require('lodash.clonedeep');

const translateClient = new Translate({ key: config.google.translateApikey });

async function getLanguages() {
  return await translateClient.getLanguages();
}

const getBytes = (string) => Buffer.byteLength(string, 'utf8');

const keys = ['description', 'text', 'title'];

async function translateDiscoverIndex({ index, to }) {
  const concurrency = 100;

  const translatedIndex = [];

  const q = queue(async ({ entry, to }, done) => {
    const translatedEntry = await translateIndexEntry({ entry, to });

    translatedIndex.push(translatedEntry);

    done();
  }, concurrency);

  for (const entry of index) {
    q.push({ entry, to });
  }

  await q.drain();

  return translatedIndex;
}

async function translateIndexEntry({ entry, to }) {
  const translatedEntry = cloneDeep(entry);

  const payload = [];

  let payloadSize = 0;

  for (const key of keys) {
    const text = entry[key];

    payloadSize += getBytes(text);
    payload.push(text);
  }

  console.log('Sending translate request:', payloadSize);

  const [results] = await translate({ payload, to });

  for (let i = 0; i < results.length; i++) {
    const result = results[i];

    const key = keys[i];

    translatedEntry[key] = result;
  }

  return translatedEntry;
}

async function translate({ payload, to, mock = true }) {
  if (mock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([payload.map((result) => `translated-${to}-${result}`)]);
      }, 1000);
    });
  } else {
    return translateClient.translate(payload, { to });
  }
}

module.exports = {
  getLanguages,
  translateDiscoverIndex,
};
