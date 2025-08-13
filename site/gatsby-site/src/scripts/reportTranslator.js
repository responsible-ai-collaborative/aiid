const { queue } = require('async');

const { cloneDeep } = require('lodash');

const remark = require('remark');

const remarkStrip = require('strip-markdown');

const keys = ['text', 'title'];

/**
 * @typedef {Object} Reporter
 * @property {function(string):void} log
 * @property {function(string):void} error
 * @property {function(string):void} warn
 */

class ReportTranslator {
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

  async translateReportsCollection({ items, to }) {
    const concurrency = 100;

    const translated = [];

    const q = queue(async ({ entry, to }) => {
      const translatedEntry = await this.translateReport({ entry, to });

      translated.push(translatedEntry);
    }, concurrency);

    q.error((err, task) => {
      this.reporter.error(
        `Error translating report ${task.entry.report_number}, ${err.code} ${err.message}`
      );
      throw new Error(
        `Translation process failed for report ${task.entry.report_number}. Error: ${err.code} - ${err.message}`
      );
    });

    const alreadyTranslated = await this.getTranslatedReports({ items, language: to });

    for (const entry of items) {
      const alreadyTranslatedEntry = alreadyTranslated.find(
        (item) => item.report_number == entry.report_number
      );

      // If the report is not already translated, translate it
      if (!alreadyTranslatedEntry) {
        q.push({ entry, to });
      }
      // If the report is already translated but is dirty, translate it again
      else if (alreadyTranslatedEntry.dirty) {
        q.push({ entry: { ...entry, dirty: alreadyTranslatedEntry.dirty }, to });
      }
    }

    if (q.length() > 0) {
      await q.drain();
    }

    return translated;
  }

  async getTranslatedReports({ items, language }) {
    const originalIds = items.map((item) => item.report_number);

    const reportsTranslatedCollection = this.mongoClient.db('translations').collection('reports');

    const query = {
      report_number: { $in: originalIds },
      $and: [{ language: language }].concat(
        [...keys, 'plain_text'].map((key) => ({ [key]: { $exists: true } }))
      ),
    };

    const translated = await reportsTranslatedCollection
      .find(query, { projection: { report_number: 1, dirty: 1 } })
      .toArray();

    return translated;
  }

  async saveTranslatedReports({ items, language }) {
    const reportsTranslationsCollection = this.mongoClient.db('translations').collection('reports');

    const translated = [];

    for (const item of items) {
      const { report_number, text, title, dirty } = item;

      const plain_text = (await remark().use(remarkStrip).process(text)).contents.toString();

      translated.push({ report_number, text, title, plain_text, dirty });
    }

    // Insert the translated reports into the reports collection with the language field
    const reportsTranslated = translated.map((t) => ({ ...t, language, created_at: new Date() }));

    const reportsTranslatedToUpdate = reportsTranslated.filter(
      (t) => t.dirty && t.text !== '' && t.title !== ''
    );

    for (const report of reportsTranslatedToUpdate) {
      await reportsTranslationsCollection.updateOne(
        { report_number: report.report_number },
        { $set: { ...report, dirty: false } }
      );
    }

    const reportsTranslatedToInsert = reportsTranslated.filter(
      (t) => !t.dirty && t.text !== '' && t.title !== ''
    );

    if (reportsTranslatedToInsert.length > 0) {
      await reportsTranslationsCollection.insertMany(reportsTranslatedToInsert);
    }

    return { insertedCount: reportsTranslatedToInsert.length + reportsTranslatedToUpdate.length };
  }

  async translateReport({ entry, to }) {
    const translatedEntry = cloneDeep(entry);

    const payload = [];

    for (const key of keys) {
      const text = entry[key];

      payload.push(text);
    }

    const [results] = await this.translate({ payload, to });

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      // Check if the translation is empty. The translation API sometimes returns empty strings with a 200 status code.
      if (result === '') {
        this.reporter.error(
          `Error translating report ${entry.report_number}, ${keys[i]} field is empty`
        );
      }

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

    let reportsQuery = {};

    if (this.submissionDateStart) {
      // Check if the date is valid
      if (isNaN(Date.parse(this.submissionDateStart))) {
        const errorMessage = `Translation process error: Invalid date format for TRANSLATE_SUBMISSION_DATE_START env variable: [${this.submissionDateStart}]`;

        this.reporter.error(errorMessage);
        throw new Error(errorMessage);
      }

      this.reporter.log(
        `Translating incident reports submitted after [${this.submissionDateStart}]`
      );
      reportsQuery = { date_submitted: { $gte: new Date(this.submissionDateStart) } };
    } else {
      this.reporter.log(
        `Translating all incident reports. (TRANSLATE_SUBMISSION_DATE_START env variable is not defined)`
      );
    }

    const reports = await this.mongoClient
      .db('aiidprod')
      .collection(`reports`)
      .find(reportsQuery)
      .toArray();

    this.reporter.log(`Processing translation of ${reports.length} incident reports`);

    const concurrency = 10;

    const q = queue(async ({ to }, done) => {
      this.reporter.log(`Translating incident reports for [${to}]`);

      const items = reports.filter((r) => r.language !== to);

      let translated = await this.translateReportsCollection({ items, to });

      // filter translated reports that are empty
      translated = translated.filter((t) => t.text !== '' && t.title !== '');

      if (translated.length > 0) {
        this.reporter.log(`Translated [${translated.length}] new reports to [${to}]`);

        const result = await this.saveTranslatedReports({ items: translated, language: to });

        this.reporter.log(`Stored [${result.insertedCount}] new reports to [${to}]`);
      } else {
        this.reporter.log(`No new incident reports needed translation to [${to}]`);
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

module.exports = ReportTranslator;
