const MongoClient = require('mongodb').MongoClient;

const { Translate } = require('@google-cloud/translate').v2;

const { queue } = require('async');

const config = require('../../config');

const cloneDeep = require('lodash.clonedeep');

const keys = ['description', 'text', 'title'];

const client = new MongoClient(config.mongodb.translationsConnectionString);

async function getLanguages() {
  return await translateClient.getLanguages();
}

async function translateIncidents() {
  try {
    await client.connect();

    const database = client.db('aiidprod');

    const collection = database.collection(`incidents`);

    const incidents = await collection.find({}).toArray();

    const [languages] = await getLanguages();

    const concurrency = 10;

    const q = queue(async ({ to }, done) => {
      const translated = await translateIncidentCollection({ items: incidents, to });

      if (translated.length > 0) {
        await saveIncidents({ items: translated, language: to });
      }

      done();
    }, concurrency);

    for (let { code: to } of languages) {
      q.push({ to });
    }

    if (q.length() > 0) {
      await q.drain();
    }
  } finally {
    await client.close();
  }
}

async function translateIncidentCollection({ items, to }) {
  const concurrency = 100;

  const translated = [];

  const q = queue(async ({ entry, to }, done) => {
    const translatedEntry = await translateIncident({ entry, to });

    translated.push(translatedEntry);

    done();
  }, concurrency);

  const alreadyTranslated = await getTranslatedIncidents({ items, language: to });

  for (const entry of items) {
    if (!alreadyTranslated.find((item) => item.report_number == entry.report_number)) {
      q.push({ entry, to });
    }
  }

  if (q.length() > 0) {
    await q.drain();
  }

  return translated;
}

async function getTranslatedIncidents({ items, language }) {
  const originalIds = items.map((item) => item.report_number);

  const incidents = client.db('translations').collection(`incidents-${language}`);

  const query = {
    report_number: { $in: originalIds },
    $and: keys.map((key) => ({ [key]: { $exists: true } })),
  };

  const translated = await incidents.find(query, { projection: { report_number: 1 } }).toArray();

  return translated;
}

async function saveIncidents({ items, language }) {
  const incidents = client.db('translations').collection(`incidents-${language}`);

  const result = await incidents.insertMany(items);

  console.log(`${result.insertedCount} documents were inserted`);
}

const translateClient = new Translate({ key: config.google.translateApikey });

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

async function translateIncident({ entry, to }) {
  const translatedEntry = cloneDeep(entry);

  const payload = [];

  for (const key of keys) {
    const text = entry[key];

    payload.push(text);
  }

  const [results] = await translate({ payload, to });

  for (let i = 0; i < results.length; i++) {
    const result = results[i];

    const key = keys[i];

    translatedEntry[key] = result;
  }

  return translatedEntry;
}

module.exports = {
  getLanguages,
  translateIncidents,
};
