import { ObjectId } from 'bson';
import { expect } from '@playwright/test';
import sinon from 'sinon';
import { test } from '../../utils';
import MitClassificationsSync, {
  MANAGED_FIELDS,
  buildPlan,
  fetchArcolaExport,
  mapPermittedValue,
  parseAdditionalSubdomains,
  parseExport,
  parseMaxFieldUpdates,
  sameValue,
  storedValue,
} from '../../../src/scripts/mitClassificationsSync';
import {
  ADDITIONAL_SUBDOMAINS_FIELD,
  MULTI_AGENT_SUBDOMAIN,
  PROMPT_VERSION_FIELD,
  addArcolaFields,
  additionalSubdomainsField,
  promptVersionField,
} from '../../../migrations/2026.11.03T12.00.00.add-mit-arcola-fields';
import {
  HUMAN_CORRECTED_FIELD,
  REVISION_FIELD,
  addRevisionFields,
  humanCorrectedField,
  revisionField,
} from '../../../migrations/2026.11.08T12.00.00.add-mit-revision-fields';
import seeds from '../../seeds/aiidprod/taxa';

const subdomains = [
  '1.1. Unfair discrimination and misrepresentation',
  '1.2. Exposure to toxic content',
  '6.5. Governance failure',
  '7.3. Lack of capability or robustness',
  '7.6. Multi-agent risks',
];

/** The MIT taxonomy as the migration leaves it, reduced to the values the tests use */
const taxonomy = {
  _id: new ObjectId('67c0c38a1d748d386e090c07'),
  namespace: 'MIT',
  field_list: [
    {
      short_name: 'Risk Domain',
      display_type: 'enum',
      permitted_values: [
        '1. Discrimination and Toxicity',
        '4. Malicious Actors & Misuse',
        '7. AI system safety, failures, and limitations',
      ],
    },
    { short_name: 'Risk Subdomain', display_type: 'enum', permitted_values: subdomains },
    { short_name: 'Entity', display_type: 'enum', permitted_values: ['Human', 'AI', 'Other'] },
    {
      short_name: 'Timing',
      display_type: 'enum',
      permitted_values: ['Pre-deployment', 'Post-deployment', 'Other'],
    },
    {
      short_name: 'Intent',
      display_type: 'enum',
      permitted_values: ['Intentional', 'Unintentional', 'Other'],
    },
    additionalSubdomainsField(subdomains),
    promptVersionField,
    revisionField,
    humanCorrectedField,
  ],
};

const columns = [
  'aiid_id',
  'title',
  'domain_code',
  'subdomain_code',
  'causal_entity',
  'causal_timing',
  'causal_intent',
  'additional_subdomains',
  'prompt_version',
  'classified_at',
  // Appended to the export in version 1.1.0 of the API
  'revision',
  'human_corrected',
];

const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;

/** A CSV in the shape of the Arcola export: quoted cells, JSON inside cells, columns by name */
const csvFrom = (rows: Record<string, string>[], header = columns) =>
  [
    header.map(quote).join(','),
    ...rows.map((row) => header.map((column) => quote(row[column] ?? '')).join(',')),
  ].join('\n') + '\n';

const row = (overrides: Record<string, string> = {}): Record<string, string> => ({
  aiid_id: '1',
  title: 'Incident 1',
  domain_code: '1 Discrimination & Toxicity',
  subdomain_code: '1.2 Exposure to toxic content',
  causal_entity: 'AI',
  causal_timing: 'Post-deployment',
  causal_intent: 'Unintentional',
  additional_subdomains: JSON.stringify([
    { code: '7.3 Lack of capability or robustness', justification: 'why' },
    { code: '6.5 Governance failure', justification: 'why' },
  ]),
  prompt_version: 'aiid.v2',
  classified_at: '2026-07-18 15:59:10.018+00',
  revision: '2',
  human_corrected: 'false',
  ...overrides,
});

