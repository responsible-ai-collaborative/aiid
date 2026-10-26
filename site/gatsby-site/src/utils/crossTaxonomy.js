import { getClassificationValue } from './classifications';

/**
 * Splits a "namespace::field" selector key into its parts. Shared contract
 * between the field-selector options and every consumer of those keys.
 */
export function parseKey(key) {
  if (!key) return { namespace: '', field: '' };
  const [namespace, ...rest] = key.split('::');

  return { namespace, field: rest.join('::') };
}

/**
 * Groups a flat array of classification documents by incident_id.
 * Returns a Map<number, Classification[]>.
 */
export function groupClassificationsByIncident(classifications) {
  const grouped = new Map();

  for (const c of classifications) {
    if (!c.incidents || c.incidents.length === 0) continue;
    for (const incident of c.incidents) {
      const id = incident.incident_id;

      if (!grouped.has(id)) {
        grouped.set(id, []);
      }
      grouped.get(id).push(c);
    }
  }
  return grouped;
}

/**
 * Returns a flat list of fields suitable for axis selection dropdowns,
 * filtered to categorical/enumerable types.
 */
export function getAvailableFields(taxas) {
  const categoricalTypes = ['enum', 'multi', 'list', 'bool'];

  const seen = new Set();

  const fields = [];

  for (const taxa of taxas) {
    for (const field of taxa.field_list) {
      const key = `${taxa.namespace}::${field.short_name}`;

      if (seen.has(key)) continue;
      if (
        categoricalTypes.includes(field.display_type) ||
        (field.permitted_values && field.permitted_values.length > 0)
      ) {
        seen.add(key);
        fields.push({
          namespace: taxa.namespace,
          short_name: field.short_name,
          long_name: field.long_name,
          display_type: field.display_type,
          permitted_values: field.permitted_values,
        });
      }
    }
  }
  return fields;
}

/**
 * Strips a leading numeric index prefix from a category label.
 * e.g. "3. Misinformation" -> "Misinformation", "12. Something" -> "Something"
 * Matches the pattern used by the MIT AI Risk Repository taxonomy.
 * Has no effect on values that don't start with a number.
 */
function stripNumericPrefix(v) {
  return v.replace(/^\d+\.\s*/, '');
}

/**
 * Extracts a flat array of string values from a classification for a given field.
 * Handles strings, arrays, booleans, and nulls.
 */
function extractValues(classification, fieldName) {
  const raw = getClassificationValue(classification, fieldName);

  if (raw === null || raw === undefined || raw === '') return [];
  if (typeof raw === 'boolean') return [raw ? 'Yes' : 'No'];
  if (Array.isArray(raw))
    return raw
      .filter((v) => v !== null && v !== undefined && v !== '')
      .map((v) => stripNumericPrefix(String(v)));
  if (typeof raw === 'string') {
    // Handle semicolon-separated values (e.g., CSETv1 "System Developer": "Google; DeepMind")
    if (raw.includes('; ')) {
      return raw
        .split('; ')
        .map((v) => stripNumericPrefix(v.trim()))
        .filter((v) => v !== '');
    }

    return [stripNumericPrefix(raw)];
  }
  return [stripNumericPrefix(String(raw))];
}

/**
 * Builds cross-taxonomy co-occurrence data from grouped classifications.
 *
 * Returns {
 *   pairs: Array<{ x: string, y: string, count: number, ids: number[] }>,  // every x/y value pair
 *   matrix: Map<string, Map<string, number>>, // xValue -> yValue -> count
 *   xValues: string[],
 *   yValues: string[],
 *   incidentCount: number,  // incidents contributing data
 *   totalPairs: number,
 * }
 */
export function buildCrossData(
  groupedClassifications,
  xNamespace,
  xField,
  yNamespace,
  yField,
  filterNamespace,
  filterField,
  filterValue
) {
  const matrix = new Map();

  const xValuesSet = new Set();

  const yValuesSet = new Set();

  // xValue -> yValue -> Set<incident_id>, mirrors `matrix` but tracks which
  // incidents land in each cell so the chart's "Incident IDs" view can list them.
  const idMatrix = new Map();

  let incidentCount = 0;

  let totalPairs = 0;

  for (const [incidentId, classifications] of groupedClassifications) {
    // Apply optional filter
    if (filterNamespace && filterField && filterValue) {
      const filterClassification = classifications.find((c) => c.namespace === filterNamespace);

      if (!filterClassification) continue;

      const filterValues = extractValues(filterClassification, filterField);

      if (!filterValues.includes(filterValue)) continue;
    }

    const xClassification = classifications.find((c) => c.namespace === xNamespace);

    const yClassification = classifications.find((c) => c.namespace === yNamespace);

    if (!xClassification || !yClassification) continue;

    const xVals = extractValues(xClassification, xField);

    const yVals = extractValues(yClassification, yField);

    if (xVals.length === 0 || yVals.length === 0) continue;

    incidentCount++;

    for (const xv of xVals) {
      xValuesSet.add(xv);
      if (!matrix.has(xv)) matrix.set(xv, new Map());
      const row = matrix.get(xv);

      if (!idMatrix.has(xv)) idMatrix.set(xv, new Map());
      const idRow = idMatrix.get(xv);

      for (const yv of yVals) {
        yValuesSet.add(yv);
        row.set(yv, (row.get(yv) || 0) + 1);
        totalPairs++;

        if (!idRow.has(yv)) idRow.set(yv, new Set());
        idRow.get(yv).add(incidentId);
      }
    }
  }

  const xValues = Array.from(xValuesSet).sort();

  const yValues = Array.from(yValuesSet).sort();

  const pairs = [];

  for (const xv of xValues) {
    for (const yv of yValues) {
      const count = matrix.get(xv)?.get(yv) || 0;

      if (count > 0) {
        const ids = Array.from(idMatrix.get(xv)?.get(yv) || []).sort((a, b) => a - b);

        pairs.push({ x: xv, y: yv, count, ids });
      }
    }
  }

  return { pairs, matrix, xValues, yValues, incidentCount, totalPairs };
}

