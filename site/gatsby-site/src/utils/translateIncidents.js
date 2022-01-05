const MongoClient = require('mongodb').MongoClient;

const lodash = require('lodash');

const { queue } = require('async');

const config = require('../../config');

const { getLanguages } = require('../components/i18n/languages');

const cloneDeep = require('lodash.clonedeep');

const { translate } = require('./translate');

const keys = ['text', 'title'];

const client = config.mongodb.translationsConnectionString
  ? new MongoClient(config.mongodb.translationsConnectionString)
  : null;

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

  const incidents = client.db('translations').collection(`incident_reports_${language}`);

  const query = {
    report_number: { $in: originalIds },
    $and: keys.map((key) => ({ [key]: { $exists: true } })),
  };

  const translated = await incidents.find(query, { projection: { report_number: 1 } }).toArray();

  return translated;
}

async function saveIncidents({ items, language }) {
  const incidents = client.db('translations').collection(`incident_reports_${language}`);

  const fields = [...keys, 'report_number'];

  const translated = items.map((item) => lodash.pick(item, fields));

  return incidents.insertMany(translated);
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

async function run({ reporter }) {
  try {
    await client.connect();

    const incidents = await client.db('aiidprod').collection(`incidents`).find({}).toArray();

    const concurrency = 10;

    const q = queue(async ({ to }, done) => {
      reporter.log(`Translating incident reports for [${to}]`);

      const translated = await translateIncidentCollection({ items: incidents, to });

      if (translated.length > 0) {
        reporter.log(`Translated [${translated.length}] new reports to [${to}]`);

        const result = await saveIncidents({ items: translated, language: to });

        reporter.log(`Stored [${result.insertedCount}] new reports to [${to}]`);
      } else {
        reporter.log(`No new incident reports neeed translation to [${to}]`);
      }

      done();
    }, concurrency);

    for (let { code: to } of getLanguages()) {
      q.push({ to });
    }

    if (q.length() > 0) {
      await q.drain();
    }
  } finally {
    await client.close();
  }
}

module.exports = {
  run,
};