/** The taxonomy values `row()` stands for once mapped */
const mappedValues = {
  'Risk Domain': '1. Discrimination and Toxicity',
  'Risk Subdomain': '1.2. Exposure to toxic content',
  Entity: 'AI',
  Timing: 'Post-deployment',
  Intent: 'Unintentional',
  'Additional Subdomains': ['7.3. Lack of capability or robustness', '6.5. Governance failure'],
  'Prompt Version': 'aiid.v2',
  Revision: 2,
  'Human Corrected': false,
};

const attributesOf = (values: Record<string, unknown>) =>
  Object.entries(values).map(([short_name, value]) => ({
    short_name,
    value_json: JSON.stringify(value),
  }));

const stored = (
  incident_id: number,
  values: Record<string, unknown>,
  id = '650000000000000000000001'
) => ({
  _id: new ObjectId(id),
  namespace: 'MIT',
  incidents: [incident_id],
  reports: [],
  attributes: attributesOf(values),
  notes: '',
  publish: true,
  created_at: new Date('2025-02-27T21:41:01.428Z'),
});

const now = new Date('2026-11-03T07:40:00.000Z');

let clock: sinon.SinonFakeTimers;

test.beforeEach(() => {
  clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
});

test.afterEach(() => {
  clock.restore();
});

const createMocks = ({
  csv = csvFrom([row()]),
  incidents = [1, 2, 3],
  classifications = [] as any[],
  taxonomyDoc = taxonomy as any,
} = {}) => {
  const reporter = { log: sinon.stub(), error: sinon.stub(), warn: sinon.stub() };

  const taxaCollection = { findOne: sinon.stub().resolves(taxonomyDoc) };

  const incidentsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(incidents.map((incident_id) => ({ incident_id }))),
    }),
  };

  const classificationsCollection = {
    find: sinon.stub().returns({ toArray: sinon.stub().resolves(classifications) }),
    bulkWrite: sinon.stub().callsFake(async (operations: any[]) => ({
      insertedCount: operations.filter((operation) => operation.insertOne).length,
      modifiedCount: operations.filter((operation) => operation.updateOne).length,
    })),
  };

  const collections: Record<string, any> = {
    taxa: taxaCollection,
    incidents: incidentsCollection,
    classifications: classificationsCollection,
  };

  const mongoClient = {
    connect: sinon.stub().resolves(),
    close: sinon.stub().resolves(),
    db: sinon.stub().callsFake((name: string) => {
      if (name !== 'aiidprod') {
        throw new Error(`Unexpected database name: ${name}`);
      }

      return { collection: (collection: string) => collections[collection] };
    }),
  };

  const fetchExport = sinon.stub().resolves(csv);

  return {
    reporter,
    taxaCollection,
    incidentsCollection,
    classificationsCollection,
    mongoClient,
    fetchExport,
  };
};

type Mocks = ReturnType<typeof createMocks>;

const createSync = (mocks: Mocks, options: Record<string, unknown> = {}) =>
  new MitClassificationsSync({
    mongoClient: mocks.mongoClient as any,
    fetchExport: mocks.fetchExport,
    reporter: mocks.reporter,
    dryRun: false,
    maxFieldUpdates: 100,
    ...options,
  });

test('MIT sync - parseExport reads columns by name, ignores extra columns and accepts multi-line cells', () => {
  const shuffled = [...columns].reverse().concat(['natsec_summary']);

  const rows = parseExport(
    csvFrom([{ ...row(), natsec_summary: 'line one\nline two, with a comma' }], shuffled)
  );

  expect(rows).toHaveLength(1);
  expect(rows[0].incident_id).toBe(1);
  expect(rows[0].values.subdomain_code).toBe('1.2 Exposure to toxic content');
  expect(rows[0].values.natsec_summary).toBe('line one\nline two, with a comma');
});

test('MIT sync - parseExport rejects an export without the columns it needs', () => {
  const header = columns.filter((column) => column !== 'prompt_version');

  expect(() => parseExport(csvFrom([row()], header))).toThrow(
    /missing the column\(s\) prompt_version/
  );

  // An export from before version 1.1.0 of the API has neither revision column
  const before = columns.filter((column) => !['revision', 'human_corrected'].includes(column));

  expect(() => parseExport(csvFrom([row()], before))).toThrow(
    /missing the column\(s\) revision, human_corrected/
  );
});

