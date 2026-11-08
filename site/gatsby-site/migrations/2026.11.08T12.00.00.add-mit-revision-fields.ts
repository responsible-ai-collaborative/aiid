import { Collection, Document, MongoClient } from 'mongodb';

/**
 * MIT taxonomy fields for the revision of each Arcola classification (November 2026).
 *
 * Version 1.1.0 of the Arcola AI platform API appends two columns to the export the MIT sync
 * reads (`src/scripts/mitClassificationsSync.ts`): `revision`, a number per incident that is 1 for
 * its first classification and one higher for each later one, and `human_corrected`, whether a
 * person set a value on the row. The sync now replaces a stored classification only when the
 * export carries a higher revision, so the revision has to live in the classification.
 *
 * - Adds `Revision` (int) and `Human Corrected` (bool) to the MIT field list
 * - Rewrites the Prompt Version description, which said that the prompt version decides when a
 *   classification is replaced, and the taxonomy description's paragraph on the automated refresh
 *
 * Runs after `2026.11.03T12.00.00.add-mit-arcola-fields.ts`. Idempotent, and `down` only reverts
 * what `up` changed.
 */

export const NAMESPACE = 'MIT';

export const REVISION_FIELD = 'Revision';

export const HUMAN_CORRECTED_FIELD = 'Human Corrected';

export const PROMPT_VERSION_FIELD = 'Prompt Version';

/** The paragraph `2026.11.03T12.00.00.add-mit-arcola-fields.ts` added to the taxonomy description */
export const PREVIOUS_SYNC_PARAGRAPH = `Since November 2026 these classifications are refreshed automatically from the [Arcola AI](https://platform.arcolaai.com/) platform's classifier. The Prompt Version field records which generation of the classifier produced an incident's classification, and Additional Subdomains lists the further subdomains the classifier found to apply.`;

export const SYNC_PARAGRAPH = `Since November 2026 these classifications are refreshed automatically from the [Arcola AI](https://platform.arcolaai.com/) platform's classifier. Additional Subdomains lists the further subdomains the classifier found to apply, Prompt Version records which version of the classifier prompt produced the classification, Revision counts the classifications of the incident (1 for the first, one higher for each re-classification), and Human Corrected says whether a person set any of its values by hand.`;

/** The Prompt Version description `2026.11.03T12.00.00.add-mit-arcola-fields.ts` wrote */
export const PREVIOUS_PROMPT_VERSION_DESCRIPTION =
  "The version of the classifier prompt that produced the incident's MIT classification, for example `aiid.v2`. The classifications are refreshed automatically from the Arcola AI platform, and a stored classification is only replaced when the platform has re-classified the incident under a new prompt version, so this field records which generation of the classifier the other fields come from.";

export const PROMPT_VERSION_DESCRIPTION =
  "The version of the classifier prompt that produced the incident's MIT classification, for example `aiid.v2`. An incident can be re-classified under the same prompt version, for example by a different model or after a person corrected a value; the Revision field counts every re-classification.";

export const revisionField: Document = {
  short_name: REVISION_FIELD,
  long_name: REVISION_FIELD,
  short_description:
    'The revision of the automated classification: 1 for the first classification of the incident, one higher for each later one.',
  long_description:
    "The revision number the Arcola AI platform gives the incident's MIT classification: 1 for the first time the incident was classified, and one higher each time it is re-classified, whether under a new prompt version, by a different model or because a person corrected a value. The classifications are refreshed automatically, and a stored classification only changes when the platform publishes a higher revision for the incident.",
  display_type: 'int',
  mongo_type: 'int',
  default: '',
  weight: 1,
  instant_facet: false,
  required: false,
  public: true,
  hide_search: true,
  permitted_values: [],
};

export const humanCorrectedField: Document = {
  short_name: HUMAN_CORRECTED_FIELD,
  long_name: HUMAN_CORRECTED_FIELD,
  short_description: 'Whether a person corrected a value of the automated classification.',
  long_description:
    "Whether a person set any of the values of the incident's MIT classification by hand on the Arcola AI platform, rather than leaving every value to the automated classifier. A correction is published as a new Revision of the classification.",
  display_type: 'bool',
  mongo_type: 'bool',
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

  return taxonomy;
};

/** Adds the revision fields and brings the descriptions in line with the revision rule. */
export const addRevisionFields = async (
  taxa: Collection<Document>
): Promise<{ added: string[] }> => {
  const taxonomy = await getTaxonomy(taxa);

  const fieldList: Document[] = taxonomy.field_list || [];

  const added: string[] = [];

  for (const field of [revisionField, humanCorrectedField]) {
    if (!fieldList.some((entry) => entry.short_name === field.short_name)) {
      fieldList.push({ ...field, permitted_values: [] });
      added.push(field.short_name);
    }
  }

  const promptVersion = fieldList.find((field) => field.short_name === PROMPT_VERSION_FIELD);

  if (promptVersion && promptVersion.long_description === PREVIOUS_PROMPT_VERSION_DESCRIPTION) {
    promptVersion.long_description = PROMPT_VERSION_DESCRIPTION;
  }

  let description: string = taxonomy.description || '';

  if (description.includes(PREVIOUS_SYNC_PARAGRAPH)) {
    description = description.replace(PREVIOUS_SYNC_PARAGRAPH, SYNC_PARAGRAPH);
  } else if (!description.includes(SYNC_PARAGRAPH)) {
    description = `${description.trimEnd()}\n\n${SYNC_PARAGRAPH}`;
  }

  await taxa.updateOne({ _id: taxonomy._id }, { $set: { field_list: fieldList, description } });

  return { added };
};

/** Reverts `addRevisionFields`. Classifications that already carry the fields are left alone. */
export const removeRevisionFields = async (taxa: Collection<Document>): Promise<void> => {
  const taxonomy = await getTaxonomy(taxa);

  const fieldList = ((taxonomy.field_list || []) as Document[]).filter(
    (field) => ![REVISION_FIELD, HUMAN_CORRECTED_FIELD].includes(field.short_name)
  );

  const promptVersion = fieldList.find((field) => field.short_name === PROMPT_VERSION_FIELD);

  if (promptVersion && promptVersion.long_description === PROMPT_VERSION_DESCRIPTION) {
    promptVersion.long_description = PREVIOUS_PROMPT_VERSION_DESCRIPTION;
  }

  const description = (taxonomy.description || '').replace(SYNC_PARAGRAPH, PREVIOUS_SYNC_PARAGRAPH);

  await taxa.updateOne({ _id: taxonomy._id }, { $set: { field_list: fieldList, description } });
};

export const up = async ({ context: { client } }: { context: { client: MongoClient } }) => {
  const { added } = await addRevisionFields(client.db('aiidprod').collection('taxa'));

  console.log(`${NAMESPACE} taxonomy: added ${added.length ? added.join(', ') : 'no new fields'}`);
};

export const down = async ({ context: { client } }: { context: { client: MongoClient } }) => {
  await removeRevisionFields(client.db('aiidprod').collection('taxa'));
};
