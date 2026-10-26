/* eslint-env jest */
/**
 * Unit tests for src/utils/crossTaxonomyStatic.js
 *
 * Covers the build-time node transforms in isolation, plus an end-to-end pass
 * of transformed fixtures through the crossTaxonomy data pipeline.
 */
import {
  transformTaxas,
  transformClassifications,
  transformIncidents,
  buildTimeTaxa,
  buildTimeClassifications,
} from '../crossTaxonomyStatic';
import {
  groupClassificationsByIncident,
  getAvailableFields,
  buildCrossData,
  buildIncidentEntityMap,
  getFieldValues,
  getEntityValues,
} from '../crossTaxonomy';

// ── Fixtures mirroring Gatsby build-time query node shapes ──────────────────

const taxaNodes = [
  {
    namespace: 'CSETv1',
    weight: 70,
    description: 'CSET taxonomy',
    field_list: [
      {
        field_number: '1',
        short_name: 'Harm Distribution Basis',
        long_name: 'Harm Distribution Basis',
        display_type: 'multi',
        mongo_type: 'array',
        permitted_values: ['race', 'sex'],
        instant_facet: true,
        public: true,
      },
      {
        field_number: '2',
        short_name: 'Internal Notes',
        long_name: 'Internal Notes',
        display_type: 'long_string',
        mongo_type: 'string',
        permitted_values: [],
        instant_facet: false,
        public: false,
      },
      {
        field_number: '3',
        short_name: 'Sector of Deployment',
        long_name: 'Sector of Deployment',
        display_type: 'multi',
        mongo_type: 'array',
        permitted_values: [],
        instant_facet: true,
        public: null,
      },
    ],
  },
  { namespace: 'Broken', weight: 0, description: 'no field list', field_list: null },
];

const classificationNodes = [
  {
    namespace: 'CSETv1',
    incidents: [{ incident_id: 1 }, { incident_id: 2 }],
    attributes: [
      { short_name: 'Harm Distribution Basis', value_json: '["race"]' },
      { short_name: 'Sector of Deployment', value_json: '["public safety"]' },
    ],
  },
  {
    namespace: 'GMF',
    // A null entry mimics a Gatsby @link to an incident that no longer exists.
    incidents: [{ incident_id: 1 }, null],
    attributes: [{ short_name: 'Known AI Technology', value_json: '["Face Recognition"]' }],
  },
  {
    namespace: 'CSETv1',
    incidents: null,
    attributes: [{ short_name: 'Harm Distribution Basis', value_json: '["sex"]' }],
  },
  // No attributes array — must be dropped, matching the runtime page filter.
  { namespace: 'CSETv1', incidents: [{ incident_id: 3 }], attributes: null },
];

const entityNodes = [
  { entity_id: 'google', name: 'Google' },
  { entity_id: 'facial-corp', name: 'Facial Corp' },
  { entity_id: 'unnamed', name: '' },
  { entity_id: null, name: 'Ghost' },
];

const incidentNodes = [
  {
    incident_id: 1,
    date: '2021-05-10',
    Alleged_deployer_of_AI_system: ['facial-corp'],
    Alleged_developer_of_AI_system: ['google', 'missing-entity'],
    Alleged_harmed_or_nearly_harmed_parties: ['unnamed'],
  },
  {
    incident_id: 2,
    date: '2019-01-01',
    Alleged_deployer_of_AI_system: null,
    Alleged_developer_of_AI_system: ['google'],
    Alleged_harmed_or_nearly_harmed_parties: [],
  },
  {
    incident_id: 3,
    date: null,
    Alleged_deployer_of_AI_system: ['google'],
    Alleged_developer_of_AI_system: [],
    Alleged_harmed_or_nearly_harmed_parties: [],
  },
];

// ── transformTaxas ──────────────────────────────────────────────────────────

describe('transformTaxas', () => {
  it('keeps fields whose public flag is true or unset, drops public: false', () => {
    const taxas = transformTaxas(taxaNodes);

    const cset = taxas.find((t) => t.namespace === 'CSETv1');

    expect(cset.field_list.map((f) => f.short_name)).toEqual([
      'Harm Distribution Basis',
      'Sector of Deployment',
    ]);
  });

  it('drops taxa without a field_list array', () => {
    const taxas = transformTaxas(taxaNodes);

    expect(taxas.map((t) => t.namespace)).toEqual(['CSETv1']);
  });

  it('handles null and empty input', () => {
    expect(transformTaxas(null)).toEqual([]);
    expect(transformTaxas([])).toEqual([]);
  });

  it('produces taxa consumable by getAvailableFields', () => {
    const fields = getAvailableFields(transformTaxas(taxaNodes));

    expect(fields.map((f) => f.short_name)).toEqual([
      'Harm Distribution Basis',
      'Sector of Deployment',
    ]);
  });
});

// ── transformClassifications ────────────────────────────────────────────────

describe('transformClassifications', () => {
  it('drops classifications without an attributes array', () => {
    const classifications = transformClassifications(classificationNodes);

    expect(classifications).toHaveLength(3);
    expect(classifications.every((c) => Array.isArray(c.attributes))).toBe(true);
  });

  it('drops null incident links and normalizes missing incident arrays', () => {
    const classifications = transformClassifications(classificationNodes);

    const gmf = classifications.find((c) => c.namespace === 'GMF');

    expect(gmf.incidents).toEqual([{ incident_id: 1 }]);

    const orphan = classifications.find(
      (c) => c.namespace === 'CSETv1' && c.incidents.length === 0
    );

    expect(orphan.incidents).toEqual([]);
  });

  it('handles null and empty input', () => {
    expect(transformClassifications(null)).toEqual([]);
    expect(transformClassifications([])).toEqual([]);
  });
});