test('MIT sync - parseExport rejects more than one row per incident', () => {
  expect(() => parseExport(csvFrom([row(), row({ prompt_version: 'aiid.v1' })]))).toThrow(
    /more than one row for incident 1/
  );
});

test('MIT sync - parseExport rejects an invalid incident number', () => {
  expect(() => parseExport(csvFrom([row({ aiid_id: 'abc' })]))).toThrow(/invalid aiid_id/);
});

test('MIT sync - values map onto the taxonomy by numeric code or exactly', () => {
  const domains = taxonomy.field_list[0].permitted_values;

  expect(mapPermittedValue('1 Discrimination & Toxicity', domains)).toBe(
    '1. Discrimination and Toxicity'
  );
  expect(mapPermittedValue('4 Malicious actors', domains)).toBe('4. Malicious Actors & Misuse');
  expect(mapPermittedValue('7. AI system safety, failures, and limitations', domains)).toBe(
    '7. AI system safety, failures, and limitations'
  );
  expect(mapPermittedValue('7.6 Multi-agent risks', subdomains)).toBe('7.6. Multi-agent risks');
  expect(mapPermittedValue('9.9 Something new', subdomains)).toBeUndefined();
  expect(mapPermittedValue('AI', ['Human', 'AI', 'Other'])).toBe('AI');
  expect(mapPermittedValue('Robot', ['Human', 'AI', 'Other'])).toBeUndefined();
});

test('MIT sync - additional_subdomains cells are JSON lists of codes with justifications', () => {
  expect(parseAdditionalSubdomains('')).toEqual([]);
  expect(
    parseAdditionalSubdomains('[{"code":"7.3 Lack","justification":"x"},"6.5 Governance failure"]')
  ).toEqual(['7.3 Lack', '6.5 Governance failure']);
  expect(() => parseAdditionalSubdomains('not json')).toThrow(/not valid JSON/);
  expect(() => parseAdditionalSubdomains('[{"justification":"x"}]')).toThrow(/no code/);
});

test('MIT sync - the field update limit defaults to 500 and must be a whole number', () => {
  expect(parseMaxFieldUpdates(undefined)).toBe(500);
  expect(parseMaxFieldUpdates('')).toBe(500);
  expect(parseMaxFieldUpdates('25')).toBe(25);
  expect(parseMaxFieldUpdates(0)).toBe(0);
  expect(() => parseMaxFieldUpdates('many')).toThrow(/MIT_SYNC_MAX_FIELD_UPDATES/);
});

test('MIT sync - creates a classification for an incident that has none', async () => {
  const mocks = createMocks();

  const plan = await createSync(mocks).run();

  expect(plan.creates.map((create) => create.incident_id)).toEqual([1]);
  expect(plan.fieldUpdates).toBe(MANAGED_FIELDS.length);

  sinon.assert.calledOnce(mocks.classificationsCollection.bulkWrite);

  const [operations, options] = mocks.classificationsCollection.bulkWrite.firstCall.args;

  expect(options).toEqual({ ordered: true });
  expect(operations).toEqual([
    {
      insertOne: {
        document: {
          namespace: 'MIT',
          incidents: [1],
          reports: [],
          attributes: attributesOf(mappedValues),
          notes: '',
          publish: true,
          created_at: now,
        },
      },
    },
  ]);
});

test('MIT sync - leaves a classification alone when the export carries the same values', async () => {
  const mocks = createMocks({
    classifications: [
      stored(1, {
        ...mappedValues,
        // Order of the secondary subdomains does not matter
        'Additional Subdomains': [
          '6.5. Governance failure',
          '7.3. Lack of capability or robustness',
        ],
      }),
    ],
  });

  const plan = await createSync(mocks).run();

  expect(plan.unchanged).toBe(1);
  expect(plan.updates).toEqual([]);
  expect(plan.fieldUpdates).toBe(0);

  sinon.assert.notCalled(mocks.classificationsCollection.bulkWrite);
});

