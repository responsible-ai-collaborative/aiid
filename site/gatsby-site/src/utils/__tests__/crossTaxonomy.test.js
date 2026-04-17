/* eslint-env jest */
/**
 * Unit tests for src/utils/crossTaxonomy.js
 *
 * Every function under test is a pure function: data in, data out.
 * No React, GraphQL, Apollo, or DOM dependencies are needed.
 */

const {
  groupClassificationsByIncident,
  buildFilteredCounts,
  buildCrossData,
  toBillboardColumns,
  buildIncidentEntityMap,
  getEntityValues,
  countEntityIncidents,
  buildEntityFilteredCounts,
} = require('../crossTaxonomy');

// ─────────────────────────────────────────────────────────────
// Test helpers
// ─────────────────────────────────────────────────────────────

/**
 * Factory: create a classification document matching the GraphQL schema.
 *
 * @param {string} namespace - Taxonomy namespace, e.g. "CSETv1", "GMF", "MIT"
 * @param {number[]} incidentIds - Array of incident IDs this classification links to
 * @param {Object} fields - Key-value pairs, e.g. { "Sector of Deployment": "Education" }
 *                          Values are auto-serialised to value_json (JSON.stringify).
 * @returns {Object} A classification document shaped like the GraphQL response.
 */
function makeClassification(namespace, incidentIds, fields = {}) {
  return {
    _id: `${namespace}-${incidentIds.join('-')}-${Math.random().toString(36).slice(2, 6)}`,
    namespace,
    incidents: incidentIds.map((id) => ({ incident_id: id })),
    publish: true,
    attributes: Object.entries(fields).map(([short_name, value]) => ({
      short_name,
      value_json: JSON.stringify(value),
    })),
  };
}

/**
 * Factory: create an incident document matching the FindIncidentsEntities query shape.
 *
 * @param {number} id - incident_id
 * @param {Object} opts - Optional entity arrays.
 * @param {Array<{entity_id:string, name:string}>} [opts.developers=[]]
 * @param {Array<{entity_id:string, name:string}>} [opts.deployers=[]]
 * @param {Array<{entity_id:string, name:string}>} [opts.harmedParties=[]]
 * @returns {Object} An incident document.
 */
function makeIncident(id, { developers = [], deployers = [], harmedParties = [] } = {}) {
  return {
    incident_id: id,
    AllegedDeveloperOfAISystem: developers.map((name) =>
      typeof name === 'string' ? { entity_id: name.toLowerCase().replace(/\s/g, '-'), name } : name
    ),
    AllegedDeployerOfAISystem: deployers.map((name) =>
      typeof name === 'string' ? { entity_id: name.toLowerCase().replace(/\s/g, '-'), name } : name
    ),
    AllegedHarmedOrNearlyHarmedParties: harmedParties.map((name) =>
      typeof name === 'string' ? { entity_id: name.toLowerCase().replace(/\s/g, '-'), name } : name
    ),
  };
}

// ─────────────────────────────────────────────────────────────
// groupClassificationsByIncident
// ─────────────────────────────────────────────────────────────

