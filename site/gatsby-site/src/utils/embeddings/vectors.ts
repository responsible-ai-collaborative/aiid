import { Binary, type MongoClient } from 'mongodb';

const EMBEDDING_SCHEMA_VERSION = 2;
const CACHE_TTL_MS = 10 * 60 * 1000;
const MIN_SCORE = 0.15;
const OVERVIEW_WEIGHT = 0.65;
const PASSAGE_WEIGHT = 0.35;

export interface IncidentVectors {
  incidentId: number;
  overview: Float32Array;
  passages: Float32Array[];
}

interface VectorCache {
  key: string;
  incidents: IncidentVectors[];
  loadedAt: number;
}

let cache: VectorCache | null = null;

export const resetIncidentVectorCache = () => {
  cache = null;
};

/** Converts BSON Float32 vector data to a unit vector, rejecting malformed values. */
export const normaliseBinaryVector = (value: unknown, dimensions: number): Float32Array | null => {
  if (!(value instanceof Binary)) return null;

  let vector: Float32Array;

  try {
    vector = value.toFloat32Array();
  } catch {
    return null;
  }

  if (vector.length !== dimensions) return null;

  let magnitudeSquared = 0;

  for (const component of vector) {
    if (!Number.isFinite(component)) return null;
    magnitudeSquared += component * component;
  }

  const magnitude = Math.sqrt(magnitudeSquared);
  if (magnitude === 0) return null;

  for (let index = 0; index < vector.length; index++) vector[index] /= magnitude;

  return vector;
};

const normaliseQueryVector = (value: number[]): Float32Array | null => {
  if (value.length === 0 || value.some((component) => !Number.isFinite(component))) return null;

  const vector = Float32Array.from(value);
  let magnitudeSquared = 0;

  for (const component of vector) magnitudeSquared += component * component;

  const magnitude = Math.sqrt(magnitudeSquared);
  if (magnitude === 0) return null;

  for (let index = 0; index < vector.length; index++) vector[index] /= magnitude;

  return vector;
};

const dot = (left: Float32Array, right: Float32Array): number => {
  let score = 0;

  for (let index = 0; index < left.length; index++) score += left[index] * right[index];

  return score;
};

/** Ranks the cached overview and passage vectors without allocating per-vector number arrays. */
export const rankIncidentVectors = (
  incidents: IncidentVectors[],
  query: number[],
  limit: number,
  minimumScore = MIN_SCORE
): { incident_id: number; score: number }[] => {
  const normalisedQuery = normaliseQueryVector(query);
  if (!normalisedQuery) return [];

  const hits: { incident_id: number; score: number }[] = [];

  for (const incident of incidents) {
    if (incident.overview.length !== normalisedQuery.length) continue;

    const overviewScore = dot(incident.overview, normalisedQuery);
    let passageScore = overviewScore;
    let foundPassage = false;

    for (const passage of incident.passages) {
      if (passage.length !== normalisedQuery.length) continue;
      const candidate = dot(passage, normalisedQuery);
      passageScore = foundPassage ? Math.max(passageScore, candidate) : candidate;
      foundPassage = true;
    }

    const score = OVERVIEW_WEIGHT * overviewScore + PASSAGE_WEIGHT * passageScore;
    if (score >= minimumScore) hits.push({ incident_id: incident.incidentId, score });
  }

  return hits.sort((left, right) => right.score - left.score).slice(0, limit);
};

/** Streams schema-v2 BSON vectors into a compact warm-function cache. */
export const loadIncidentVectors = async (
  client: MongoClient,
  model: string,
  profileId: string,
  dimensions: number
): Promise<IncidentVectors[]> => {
  const key = `${EMBEDDING_SCHEMA_VERSION}:${model}:${profileId}:${dimensions}`;

  if (cache?.key === key && Date.now() - cache.loadedAt < CACHE_TTL_MS) {
    return cache.incidents;
  }

  const cursor = client
    .db('aiidprod')
    .collection('incident_embeddings')
    .find(
      {
        embedding_schema_version: EMBEDDING_SCHEMA_VERSION,
        embedding_profile: profileId,
        model,
        dims: dimensions,
      },
      {
        projection: {
          _id: 0,
          incident_id: 1,
          'overview.vector': 1,
          'passages.vector': 1,
        },
      }
    )
    .sort({ incident_id: 1 });

  const incidents: IncidentVectors[] = [];

  for await (const document of cursor) {
    const overview = normaliseBinaryVector(document.overview?.vector, dimensions);
    if (!overview) continue;

    const passages = Array.isArray(document.passages)
      ? document.passages
          .map((passage: any) => normaliseBinaryVector(passage?.vector, dimensions))
          .filter((vector): vector is Float32Array => vector !== null)
      : [];

    incidents.push({ incidentId: document.incident_id, overview, passages });
  }

  if (incidents.length > 0) cache = { key, incidents, loadedAt: Date.now() };

  return incidents;
};