test('MIT sync - updates a classification whose revision went up, keeping attributes it does not manage', async () => {
  const mocks = createMocks({
    csv: csvFrom([row({ causal_entity: 'Human', prompt_version: 'aiid.v2.1', revision: '3' })]),
    classifications: [stored(1, { ...mappedValues, Reviewer: 'someone' })],
  });

  const plan = await createSync(mocks).run();

  expect(plan.updates).toHaveLength(1);
  expect(plan.updates[0].changes).toEqual([
    { field: 'Entity', from: 'AI', to: 'Human' },
    { field: 'Prompt Version', from: 'aiid.v2', to: 'aiid.v2.1' },
    { field: 'Revision', from: 2, to: 3 },
  ]);
  expect(plan.fieldUpdates).toBe(3);

  const [operations] = mocks.classificationsCollection.bulkWrite.firstCall.args;

  expect(operations).toEqual([
    {
      updateOne: {
        filter: { _id: new ObjectId('650000000000000000000001') },
        update: {
          $set: {
            attributes: attributesOf({
              ...mappedValues,
              Reviewer: 'someone',
              Entity: 'Human',
              'Prompt Version': 'aiid.v2.1',
              Revision: 3,
            }),
          },
        },
      },
    },
  ]);

  // Revisions and booleans are stored as JSON numbers and booleans, like the CSET int and bool fields
  const attributes = operations[0].updateOne.update.$set.attributes;

  expect(attributes.find((a: any) => a.short_name === 'Revision').value_json).toBe('3');
  expect(attributes.find((a: any) => a.short_name === 'Human Corrected').value_json).toBe('false');
});

test('MIT sync - updates a classification re-classified under the same prompt version when the revision went up', async () => {
  // The export has hundreds of these: aiid.v2 at revision 2 and again at revision 3
  const mocks = createMocks({
    csv: csvFrom([row({ causal_intent: 'Intentional', revision: '3' })]),
    classifications: [stored(1, mappedValues)],
  });

  const plan = await createSync(mocks).run();

  expect(plan.updates[0].changes).toEqual([
    { field: 'Intent', from: 'Unintentional', to: 'Intentional' },
    { field: 'Revision', from: 2, to: 3 },
  ]);

  sinon.assert.calledOnce(mocks.classificationsCollection.bulkWrite);
});

test('MIT sync - records a new revision even when every other value is the same', async () => {
  const mocks = createMocks({
    csv: csvFrom([row({ revision: '3' })]),
    classifications: [stored(1, mappedValues)],
  });

  const plan = await createSync(mocks).run();

  expect(plan.updates[0].changes).toEqual([{ field: 'Revision', from: 2, to: 3 }]);
  expect(plan.fieldUpdates).toBe(1);

  sinon.assert.calledOnce(mocks.classificationsCollection.bulkWrite);
});

test('MIT sync - records a human correction that comes with a new revision', async () => {
  const mocks = createMocks({
    csv: csvFrom([
      row({ causal_timing: 'Pre-deployment', human_corrected: 'true', revision: '3' }),
    ]),
    classifications: [stored(1, mappedValues)],
  });

  const plan = await createSync(mocks).run();

  expect(plan.humanCorrected).toBe(1);
  expect(plan.updates[0].changes).toEqual([
    { field: 'Timing', from: 'Post-deployment', to: 'Pre-deployment' },
    { field: 'Revision', from: 2, to: 3 },
    { field: 'Human Corrected', from: false, to: true },
  ]);

  sinon.assert.calledOnce(mocks.classificationsCollection.bulkWrite);
});

