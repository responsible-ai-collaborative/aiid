import { MongoClient, Collection, InsertManyResult } from 'mongodb';
import { queue, QueueObject } from 'async';
import { cloneDeep } from 'lodash';
import remark from 'remark';
import remarkStrip from 'strip-markdown';

const keys = ['text', 'title'] as const;
type ReportKey = (typeof keys)[number];

interface Reporter {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

interface TranslateClient {
  translate(payload: string[], options: { to: string }): Promise<[string[]]>;
}

interface Language {
  code: string;
}

interface Report {
  report_number: string;
  date_submitted: Date;
  language?: string;
  text: string;
  title: string;
  [key: string]: any;
}

interface TranslatorOptions {
  mongoClient: MongoClient;
  translateClient: TranslateClient;
  languages: Language[];
  reporter: Reporter;
  submissionDateStart?: string;
  dryRun?: boolean;
}

class Translator {
  private translateClient: TranslateClient;
  private mongoClient: MongoClient;
  private reporter: Reporter;
  private languages: Language[];
  private submissionDateStart?: string;
  private dryRun: boolean;

  constructor({
    mongoClient,
    translateClient,
    languages,
    reporter,
    submissionDateStart = process.env.TRANSLATE_SUBMISSION_DATE_START,
    dryRun = process.env.TRANSLATE_DRY_RUN !== 'false',
  }: TranslatorOptions) {
    this.translateClient = translateClient;
    this.mongoClient = mongoClient;
    this.reporter = reporter;
    this.languages = languages;
    this.submissionDateStart = submissionDateStart;
    this.dryRun = dryRun;
  }

  private async translate({ payload, to }: { payload: string[]; to: string }): Promise<[string[]]> {
    if (!this.dryRun) {
      return this.translateClient.translate(payload, { to });
    } else {
      return [payload.map((p) => `translated-${to}-${p}`)];
    }
  }

  private async translateReportsCollection({
    items,
    to,
  }: {
    items: Report[];
    to: string;
  }): Promise<Report[]> {
    const concurrency = 100;
    const translated: Report[] = [];

    const q: QueueObject<{ entry: Report; to: string }> = queue(async ({ entry, to }) => {
      const translatedEntry = await this.translateReport({ entry, to });
      translated.push(translatedEntry);
    }, concurrency);

    q.error((err: Error & { code?: string }, task) => {
      this.reporter.error(
        `Error translating report ${task.entry.report_number}, ${err.code} ${err.message}`
      );
      throw new Error(
        `Translation process failed for report ${task.entry.report_number}. Error: ${err.code} - ${err.message}`
      );
    });

    const alreadyTranslated = await this.getTranslatedReports({ items, language: to });

    for (const entry of items) {
      if (!alreadyTranslated.find((item) => item.report_number === entry.report_number)) {
        q.push({ entry, to });
      }
    }

    if (q.length() > 0) {
      await q.drain();
    }

    return translated;
  }

  private async getTranslatedReports({
    items,
    language,
  }: {
    items: Report[];
    language: string;
  }): Promise<Report[]> {
    const originalIds = items.map((item) => item.report_number);

    const reportsTranslatedCollection: Collection<Report> = this.mongoClient
      .db('translations')
      .collection(`reports_${language}`);

    const query = {
      report_number: { $in: originalIds },
      $and: [...keys, 'plain_text'].map((key) => ({ [key]: { $exists: true } })),
    };

    const translated = await reportsTranslatedCollection
      .find(query, { projection: { report_number: 1 } })
      .toArray();

    return translated;
  }

  private async saveTranslatedReports({
    items,
    language,
  }: {
    items: Report[];
    language: string;
  }): Promise<InsertManyResult<Report>> {
    const reportsTranslatedCollection: Collection<Report> = this.mongoClient
      .db('translations')
      .collection(`reports_${language}`);

    const translated: Report[] = [];

    for (const item of items) {
      const { report_number, text, title } = item;

      const plain_text = (await remark().use(remarkStrip).process(text)).contents.toString();

      translated.push({ report_number, text, title, plain_text });
    }

    return reportsTranslatedCollection.insertMany(translated);
  }

  private async translateReport({ entry, to }: { entry: Report; to: string }): Promise<Report> {
    const translatedEntry = cloneDeep(entry);

    const payload: string[] = [];

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

  async run(): Promise<void> {
    if (this.dryRun) {
      this.reporter.warn(
        'Please set `TRANSLATE_DRY_RUN=false` to disable dry running of translation process.'
      );
    }

    await this.mongoClient.connect();

    let reportsQuery: Record<string, any> = {};

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

    const q: QueueObject<{ to: string }> = queue(async ({ to }, done) => {
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

export default Translator;
