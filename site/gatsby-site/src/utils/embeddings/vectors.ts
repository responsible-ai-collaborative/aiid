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

const normalise = (vector: Float32Array): Float32Array | null => {
  let magnitude = 0;
  for (const component of vector) magnitude += component * component;
  magnitude = Math.sqrt(magnitude);
  if (!Number.isFinite(magnitude) || magnitude === 0) return null;
  for (let i = 0; i < vector.length; i++) vector[i] /= magnitude;
  return vector;
};

/** Decodes a stored BSON vector to unit length, or null if it is missing or malformed. */
export const normaliseBinaryVector = (value: unknown, dimensions: number): Float32Array | null => {
  if (!(value instanceof Binary)) return null;
  try {
    const vector = value.toFloat32Array();
    return vector.length === dimensions ? normalise(vector) : null;
  } catch {
    return null;
  }
};

const dot = (left: Float32Array, right: Float32Array): number => {
  let score = 0;
  for (let i = 0; i < left.length; i++) score += left[i] * right[i];
  return score;
};

/** Scores each incident as 0.65 × overview cosine + 0.35 × best passage cosine, best first. */
export const rankIncidentVectors = (
  incidents: readonly IncidentVectors[],
  query: readonly number[],
  limit: number
): { incident_id: number; score: number }[] => {
  const normalisedQuery = normalise(Float32Array.from(query));
  if (!normalisedQuery) return [];

  const hits: { incident_id: number; score: number }[] = [];
  for (const incident of incidents) {
    const overviewScore = dot(incident.overview, normalisedQuery);
    let passageScore = incident.passages.length > 0 ? -Infinity : overviewScore;
    for (const passage of incident.passages) {
      passageScore = Math.max(passageScore, dot(passage, normalisedQuery));
    }
    const score = OVERVIEW_WEIGHT * overviewScore + PASSAGE_WEIGHT * passageScore;
    if (score >= MIN_SCORE) hits.push({ incident_id: incident.incidentId, score });
  }
  return hits.sort((left, right) => right.score - left.score).slice(0, limit);
};

let cache: { key: string; incidents: IncidentVectors[]; loadedAt: number } | null = null;

/** Loads the vectors written by the same model, cached for ten minutes per warm function. */
export const loadIncidentVectors = async (
  client: MongoClient,
  model: string,
  profileId: string,
  dimensions: number
): Promise<IncidentVectors[]> => {
  const key = `${model}:${profileId}:${dimensions}`;
  if (cache?.key === key && Date.now() - cache.loadedAt < CACHE_TTL_MS) return cache.incidents;

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
      { projection: { _id: 0, incident_id: 1, 'overview.vector': 1, 'passages.vector': 1 } }
    );

  const incidents: IncidentVectors[] = [];
  for await (const document of cursor) {
    const overview = normaliseBinaryVector(document.overview?.vector, dimensions);
    if (!overview) continue;
    const passages = (document.passages || [])
      .map((passage: any) => normaliseBinaryVector(passage?.vector, dimensions))
      .filter((vector: Float32Array | null): vector is Float32Array => vector !== null);
    incidents.push({ incidentId: document.incident_id, overview, passages });
  }

  if (incidents.length > 0) cache = { key, incidents, loadedAt: Date.now() };
  return incidents;
};

export const resetIncidentVectorCache = () => {
  cache = null;
};