test('MIT sync - a classification without a revision is brought up to date on the first run', async () => {
  const legacy = { ...mappedValues } as Record<string, unknown>;

  delete legacy['Prompt Version'];
  delete legacy['Additional Subdomains'];
  delete legacy.Revision;
  delete legacy['Human Corrected'];
  legacy.Intent = 'Intentional';

  const mocks = createMocks({ classifications: [stored(1, legacy)] });

  const plan = await createSync(mocks).run();

  expect(plan.updates[0].changes).toEqual([
    { field: 'Intent', from: 'Intentional', to: 'Unintentional' },
    {
      field: 'Additional Subdomains',
      from: [],
      to: ['7.3. Lack of capability or robustness', '6.5. Governance failure'],
    },
    { field: 'Prompt Version', from: undefined, to: 'aiid.v2' },
    { field: 'Revision', from: undefined, to: 2 },
    { field: 'Human Corrected', from: undefined, to: false },
  ]);

  sinon.assert.calledOnce(mocks.classificationsCollection.bulkWrite);
});

test('MIT sync - a classification written before the revision fields existed gains them', async () => {
  const withoutRevision = { ...mappedValues } as Record<string, unknown>;

  delete withoutRevision.Revision;
  delete withoutRevision['Human Corrected'];

  const mocks = createMocks({ classifications: [stored(1, withoutRevision)] });

  const plan = await createSync(mocks).run();

  expect(plan.violations).toEqual([]);
  expect(plan.updates[0].changes).toEqual([
    { field: 'Revision', from: undefined, to: 2 },
    { field: 'Human Corrected', from: undefined, to: false },
  ]);
});

test('MIT sync - refuses to change a classification under the same revision, writing nothing', async () => {
  const mocks = createMocks({
    csv: csvFrom([row({ aiid_id: '2' }), row({ causal_entity: 'Human' })]),
    classifications: [stored(1, mappedValues)],
  });

  await expect(createSync(mocks).run()).rejects.toThrow(
    /1 classifications changed without a new revision, for example incident 1 changed under the same revision 2: Entity: "AI" -> "Human"\. A classification may only change when the export carries a higher revision for it\./
  );

  // Incident 2 would have been created, but nothing is written when any rule fails
  sinon.assert.notCalled(mocks.classificationsCollection.bulkWrite);
  sinon.assert.calledWithMatch(
    mocks.reporter.error,
    /incident 1 changed under the same revision 2: Entity/
  );
});

test('MIT sync - a new prompt version or a human correction under the same revision is refused too', async () => {
  const cases: Record<string, string>[] = [
    { prompt_version: 'aiid.v3' },
    { human_corrected: 'true' },
  ];

  for (const overrides of cases) {
    const mocks = createMocks({
      csv: csvFrom([row(overrides)]),
      classifications: [stored(1, mappedValues)],
    });

    await expect(createSync(mocks).run()).rejects.toThrow(
      /1 classifications changed without a new revision/
    );

    sinon.assert.notCalled(mocks.classificationsCollection.bulkWrite);
  }
});

test('MIT sync - refuses a revision lower than the one stored, writing nothing', async () => {
  const mocks = createMocks({
    csv: csvFrom([row({ aiid_id: '2' }), row({ causal_entity: 'Human', revision: '1' })]),
    classifications: [stored(1, { ...mappedValues, Revision: 3 })],
  });

  await expect(createSync(mocks).run()).rejects.toThrow(
    /1 classifications have a lower revision than the one stored, for example incident 1 has revision 1 in the export, below the stored revision 3: Entity: "AI" -> "Human"; Revision: 3 -> 1/
  );

  sinon.assert.notCalled(mocks.classificationsCollection.bulkWrite);

  // Even when nothing but the revision differs
  const sameValues = createMocks({
    csv: csvFrom([row({ revision: '1' })]),
    classifications: [stored(1, mappedValues)],
  });

  await expect(createSync(sameValues).run()).rejects.toThrow(/lower revision than the one stored/);
});

test('MIT sync - reports both kinds of revision violation in one error', async () => {
  const mocks = createMocks({
    csv: csvFrom([row({ causal_entity: 'Human' }), row({ aiid_id: '2', revision: '1' })]),
    classifications: [stored(1, mappedValues), stored(2, mappedValues, '650000000000000000000002')],
  });

  await expect(createSync(mocks).run()).rejects.toThrow(
    /1 classifications changed without a new revision and 1 classifications have a lower revision than the one stored/
  );
});