/**
 * Converts cross-data matrix into Billboard.js column format for bar/line charts.
 * Each y-value becomes a data series; x-values are the categories.
 */
export function toBillboardColumns(crossData) {
  const { xValues, yValues, matrix } = crossData;

  const xColumn = ['x', ...xValues];

  const dataColumns = yValues.map((yv) => [
    yv,
    ...xValues.map((xv) => matrix.get(xv)?.get(yv) || 0),
  ]);

  return [xColumn, ...dataColumns];
}

/**
 * Converts cross-data into scatter-plot xs/columns format for Billboard.js.
 * Each y-value series gets its own x-axis series keyed as `${yv}_x`.
 */
export function toScatterData(crossData) {
  const { pairs, yValues } = crossData;

  const { xValues } = crossData;

  // For scatter, we map categorical values to numeric indices
  const xIndex = new Map(xValues.map((v, i) => [v, i]));

  const xs = {};

  const columns = [];

  for (const yv of yValues) {
    const xKey = `${yv}_x`;

    xs[yv] = xKey;
    const xCol = [xKey];

    const yCol = [yv];

    for (const p of pairs) {
      if (p.y === yv) {
        xCol.push(xIndex.get(p.x));
        yCol.push(p.count);
      }
    }
    columns.push(xCol, yCol);
  }

  return { xs, columns, xValues };
}

/**
 * Counts occurrences of a target field's values across incidents that match a filter.
 * Used by guided analysis tabs to build single-field distributions.
 *
 * An optional secondary filter (extraNamespace/extraField/extraValue) further narrows
 * the matched incidents. Pass null for all three to skip it. Used by ad-hoc charts in
 * the guided tabs to layer an additional condition on top of the tab's primary selection.
 *
 * Returns {
 *   counts: Map<string, number>,
 *   total: number,
 *   incidentCount: number,
 *   incidentIdsByValue: Map<string, number[]>,  // target value -> contributing incident_ids
 * }
 */
export function buildFilteredCounts(
  groupedClassifications,
  filterNamespace,
  filterField,
  filterValue,
  targetNamespace,
  targetField,
  extraNamespace = null,
  extraField = null,
  extraValue = null
) {
  const counts = new Map();

  // target value -> Set<incident_id>; deduped so an incident with a repeated
  // value is listed once, then frozen into sorted arrays before returning.
  const idsByValue = new Map();

  let incidentCount = 0;

  for (const [incidentId, classifications] of groupedClassifications) {
    // Apply filter
    const filterClassification = classifications.find((c) => c.namespace === filterNamespace);

    if (!filterClassification) continue;

    const filterValues = extractValues(filterClassification, filterField);

    if (!filterValues.includes(filterValue)) continue;

    // Apply optional secondary filter
    if (extraNamespace && extraField && extraValue) {
      const extraClassification = classifications.find((c) => c.namespace === extraNamespace);

      if (!extraClassification) continue;

      const extraValues = extractValues(extraClassification, extraField);

      if (!extraValues.includes(extraValue)) continue;
    }

    // Extract target values
    const targetClassification = classifications.find((c) => c.namespace === targetNamespace);

    if (!targetClassification) continue;

    const targetVals = extractValues(targetClassification, targetField);

    if (targetVals.length === 0) continue;

    incidentCount++;

    for (const v of targetVals) {
      counts.set(v, (counts.get(v) || 0) + 1);
      if (!idsByValue.has(v)) idsByValue.set(v, new Set());
      idsByValue.get(v).add(incidentId);
    }
  }

  const total = Array.from(counts.values()).reduce((s, n) => s + n, 0);

  const incidentIdsByValue = freezeIdsByValue(idsByValue);

  return { counts, total, incidentCount, incidentIdsByValue };
}