describe('groupClassificationsByIncident', () => {
  test('groups 3 classifications across 2 incidents correctly', () => {
    // Two classifications belong to incident 1, one to incident 2.
    // Verifies the fundamental grouping: the Map should have 2 keys,
    // with incident 1 holding 2 entries and incident 2 holding 1.
    const c1 = makeClassification('CSETv1', [1], { Severity: 'Minor' });

    const c2 = makeClassification('GMF', [1], { 'Known AI Technology': ['NLP'] });

    const c3 = makeClassification('MIT', [2], { Intent: 'Accident' });

    const grouped = groupClassificationsByIncident([c1, c2, c3]);

    expect(grouped.size).toBe(2);
    expect(grouped.get(1)).toHaveLength(2);
    expect(grouped.get(1)).toContain(c1);
    expect(grouped.get(1)).toContain(c2);
    expect(grouped.get(2)).toHaveLength(1);
    expect(grouped.get(2)).toContain(c3);
  });

  test('one classification linked to 2 incident IDs appears in both groups', () => {
    // A single classification can reference multiple incidents.
    // It should appear in the array for every incident it references.
    const c = makeClassification('CSETv1', [10, 20], { Severity: 'Severe' });

    const grouped = groupClassificationsByIncident([c]);

    expect(grouped.size).toBe(2);
    expect(grouped.get(10)).toContain(c);
    expect(grouped.get(20)).toContain(c);
  });

  test('empty input returns an empty Map', () => {
    // Edge case: no classifications at all should produce an empty Map,
    // not null or undefined.
    const grouped = groupClassificationsByIncident([]);

    expect(grouped).toBeInstanceOf(Map);
    expect(grouped.size).toBe(0);
  });

  test('two classifications for the same incident both appear in its array', () => {
    // Verifies that duplicates within the same incident are accumulated,
    // not overwritten.
    const c1 = makeClassification('CSETv1', [5], { Severity: 'Minor' });

    const c2 = makeClassification('GMF', [5], { 'Known AI Technology': ['CV'] });

    const grouped = groupClassificationsByIncident([c1, c2]);

    expect(grouped.size).toBe(1);
    expect(grouped.get(5)).toHaveLength(2);
    expect(grouped.get(5)).toEqual(expect.arrayContaining([c1, c2]));
  });

  test('classification with empty incidents array is skipped', () => {
    // If a classification has an empty incidents array it should not appear
    // in any group, and should not cause an error.
    const c = { ...makeClassification('MIT', [], { Intent: 'Accident' }), incidents: [] };

    const grouped = groupClassificationsByIncident([c]);

    expect(grouped.size).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────
// buildFilteredCounts  (also tests extractValues indirectly)
// ─────────────────────────────────────────────────────────────

describe('buildFilteredCounts', () => {
  // Helper: group a flat array into the Map that buildFilteredCounts expects.
  const group = (arr) => groupClassificationsByIncident(arr);

  test('plain string value is extracted correctly', () => {
    // Verifies the simplest value_json shape: a JSON string like '"Education"'.
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor', 'Sector of Deployment': 'Education' }),
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'CSETv1',
      'Sector of Deployment'
    );

    expect(result.counts.get('Education')).toBe(1);
    expect(result.incidentCount).toBe(1);
  });

  test('JSON array value extracts each element separately', () => {
    // value_json = '["NLP","Computer Vision"]' should produce two separate counts.
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor' }),
      makeClassification('GMF', [1], { 'Known AI Technology': ['NLP', 'Computer Vision'] }),
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'GMF',
      'Known AI Technology'
    );

    expect(result.counts.get('NLP')).toBe(1);
    expect(result.counts.get('Computer Vision')).toBe(1);
    expect(result.total).toBe(2);
    expect(result.incidentCount).toBe(1);
  });

  test('boolean true is extracted as "Yes"', () => {
    // Booleans stored as value_json: 'true' should be converted to "Yes".
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor', Critical: true }),
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'CSETv1',
      'Critical'
    );

    expect(result.counts.get('Yes')).toBe(1);
  });

  test('boolean false is extracted as "No"', () => {
    // Booleans stored as value_json: 'false' should be converted to "No".
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor', Critical: false }),
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'CSETv1',
      'Critical'
    );

    expect(result.counts.get('No')).toBe(1);
  });

  test('semicolon-separated string is split into individual values', () => {
    // CSETv1 sometimes stores multi-values as "A; B; C".
    // extractValues should split on "; " and count each part.
    const classifications = [
      makeClassification('CSETv1', [1], {
        Severity: 'Minor',
        'System Developer': 'Google; DeepMind',
      }),
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'CSETv1',
      'System Developer'
    );

    expect(result.counts.get('Google')).toBe(1);
    expect(result.counts.get('DeepMind')).toBe(1);
    expect(result.total).toBe(2);
  });

  test('null value produces no counts for that field', () => {
    // value_json = 'null' should be treated as empty; the incident is skipped
    // for the target field.
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor', 'Sector of Deployment': null }),
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'CSETv1',
      'Sector of Deployment'
    );

    expect(result.counts.size).toBe(0);
    expect(result.incidentCount).toBe(0);
  });

  test('empty string value produces no counts for that field', () => {
    // value_json = '""' should be treated as empty.
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor', 'Sector of Deployment': '' }),
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'CSETv1',
      'Sector of Deployment'
    );

    expect(result.counts.size).toBe(0);
    expect(result.incidentCount).toBe(0);
  });

  test('array containing nulls and empty strings filters them out', () => {
    // value_json = '["NLP", null, ""]' should keep only "NLP".
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor' }),
      makeClassification('GMF', [1], { 'Known AI Technology': ['NLP', null, ''] }),
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'GMF',
      'Known AI Technology'
    );

    expect(result.counts.size).toBe(1);
    expect(result.counts.get('NLP')).toBe(1);
  });

  test('numeric value is converted to string via toString fallback', () => {
    // value_json = '42' should be stringified to "42".
    const classifications = [makeClassification('CSETv1', [1], { Severity: 'Minor', Score: 42 })];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'CSETv1',
      'Score'
    );

    expect(result.counts.get('42')).toBe(1);
  });

  test('field not present on classification returns no counts', () => {
    // If the target field does not exist in the classification's attributes,
    // getClassificationValue returns undefined, and extractValues returns [].
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor' }),
      // No GMF classification for incident 1 at all
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'CSETv1',
      'NonExistentField'
    );

    expect(result.counts.size).toBe(0);
    expect(result.incidentCount).toBe(0);
  });

  test('filter matches no incidents returns empty results', () => {
    // When no incident has the filter value, everything should be zero.
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor', 'Sector of Deployment': 'Education' }),
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Severe', // No incident has Severe
      'CSETv1',
      'Sector of Deployment'
    );

    expect(result.counts.size).toBe(0);
    expect(result.total).toBe(0);
    expect(result.incidentCount).toBe(0);
  });

  test('target namespace absent on matching incident skips it', () => {
    // Incident matches the filter (CSETv1 Severity=Minor) but has no GMF
    // classification, so it cannot produce target values.
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor' }),
      // No GMF classification for incident 1
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'GMF',
      'Known AI Technology'
    );

    expect(result.counts.size).toBe(0);
    expect(result.incidentCount).toBe(0);
  });

  test('multi-value target field counts each value separately', () => {
    // An incident whose target field has 3 values should increment
    // all 3 in the counts Map, and incidentCount should still be 1.
    const classifications = [
      makeClassification('CSETv1', [1], {
        Severity: 'Minor',
        'Sector of Deployment': 'Education; Healthcare; Government',
      }),
    ];

    const result = buildFilteredCounts(
      group(classifications),
      'CSETv1',
      'Severity',
      'Minor',
      'CSETv1',
      'Sector of Deployment'
    );

    expect(result.counts.get('Education')).toBe(1);
    expect(result.counts.get('Healthcare')).toBe(1);
    expect(result.counts.get('Government')).toBe(1);
    expect(result.total).toBe(3);
    expect(result.incidentCount).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────
// buildCrossData
// ─────────────────────────────────────────────────────────────

describe('buildCrossData', () => {
  const group = (arr) => groupClassificationsByIncident(arr);

  test('happy path: 2 incidents with X and Y values', () => {
    // Two incidents, each with values for both axes.
    // Should produce a 2x2 matrix with correct counts.
    const classifications = [
      makeClassification('MIT', [1], { Intent: 'Accident' }),
      makeClassification('CSETv1', [1], { Severity: 'Minor' }),
      makeClassification('MIT', [2], { Intent: 'Deliberate' }),
      makeClassification('CSETv1', [2], { Severity: 'Severe' }),
    ];

    const result = buildCrossData(
      group(classifications),
      'MIT',
      'Intent',
      'CSETv1',
      'Severity',
      null,
      null,
      null
    );

    expect(result.incidentCount).toBe(2);
    expect(result.xValues).toContain('Accident');
    expect(result.xValues).toContain('Deliberate');
    expect(result.yValues).toContain('Minor');
    expect(result.yValues).toContain('Severe');
    expect(result.matrix.get('Accident').get('Minor')).toBe(1);
    expect(result.matrix.get('Deliberate').get('Severe')).toBe(1);
  });

  test('multi-value X field generates multiple pairs', () => {
    // If the X field has semicolon-separated values "A; B", two pairs
    // should be generated: (A, Y) and (B, Y).
    const classifications = [
      makeClassification('CSETv1', [1], { 'Sector of Deployment': 'Education; Healthcare' }),
      makeClassification('MIT', [1], { Intent: 'Accident' }),
    ];

    const result = buildCrossData(
      group(classifications),
      'CSETv1',
      'Sector of Deployment',
      'MIT',
      'Intent',
      null,
      null,
      null
    );

    expect(result.incidentCount).toBe(1);
    expect(result.xValues).toEqual(expect.arrayContaining(['Education', 'Healthcare']));
    expect(result.totalPairs).toBe(2);
    expect(result.matrix.get('Education').get('Accident')).toBe(1);
    expect(result.matrix.get('Healthcare').get('Accident')).toBe(1);
  });

  test('filter excludes non-matching incidents', () => {
    // 2 incidents, but the filter only matches incident 2.
    // Incident 1 should be excluded from the results.
    const classifications = [
      makeClassification('MIT', [1], { Intent: 'Accident' }),
      makeClassification('CSETv1', [1], { Severity: 'Minor', 'Harm Domain': 'Physical' }),
      makeClassification('MIT', [2], { Intent: 'Deliberate' }),
      makeClassification('CSETv1', [2], { Severity: 'Severe', 'Harm Domain': 'Psychological' }),
    ];

    const result = buildCrossData(
      group(classifications),
      'MIT',
      'Intent',
      'CSETv1',
      'Severity',
      'CSETv1',
      'Harm Domain',
      'Psychological' // Only incident 2 matches
    );

    expect(result.incidentCount).toBe(1);
    expect(result.xValues).toEqual(['Deliberate']);
    expect(result.yValues).toEqual(['Severe']);
  });

  test('filter that matches nothing returns zero counts', () => {
    // Filter value exists in no classification. Everything should be empty.
    const classifications = [
      makeClassification('MIT', [1], { Intent: 'Accident' }),
      makeClassification('CSETv1', [1], { Severity: 'Minor', 'Harm Domain': 'Physical' }),
    ];

    const result = buildCrossData(
      group(classifications),
      'MIT',
      'Intent',
      'CSETv1',
      'Severity',
      'CSETv1',
      'Harm Domain',
      'NonExistent'
    );

    expect(result.incidentCount).toBe(0);
    expect(result.xValues).toHaveLength(0);
    expect(result.yValues).toHaveLength(0);
    expect(result.pairs).toHaveLength(0);
  });

  test('incident missing X classification is skipped', () => {
    // Incident 1 has CSETv1 (Y axis) but no MIT (X axis).
    // It should be silently skipped, not cause an error.
    const classifications = [
      makeClassification('CSETv1', [1], { Severity: 'Minor' }),
      // No MIT classification for incident 1
    ];

    const result = buildCrossData(
      group(classifications),
      'MIT',
      'Intent',
      'CSETv1',
      'Severity',
      null,
      null,
      null
    );

    expect(result.incidentCount).toBe(0);
    expect(result.xValues).toHaveLength(0);
  });

  test('incident missing Y classification is skipped', () => {
    // Incident 1 has MIT (X axis) but no CSETv1 (Y axis).
    const classifications = [
      makeClassification('MIT', [1], { Intent: 'Accident' }),
      // No CSETv1 for incident 1
    ];

    const result = buildCrossData(
      group(classifications),
      'MIT',
      'Intent',
      'CSETv1',
      'Severity',
      null,
      null,
      null
    );

    expect(result.incidentCount).toBe(0);
    expect(result.yValues).toHaveLength(0);
  });

  test('X and Y from the same taxonomy namespace work correctly', () => {
    // Both axes reference CSETv1 fields. The function should find the
    // single CSETv1 classification and extract both fields from it.
    const classifications = [
      makeClassification('CSETv1', [1], {
        Severity: 'Minor',
        'Sector of Deployment': 'Education',
      }),
    ];

    const result = buildCrossData(
      group(classifications),
      'CSETv1',
      'Severity',
      'CSETv1',
      'Sector of Deployment',
      null,
      null,
      null
    );

    expect(result.incidentCount).toBe(1);
    expect(result.matrix.get('Minor').get('Education')).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────
// toBillboardColumns
// ─────────────────────────────────────────────────────────────

describe('toBillboardColumns', () => {
  test('2x2 matrix produces correct Billboard.js column format', () => {
    // A 2x2 matrix should yield: an x-axis column with 2 categories,
    // plus 2 data-series columns, each with a value per x category.
    const crossData = {
      xValues: ['Accident', 'Deliberate'],
      yValues: ['Minor', 'Severe'],
      matrix: new Map([
        [
          'Accident',
          new Map([
            ['Minor', 3],
            ['Severe', 1],
          ]),
        ],
        [
          'Deliberate',
          new Map([
            ['Minor', 0],
            ['Severe', 2],
          ]),
        ],
      ]),
    };

    const columns = toBillboardColumns(crossData);

    expect(columns).toEqual([
      ['x', 'Accident', 'Deliberate'],
      ['Minor', 3, 0],
      ['Severe', 1, 2],
    ]);
  });

  test('single cell matrix', () => {
    // Minimal case: one X value, one Y value.
    const crossData = {
      xValues: ['Accident'],
      yValues: ['Minor'],
      matrix: new Map([['Accident', new Map([['Minor', 5]])]]),
    };

    const columns = toBillboardColumns(crossData);

    expect(columns).toEqual([
      ['x', 'Accident'],
      ['Minor', 5],
    ]);
  });

  test('zero count values are preserved, not omitted', () => {
    // If xValue "Deliberate" has no entry for yValue "Minor" in the matrix,
    // the output should contain 0, not skip the entry.
    const crossData = {
      xValues: ['Accident', 'Deliberate'],
      yValues: ['Minor'],
      matrix: new Map([
        ['Accident', new Map([['Minor', 2]])],
        ['Deliberate', new Map()], // no Minor entry
      ]),
    };

    const columns = toBillboardColumns(crossData);

    expect(columns).toEqual([
      ['x', 'Accident', 'Deliberate'],
      ['Minor', 2, 0],
    ]);
  });

  test('empty cross data produces only an empty x column', () => {
    // When there are no values at all, the output should be just ['x']
    // with no data series.
    const crossData = {
      xValues: [],
      yValues: [],
      matrix: new Map(),
    };

    const columns = toBillboardColumns(crossData);

    expect(columns).toEqual([['x']]);
  });
});

// ─────────────────────────────────────────────────────────────
// buildIncidentEntityMap
// ─────────────────────────────────────────────────────────────

describe('buildIncidentEntityMap', () => {
  test('3 incidents with full entity arrays produce correct Map', () => {
    // Verifies that all three entity types are correctly extracted
    // and mapped by incident_id.
    const incidents = [
      makeIncident(1, {
        developers: ['OpenAI'],
        deployers: ['Uber'],
        harmedParties: ['Pedestrians'],
      }),
      makeIncident(2, { developers: ['Google', 'DeepMind'], deployers: ['Google'] }),
      makeIncident(3, { developers: ['Meta'] }),
    ];

    const map = buildIncidentEntityMap(incidents);

    expect(map.size).toBe(3);
    expect(map.get(1).developers).toEqual(['OpenAI']);
    expect(map.get(1).deployers).toEqual(['Uber']);
    expect(map.get(1).harmedParties).toEqual(['Pedestrians']);
    expect(map.get(2).developers).toEqual(['Google', 'DeepMind']);
    expect(map.get(2).deployers).toEqual(['Google']);
    expect(map.get(2).harmedParties).toEqual([]);
    expect(map.get(3).developers).toEqual(['Meta']);
    expect(map.get(3).deployers).toEqual([]);
  });

  test('incident with empty developer array produces empty developers list', () => {
    // Explicit empty array should result in an empty array, not undefined.
    const incidents = [makeIncident(1, { developers: [] })];

    const map = buildIncidentEntityMap(incidents);

    expect(map.get(1).developers).toEqual([]);
  });

  test('incident where AllegedDeveloperOfAISystem is null or undefined', () => {
    // If the GraphQL response has null for an entity field, the code uses
    // the || [] fallback. This should not throw.
    const incident = {
      incident_id: 1,
      AllegedDeveloperOfAISystem: null,
      AllegedDeployerOfAISystem: undefined,
      AllegedHarmedOrNearlyHarmedParties: [{ entity_id: 'people', name: 'People' }],
    };

    const map = buildIncidentEntityMap([incident]);

    expect(map.get(1).developers).toEqual([]);
    expect(map.get(1).deployers).toEqual([]);
    expect(map.get(1).harmedParties).toEqual(['People']);
  });
});

// ─────────────────────────────────────────────────────────────
// getEntityValues
// ─────────────────────────────────────────────────────────────

describe('getEntityValues', () => {
  test('returns values sorted by count descending', () => {
    // OpenAI appears in 3 incidents, Google in 1. OpenAI should come first.
    const incidents = [
      makeIncident(1, { developers: ['OpenAI'] }),
      makeIncident(2, { developers: ['OpenAI', 'Google'] }),
      makeIncident(3, { developers: ['OpenAI'] }),
    ];

    const map = buildIncidentEntityMap(incidents);

    const values = getEntityValues(map, 'developers');

    expect(values[0]).toEqual({ value: 'OpenAI', count: 3 });
    expect(values[1]).toEqual({ value: 'Google', count: 1 });
  });

  test('empty map returns empty array', () => {
    // No incidents at all should produce [], not an error.
    const values = getEntityValues(new Map(), 'developers');

    expect(values).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────
// countEntityIncidents
// ─────────────────────────────────────────────────────────────

describe('countEntityIncidents', () => {
  test('entity present in 5 incidents returns 5', () => {
    // Count how many incidents involve a specific entity.
    const incidents = [
      makeIncident(1, { developers: ['OpenAI'] }),
      makeIncident(2, { developers: ['OpenAI'] }),
      makeIncident(3, { developers: ['Google'] }),
      makeIncident(4, { developers: ['OpenAI'] }),
      makeIncident(5, { developers: ['OpenAI', 'Meta'] }),
      makeIncident(6, { developers: ['OpenAI'] }),
    ];

    const map = buildIncidentEntityMap(incidents);

    expect(countEntityIncidents(map, 'developers', 'OpenAI')).toBe(5);
  });

  test('entity not found returns 0', () => {
    // An entity name that doesn't exist in any incident should return 0.
    const incidents = [makeIncident(1, { developers: ['OpenAI'] })];

    const map = buildIncidentEntityMap(incidents);

    expect(countEntityIncidents(map, 'developers', 'UnknownCorp')).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────
// buildEntityFilteredCounts
// ─────────────────────────────────────────────────────────────

describe('buildEntityFilteredCounts', () => {
  test('OpenAI incidents with CSETv1 Sector returns correct counts', () => {
    // Two incidents have OpenAI as developer. Both have CSETv1 classifications.
    // Sector values should be counted correctly.
    const classifications = [
      makeClassification('CSETv1', [1], { 'Sector of Deployment': 'Education' }),
      makeClassification('CSETv1', [2], { 'Sector of Deployment': 'Healthcare' }),
      makeClassification('CSETv1', [3], { 'Sector of Deployment': 'Government' }),
    ];

    const incidents = [
      makeIncident(1, { developers: ['OpenAI'] }),
      makeIncident(2, { developers: ['OpenAI'] }),
      makeIncident(3, { developers: ['Google'] }), // Not OpenAI
    ];

    const grouped = groupClassificationsByIncident(classifications);

    const entityMap = buildIncidentEntityMap(incidents);

    const result = buildEntityFilteredCounts(
      grouped,
      entityMap,
      'developers',
      'OpenAI',
      'CSETv1',
      'Sector of Deployment'
    );

    expect(result.counts.get('Education')).toBe(1);
    expect(result.counts.get('Healthcare')).toBe(1);
    expect(result.counts.has('Government')).toBe(false); // Google's incident
    expect(result.incidentCount).toBe(2);
    expect(result.total).toBe(2);
  });

  test('entity matches incidents but those incidents have no target taxonomy', () => {
    // OpenAI has 2 incidents, but neither has a CSETv1 classification.
    // The function should return incidentCount=0 and empty counts.
    const classifications = [
      // Only GMF classifications, no CSETv1
      makeClassification('GMF', [1], { 'Known AI Technology': ['NLP'] }),
      makeClassification('GMF', [2], { 'Known AI Technology': ['CV'] }),
    ];

    const incidents = [
      makeIncident(1, { developers: ['OpenAI'] }),
      makeIncident(2, { developers: ['OpenAI'] }),
    ];

    const grouped = groupClassificationsByIncident(classifications);

    const entityMap = buildIncidentEntityMap(incidents);

    const result = buildEntityFilteredCounts(
      grouped,
      entityMap,
      'developers',
      'OpenAI',
      'CSETv1',
      'Sector of Deployment'
    );

    expect(result.counts.size).toBe(0);
    expect(result.incidentCount).toBe(0);
    expect(result.total).toBe(0);
  });

  test('entity not in any incident returns empty counts', () => {
    // The entity name doesn't match any incident's developers.
    const classifications = [
      makeClassification('CSETv1', [1], { 'Sector of Deployment': 'Education' }),
    ];

    const incidents = [makeIncident(1, { developers: ['Google'] })];

    const grouped = groupClassificationsByIncident(classifications);

    const entityMap = buildIncidentEntityMap(incidents);

    const result = buildEntityFilteredCounts(
      grouped,
      entityMap,
      'developers',
      'UnknownCorp',
      'CSETv1',
      'Sector of Deployment'
    );

    expect(result.counts.size).toBe(0);
    expect(result.incidentCount).toBe(0);
    expect(result.total).toBe(0);
  });
});