// ── transformIncidents ──────────────────────────────────────────────────────

describe('transformIncidents', () => {
  it('resolves entity ids to { entity_id, name } objects', () => {
    const incidents = transformIncidents(incidentNodes, entityNodes);

    const first = incidents.find((i) => i.incident_id === 1);

    expect(first.AllegedDeployerOfAISystem).toEqual([
      { entity_id: 'facial-corp', name: 'Facial Corp' },
    ]);
  });

  it('skips ids without a matching entity, mirroring the runtime resolver', () => {
    const incidents = transformIncidents(incidentNodes, entityNodes);

    const first = incidents.find((i) => i.incident_id === 1);

    expect(first.AllegedDeveloperOfAISystem).toEqual([{ entity_id: 'google', name: 'Google' }]);
  });

  it('skips entities without a usable name or id', () => {
    const incidents = transformIncidents(incidentNodes, entityNodes);

    const first = incidents.find((i) => i.incident_id === 1);

    expect(first.AllegedHarmedOrNearlyHarmedParties).toEqual([]);
  });

  it('normalizes null entity arrays to empty arrays', () => {
    const incidents = transformIncidents(incidentNodes, entityNodes);

    const second = incidents.find((i) => i.incident_id === 2);

    expect(second.AllegedDeployerOfAISystem).toEqual([]);
  });

  it('handles null and empty input', () => {
    expect(transformIncidents(null, null)).toEqual([]);
    expect(transformIncidents([], [])).toEqual([]);
  });

  it('produces incidents consumable by buildIncidentEntityMap and getEntityValues', () => {
    const incidents = transformIncidents(incidentNodes, entityNodes);

    const map = buildIncidentEntityMap(incidents);

    expect(map.get(1).deployers).toEqual(['Facial Corp']);
    expect(map.get(2).developers).toEqual(['Google']);

    const developers = getEntityValues(map, 'developers');

    expect(developers).toEqual([{ value: 'Google', count: 2 }]);
  });
});

// ── Synthetic Time taxonomy ─────────────────────────────────────────────────

describe('buildTimeTaxa / buildTimeClassifications', () => {
  it('exposes Year as a public enum field', () => {
    const fields = getAvailableFields([buildTimeTaxa()]);

    expect(fields).toEqual([
      expect.objectContaining({ namespace: 'Time', short_name: 'Year', display_type: 'enum' }),
    ]);
  });

  it('derives one Year pseudo-classification per dated incident', () => {
    const incidents = transformIncidents(incidentNodes, entityNodes);

    const timeClassifications = buildTimeClassifications(incidents);

    expect(timeClassifications).toHaveLength(2);
    expect(timeClassifications[0]).toEqual({
      namespace: 'Time',
      incidents: [{ incident_id: 1 }],
      attributes: [{ short_name: 'Year', value_json: '"2021"' }],
    });
  });

  it('skips incidents with missing or too-short dates', () => {
    const timeClassifications = buildTimeClassifications([
      { incident_id: 10, date: '20' },
      { incident_id: 11, date: null },
      { incident_id: 12 },
    ]);

    expect(timeClassifications).toEqual([]);
  });

  it('handles null input', () => {
    expect(buildTimeClassifications(null)).toEqual([]);
  });
});

// ── End-to-end: build-time nodes through the full data pipeline ─────────────

describe('build-time data pipeline integration', () => {
  const allClassifications = [
    ...transformClassifications(classificationNodes),
    ...buildTimeClassifications(transformIncidents(incidentNodes, entityNodes)),
  ];

  const grouped = groupClassificationsByIncident(allClassifications);

  it('groups transformed classifications by incident', () => {
    // Incident 1 carries CSETv1, GMF, and Time; incident 2 carries CSETv1 and Time.
    expect(
      grouped
        .get(1)
        .map((c) => c.namespace)
        .sort()
    ).toEqual(['CSETv1', 'GMF', 'Time']);
    expect(
      grouped
        .get(2)
        .map((c) => c.namespace)
        .sort()
    ).toEqual(['CSETv1', 'Time']);
  });

  it('cross-tabulates a taxonomy field against another taxonomy', () => {
    const crossData = buildCrossData(
      grouped,
      'CSETv1',
      'Harm Distribution Basis',
      'GMF',
      'Known AI Technology',
      null,
      null,
      null
    );

    expect(crossData.incidentCount).toBe(1);
    expect(crossData.pairs).toEqual([{ x: 'race', y: 'Face Recognition', count: 1, ids: [1] }]);
  });

  it('cross-tabulates a taxonomy field against the synthetic Time taxonomy', () => {
    const crossData = buildCrossData(
      grouped,
      'Time',
      'Year',
      'CSETv1',
      'Harm Distribution Basis',
      null,
      null,
      null
    );

    expect(crossData.incidentCount).toBe(2);
    expect(crossData.xValues).toEqual(['2019', '2021']);
  });

  it('computes field value frequencies over transformed classifications', () => {
    const values = getFieldValues(allClassifications, 'CSETv1', 'Harm Distribution Basis');

    expect(values).toEqual([
      { value: 'race', count: 1 },
      { value: 'sex', count: 1 },
    ]);
  });
});
