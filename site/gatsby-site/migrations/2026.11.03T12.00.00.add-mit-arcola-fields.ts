import { Collection, Document, MongoClient } from 'mongodb';

/**
 * MIT taxonomy fields for the Arcola classification sync (November 2026).
 *
 * The MIT classifications are refreshed from the Arcola AI platform's export by
 * `src/scripts/mitClassificationsSync.ts`. The export carries two things the taxonomy had no
 * field for: the further subdomains the classifier found for an incident, and the version of the
 * classifier prompt that produced the row. The sync only replaces a stored classification when
 * that prompt version changes, so the version has to live in the classification.
 *
 * - Adds `Additional Subdomains` (multi) and `Prompt Version` (string) to the MIT field list
 * - Adds `7.6. Multi-agent risks`, which the classifier uses, to the subdomain lists
 * - Mentions the automated refresh in the taxonomy description
 *
 * Idempotent: every step checks whether its change is already in place, so the migration can be
 * re-run, and `down` only removes what `up` added.
 */

export const NAMESPACE = 'MIT';

export const ADDITIONAL_SUBDOMAINS_FIELD = 'Additional Subdomains';

export const PROMPT_VERSION_FIELD = 'Prompt Version';

export const MULTI_AGENT_SUBDOMAIN = '7.6. Multi-agent risks';

const MULTI_AGENT_SECTION = `## 7.6 Multi-agent risks

Risks from multi-agent interactions, due to incentives (which can lead to conflict or collusion) and/or the structure of the system, such as a loss of control or emergent behaviours arising from the interactions of multiple AI agents.`;

const SYNC_PARAGRAPH = `Since November 2026 these classifications are refreshed automatically from the [Arcola AI](https://platform.arcolaai.com/) platform's classifier. The Prompt Version field records which generation of the classifier produced an incident's classification, and Additional Subdomains lists the further subdomains the classifier found to apply.`;

export const additionalSubdomainsField = (permittedValues: string[]): Document => ({
  short_name: ADDITIONAL_SUBDOMAINS_FIELD,
  long_name: ADDITIONAL_SUBDOMAINS_FIELD,
  short_description:
    'Further subdomains of the Domain Taxonomy that the automated classifier found to apply to the incident, beyond the primary Risk Subdomain.',
  long_description:
    'Further subdomains of the MIT AI Risk Repository Domain Taxonomy that the automated classifier found to apply to the incident, in addition to the primary Risk Subdomain. The classifier records a justification for each; only the subdomain labels are stored here. The permitted values are those of the Risk Subdomain field.',
  display_type: 'multi',
  mongo_type: 'array',
  default: '',
  weight: 4,
  instant_facet: true,
  required: false,
  public: true,
  permitted_values: permittedValues,
});

export const promptVersionField: Document = {
  short_name: PROMPT_VERSION_FIELD,
  long_name: PROMPT_VERSION_FIELD,
  short_description:
    'The version of the automated classifier prompt that produced this classification.',
  long_description:
    "The version of the classifier prompt that produced the incident's MIT classification, for example `aiid.v2`. The classifications are refreshed automatically from the Arcola AI platform, and a stored classification is only replaced when the platform has re-classified the incident under a new prompt version, so this field records which generation of the classifier the other fields come from.",
  display_type: 'string',
  mongo_type: 'string',
  default: '',
  weight: 1,
  instant_facet: false,
  required: false,
  public: true,
  permitted_values: [],
};

const getTaxonomy = async (taxa: Collection<Document>): Promise<Document> => {
  const taxonomy = await taxa.findOne({ namespace: NAMESPACE });

  if (!taxonomy) {
    throw new Error(`The ${NAMESPACE} taxonomy is missing from the taxa collection`);
  }

  const subdomain = (taxonomy.field_list as Document[]).find(
    (field) => field.short_name === 'Risk Subdomain'
  );

  if (!subdomain || !Array.isArray(subdomain.permitted_values)) {
    throw new Error(`The ${NAMESPACE} taxonomy has no Risk Subdomain field with permitted values`);
  }

  return taxonomy;
};

