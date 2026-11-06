import { parse } from 'csv-parse/sync';
import fetch from 'cross-fetch';
import { Document, MongoClient, ObjectId } from 'mongodb';

/**
 * Refreshes the MIT taxonomy classifications from the Arcola AI platform.
 *
 * Arcola classifies every AIID incident with the MIT AI Risk Repository taxonomy and exposes the
 * latest classification of each incident as a CSV export. This module turns that export into the
 * `classifications` documents of the `MIT` namespace under three integrity rules, each of which
 * aborts the run before anything is written:
 *
 * 1. Every value has to map onto a permitted value of the taxonomy. The export's labels differ
 *    from the taxonomy's by punctuation ("4 Malicious actors" against "4. Malicious Actors &
 *    Misuse"), so domain and subdomain values are matched by their numeric code; everything else
 *    has to match exactly.
 * 2. A stored classification only changes when the export carries a new prompt version for the
 *    incident. A changed value under the same prompt version means the classifier is not
 *    deterministic or the pipeline is broken.
 * 3. A run that would change more than `MIT_SYNC_MAX_FIELD_UPDATES` field values is refused: a
 *    flood of changes signals a broken pipeline rather than a day's worth of new incidents.
 *
 * With `MIT_SYNC_DRY_RUN` unset or anything but `false`, the run plans and reports everything it
 * would write, applies the same three rules, and writes nothing.
 */

export const NAMESPACE = 'MIT';

export const DEFAULT_EXPORT_URL =
  'https://platform.arcolaai.com/api/v1/aiid/export?classified_only=true&latest_only=true&limit=10000';

/** Rows above which the export is assumed to have been cut off by its `limit` parameter */
export const EXPORT_ROW_LIMIT = 10000;

export const DEFAULT_MAX_FIELD_UPDATES = 500;

export const PROMPT_VERSION_FIELD = 'Prompt Version';

export const MIGRATION_NAME = '2026.11.03T12.00.00.add-mit-arcola-fields.ts';

export type FieldKind = 'enum' | 'multi' | 'string';

export interface ManagedField {
  /** `short_name` of the taxonomy field */
  field: string;
  /** Column of the Arcola export */
  column: string;
  kind: FieldKind;
}

/** The taxonomy fields the sync owns, and the export column each one comes from */
export const MANAGED_FIELDS: ManagedField[] = [
  { field: 'Risk Domain', column: 'domain_code', kind: 'enum' },
  { field: 'Risk Subdomain', column: 'subdomain_code', kind: 'enum' },
  { field: 'Entity', column: 'causal_entity', kind: 'enum' },
  { field: 'Timing', column: 'causal_timing', kind: 'enum' },
  { field: 'Intent', column: 'causal_intent', kind: 'enum' },
  { field: 'Additional Subdomains', column: 'additional_subdomains', kind: 'multi' },
  { field: PROMPT_VERSION_FIELD, column: 'prompt_version', kind: 'string' },
];

export const REQUIRED_COLUMNS = ['aiid_id', ...MANAGED_FIELDS.map((field) => field.column)];

export type FieldValue = string | string[];

export interface Attribute {
  short_name: string;
  value_json: string;
}

export interface ExportRow {
  incident_id: number;
  values: Record<string, string>;
}

export interface Change {
  field: string;
  from: FieldValue | undefined;
  to: FieldValue;
}

export interface PlannedCreate {
  incident_id: number;
  attributes: Attribute[];
}

export interface PlannedUpdate {
  incident_id: number;
  _id: ObjectId;
  attributes: Attribute[];
  changes: Change[];
}

export interface Unmappable {
  incident_id: number;
  field: string;
  value: string;
  reason: string;
}

export interface Violation {
  incident_id: number;
  promptVersion: string;
  changes: Change[];
}

export interface Plan {
  rows: number;
  creates: PlannedCreate[];
  updates: PlannedUpdate[];
  unchanged: number;
  /** Export rows whose incident does not exist in `aiidprod.incidents` */
  unknownIncidents: number[];
  /** Incidents that hold more than one MIT classification */
  duplicateClassifications: number[];
  unmappable: Unmappable[];
  violations: Violation[];
  /** Field values a real run would write: every field of a new classification, changed ones of an updated one */
  fieldUpdates: number;
  promptVersions: Record<string, number>;
}

