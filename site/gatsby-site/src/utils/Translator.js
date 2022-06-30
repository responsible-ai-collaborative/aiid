const { queue } = require('async');

const { cloneDeep } = require('lodash');

const remark = require('remark');

const remarkStrip = require('strip-markdown');

const keys = ['text', 'title'];

class Translator {
  constructor({
    mongoClient,
    translateClient,
    languages,
    reporter,
    dryRun = process.env.TRANSLATE_DRY_RUN !== 'false',
  }) {
    this.translateClient = translateClient;
    /**
     * @type {import('mongodb').MongoClient}
     * @public
     */
    this.mongoClient = mongoClient;
    this.reporter = reporter;
    this.languages = languages;
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
      this.reporter.log(
        `Error translating report ${task.entry.report_number}, ${err.code} ${err.message}`
      );
    });

    const alreadyTranslated = await this.getTranslatedReports({ items, language: to });

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

  async getTranslatedReports({ items, language }) {
    const originalIds = items.map((item) => item.report_number);

    const incidents = this.mongoClient.db('translations').collection(`reports_${language}`);

    const query = {
      report_number: { $in: originalIds },
      $and: [...keys, 'plain_text'].map((key) => ({ [key]: { $exists: true } })),
    };

    const translated = await incidents.find(query, { projection: { report_number: 1 } }).toArray();

    return translated;
  }

  async saveTranslatedReports({ items, language }) {
    const incidents = this.mongoClient.db('translations').collection(`reports_${language}`);

    const translated = [];

    for (const item of items) {
      const { report_number, text, title } = item;

      const plain_text = (await remark().use(remarkStrip).process(text)).contents.toString();

      translated.push({ report_number, text, title, plain_text });
    }

    return incidents.insertMany(translated);
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

      const key = keys[i];

      translatedEntry[key] = result;
    }

    return translatedEntry;
  }

  async run() {
    await this.mongoClient.connect();

    const reports = await this.mongoClient.db('aiidprod').collection(`reports`).find({}).toArray();

    const concurrency = 10;

    const q = queue(async ({ to }, done) => {
      this.reporter.log(`Translating incident reports for [${to}]`);

      const items = reports.filter((r) => r.language !== to);

      const translated = await this.translateReportsCollection({ items, to });

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

module.exports = Translator;
