/** Recomputes every incident's stored similar incidents from incident_embeddings. */
import { MongoClient, type AnyBulkWriteOperation } from 'mongodb';
import { createEmbeddingProvider } from '../utils/embeddings/provider';
import { loadIncidentVectors, rankIncidentVectors } from '../utils/embeddings/vectors';

const NEIGHBORS = 3;

export const refreshIncidentNeighbors = async (client: MongoClient, { dryRun = false } = {}) => {
  // Only reads the model settings; no embedding request is made.
  const { model, profileId } = createEmbeddingProvider();

  const db = client.db('aiidprod');

  const sample = await db
    .collection('incident_embeddings')
    .findOne({ embedding_schema_version: 2, model, embedding_profile: profileId });

  if (!sample) throw new Error(`No incident embeddings were written by ${model}`);

  const incidents = db.collection('incidents');

  const current = await incidents
    .find({}, { projection: { _id: 0, incident_id: 1, nlp_similar_incidents: 1 } })
    .toArray();

  const ids = new Set(current.map((incident) => incident.incident_id));

  const corpus = (await loadIncidentVectors(client, model, profileId, sample.dims)).filter(
    (incident) => ids.has(incident.incidentId)
  );

  const byId = new Map(corpus.map((incident) => [incident.incidentId, incident]));

  const writes: AnyBulkWriteOperation[] = [];

  for (const incident of current) {
    const source = byId.get(incident.incident_id);

    // Incidents the nightly run has not embedded yet keep their stored list.
    if (!source) continue;

    const neighbors = rankIncidentVectors(corpus, Array.from(source.overview), NEIGHBORS + 1)
      .filter((hit) => hit.incident_id !== source.incidentId)
      .slice(0, NEIGHBORS)
      .map(({ incident_id, score }) => ({ incident_id, similarity: score }));

    if (JSON.stringify(neighbors) !== JSON.stringify(incident.nlp_similar_incidents)) {
      writes.push({
        updateOne: {
          filter: { incident_id: incident.incident_id },
          update: { $set: { nlp_similar_incidents: neighbors } },
        },
      });
    }
  }

  if (!dryRun && writes.length > 0) await incidents.bulkWrite(writes);

  return { incidents: current.length, embedded: corpus.length, changed: writes.length, dryRun };
};

if (require.main === module) {
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING!);

  client
    .connect()
    .then(() => refreshIncidentNeighbors(client, { dryRun: process.argv.includes('--dry-run') }))
    .then((summary) => console.log(JSON.stringify(summary, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => client.close());
}
