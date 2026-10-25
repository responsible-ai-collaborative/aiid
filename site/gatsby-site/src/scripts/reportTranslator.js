const { queue } = require('async');

const { cloneDeep } = require('lodash');

const remark = require('remark');

const remarkStrip = require('strip-markdown');

const { parseMaxCharsPerRun, describeChars } = require('./translationBudget');

const keys = ['text', 'title'];

const countChars = (entry) => keys.reduce((total, key) => total + (entry[key] || '').length, 0);

/**
 * @typedef {Object} Reporter
 * @property {function(string):void} log
 * @property {function(string):void} error
 * @property {function(string):void} warn
 */

/**
 * Translates the reports in `aiidprod.reports` into every configured language and stores the
 * results in `translations.reports`, one document per (report_number, language).
 *
 * A report is sent to Google Translate when it has no stored translation for a language, or
 * when its stored translation is flagged `dirty` because the report's text or title changed.
 * Every stored translation is written with an upsert keyed on (report_number, language), so a
 * re-translation always replaces the right document and clears its `dirty` flag, and a run
 * saves each translation as soon as it arrives rather than after a whole language finishes.
 */
class ReportTranslator {
  /**
   * @param {Object} options
   * @param {import('mongodb').MongoClient} options.mongoClient
   * @param {Object} options.translateClient
   * @param {{code: string}[]} options.languages
   * @param {Reporter} options.reporter
   * @param {string} [options.submissionDateStart]
   * @param {boolean} [options.dryRun]
   * @param {string|number} [options.maxCharsPerRun] Characters above which a run refuses to start
   */
  constructor({
    mongoClient,
    translateClient,
    languages,
    reporter,
    submissionDateStart = process.env.TRANSLATE_SUBMISSION_DATE_START,
    dryRun = process.env.TRANSLATE_DRY_RUN !== 'false',
    maxCharsPerRun = process.env.TRANSLATE_MAX_CHARS_PER_RUN,
  }) {
    this.translateClient = translateClient;
    this.mongoClient = mongoClient;
    this.reporter = reporter;
    this.languages = languages;
    this.submissionDateStart = submissionDateStart;
    this.dryRun = dryRun;
    this.maxCharsPerRun = parseMaxCharsPerRun(maxCharsPerRun);
    this.charsSent = 0;
    this.failures = [];
  }

  async translate({ payload, to }) {
    if (!this.dryRun) {
      this.charsSent += payload.reduce((total, text) => total + text.length, 0);

      return this.translateClient.translate(payload, { to });
    } else {
      return [payload.map((p) => `translated-${to}-${p}`)];
    }
  }

  /**
   * Works out which of `items` have to be sent to Google Translate for language `to`: reports
   * with no complete stored translation, and reports whose stored translation is dirty.
   * Nothing is sent from here, so a run can add up its cost before it starts.
   */
  async getReportsToTranslate({ items, to }) {
    const reportsTranslatedCollection = this.mongoClient.db('translations').collection('reports');

    const query = {
      report_number: { $in: items.map((item) => item.report_number) },
      $and: [{ language: to }].concat(
        [...keys, 'plain_text'].map((key) => ({ [key]: { $exists: true } }))
      ),
    };

    const translated = await reportsTranslatedCollection
      .find(query, { projection: { report_number: 1, dirty: 1 } })
      .toArray();

    const stored = new Map();

    for (const translation of translated) {
      const previous = stored.get(translation.report_number);

      stored.set(translation.report_number, {
        dirty: Boolean(translation.dirty) || Boolean(previous && previous.dirty),
      });
    }

    const toTranslate = [];

    for (const entry of items) {
      if (keys.some((key) => !entry[key])) {
        // A translation is only stored when every field is present, so a report with an empty
        // field would be paid for on every run and never saved.
        this.reporter.warn(
          `Skipping report ${entry.report_number} for [${to}]: its ${keys
            .filter((key) => !entry[key])
            .join(' and ')} field is empty`
        );
        continue;
      }

      const current = stored.get(entry.report_number);

      if (!current) {
        toTranslate.push({ entry, dirty: false });
      } else if (current.dirty) {
        toTranslate.push({ entry, dirty: true });
      }
    }

    const chars = toTranslate.reduce((total, { entry }) => total + countChars(entry), 0);

    return { toTranslate, chars };
  }