test('MIT sync - refuses a row whose revision or human_corrected is not valid', async () => {
  const cases: [Record<string, string>, RegExp][] = [
    [{ revision: '0' }, /Revision "0" \(not a positive whole number\)/],
    [{ revision: '1.5' }, /Revision "1.5" \(not a positive whole number\)/],
    [{ revision: '' }, /Revision "" \(not a positive whole number\)/],
    [{ human_corrected: 'yes' }, /Human Corrected "yes" \(not true or false\)/],
    [{ human_corrected: '' }, /Human Corrected "" \(not true or false\)/],
  ];

  for (const [overrides, message] of cases) {
    const mocks = createMocks({ csv: csvFrom([row(overrides)]) });

    await expect(createSync(mocks).run()).rejects.toThrow(message);

    sinon.assert.notCalled(mocks.classificationsCollection.bulkWrite);
  }
});

test('MIT sync - stored revisions and booleans compare by value', () => {
  const classification = {
    attributes: [
      { short_name: 'Revision', value_json: '3' },
      { short_name: 'Human Corrected', value_json: 'true' },
      { short_name: 'Old Revision', value_json: '"2"' },
      { short_name: 'Old Flag', value_json: '"false"' },
      { short_name: 'Empty', value_json: 'null' },
    ],
  };

  expect(storedValue(classification, 'Revision', 'int')).toBe(3);
  expect(storedValue(classification, 'Human Corrected', 'bool')).toBe(true);
  expect(storedValue(classification, 'Old Revision', 'int')).toBe(2);
  expect(storedValue(classification, 'Old Flag', 'bool')).toBe(false);
  expect(storedValue(classification, 'Empty', 'int')).toBeUndefined();
  expect(storedValue(classification, 'Missing', 'bool')).toBeUndefined();

  expect(sameValue('int', 3, 3)).toBe(true);
  expect(sameValue('int', 3, 4)).toBe(false);
  expect(sameValue('bool', false, false)).toBe(true);
  expect(sameValue('bool', undefined, false)).toBe(false);
});

test('MIT sync - refuses a run that would write more field values than the limit', async () => {
  const mocks = createMocks({ csv: csvFrom([row(), row({ aiid_id: '2' })]) });

  // Two new classifications of nine fields each
  expect(MANAGED_FIELDS).toHaveLength(9);

  await expect(createSync(mocks, { maxFieldUpdates: 17 }).run()).rejects.toThrow(
    /would write 18 field values, above the MIT_SYNC_MAX_FIELD_UPDATES limit of 17/
  );

  sinon.assert.notCalled(mocks.classificationsCollection.bulkWrite);

  const relaxed = createMocks({ csv: csvFrom([row(), row({ aiid_id: '2' })]) });

  await createSync(relaxed, { maxFieldUpdates: 18 }).run();

  sinon.assert.calledOnce(relaxed.classificationsCollection.bulkWrite);
});

test('MIT sync - refuses a value the taxonomy does not permit, writing nothing', async () => {
  const mocks = createMocks({
    csv: csvFrom([row({ aiid_id: '2' }), row({ subdomain_code: '9.9 Something new' })]),
  });

  await expect(createSync(mocks).run()).rejects.toThrow(
    /1 values do not map onto the taxonomy, for example incident 1 Risk Subdomain "9.9 Something new" \(not a permitted value\)/
  );

  sinon.assert.notCalled(mocks.classificationsCollection.bulkWrite);
});

test('MIT sync - refuses a row without a prompt version', async () => {
  const mocks = createMocks({ csv: csvFrom([row({ prompt_version: ' ' })]) });

  await expect(createSync(mocks).run()).rejects.toThrow(/Prompt Version " " \(empty\)/);

  sinon.assert.notCalled(mocks.classificationsCollection.bulkWrite);
});