interface Reporter {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
}

export interface MitClassificationsSyncOptions {
  mongoClient: MongoClient;
  /** Returns the export as CSV text; see `fetchArcolaExport` */
  fetchExport: () => Promise<string>;
  reporter: Reporter;
  dryRun?: boolean;
  /** Field values above which a run refuses to write; see `MIT_SYNC_MAX_FIELD_UPDATES` */
  maxFieldUpdates?: string | number;
}

type FetchLike = (
  url: string,
  init?: { headers?: Record<string, string> }
) => Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  text: () => Promise<string>;
}>;

/** Downloads the export with the API key in the `X-API-Key` header, as Arcola documents it. */
export const fetchArcolaExport = async ({
  apiKey,
  url = DEFAULT_EXPORT_URL,
  fetchImpl = fetch as unknown as FetchLike,
}: {
  apiKey: string | undefined;
  url?: string;
  fetchImpl?: FetchLike;
}): Promise<string> => {
  if (!apiKey) {
    throw new Error('ARCOLA_API_KEY must hold the Arcola API key');
  }

  const response = await fetchImpl(url, { headers: { 'X-API-Key': apiKey, Accept: 'text/csv' } });

  if (!response.ok) {
    throw new Error(`Arcola export request failed: HTTP ${response.status} ${response.statusText}`);
  }

  return response.text();
};

export const parseMaxFieldUpdates = (value: string | number | undefined): number => {
  if (value === undefined || value === null || value === '') {
    return DEFAULT_MAX_FIELD_UPDATES;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(
      `MIT_SYNC_MAX_FIELD_UPDATES must be a whole number of field values, got ${JSON.stringify(
        value
      )}`
    );
  }

  return parsed;
};

/**
 * Parses the export, checking that every column the sync reads is present (it reads columns by
 * name, never by position) and that there is exactly one row per incident.
 */
export const parseExport = (csv: string): ExportRow[] => {
  const records: Record<string, string>[] = parse(csv, {
    bom: true,
    skip_empty_lines: true,
    columns: (header: string[]) => {
      const missing = REQUIRED_COLUMNS.filter((column) => !header.includes(column));

      if (missing.length > 0) {
        throw new Error(
          `Arcola export is missing the column(s) ${missing.join(
            ', '
          )}; the sync reads columns by name and needs every one of them`
        );
      }

      return header;
    },
  });

  const rows: ExportRow[] = [];

  const seen = new Set<number>();

  for (const record of records) {
    const incident_id = Number(record.aiid_id);

    if (!Number.isInteger(incident_id) || incident_id <= 0) {
      throw new Error(
        `Arcola export row has an invalid aiid_id: ${JSON.stringify(record.aiid_id)}`
      );
    }

    if (seen.has(incident_id)) {
      throw new Error(
        `Arcola export has more than one row for incident ${incident_id}; the sync needs one row per incident (latest_only=true)`
      );
    }

    seen.add(incident_id);

    rows.push({ incident_id, values: record });
  }

  if (rows.length >= EXPORT_ROW_LIMIT) {
    throw new Error(
      `Arcola export has ${rows.length} rows, which is the export limit; raise the limit parameter of the export URL`
    );
  }

  return rows;
};

/** The numeric code that starts a domain or subdomain label: "4" or "1.2" */
const codeOf = (value: string): string | undefined => {
  const match = /^\s*(\d+(?:\.\d+)?)\.?(?=\s|$)/.exec(value);

  return match ? match[1] : undefined;
};

/**
 * The permitted value an export value stands for: the value itself when it is permitted as
 * written, otherwise the permitted value with the same numeric code.
 */
export const mapPermittedValue = (raw: string, permitted: string[]): string | undefined => {
  const value = raw.trim();

  if (permitted.includes(value)) {
    return value;
  }

  const code = codeOf(value);

  if (code === undefined) {
    return undefined;
  }

  return permitted.find((candidate) => codeOf(candidate) === code);
};

