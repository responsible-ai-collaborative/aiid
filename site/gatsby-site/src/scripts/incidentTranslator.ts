import { Translate } from '@google-cloud/translate/build/src/v2';
import { queue } from 'async';
import { cloneDeep } from 'lodash';
import { Document, MongoClient } from 'mongodb';

const keys: string[] = ['title', 'description'];

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
}

/**
 * IncidentTranslator is responsible for translating incidents in MongoDB
 * into different languages using a translation service such as Google Translate.
 */
export default class IncidentTranslator {
  translateClient: Translate;

  mongoClient: MongoClient;

  reporter: Reporter;

  languages: string[];

  creationDateStart: string | undefined;

  dryRun: boolean;

  constructor({
    mongoClient,
    translateClient,
    languages,
    reporter,
    creationDateStart = process.env.TRANSLATE_INCIDENT_CREATION_DATE_START,
    dryRun = process.env.TRANSLATE_DRY_RUN !== 'false',
  }: IncidentTranslatorOptions) {
    this.translateClient = translateClient;
    this.mongoClient = mongoClient;
    this.reporter = reporter;
    this.languages = languages;
    this.creationDateStart = creationDateStart;
    this.dryRun = dryRun;
  }

  /**
   * Performs the actual translation of a given payload to a specified language.
   * If dryRun is true, it returns mocked results instead of calling the API.
   */
  async translate({ payload, to }: { payload: string[]; to: string }): Promise<string[]> {
    if (!this.dryRun) {
      return this.translateClient.translate(payload, { to });
    } else {
      return payload.map((p) => `translated-${to}-${p}`);
    }
  }

  /**
   * Translates an entire collection of incidents for a given language.
   * It uses a concurrency queue to process them in batches.
   */
  async translateIncidentsCollection({
    items,
    to,
  }: {
    items: Document[];
    to: string;
  }): Promise<Document[]> {
    const concurrency = 100;

    const translated: Document[] = [];

    // Create a queue for processing incident translations
    const q = queue(async (task: { entry: Document; to: string }) => {
      const translatedEntry = await this.translateIncident({
        entry: task.entry,
        to: task.to,
      });

      translated.push(translatedEntry);
    }, concurrency);

    q.error((err, task) => {
      this.reporter.error(`Error translating incident ${task.entry.incident_id}, ${err.message}`);
      throw new Error(
        `Translation process failed for incident ${task.entry.incident_id}. Error: ${err.message}`
      );
    });

    // Fetch incidents that are already translated for this language
    const alreadyTranslated = await this.getTranslatedIncidents({
      items,
      language: to,
    });

    // Only queue incidents that have not been translated yet
    for (const entry of items) {
      if (!alreadyTranslated.find((item) => item.incident_id === entry.incident_id)) {
        q.push({ entry, to });
      }
    }

    if (q.length() > 0) {
      await q.drain();
    }

    return translated;
  }

  /**
   * Gets a list of incidents that have already been translated into the specified language.
   */
  async getTranslatedIncidents({
    items,
    language,
  }: {
    items: Document[];
    language: string;
  }): Promise<Document[]> {
    const originalIds = items.map((item) => item.incident_id);

    const incidentsTranslatedCollection = this.mongoClient
      .db('translations')
      .collection('incidents');

    const query = {
      incident_id: { $in: originalIds },
      $and: [{ language }, ...keys.map((key) => ({ [key]: { $exists: true } }))],
    };

    const translated = await incidentsTranslatedCollection
      .find(query, { projection: { incident_id: 1 } })
      .toArray();

    return translated;
  }

  /**
   * Saves the translated incidents to MongoDB in the 'translations.incidents' collection.
   */
  async saveTranslatedIncidents({ items, language }: { items: Document[]; language: string }) {
    const incidentsTranslationsCollection = this.mongoClient
      .db('translations')
      .collection('incidents');

    // Build the translated documents to be inserted
    const incidentsTranslated = items.map((t) => {
      const translated: Document = {
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

  /**
   * Translates a single incident. It uses the keys array to know which fields to translate.
   */
  async translateIncident({ entry, to }: { entry: Document; to: string }): Promise<Document> {
    const translatedEntry = cloneDeep(entry);

    const payload: string[] = [];

    // Prepare the payload by extracting the relevant fields from the entry
    for (const key of keys) {
      const text = entry[key];

      payload.push(text);
    }

    // Call the translation API (or mocked call if dryRun is true)
    const results = await this.translate({ payload, to });

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

    const concurrency = 10;

    // Create a queue to translate incidents for each language
    const q = queue(async (task: { to: string }, done: () => void) => {
      this.reporter.log(`Translating incidents for [${task.to}]`);

      let translated = await this.translateIncidentsCollection({
        items: incidents,
        to: task.to,
      });

      // filter translated reports that are empty
      translated = translated.filter((t) => t.title !== '' && t.description !== '');

      if (translated.length > 0) {
        this.reporter.log(`Translated [${translated.length}] new incidents to [${task.to}]`);
        const result = await this.saveTranslatedIncidents({
          items: translated,
          language: task.to,
        });

        this.reporter.log(`Stored [${result.insertedCount}] new incidents to [${task.to}]`);
      } else {
        this.reporter.log(`No new incidents needed translation to [${task.to}]`);
      }

      done();
    }, concurrency);

    // Enqueue all target languages for translation
    for (const to of this.languages) {
      q.push({ to });
    }

    // Wait until all languages have been processed
    if (q.length() > 0) {
      await q.drain();
    }

    await this.mongoClient.close();
  }
}