test('MIT sync - skips rows for incidents that do not exist and says so', async () => {
  const mocks = createMocks({ csv: csvFrom([row(), row({ aiid_id: '999' })]) });

  const plan = await createSync(mocks).run();

  expect(plan.unknownIncidents).toEqual([999]);
  expect(plan.creates.map((create) => create.incident_id)).toEqual([1]);

  sinon.assert.calledWithMatch(
    mocks.reporter.warn,
    /Skipping 1 rows whose incident is not in the database: 999/
  );
});

test('MIT sync - refuses to run against a taxonomy without the sync fields', async () => {
  const mocks = createMocks({
    taxonomyDoc: { ...taxonomy, field_list: taxonomy.field_list.slice(0, 5) },
  });

  await expect(createSync(mocks).run()).rejects.toThrow(
    'has no Additional Subdomains, Prompt Version, Revision, Human Corrected field; run migrations 2026.11.03T12.00.00.add-mit-arcola-fields.ts, 2026.11.08T12.00.00.add-mit-revision-fields.ts before syncing'
  );

  const withoutRevision = createMocks({
    taxonomyDoc: { ...taxonomy, field_list: taxonomy.field_list.slice(0, 7) },
  });

  await expect(createSync(withoutRevision).run()).rejects.toThrow(
    'has no Revision, Human Corrected field; run migration 2026.11.08T12.00.00.add-mit-revision-fields.ts before syncing'
  );
});

test('MIT sync - refuses to run while an incident holds two MIT classifications', async () => {
  const mocks = createMocks({
    classifications: [stored(1, mappedValues), stored(1, mappedValues, '650000000000000000000002')],
  });

  await expect(createSync(mocks).run()).rejects.toThrow(
    /incidents hold more than one MIT classification \(1\)/
  );

  sinon.assert.notCalled(mocks.classificationsCollection.bulkWrite);
});

test('MIT sync - a dry run applies every rule and writes nothing', async () => {
  const mocks = createMocks({
    csv: csvFrom([row(), row({ aiid_id: '2', revision: '3' })]),
    classifications: [stored(2, { ...mappedValues, Entity: 'Human' })],
  });

  const plan = await createSync(mocks, { dryRun: true }).run();

  expect(plan.creates.map((create) => create.incident_id)).toEqual([1]);
  expect(plan.updates.map((update) => update.incident_id)).toEqual([2]);

  sinon.assert.notCalled(mocks.classificationsCollection.bulkWrite);
  sinon.assert.calledWithMatch(mocks.reporter.warn, /Dry run/);
  sinon.assert.calledWithMatch(
    mocks.reporter.log,
    /Dry run complete: 1 classifications would be created and 1 updated \(11 field values\); nothing was written/
  );
  sinon.assert.calledOnce(mocks.mongoClient.close);

  const violating = createMocks({
    csv: csvFrom([row({ causal_entity: 'Human' })]),
    classifications: [stored(1, mappedValues)],
  });

  await expect(createSync(violating, { dryRun: true }).run()).rejects.toThrow(
    /without a new revision/
  );
});

test('MIT sync - buildPlan counts prompt versions, revisions and corrections and reports the plan it would write', () => {
  const rows = parseExport(
    csvFrom([
      row(),
      row({ aiid_id: '2', prompt_version: 'aiid.v2.1', revision: '1' }),
      row({ aiid_id: '3', revision: '10', human_corrected: 'true' }),
    ])
  );

  const permitted = new Map(
    taxonomy.field_list.map((field) => [field.short_name, field.permitted_values])
  );

  const plan = buildPlan({
    rows,
    permitted,
    incidentIds: new Set([1, 2]),
    existing: [stored(1, mappedValues)],
  });

  expect(plan).toMatchObject({
    rows: 3,
    unchanged: 1,
    unknownIncidents: [3],
    promptVersions: { 'aiid.v2': 2, 'aiid.v2.1': 1 },
    revisions: { '1': 1, '2': 1, '10': 1 },
    humanCorrected: 1,
    fieldUpdates: MANAGED_FIELDS.length,
  });
  expect(plan.creates.map((create) => create.incident_id)).toEqual([2]);
});