/** The subdomain labels of an `additional_subdomains` cell: a JSON list of `{ code, justification }` */
export const parseAdditionalSubdomains = (cell: string): string[] => {
  if (!cell || cell.trim() === '') {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(cell);
  } catch {
    throw new Error('additional_subdomains is not valid JSON');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('additional_subdomains is not a JSON list');
  }

  return parsed.map((entry) => {
    if (typeof entry === 'string') {
      return entry;
    }

    if (
      entry &&
      typeof entry === 'object' &&
      typeof (entry as { code?: unknown }).code === 'string'
    ) {
      return (entry as { code: string }).code;
    }

    throw new Error('additional_subdomains entry has no code');
  });
};

/**
 * The permitted values of every managed field, from the taxonomy document. Throws when a managed
 * field is missing, which means the migration that adds it has not run.
 */
export const taxonomyPermittedValues = (taxonomy: Document | null): Map<string, string[]> => {
  if (!taxonomy) {
    throw new Error(`The ${NAMESPACE} taxonomy is missing from aiidprod.taxa`);
  }

  const fieldList: Document[] = taxonomy.field_list || [];

  const permitted = new Map<string, string[]>();

  const missing: string[] = [];

  for (const { field } of MANAGED_FIELDS) {
    const definition = fieldList.find((entry) => entry.short_name === field);

    if (!definition) {
      missing.push(field);
    } else {
      permitted.set(
        field,
        Array.isArray(definition.permitted_values) ? definition.permitted_values : []
      );
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `The ${NAMESPACE} taxonomy has no ${missing.join(
        ', '
      )} field; run migration ${MIGRATION_NAME} before syncing`
    );
  }

  return permitted;
};

/** Maps one export row onto taxonomy values, collecting what cannot be mapped. */
export const rowToValues = (
  row: ExportRow,
  permitted: Map<string, string[]>
): { values: Record<string, FieldValue>; unmappable: Unmappable[] } => {
  const values: Record<string, FieldValue> = {};

  const unmappable: Unmappable[] = [];

  for (const { field, column, kind } of MANAGED_FIELDS) {
    const raw = row.values[column] ?? '';

    if (kind === 'enum') {
      const mapped = mapPermittedValue(raw, permitted.get(field)!);

      if (mapped === undefined) {
        unmappable.push({
          incident_id: row.incident_id,
          field,
          value: raw,
          reason: 'not a permitted value',
        });
      } else {
        values[field] = mapped;
      }
    } else if (kind === 'multi') {
      try {
        const mapped: string[] = [];

        for (const entry of parseAdditionalSubdomains(raw)) {
          const value = mapPermittedValue(entry, permitted.get(field)!);

          if (value === undefined) {
            unmappable.push({
              incident_id: row.incident_id,
              field,
              value: entry,
              reason: 'not a permitted value',
            });
          } else if (!mapped.includes(value)) {
            mapped.push(value);
          }
        }

        values[field] = mapped;
      } catch (error: any) {
        unmappable.push({
          incident_id: row.incident_id,
          field,
          value: raw.slice(0, 80),
          reason: error.message,
        });
      }
    } else {
      const value = raw.trim();

      if (value === '') {
        unmappable.push({ incident_id: row.incident_id, field, value: raw, reason: 'empty' });
      } else {
        values[field] = value;
      }
    }
  }

  return { values, unmappable };
};

/** The stored value of a managed field, in the shape `rowToValues` produces */
export const storedValue = (
  classification: Document,
  field: string,
  kind: FieldKind
): FieldValue | undefined => {
  const attribute = (classification.attributes || []).find(
    (entry: Attribute) => entry.short_name === field
  );

  if (!attribute) {
    return kind === 'multi' ? [] : undefined;
  }

  let value: unknown;

  try {
    value = JSON.parse(attribute.value_json);
  } catch {
    value = attribute.value_json;
  }

  if (kind === 'multi') {
    if (Array.isArray(value)) {
      return value.map((entry) => String(entry));
    }

    return value === null || value === undefined || value === '' ? [] : [String(value)];
  }

  return value === null || value === undefined || value === '' ? undefined : String(value);
};