/** Adds the sync fields, the multi-agent subdomain and the description paragraph. */
export const addArcolaFields = async (
  taxa: Collection<Document>
): Promise<{ added: string[]; subdomainAdded: boolean }> => {
  const taxonomy = await getTaxonomy(taxa);

  const fieldList: Document[] = taxonomy.field_list;

  const subdomain = fieldList.find((field) => field.short_name === 'Risk Subdomain')!;

  const subdomainAdded = !subdomain.permitted_values.includes(MULTI_AGENT_SUBDOMAIN);

  if (subdomainAdded) {
    subdomain.permitted_values.push(MULTI_AGENT_SUBDOMAIN);
  }

  if (
    typeof subdomain.long_description === 'string' &&
    !subdomain.long_description.includes('## 7.6')
  ) {
    subdomain.long_description = `${subdomain.long_description.trimEnd()}\n\n${MULTI_AGENT_SECTION}`;
  }

  if (typeof subdomain.short_description === 'string') {
    subdomain.short_description = subdomain.short_description.replace(
      '23 subdomains',
      '24 subdomains'
    );
  }

  const added: string[] = [];

  const additional = fieldList.find((field) => field.short_name === ADDITIONAL_SUBDOMAINS_FIELD);

  if (additional) {
    // Keep the secondary list in step with the primary one
    additional.permitted_values = [...subdomain.permitted_values];
  } else {
    fieldList.push(additionalSubdomainsField([...subdomain.permitted_values]));
    added.push(ADDITIONAL_SUBDOMAINS_FIELD);
  }

  if (!fieldList.some((field) => field.short_name === PROMPT_VERSION_FIELD)) {
    fieldList.push({ ...promptVersionField });
    added.push(PROMPT_VERSION_FIELD);
  }

  let description: string = taxonomy.description || '';

  description = description.replace('23 specific domains', '24 specific subdomains');

  if (!description.includes('Arcola')) {
    description = `${description.trimEnd()}\n\n${SYNC_PARAGRAPH}`;
  }

  await taxa.updateOne({ _id: taxonomy._id }, { $set: { field_list: fieldList, description } });

  return { added, subdomainAdded };
};

/** Reverts `addArcolaFields`. Classifications that already carry the fields are left alone. */
export const removeArcolaFields = async (taxa: Collection<Document>): Promise<void> => {
  const taxonomy = await getTaxonomy(taxa);

  const fieldList = (taxonomy.field_list as Document[]).filter(
    (field) => ![ADDITIONAL_SUBDOMAINS_FIELD, PROMPT_VERSION_FIELD].includes(field.short_name)
  );

  const subdomain = fieldList.find((field) => field.short_name === 'Risk Subdomain')!;

  subdomain.permitted_values = subdomain.permitted_values.filter(
    (value: string) => value !== MULTI_AGENT_SUBDOMAIN
  );

  if (typeof subdomain.long_description === 'string') {
    subdomain.long_description = subdomain.long_description.replace(
      `\n\n${MULTI_AGENT_SECTION}`,
      ''
    );
  }

  if (typeof subdomain.short_description === 'string') {
    subdomain.short_description = subdomain.short_description.replace(
      '24 subdomains',
      '23 subdomains'
    );
  }

  const description = (taxonomy.description || '')
    .replace(`\n\n${SYNC_PARAGRAPH}`, '')
    .replace('24 specific subdomains', '23 specific domains');

  await taxa.updateOne({ _id: taxonomy._id }, { $set: { field_list: fieldList, description } });
};

export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {
  const taxa = client.db('aiidprod').collection('taxa');

  const { added, subdomainAdded } = await addArcolaFields(taxa);

  console.log(
    `${NAMESPACE} taxonomy: added ${added.length ? added.join(', ') : 'no new fields'}; ${
      subdomainAdded ? 'added' : 'already had'
    } ${MULTI_AGENT_SUBDOMAIN}`
  );
};

export const down = async ({ context: { client } }: { context: { client: MongoClient } }) => {
  await removeArcolaFields(client.db('aiidprod').collection('taxa'));
};
