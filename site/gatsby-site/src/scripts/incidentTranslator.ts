import { Translate } from '@google-cloud/translate/build/src/v2';
import { queue } from 'async';
import { cloneDeep } from 'lodash';
import { Document, MongoClient } from 'mongodb';
import { describeChars, parseMaxCharsPerRun } from './translationBudget';

const keys: string[] = ['title', 'description'];

const countChars = (entry: Document): number =>
  keys.reduce((total, key) => total + (entry[key] || '').length, 0);

interface Reporter {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
}

interface IncidentTranslatorOptions {
  mongoClient: MongoClient;
  translateClient: Translate;
  languages: string[];
  reporter: Reporter;
  creationDateStart?: string;
  dryRun?: boolean;
  /** Characters above which a run refuses to start; see `translationBudget.ts` */
  maxCharsPerRun?: string | number;
}

interface PlannedTranslation {
  entry: Document;
  dirty: boolean;
}

interface LanguagePlan {
  to: string;
  toTranslate: PlannedTranslation[];
  chars: number;
}

interface TranslationFailure {
  incident_id: number;
  language: string;
  message: string;
}

/**
 * Translates the incidents in `aiidprod.incidents` into every configured language and stores
 * the results in `translations.incidents`, one document per (incident_id, language).
 *
 * An incident is sent to Google Translate when it has no stored translation for a language, or
 * when its stored translation is flagged `dirty` because the incident's title or description
 * changed. Every stored translation is written with an upsert keyed on (incident_id, language),
 * so a re-translation always replaces the right document and clears its `dirty` flag, and a
 * run saves each translation as soon as it arrives rather than after a whole language finishes.
 */
export default class IncidentTranslator {
  translateClient: Translate;

  mongoClient: MongoClient;

  reporter: Reporter;

  languages: string[];

  creationDateStart: string | undefined;

  dryRun: boolean;

  maxCharsPerRun: number;

  charsSent: number;

  failures: TranslationFailure[];

  constructor({
    mongoClient,
    translateClient,
    languages,
    reporter,
    creationDateStart = process.env.TRANSLATE_INCIDENT_CREATION_DATE_START,
    dryRun = process.env.TRANSLATE_DRY_RUN !== 'false',
    maxCharsPerRun = process.env.TRANSLATE_MAX_CHARS_PER_RUN,
  }: IncidentTranslatorOptions) {
    this.translateClient = translateClient;
    this.mongoClient = mongoClient;
    this.reporter = reporter;
    this.languages = languages;
    this.creationDateStart = creationDateStart;
    this.dryRun = dryRun;
    this.maxCharsPerRun = parseMaxCharsPerRun(maxCharsPerRun);
    this.charsSent = 0;
    this.failures = [];
  }

  /**
   * Performs the actual translation of a given payload to a specified language.
   * If dryRun is true, it returns mocked results instead of calling the API.
   */
  async translate({ payload, to }: { payload: string[]; to: string }): Promise<[string[], any]> {
    if (!this.dryRun) {
      this.charsSent += payload.reduce((total, text) => total + text.length, 0);

      return this.translateClient.translate(payload, { to });
    } else {
      return [payload.map((p) => `translated-${to}-${p}`), {}];
    }
  }