export const sameValue = (
  kind: FieldKind,
  a: FieldValue | undefined,
  b: FieldValue | undefined
): boolean => {
  if (kind === 'multi') {
    const left = [...((a as string[]) || [])].sort();

    const right = [...((b as string[]) || [])].sort();

    return left.length === right.length && left.every((value, index) => value === right[index]);
  }

  return a === b;
};

/** The attributes of a classification with the managed fields set to `values`; other attributes are kept */
export const buildAttributes = (
  existing: Attribute[] | undefined,
  values: Record<string, FieldValue>
): Attribute[] => {
  const attributes = (existing || []).map((attribute) => ({ ...attribute }));

  for (const { field } of MANAGED_FIELDS) {
    const value_json = JSON.stringify(values[field]);

    const current = attributes.find((attribute) => attribute.short_name === field);

    if (current) {
      current.value_json = value_json;
    } else {
      attributes.push({ short_name: field, value_json });
    }
  }

  return attributes;
};

/**
 * Works out what a run would write, without writing anything. `existing` holds the MIT
 * classifications currently stored; `incidentIds` the incidents that exist.
 */
export const buildPlan = ({
  rows,
  permitted,
  incidentIds,
  existing,
}: {
  rows: ExportRow[];
  permitted: Map<string, string[]>;
  incidentIds: Set<number>;
  existing: Document[];
}): Plan => {
  const plan: Plan = {
    rows: rows.length,
    creates: [],
    updates: [],
    unchanged: 0,
    unknownIncidents: [],
    duplicateClassifications: [],
    unmappable: [],
    violations: [],
    fieldUpdates: 0,
    promptVersions: {},
  };

  const byIncident = new Map<number, Document[]>();

  for (const classification of existing) {
    for (const incident_id of classification.incidents || []) {
      byIncident.set(incident_id, [...(byIncident.get(incident_id) || []), classification]);
    }
  }

  for (const [incident_id, classifications] of byIncident) {
    if (classifications.length > 1) {
      plan.duplicateClassifications.push(incident_id);
    }
  }

  for (const row of rows) {
    const promptVersion = (row.values.prompt_version || '').trim() || '(empty)';

    plan.promptVersions[promptVersion] = (plan.promptVersions[promptVersion] || 0) + 1;

    if (!incidentIds.has(row.incident_id)) {
      plan.unknownIncidents.push(row.incident_id);
      continue;
    }

    const { values, unmappable } = rowToValues(row, permitted);

    if (unmappable.length > 0) {
      plan.unmappable.push(...unmappable);
      continue;
    }

    const current = byIncident.get(row.incident_id);

    if (!current) {
      plan.creates.push({
        incident_id: row.incident_id,
        attributes: buildAttributes(undefined, values),
      });
      plan.fieldUpdates += MANAGED_FIELDS.length;
      continue;
    }

    if (current.length > 1) {
      continue;
    }

    const [classification] = current;

    const changes: Change[] = [];

    for (const { field, kind } of MANAGED_FIELDS) {
      const from = storedValue(classification, field, kind);

      const to = values[field];

      if (!sameValue(kind, from, to)) {
        changes.push({ field, from, to });
      }
    }

    if (changes.length === 0) {
      plan.unchanged++;
      continue;
    }

    const promptVersionChanged = changes.some((change) => change.field === PROMPT_VERSION_FIELD);

    if (!promptVersionChanged) {
      plan.violations.push({
        incident_id: row.incident_id,
        promptVersion: values[PROMPT_VERSION_FIELD] as string,
        changes,
      });
      continue;
    }

    plan.updates.push({
      incident_id: row.incident_id,
      _id: classification._id,
      attributes: buildAttributes(classification.attributes, values),
      changes,
    });
    plan.fieldUpdates += changes.length;
  }

  plan.unknownIncidents.sort((a, b) => a - b);
  plan.duplicateClassifications.sort((a, b) => a - b);

  return plan;
};

