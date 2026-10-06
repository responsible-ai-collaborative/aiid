import * as Sentry from '@sentry/aws-serverless';
import { Binary } from 'mongodb';
import {
  FieldNode,
  GraphQLEnumType,
  GraphQLFieldConfigMap,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
  Kind,
  SelectionSetNode,
} from 'graphql';
import { allow } from 'graphql-shield';
import {
  createEmbeddingProvider,
  EmbeddingRequestError,
} from '../../src/utils/embeddings/provider';
import { Context, DBIncident } from '../interfaces';
import { IncidentType } from '../types/incidents';

const EMBEDDING_SCHEMA_VERSION = 2;
const MAX_QUERY_CHARS = 500;
const MIN_SCORE = 0.15;
const OVERVIEW_WEIGHT = 0.65;
const PASSAGE_WEIGHT = 0.35;
const CACHE_TTL_MS = 10 * 60 * 1000;
const EMBED_TIMEOUT_MS = 8000;
const MAX_CACHED_QUERY_VECTORS = 500;

const SemanticSearchStatusType = new GraphQLEnumType({
  name: 'SemanticSearchStatus',
  description: 'Whether the search ran. Every status other than OK has an empty result list.',
  values: {
    OK: { description: 'The search ran, including when nothing matched.' },
    QUOTA_EXHAUSTED: {
      description: 'The embedding provider refused the request because its limit was reached.',
    },
    UNAVAILABLE: { description: 'Search is not configured, or an embedding dependency failed.' },
  },
});

const SemanticSearchImageType = new GraphQLObjectType({
  name: 'SemanticSearchImage',
  description:
    'The picture shown for an incident, taken from the earliest of its reports that has one.',
  fields: {
    cloudinary_id: { type: GraphQLString },
    image_url: { type: GraphQLString },
  },
});

const SemanticSearchResultType = new GraphQLObjectType({
  name: 'SemanticSearchResult',
  fields: {
    score: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Weighted cosine similarity across the incident overview and best passage.',
    },
    incident: { type: new GraphQLNonNull(IncidentType) },
    image: {
      type: SemanticSearchImageType,
      description: "Null when none of the incident's reports has a picture.",
    },
  },
});

const SemanticSearchResponseType = new GraphQLObjectType({
  name: 'SemanticSearchResponse',
  fields: {
    status: { type: new GraphQLNonNull(SemanticSearchStatusType) },
    results: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SemanticSearchResultType))),
    },
  },
});

export interface CachedIncidentVectors {
  incidentId: number;
  overview: Float32Array;
  passages: Float32Array[];
}

interface VectorCache {
  key: string;
  incidents: CachedIncidentVectors[];
  loadedAt: number;
}

let cache: VectorCache | null = null;

/**
 * Query vectors already embedded on this warm function, by embedding profile and text, least
 * recently used first. They are held in memory only, so no search text is ever stored. Searching
 * the same text again, or another page of it, reuses the vector instead of waiting on the provider.
 */
const queryVectors = new Map<string, number[]>();

