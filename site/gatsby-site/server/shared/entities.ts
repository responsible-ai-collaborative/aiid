import { Db, Collection, MongoClient } from 'mongodb';
import * as natural from 'natural';
import { Entity } from '../generated/graphql';

type FieldType = 'string' | 'array';
type FieldUpdateConfig = {
    dbField: string;
    fieldType: FieldType;
};
type ReferenceUpdateConfig = {
    name: string;
    fields: FieldUpdateConfig[];
};

async function verifyEntitiesExist(
    entitiesCollection: Collection,
    primaryId: string,
    secondaryId: string
): Promise<void> {
    const [primaryEntityCount, secondaryEntityCount] = await Promise.all([
        entitiesCollection.countDocuments({ entity_id: primaryId }),
        entitiesCollection.countDocuments({ entity_id: secondaryId })
    ]);
    if (primaryEntityCount === 0) {
        throw new Error(`Primary entity with ID ${primaryId} not found.`);
    }
    if (secondaryEntityCount === 0) {
        throw new Error(`Secondary entity with ID ${secondaryId} not found.`);
    }
}

/**
 * Generate a consistent key for a relationship by sorting the two entity IDs.
 */
function generateRelKey(id1: string, id2: string): string {
    return [id1, id2].sort().join(':');
}


async function mergeEntityRelationships(
    relationshipsCollection: Collection,
    primaryId: string,
    secondaryId: string,
): Promise<void> {

    const secondaryRels = await relationshipsCollection.find({ $or: [{ sub: secondaryId }, { obj: secondaryId }] }).toArray();
    const potentialNewRelsMap = new Map<string, any>();

    for (const r of secondaryRels) {

        const sub = r.sub === secondaryId ? primaryId : r.sub;
        const obj = r.obj === secondaryId ? primaryId : r.obj;

        if (sub === obj) continue;

        const key = generateRelKey(sub, obj);

        if (!potentialNewRelsMap.has(key)) {
            potentialNewRelsMap.set(key, { sub, obj, is_symmetric: r.is_symmetric, pred: r.pred });
        }
    }

    const existingPrimaryRels = await relationshipsCollection.find({ $or: [{ sub: primaryId }, { obj: primaryId }] }).toArray();
    const existingKeys = new Set<string>();

    existingPrimaryRels.forEach(r => {
        const key = generateRelKey(r.sub, r.obj);
        existingKeys.add(key);
    });

    const newRelsToInsert = Array.from(potentialNewRelsMap.values()).filter(r => {
        const key = generateRelKey(r.sub, r.obj);
        return !existingKeys.has(key);
    });

    await relationshipsCollection.deleteMany({ $or: [{ sub: secondaryId }, { obj: secondaryId }] });
    
    if (newRelsToInsert.length > 0) {
        await relationshipsCollection.insertMany(newRelsToInsert, { ordered: false });
    }
}

async function updateReferences(
    db: Db,
    primaryId: string,
    secondaryId: string,
    collectionConfig: ReferenceUpdateConfig
): Promise<void> {
    const collection = db.collection(collectionConfig.name);
    const bulkOps: any[] = [];

    for (const fieldInfo of collectionConfig.fields) {
        const { dbField, fieldType } = fieldInfo;

        const cursor = collection.find({ [dbField]: secondaryId });

        for await (const doc of cursor) {
            if (fieldType === 'string') {
                if (doc[dbField] === secondaryId) {
                    bulkOps.push({
                        updateOne: {
                            filter: { _id: doc._id },
                            update: { $set: { [dbField]: primaryId } }
                        }
                    });
                }
            } else if (fieldType === 'array') {

                const currentArray: string[] = doc[dbField];

                const filteredArray = currentArray.filter(id => id !== secondaryId);

                const updatedArray = filteredArray.includes(primaryId) ? filteredArray : [...filteredArray, primaryId];

                if (JSON.stringify(currentArray) !== JSON.stringify(updatedArray)) {
                    bulkOps.push({
                        updateOne: {
                            filter: { _id: doc._id },
                            update: { $set: { [dbField]: updatedArray } }
                        }
                    });
                }
            }
        }
    }

    if (bulkOps.length > 0) {
        await collection.bulkWrite(bulkOps, { ordered: false });
    }
}

export async function mergeEntities(
    entityId1: string,
    entityId2: string,
    keepEntity: 1 | 2,
    client: MongoClient
) {

    if (entityId1 === entityId2) {
        throw new Error('Cannot merge an entity with itself.');
    }

    if (keepEntity !== 1 && keepEntity !== 2) {
        throw new Error(`Invalid keepEntity value: ${keepEntity} for entityId1: ${entityId1} and entityId2: ${entityId2}.`);
    }

    const primaryIdToKeep = keepEntity === 1 ? entityId1 : entityId2;
    const secondaryIdToDelete = keepEntity === 1 ? entityId2 : entityId1;

    const db: Db = client.db('aiidprod');
    const entitiesCollection: Collection = db.collection('entities');
    const relationshipsCollection: Collection = db.collection('entity_relationships');

    await verifyEntitiesExist(entitiesCollection, primaryIdToKeep, secondaryIdToDelete);

    await mergeEntityRelationships(relationshipsCollection, primaryIdToKeep, secondaryIdToDelete);

    const references: ReferenceUpdateConfig[] = [
        {
            name: 'incidents', fields: [
                { dbField: 'Alleged deployer of AI system', fieldType: 'array' },
                { dbField: 'Alleged developer of AI system', fieldType: 'array' },
                { dbField: 'Alleged harmed or nearly harmed parties', fieldType: 'array' },
                { dbField: 'implicated_systems', fieldType: 'array' },
            ]
        },
        {
            name: 'submissions', fields: [
                { dbField: 'developers', fieldType: 'array' },
                { dbField: 'deployers', fieldType: 'array' },
                { dbField: 'harmed_parties', fieldType: 'array' },
                { dbField: 'implicated_systems', fieldType: 'array' },
            ]
        },
        {
            name: 'subscriptions', fields: [
                { dbField: 'entityId', fieldType: 'string' },
            ]
        },
    ];

    for (const ref of references) {
        await updateReferences(db, primaryIdToKeep, secondaryIdToDelete, ref);
    }

    await db.collection('entity_duplicates').insertOne({
        duplicate_entity_id: secondaryIdToDelete,
        true_entity_id: primaryIdToKeep
    });

    await entitiesCollection.deleteOne({ entity_id: secondaryIdToDelete });
}

export interface SimilarEntityPair {
  entityId1: string;
  entityName1: string;
  entityId2: string;
  entityName2: string;
  similarity: number;
}

export function findSimilarEntities(
    entities: Entity[],
    thresholdPercent: number
): SimilarEntityPair[] {
    const thresholdValue = thresholdPercent / 100;
    const rawPairs: { e1: Entity; e2: Entity; sim: number }[] = [];

    for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < entities.length; j++) {
            const simFraction = natural.DiceCoefficient(entities[i].name, entities[j].name);
            if (simFraction >= thresholdValue) {
                rawPairs.push({ e1: entities[i], e2: entities[j], sim: simFraction });
            }
        }
    }

    rawPairs.sort((a, b) => b.sim - a.sim);

    return rawPairs.map(p => ({
        entityId1: p.e1.entity_id,
        entityName1: p.e1.name,
        entityId2: p.e2.entity_id,
        entityName2: p.e2.name,
        similarity: p.sim * 100,
    }));
}