const describeValue = (value: FieldValue | undefined): string =>
  value === undefined ? '(none)' : JSON.stringify(value);

const describeChanges = (changes: Change[]): string =>
  changes
    .map(
      (change) => `${change.field}: ${describeValue(change.from)} -> ${describeValue(change.to)}`
    )
    .join('; ');

const sample = <T>(items: T[], count: number): T[] => items.slice(0, count);

export default class MitClassificationsSync {
  mongoClient: MongoClient;

  fetchExport: () => Promise<string>;

  reporter: Reporter;

  dryRun: boolean;

  maxFieldUpdates: number;

  constructor({
    mongoClient,
    fetchExport,
    reporter,
    dryRun = process.env.MIT_SYNC_DRY_RUN !== 'false',
    maxFieldUpdates = process.env.MIT_SYNC_MAX_FIELD_UPDATES,
  }: MitClassificationsSyncOptions) {
    this.mongoClient = mongoClient;
    this.fetchExport = fetchExport;
    this.reporter = reporter;
    this.dryRun = dryRun;
    this.maxFieldUpdates = parseMaxFieldUpdates(maxFieldUpdates);
  }

  /** Logs what the run found and what it would write, so a dry run is a complete rehearsal */
  describePlan(plan: Plan): void {
    const { reporter } = this;

    reporter.log(
      `Arcola export: ${plan.rows} rows; prompt versions ${Object.entries(plan.promptVersions)
        .map(([version, count]) => `${version}=${count}`)
        .join(', ')}`
    );

    if (plan.unknownIncidents.length > 0) {
      reporter.warn(
        `Skipping ${
          plan.unknownIncidents.length
        } rows whose incident is not in the database: ${sample(plan.unknownIncidents, 20).join(
          ', '
        )}${plan.unknownIncidents.length > 20 ? ', ...' : ''}`
      );
    }

    reporter.log(
      `Plan: ${plan.creates.length} classifications to create, ${plan.updates.length} to update, ${plan.unchanged} unchanged; ${plan.fieldUpdates} field values to write (limit ${this.maxFieldUpdates})`
    );

    for (const create of sample(plan.creates, 20)) {
      reporter.log(
        `  create incident ${create.incident_id}: ${describeChanges(
          MANAGED_FIELDS.map(({ field }) => ({
            field,
            from: undefined,
            to: JSON.parse(
              create.attributes.find((attribute) => attribute.short_name === field)!.value_json
            ),
          }))
        )}`
      );
    }

    if (plan.creates.length > 20) {
      reporter.log(`  ... and ${plan.creates.length - 20} more to create`);
    }

    for (const update of sample(plan.updates, 20)) {
      reporter.log(`  update incident ${update.incident_id}: ${describeChanges(update.changes)}`);
    }

    if (plan.updates.length > 20) {
      reporter.log(`  ... and ${plan.updates.length - 20} more to update`);
    }

    for (const violation of sample(plan.violations, 50)) {
      reporter.error(
        `  incident ${violation.incident_id} changed under the same prompt version ${
          violation.promptVersion
        }: ${describeChanges(violation.changes)}`
      );
    }

    for (const unmappable of sample(plan.unmappable, 50)) {
      reporter.error(
        `  incident ${unmappable.incident_id}: ${unmappable.field} value ${JSON.stringify(
          unmappable.value
        )} is ${unmappable.reason}`
      );
    }

    if (plan.duplicateClassifications.length > 0) {
      reporter.error(
        `  incidents with more than one ${NAMESPACE} classification: ${plan.duplicateClassifications.join(
          ', '
        )}`
      );
    }
  }

