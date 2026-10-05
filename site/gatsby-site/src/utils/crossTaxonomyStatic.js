/**
 * Transforms Gatsby build-time query nodes into the plain shapes that the
 * cross-taxonomy data-processing utils (utils/crossTaxonomy.js) consume.
 *
 * The /apps/cross-taxonomy page loads all of its data from the static build
 * (see the page's `pageQuery`) instead of the runtime GraphQL API, so these
 * functions are the seam between the Gatsby node shapes and the shapes the
 * runtime API used to return. They are pure so they can be unit tested
 * without Gatsby or a database.
 */

/**
 * Filters taxa to publicly visible fields.
 * Input: nodes from `allMongodbAiidprodTaxa`.
 * Output: same shape, with field_list restricted to entries where public !== false.
 * Taxa without a namespace or a field_list array are dropped.
 */
export function transformTaxas(taxaNodes) {
  return (taxaNodes || [])
    .filter((taxa) => taxa && taxa.namespace && Array.isArray(taxa.field_list))
    .map((taxa) => ({
      ...taxa,
      field_list: taxa.field_list.filter((f) => f && f.public !== false),
    }));
}

/**
 * Normalizes classification nodes for the data-processing utils.
 * Drops documents without an attributes array, and drops broken incident
 * links (Gatsby's `@link(by: "incident_id")` resolves references to missing
 * incidents as null entries).
 * Output shape: { namespace, incidents: [{ incident_id }], attributes: [{ short_name, value_json }] }
 */
export function transformClassifications(classificationNodes) {
  return (classificationNodes || [])
    .filter((c) => c && c.namespace && Array.isArray(c.attributes))
    .map((c) => ({
      namespace: c.namespace,
      attributes: c.attributes,
      incidents: (c.incidents || []).filter((i) => i && typeof i.incident_id === 'number'),
    }));
}

/**
 * Resolves the raw entity-id arrays on incident nodes into { entity_id, name }
 * objects, matching the shape the runtime GraphQL relationship fields returned
 * and that buildIncidentEntityMap consumes.
 * Ids with no matching entity are skipped, mirroring the runtime resolver
 * (a find() over the entities collection returns nothing for them).
 */
export function transformIncidents(incidentNodes, entityNodes) {
  const namesById = new Map(
    (entityNodes || [])
      .filter((e) => e && e.entity_id && typeof e.name === 'string' && e.name !== '')
      .map((e) => [e.entity_id, e.name])
  );

  const resolveEntities = (ids) =>
    (ids || [])
      .filter((id) => namesById.has(id))
      .map((id) => ({ entity_id: id, name: namesById.get(id) }));

  return (incidentNodes || [])
    .filter((inc) => inc && typeof inc.incident_id === 'number')
    .map((inc) => ({
      incident_id: inc.incident_id,
      date: inc.date,
      AllegedDeployerOfAISystem: resolveEntities(inc.Alleged_deployer_of_AI_system),
      AllegedDeveloperOfAISystem: resolveEntities(inc.Alleged_developer_of_AI_system),
      AllegedHarmedOrNearlyHarmedParties: resolveEntities(
        inc.Alleged_harmed_or_nearly_harmed_parties
      ),
    }));
}

/**
 * Synthetic "Time" taxa. Injecting it alongside the real taxa lets the
 * existing data-processing functions treat the incident year as a regular
 * taxonomy field, with zero changes to those utils.
 */
export function buildTimeTaxa() {
  return {
    namespace: 'Time',
    weight: 0,
    description: 'Year the incident was reported',
    field_list: [
      {
        field_number: '0',
        short_name: 'Year',
        long_name: 'Year',
        display_type: 'enum',
        mongo_type: 'string',
        permitted_values: [],
        instant_facet: false,
        public: true,
      },
    ],
  };
}

/**
 * Per-incident "Time" pseudo-classifications derived from incident dates.
 * Incidents without a parseable date (string of at least 4 characters) are
 * skipped. Expects incidents in the shape produced by transformIncidents.
 */
export function buildTimeClassifications(incidents) {
  return (incidents || [])
    .filter((inc) => inc && typeof inc.date === 'string' && inc.date.length >= 4)
    .map((inc) => ({
      namespace: 'Time',
      incidents: [{ incident_id: inc.incident_id }],
      attributes: [{ short_name: 'Year', value_json: JSON.stringify(inc.date.substring(0, 4)) }],
    }));
}