/**
 * Converts a Map<value, Set<incident_id>> into Map<value, number[]> with each
 * id list sorted ascending. Shared by the filtered-count builders.
 */
function freezeIdsByValue(idsByValue) {
  return new Map(
    Array.from(idsByValue.entries()).map(([value, ids]) => [
      value,
      Array.from(ids).sort((a, b) => a - b),
    ])
  );
}

/**
 * Collects all unique values for a given field across all classifications,
 * sorted by frequency descending.
 */
export function getFieldValues(allClassifications, namespace, fieldName) {
  const counts = new Map();

  for (const c of allClassifications) {
    if (c.namespace !== namespace) continue;
    const vals = extractValues(c, fieldName);

    for (const v of vals) {
      counts.set(v, (counts.get(v) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ value, count }));
}

/**
 * Counts total incidents matching a filter field/value.
 */
export function countFilteredIncidents(groupedClassifications, namespace, field, value) {
  let count = 0;

  for (const [, classifications] of groupedClassifications) {
    const classification = classifications.find((c) => c.namespace === namespace);

    if (!classification) continue;
    const vals = extractValues(classification, field);

    if (vals.includes(value)) count++;
  }
  return count;
}

// ── Entity-based helpers (developer / deployer / harmed parties) ──

/**
 * Builds a map from incident_id to entity names.
 * Input: array of incident objects from GraphQL with entity sub-objects.
 * Returns Map<number, { developers: string[], deployers: string[], harmedParties: string[] }>
 */
export function buildIncidentEntityMap(incidents) {
  const map = new Map();

  for (const inc of incidents) {
    map.set(inc.incident_id, {
      developers: (inc.AllegedDeveloperOfAISystem || []).map((e) => e.name),
      deployers: (inc.AllegedDeployerOfAISystem || []).map((e) => e.name),
      harmedParties: (inc.AllegedHarmedOrNearlyHarmedParties || []).map((e) => e.name),
    });
  }
  return map;
}

/**
 * Returns unique entity values sorted by frequency descending.
 * entityField is 'developers', 'deployers', or 'harmedParties'.
 */
export function getEntityValues(incidentEntityMap, entityField) {
  const counts = new Map();

  for (const [, entities] of incidentEntityMap) {
    const values = entities[entityField] || [];

    for (const v of values) {
      counts.set(v, (counts.get(v) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ value, count }));
}

/**
 * Counts incidents that include a specific entity value.
 */
export function countEntityIncidents(incidentEntityMap, entityField, entityValue) {
  let count = 0;

  for (const [, entities] of incidentEntityMap) {
    if ((entities[entityField] || []).includes(entityValue)) count++;
  }
  return count;
}

/**
 * Builds classification field counts for incidents that match an entity filter.
 * Finds incidents with the given entity, looks up their classifications, and
 * extracts values for the target field.
 *
 * An optional secondary classification filter (extraNamespace/extraField/extraValue)
 * further narrows the matched incidents. Pass null for all three to skip it. Used by
 * ad-hoc charts in the entity guided tabs to layer an extra condition on the selection.
 *
 * Returns {
 *   counts: Map<string, number>,
 *   total: number,
 *   incidentCount: number,
 *   incidentIdsByValue: Map<string, number[]>,  // target value -> contributing incident_ids
 * }
 */
export function buildEntityFilteredCounts(
  groupedClassifications,
  incidentEntityMap,
  entityField,
  entityValue,
  targetNamespace,
  targetField,
  extraNamespace = null,
  extraField = null,
  extraValue = null
) {
  const counts = new Map();

  const idsByValue = new Map();

  let incidentCount = 0;

  for (const [incidentId, classifications] of groupedClassifications) {
    const entities = incidentEntityMap.get(incidentId);

    if (!entities || !(entities[entityField] || []).includes(entityValue)) continue;

    // Apply optional secondary filter
    if (extraNamespace && extraField && extraValue) {
      const extraClassification = classifications.find((c) => c.namespace === extraNamespace);

      if (!extraClassification) continue;

      const extraValues = extractValues(extraClassification, extraField);

      if (!extraValues.includes(extraValue)) continue;
    }

    const targetClassification = classifications.find((c) => c.namespace === targetNamespace);

    if (!targetClassification) continue;

    const targetVals = extractValues(targetClassification, targetField);

    if (targetVals.length === 0) continue;

    incidentCount++;

    for (const v of targetVals) {
      counts.set(v, (counts.get(v) || 0) + 1);
      if (!idsByValue.has(v)) idsByValue.set(v, new Set());
      idsByValue.get(v).add(incidentId);
    }
  }

  const total = Array.from(counts.values()).reduce((s, n) => s + n, 0);

  const incidentIdsByValue = freezeIdsByValue(idsByValue);

  return { counts, total, incidentCount, incidentIdsByValue };
}