  /** The reasons a run must not write, in the order they are checked */
  checkPlan(plan: Plan): void {
    if (plan.duplicateClassifications.length > 0) {
      throw new Error(
        `MIT sync aborted before writing: ${
          plan.duplicateClassifications.length
        } incidents hold more than one ${NAMESPACE} classification (${sample(
          plan.duplicateClassifications,
          20
        ).join(', ')}). Remove the extra documents, then run again.`
      );
    }

    if (plan.unmappable.length > 0) {
      throw new Error(
        `MIT sync aborted before writing: ${
          plan.unmappable.length
        } values do not map onto the taxonomy, for example incident ${
          plan.unmappable[0].incident_id
        } ${plan.unmappable[0].field} ${JSON.stringify(plan.unmappable[0].value)} (${
          plan.unmappable[0].reason
        }). Add the value to the taxonomy or fix the export, then run again.`
      );
    }

    if (plan.violations.length > 0) {
      throw new Error(
        `MIT sync aborted before writing: ${
          plan.violations.length
        } classifications changed without a new prompt version, for example incident ${
          plan.violations[0].incident_id
        } (${describeChanges(
          plan.violations[0].changes
        )}). A classification may only change when its prompt version changes.`
      );
    }

    if (plan.fieldUpdates > this.maxFieldUpdates) {
      throw new Error(
        `MIT sync aborted before writing: this run would write ${plan.fieldUpdates} field values, above the MIT_SYNC_MAX_FIELD_UPDATES limit of ${this.maxFieldUpdates}. Check why so much changed, or raise the limit to run it on purpose.`
      );
    }
  }

  async apply(plan: Plan): Promise<void> {
    const classifications = this.mongoClient.db('aiidprod').collection('classifications');

    const created_at = new Date();

    const operations: Document[] = [
      ...plan.creates.map((create) => ({
        insertOne: {
          document: {
            namespace: NAMESPACE,
            incidents: [create.incident_id],
            reports: [],
            attributes: create.attributes,
            notes: '',
            publish: true,
            created_at,
          },
        },
      })),
      ...plan.updates.map((update) => ({
        updateOne: {
          filter: { _id: update._id },
          update: { $set: { attributes: update.attributes } },
        },
      })),
    ];

    if (operations.length === 0) {
      this.reporter.log('Nothing to write');

      return;
    }

    const result = await classifications.bulkWrite(operations as any, { ordered: true });

    this.reporter.log(
      `Wrote ${result.insertedCount} new classifications and updated ${result.modifiedCount}`
    );

    if (
      result.insertedCount !== plan.creates.length ||
      result.modifiedCount !== plan.updates.length
    ) {
      throw new Error(
        `MIT sync wrote ${result.insertedCount} of ${plan.creates.length} new classifications and ${result.modifiedCount} of ${plan.updates.length} updates`
      );
    }
  }

  async run(): Promise<Plan> {
    if (this.dryRun) {
      this.reporter.warn(
        'Dry run: the plan below is reported but not written. Set `MIT_SYNC_DRY_RUN=false` to write it.'
      );
    }

    await this.mongoClient.connect();

    try {
      const csv = await this.fetchExport();

      const rows = parseExport(csv);

      const aiidprod = this.mongoClient.db('aiidprod');

      const taxonomy = await aiidprod.collection('taxa').findOne({ namespace: NAMESPACE });

      const permitted = taxonomyPermittedValues(taxonomy);

      const incidents = await aiidprod
        .collection('incidents')
        .find({}, { projection: { incident_id: 1 } })
        .toArray();

      const incidentIds = new Set<number>(incidents.map((incident) => incident.incident_id));

      const existing = await aiidprod
        .collection('classifications')
        .find({ namespace: NAMESPACE })
        .toArray();

      this.reporter.log(
        `Database: ${incidentIds.size} incidents, ${existing.length} ${NAMESPACE} classifications`
      );

      const plan = buildPlan({ rows, permitted, incidentIds, existing });

      this.describePlan(plan);

      this.checkPlan(plan);

      if (this.dryRun) {
        this.reporter.log(
          `Dry run complete: ${plan.creates.length} classifications would be created and ${plan.updates.length} updated (${plan.fieldUpdates} field values); nothing was written`
        );
      } else {
        await this.apply(plan);
      }

      return plan;
    } finally {
      await this.mongoClient.close();
    }
  }
}