  /**
   * Works out which of `items` have to be sent to Google Translate for language `to`:
   * incidents with no stored translation, and incidents whose stored translation is dirty.
   * Nothing is sent from here, so a run can add up its cost before it starts.
   */
  async getIncidentsToTranslate({
    items,
    to,
  }: {
    items: Document[];
    to: string;
  }): Promise<{ toTranslate: PlannedTranslation[]; chars: number }> {
    const incidentsTranslatedCollection = this.mongoClient
      .db('translations')
      .collection('incidents');

    const query = {
      incident_id: { $in: items.map((item) => item.incident_id) },
      $and: [{ language: to }, ...keys.map((key) => ({ [key]: { $exists: true } }))],
    };

    const translated = await incidentsTranslatedCollection
      .find(query, { projection: { incident_id: 1, dirty: 1 } })
      .toArray();

    const stored = new Map<number, { dirty: boolean }>();

    for (const translation of translated) {
      const previous = stored.get(translation.incident_id);

      stored.set(translation.incident_id, {
        dirty: Boolean(translation.dirty) || Boolean(previous && previous.dirty),
      });
    }

    const toTranslate: PlannedTranslation[] = [];

    for (const entry of items) {
      if (keys.some((key) => !entry[key])) {
        // A translation is only stored when every field is present, so an incident with an
        // empty field would be paid for on every run and never saved.
        this.reporter.warn(
          `Skipping incident ${entry.incident_id} for [${to}]: its ${keys
            .filter((key) => !entry[key])
            .join(' and ')} field is empty`
        );
        continue;
      }

      const current = stored.get(entry.incident_id);

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
   * Stores one translation, replacing any stored translation of the same incident in the same
   * language and clearing its dirty flag.
   */
  async saveTranslatedIncident({ item, language }: { item: Document; language: string }) {
    const incidentsTranslationsCollection = this.mongoClient
      .db('translations')
      .collection('incidents');

    const translation: Document = {
      incident_id: item.incident_id,
      language,
      created_at: new Date(),
      dirty: false,
    };

    for (const key of keys) {
      translation[key] = item[key];
    }

    await incidentsTranslationsCollection.updateOne(
      { incident_id: item.incident_id, language },
      { $set: translation },
      { upsert: true }
    );
  }

  /**
   * Translates a single incident. It uses the keys array to know which fields to translate.
   */
  async translateIncident({ entry, to }: { entry: Document; to: string }): Promise<Document> {
    const translatedEntry = cloneDeep(entry);

    const payload: string[] = keys.map((key) => entry[key]);

    // Call the translation API (or mocked call if dryRun is true)
    const [results] = await this.translate({ payload, to });

    // Apply each translated result to the correct field
    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      // Check if the translation is empty. The translation API sometimes returns empty strings with a 200 status code.
      if (result === '') {
        this.reporter.error(
          `Error translating incident ${entry.incident_id}, ${keys[i]} field is empty`
        );
      }

      const field = keys[i];

      translatedEntry[field] = result;
    }

    return translatedEntry;
  }

  /**
   * Translates and stores every incident in `toTranslate` for language `to`. A failure on one
   * incident is recorded and the rest carry on, so one bad incident cannot discard a whole run
   * that has already been paid for.
   */
  async translateLanguage({ to, toTranslate }: LanguagePlan): Promise<number> {
    if (toTranslate.length === 0) {
      this.reporter.log(`No new incidents needed translation to [${to}]`);

      return 0;
    }

    this.reporter.log(`Translating ${toTranslate.length} incidents to [${to}]`);

    const concurrency = 100;

    let stored = 0;

    const q = queue(async ({ entry }: PlannedTranslation) => {
      try {
        const translatedEntry = await this.translateIncident({ entry, to });

        if (keys.some((key) => translatedEntry[key] === '')) {
          return;
        }

        await this.saveTranslatedIncident({ item: translatedEntry, language: to });

        stored++;
      } catch (error: any) {
        const message = `${error.code ? `${error.code} ` : ''}${error.message}`;

        this.reporter.error(
          `Error translating incident ${entry.incident_id} to [${to}], ${message}`
        );

        this.failures.push({ incident_id: entry.incident_id, language: to, message });
      }
    }, concurrency);

    q.push(toTranslate);

    await q.drain();

    this.reporter.log(`Stored [${stored}] translations to [${to}]`);

    return stored;
  }

  /**
   * Runs the entire translation process. It connects to MongoDB, retrieves
   * incidents from 'aiidprod.incidents', and then translates them into the
   * configured languages, saving the results in 'translations.incidents' collection.
   */
  async run(): Promise<void> {
    if (this.dryRun) {
      this.reporter.warn(
        'Please set `TRANSLATE_DRY_RUN=false` to disable dry running of the translation process.'
      );
    }

    await this.mongoClient.connect();

    try {
      let incidentsQuery = {};

      // If creationDateStart is provided, only translate incidents after that date
      if (this.creationDateStart) {
        if (isNaN(Date.parse(this.creationDateStart))) {
          const errorMessage = `Translation process error: Invalid date format for TRANSLATE_INCIDENT_CREATION_DATE_START env variable: [${this.creationDateStart}]`;

          this.reporter.error(errorMessage);
          throw new Error(errorMessage);
        }

        this.reporter.log(`Translating incidents created after [${this.creationDateStart}]`);
        incidentsQuery = { created_at: { $gte: new Date(this.creationDateStart) } };
      } else {
        this.reporter.log(
          'Translating all incidents. (TRANSLATE_INCIDENT_CREATION_DATE_START env variable is not defined)'
        );
      }

      // Fetch incidents from the source database 'aiidprod.incidents'
      const incidents = await this.mongoClient
        .db('aiidprod')
        .collection('incidents')
        .find(incidentsQuery)
        .toArray();

      this.reporter.log(`Processing translation of ${incidents.length} incidents`);

      // Work out everything this run would send before sending any of it
      const plan: LanguagePlan[] = [];

      for (const to of this.languages) {
        const { toTranslate, chars } = await this.getIncidentsToTranslate({ items: incidents, to });

        const dirty = toTranslate.filter((item) => item.dirty).length;

        this.reporter.log(
          `[${to}] ${toTranslate.length} incidents to translate (${
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
          .map((failure) => `incident ${failure.incident_id} [${failure.language}]`)
          .join(', ')}`
      );
    }
  }
}