test('MIT sync - the plan summary lists revisions in numeric order and the corrected rows', async () => {
  const mocks = createMocks({
    csv: csvFrom([
      row({ revision: '10' }),
      row({ aiid_id: '2', revision: '2', human_corrected: 'true' }),
    ]),
  });

  await createSync(mocks, { dryRun: true }).run();

  sinon.assert.calledWithMatch(
    mocks.reporter.log,
    'Arcola export: 2 rows; prompt versions aiid.v2=2; revisions 2=1, 10=1; 1 human-corrected'
  );
});

test('MIT sync - fetchArcolaExport sends the API key and rejects anything but a 200', async () => {
  const fetchImpl = sinon
    .stub()
    .resolves({ ok: true, status: 200, statusText: 'OK', text: async () => 'csv' });

  expect(
    await fetchArcolaExport({ apiKey: 'secret', url: 'https://example.test/export', fetchImpl })
  ).toBe('csv');

  sinon.assert.calledOnceWithExactly(fetchImpl, 'https://example.test/export', {
    headers: { 'X-API-Key': 'secret', Accept: 'text/csv' },
  });

  const failing = sinon
    .stub()
    .resolves({ ok: false, status: 429, statusText: 'Too Many Requests', text: async () => '' });

  await expect(fetchArcolaExport({ apiKey: 'secret', fetchImpl: failing })).rejects.toThrow(
    /HTTP 429 Too Many Requests/
  );

  await expect(fetchArcolaExport({ apiKey: undefined, fetchImpl })).rejects.toThrow(
    /ARCOLA_API_KEY/
  );
});

test('MIT sync - the migrations turn the taxonomy from before the sync into the seed the end-to-end tests use', async () => {
  const seed = (seeds as any[]).find((entry) => entry.namespace === 'MIT');

  // The seed with the migration's additions undone
  const before = JSON.parse(JSON.stringify(seed));

  before._id = new ObjectId('67c0c38a1d748d386e090c07');
  before.field_list = before.field_list.filter(
    (field: any) =>
      ![
        ADDITIONAL_SUBDOMAINS_FIELD,
        PROMPT_VERSION_FIELD,
        REVISION_FIELD,
        HUMAN_CORRECTED_FIELD,
      ].includes(field.short_name)
  );

  const subdomain = before.field_list.find((field: any) => field.short_name === 'Risk Subdomain');

  subdomain.permitted_values = subdomain.permitted_values.filter(
    (value: string) => value !== MULTI_AGENT_SUBDOMAIN
  );
  subdomain.long_description = subdomain.long_description.replace(
    /\n\n## 7\.6 Multi-agent risks[\s\S]*$/,
    ''
  );
  subdomain.short_description = subdomain.short_description.replace(
    '24 subdomains',
    '23 subdomains'
  );
  before.description = before.description
    .replace(/\n\nSince November 2026[^\n]*$/, '')
    .replace('24 specific subdomains', '23 specific domains');

  expect(before.field_list).toHaveLength(5);
  expect(before.description).not.toContain('Arcola');

  // A one-document taxa collection, so the second migration reads what the first one wrote
  let document = before;

  const taxa = {
    findOne: sinon
      .stub()
      .callsFake(async () => ({ ...JSON.parse(JSON.stringify(document)), _id: document._id })),
    updateOne: sinon.stub().callsFake(async (filter: any, update: any) => {
      expect(filter).toEqual({ _id: before._id });
      document = { ...document, ...update.$set };

      return { modifiedCount: 1 };
    }),
  };

  expect(await addArcolaFields(taxa as any)).toEqual({
    added: [ADDITIONAL_SUBDOMAINS_FIELD, PROMPT_VERSION_FIELD],
    subdomainAdded: true,
  });

  expect(await addRevisionFields(taxa as any)).toEqual({
    added: [REVISION_FIELD, HUMAN_CORRECTED_FIELD],
  });

  sinon.assert.calledTwice(taxa.updateOne);

  expect(document.field_list).toEqual(seed.field_list);
  expect(document.description).toEqual(seed.description);
});
