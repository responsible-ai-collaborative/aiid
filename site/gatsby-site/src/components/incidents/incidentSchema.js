import * as Yup from 'yup';

/**
 * The incident form's entity fields, keyed as the form (and the GraphQL
 * incident type) names them.
 */
export const ENTITY_FIELDS = [
  'AllegedDeployerOfAISystem',
  'AllegedDeveloperOfAISystem',
  'AllegedHarmedOrNearlyHarmedParties',
  'implicated_systems',
];

/**
 * Builds the validation schema of the incident form.
 *
 * Every entity field is required, which with this version of yup also rejects
 * an empty list. Hundreds of incidents predate the Implicated Systems field
 * (and some have other entity fields that were left blank), so requiring the
 * field on every save turned an unrelated one-line correction into a research
 * task. `optionalEntityFields` names the entity fields that may stay blank for
 * this edit; the edit page passes the fields that were already blank when the
 * record was opened, so a new incident, or a record whose field was filled in,
 * is validated as before. SEE: #4094
 *
 * @param {{ optionalEntityFields?: string[] }} [options]
 */
export const createIncidentSchema = ({ optionalEntityFields = [] } = {}) => {
  const entityField = (name) =>
    optionalEntityFields.includes(name) ? Yup.array() : Yup.array().required();

  return Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
    date: Yup.date().required(),
    AllegedDeployerOfAISystem: entityField('AllegedDeployerOfAISystem'),
    AllegedDeveloperOfAISystem: entityField('AllegedDeveloperOfAISystem'),
    AllegedHarmedOrNearlyHarmedParties: entityField('AllegedHarmedOrNearlyHarmedParties'),
    implicated_systems: entityField('implicated_systems'),
    editors: Yup.array().of(Yup.string()).required(),
    editor_notes: Yup.string().nullable(),
    // Existing reports to link when creating an incident, as report numbers. SEE: #4052
    // The edit pages carry the incident's own report objects in this field (they are
    // dropped on save), so only plain values are checked as numbers.
    reports: Yup.array()
      .of(
        Yup.lazy((value) =>
          value !== null && typeof value === 'object'
            ? Yup.object()
            : Yup.number().integer().positive()
        )
      )
      .nullable(),
  });
};

/**
 * The entity fields of an existing incident that are blank, i.e. the fields a
 * legacy record may be saved without. Accepts the incident as the API returns
 * it (lists of entities, or null) or as the form holds it (lists of names).
 *
 * @param {Record<string, unknown> | null | undefined} incident
 * @returns {string[]}
 */
export const legacyEmptyEntityFields = (incident) =>
  ENTITY_FIELDS.filter((field) => !incident?.[field] || incident[field].length === 0);

/** The schema for a new incident: every entity field is required. */
export const schema = createIncidentSchema();
