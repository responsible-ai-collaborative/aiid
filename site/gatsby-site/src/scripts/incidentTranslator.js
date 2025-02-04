const { queue } = require('async');

const { cloneDeep } = require('lodash');

const keys = ['title', 'description'];

/**
 * @typedef {Object} Reporter
 * @property {function(string):void} log
 * @property {function(string):void} error
 * @property {function(string):void} warn
 */

class IncidentTranslator {
  /**
   * @param {Object} options
   * @param {import('mongodb').MongoClient} options.mongoClient
   * @param {Object} options.translateClient
   * @param {string[]} options.languages
   * @param {Reporter} options.reporter
   * @param {string} [options.submissionDateStart]
   * @param {boolean} [options.dryRun]
   */
  constructor({
    mongoClient,
    translateClient,
    languages,
    reporter,
    submissionDateStart = process.env.TRANSLATE_SUBMISSION_DATE_START,
    dryRun = process.env.TRANSLATE_DRY_RUN !== 'false',
  }) {
    this.translateClient = translateClient;
    this.mongoClient = mongoClient;
    this.reporter = reporter;
    this.languages = languages;
    this.submissionDateStart = submissionDateStart;
    this.dryRun = dryRun;
  }

  async translate({ payload, to }) {
    if (!this.dryRun) {
      return this.translateClient.translate(payload, { to });
    } else {
      return [payload.map((p) => `translated-${to}-${p}`)];
    }
  }

  async translateIncidentsCollection({ items, to }) {
    const concurrency = 100;

    const translated = [];

    const q = queue(async ({ entry, to }) => {
      const translatedEntry = await this.translateIncident({ entry, to });

      translated.push(translatedEntry);
    }, concurrency);

    q.error((err, task) => {
      this.reporter.error(
        `Error translating incident ${task.entry.incident_id}, ${err.code} ${err.message}`
      );
      throw new Error(
        `Translation process failed for incident ${task.entry.incident_id}. Error: ${err.code} - ${err.message}`
      );
    });

    const alreadyTranslated = await this.getTranslatedIncidents({ items, language: to });

    for (const entry of items) {
      if (!alreadyTranslated.find((item) => item.incident_id == entry.incident_id)) {
        q.push({ entry, to });
      }
    }

    if (q.length() > 0) {
      await q.drain();
    }

    return translated;
  }

  async getTranslatedIncidents({ items, language }) {
    const originalIds = items.map((item) => item.incident_id);

    const incidentsTranslatedCollection = this.mongoClient
      .db('translations')
      .collection('incidents');

    const query = {
      incident_id: { $in: originalIds },
      $and: [{ language: language }].concat(keys.map((key) => ({ [key]: { $exists: true } }))),
    };

    const translated = await incidentsTranslatedCollection
      .find(query, { projection: { incident_id: 1 } })
      .toArray();

    return translated;
  }

  async saveTranslatedIncidents({ items, language }) {
    const incidentsTranslationsCollection = this.mongoClient
      .db('translations')
      .collection('incidents');

    // Insert the translated incident into the incidents collection with the language field
    const incidentsTranslated = items.map((t) => {
      const translated = {
        incident_id: t.incident_id,
        language,
      };

      for (const key of keys) {
        translated[key] = t[key];
      }

      return translated;
    });

    return incidentsTranslationsCollection.insertMany(incidentsTranslated);
  }

  async translateIncident({ entry, to }) {
    const translatedEntry = cloneDeep(entry);

    const payload = [];

    for (const key of keys) {
      const text = entry[key];

      payload.push(text);
    }

    const [results] = await this.translate({ payload, to });

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      const key = keys[i];

      translatedEntry[key] = result;
    }

    return translatedEntry;
  }

  async run() {
    if (this.dryRun) {
      this.reporter.warn(
        'Please set `TRANSLATE_DRY_RUN=false` to disable dry running of translation process.'
      );
    }

    await this.mongoClient.connect();

    let incidentsQuery = {};

    if (this.submissionDateStart) {
      // Check if the date is valid
      if (isNaN(Date.parse(this.submissionDateStart))) {
        const errorMessage = `Translation process error: Invalid date format for TRANSLATE_SUBMISSION_DATE_START env variable: [${this.submissionDateStart}]`;

        this.reporter.error(errorMessage);
        throw new Error(errorMessage);
      }

      this.reporter.log(`Translating incidents created after [${this.submissionDateStart}]`);
      incidentsQuery = { created_at: { $gte: new Date(this.submissionDateStart) } };
    } else {
      this.reporter.log(
        `Translating all incidents. (TRANSLATE_SUBMISSION_DATE_START env variable is not defined)`
      );
    }

    const incidents = await this.mongoClient
      .db('aiidprod')
      .collection(`incidents`)
      .find(incidentsQuery)
      .toArray();

    this.reporter.log(`Processing translation of ${incidents.length} incidents`);

    const concurrency = 10;

    const q = queue(async ({ to }, done) => {
      this.reporter.log(`Translating incidents for [${to}]`);

      const items = incidents.filter((r) => r.language !== to);

      const translated = await this.translateIncidentsCollection({ items, to });

      if (translated.length > 0) {
        this.reporter.log(`Translated [${translated.length}] new incidents to [${to}]`);

        const result = await this.saveTranslatedIncidents({ items: translated, language: to });

        this.reporter.log(`Stored [${result.insertedCount}] new incidents to [${to}]`);
      } else {
        this.reporter.log(`No new incidents needed translation to [${to}]`);
      }

      done();
    }, concurrency);

    for (const { code: to } of this.languages) {
      q.push({ to });
    }

    if (q.length() > 0) {
      await q.drain();
    }
    await this.mongoClient.close();
  }
}

module.exports = IncidentTranslator;