export const resetSemanticSearchCache = () => {
  cache = null;
  queryVectors.clear();
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
  incidents: CachedIncidentVectors[],
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
const loadVectors = async (
  context: Context,
  model: string,
  profileId: string,
  dimensions: number
): Promise<CachedIncidentVectors[]> => {
  const key = `${EMBEDDING_SCHEMA_VERSION}:${model}:${profileId}:${dimensions}`;

  if (cache?.key === key && Date.now() - cache.loadedAt < CACHE_TTL_MS) {
    return cache.incidents;
  }

  const cursor = context.client
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

  const incidents: CachedIncidentVectors[] = [];

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

type Embedded =
  | { model: string; profileId: string; vector: number[] }
  | { status: 'QUOTA_EXHAUSTED' | 'UNAVAILABLE' };

const embedQuery = async (query: string): Promise<Embedded> => {
  try {
    const provider = createEmbeddingProvider({ maxAttempts: 1, timeoutMs: EMBED_TIMEOUT_MS });

    // Case and spacing barely move a vector, so texts differing only in them share one.
    const key = `${provider.profileId}\n${query.toLowerCase().replace(/\s+/g, ' ')}`;

    let vector = queryVectors.get(key);

    if (vector) {
      queryVectors.delete(key);
    } else {
      [vector] = (await provider.embed([query], 'query')).vectors;
    }

    queryVectors.set(key, vector);
    if (queryVectors.size > MAX_CACHED_QUERY_VECTORS) {
      queryVectors.delete(queryVectors.keys().next().value!);
    }

    return { model: provider.model, profileId: provider.profileId, vector };
  } catch (error) {
    Sentry.captureException(error);

    const limited =
      error instanceof EmbeddingRequestError && (error.status === 429 || error.quotaExhausted);

    return { status: limited ? 'QUOTA_EXHAUSTED' : 'UNAVAILABLE' };
  }
};

/** What a request asks of each result, so nothing it leaves out is loaded. */
interface Wanted {
  /** Each incident's stored legacy embedding, by far its largest field. */
  incidentEmbedding: boolean;
  image: boolean;
}

/** The names of the fields a request selects at a path below this field, fragments included. */
const fieldsSelectedAt = (info: GraphQLResolveInfo, path: string[]): Set<string> => {
  const fieldsIn = (selectionSet?: SelectionSetNode): FieldNode[] =>
    (selectionSet?.selections ?? []).flatMap((selection) => {
      if (selection.kind === Kind.FIELD) return [selection];
      if (selection.kind === Kind.INLINE_FRAGMENT) return fieldsIn(selection.selectionSet);
      return fieldsIn(info.fragments[selection.name.value]?.selectionSet);
    });

  let fields: readonly FieldNode[] = info.fieldNodes;

  for (const name of path) {
    fields = fields
      .flatMap((field) => fieldsIn(field.selectionSet))
      .filter((field) => field.name.value === name);
  }

  return new Set(
    fields.flatMap((field) => fieldsIn(field.selectionSet)).map((field) => field.name.value)
  );
};

const wantedBy = (info: GraphQLResolveInfo): Wanted => ({
  incidentEmbedding: fieldsSelectedAt(info, ['results', 'incident']).has('embedding'),
  image: fieldsSelectedAt(info, ['results']).has('image'),
});

interface ResultImage {
  cloudinary_id: string | null;
  image_url: string | null;
}

/**
 * Each incident's picture, from the earliest of its reports that has one, found in one query for
 * all of them. An incident without one maps to null.
 */
const findImages = async (context: Context, incidents: DBIncident[]) => {
  const reports = await context.client
    .db('aiidprod')
    .collection('reports')
    .find(
      {
        report_number: { $in: incidents.flatMap((incident) => incident.reports ?? []) },
        $or: [{ cloudinary_id: { $nin: [null, ''] } }, { image_url: { $nin: [null, ''] } }],
      },
      { projection: { _id: 0, report_number: 1, cloudinary_id: 1, image_url: 1 } }
    )
    .toArray();

  const withImage = new Map(reports.map((report) => [report.report_number, report]));

  return new Map(
    incidents.map((incident): [number, ResultImage | null] => {
      const earliest = [...(incident.reports ?? [])]
        .sort((left, right) => left - right)
        .map((reportNumber) => withImage.get(reportNumber))
        .find(Boolean);

      return [
        incident.incident_id,
        earliest
          ? { cloudinary_id: earliest.cloudinary_id || null, image_url: earliest.image_url || null }
          : null,
      ];
    })
  );
};

export const queryFields: GraphQLFieldConfigMap<any, Context> = {
  semanticSearch: {
    type: new GraphQLNonNull(SemanticSearchResponseType),
    description: 'Incidents ranked by their semantic similarity to a free-text query.',
    args: {
      query: { type: new GraphQLNonNull(GraphQLString) },
      limit: {
        type: GraphQLInt,
        description: 'At most this many results. Every match is returned when it is left out.',
      },
    },
    resolve: async (_source, args, context, info) => {
      const query = String(args.query).trim().slice(0, MAX_QUERY_CHARS);
      const limit =
        args.limit == null ? Infinity : Math.max(Math.trunc(Number(args.limit)) || 1, 1);

      if (!query) return { status: 'OK', results: [] };

      const embedded = await embedQuery(query);
      if ('status' in embedded) return { status: embedded.status, results: [] };

      try {
        const stored = await loadVectors(
          context,
          embedded.model,
          embedded.profileId,
          embedded.vector.length
        );

        if (stored.length === 0) return { status: 'UNAVAILABLE', results: [] };

        const wanted = wantedBy(info);
        const hits = rankIncidentVectors(stored, embedded.vector, limit);

        // The legacy embedding is most of an incident's size, so it is loaded only when asked for.
        const incidents = await context.client
          .db('aiidprod')
          .collection<DBIncident>('incidents')
          .find(
            { incident_id: { $in: hits.map((hit) => hit.incident_id) } },
            wanted.incidentEmbedding ? {} : { projection: { embedding: 0 } }
          )
          .toArray();
        const byId = new Map(incidents.map((incident) => [incident.incident_id, incident]));
        const found = hits.flatMap((hit) => {
          const incident = byId.get(hit.incident_id);

          return incident ? [{ score: hit.score, incident }] : [];
        });
        const images = wanted.image
          ? await findImages(
              context,
              found.map(({ incident }) => incident)
            )
          : null;
        const results = found.map((result) => ({
          ...result,
          ...(images && { image: images.get(result.incident.incident_id) }),
        }));

        return { status: 'OK', results };
      } catch (error) {
        Sentry.captureException(error);
        return { status: 'UNAVAILABLE', results: [] };
      }
    },
  },
};

export const permissions = {
  Query: {
    semanticSearch: allow,
  },
};