  /**
   * Stores one translation, replacing any stored translation of the same report in the same
   * language and clearing its dirty flag.
   */
  async saveTranslatedReport({ item, language }) {
    const reportsTranslationsCollection = this.mongoClient.db('translations').collection('reports');

    const { report_number, text, title } = item;

    const plain_text = (await remark().use(remarkStrip).process(text)).contents.toString();

    const translation = {
      report_number,
      text,
      title,
      plain_text,
      language,
      dirty: false,
      created_at: new Date(),
    };

    await reportsTranslationsCollection.updateOne(
      { report_number, language },
      { $set: translation },
      { upsert: true }
    );
  }

  async translateReport({ entry, to }) {
    const translatedEntry = cloneDeep(entry);

    const payload = keys.map((key) => entry[key]);

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

  /**
   * Translates and stores every report in `toTranslate` for language `to`. A failure on one
   * report is recorded and the rest carry on, so one bad report cannot discard a whole run
   * that has already been paid for.
   */
  async translateLanguage({ to, toTranslate }) {
    if (toTranslate.length === 0) {
      this.reporter.log(`No new incident reports needed translation to [${to}]`);

      return 0;
    }

    this.reporter.log(`Translating ${toTranslate.length} incident reports to [${to}]`);

    const concurrency = 100;

    let stored = 0;

    const q = queue(async ({ entry }) => {
      try {
        const translatedEntry = await this.translateReport({ entry, to });

        if (keys.some((key) => translatedEntry[key] === '')) {
          return;
        }

        await this.saveTranslatedReport({ item: translatedEntry, language: to });

        stored++;
      } catch (error) {
        const message = `${error.code ? `${error.code} ` : ''}${error.message}`;

        this.reporter.error(
          `Error translating report ${entry.report_number} to [${to}], ${message}`
        );

        this.failures.push({ report_number: entry.report_number, language: to, message });
      }
    }, concurrency);

    q.push(toTranslate);

    await q.drain();

    this.reporter.log(`Stored [${stored}] translations to [${to}]`);

    return stored;
  }

  async run() {
    if (this.dryRun) {
      this.reporter.warn(
        'Please set `TRANSLATE_DRY_RUN=false` to disable dry running of translation process.'
      );
    }

    await this.mongoClient.connect();

    try {
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

      // Exclude non-approved variant reports tag
      reportsQuery.tags = { $nin: ['variant:unreviewed', 'variant:rejected'] };

      const reports = await this.mongoClient
        .db('aiidprod')
        .collection(`reports`)
        .find(reportsQuery)
        .toArray();

      this.reporter.log(`Processing translation of ${reports.length} incident reports`);

      // Work out everything this run would send before sending any of it
      const plan = [];

      for (const { code: to } of this.languages) {
        const items = reports.filter((r) => r.language !== to);

        const { toTranslate, chars } = await this.getReportsToTranslate({ items, to });

        const dirty = toTranslate.filter((item) => item.dirty).length;

        this.reporter.log(
          `[${to}] ${toTranslate.length} reports to translate (${
            toTranslate.length - dirty
          } new, ${dirty} dirty), ${chars} characters`
        );

        plan.push({ to, toTranslate, chars });
      }

      const totalChars = plan.reduce((total, language) => total + language.chars, 0);

      this.reporter.log(
        `This run would send ${describeChars(totalChars)}; the limit is ${this.maxCharsPerRun}`
      );

      if (!this.dryRun && totalChars > this.maxCharsPerRun) {
        const errorMessage = `Translation process aborted before calling Google Translate: this run would send ${describeChars(
          totalChars
        )}, above the TRANSLATE_MAX_CHARS_PER_RUN limit of ${
          this.maxCharsPerRun
        }. Check why so much needs translating, or raise the limit to run it on purpose.`;

        this.reporter.error(errorMessage);
        throw new Error(errorMessage);
      }

      await Promise.all(plan.map((language) => this.translateLanguage(language)));

      this.reporter.log(`Sent ${describeChars(this.charsSent)} to Google Translate`);
    } finally {
      await this.mongoClient.close();
    }

    if (this.failures.length > 0) {
      throw new Error(
        `Translation process finished with ${
          this.failures.length
        } failed translations: ${this.failures
          .map((failure) => `report ${failure.report_number} [${failure.language}]`)
          .join(', ')}`
      );
    }
  }
}

module.exports = ReportTranslator;
