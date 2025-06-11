import { gql } from '../../server/generated';

export const UPSERT_ENTITY = gql(`
  mutation UpsertEntity($filter: EntityFilterType!, $update: EntityInsertType!) {
    upsertOneEntity(filter: $filter, update: $update) {
      entity_id
      name
    }
  }
`);

export const FIND_ENTITIES = gql(`
  query FindEntities {
    entities {
      entity_id
      name
    }
  }
`);

export const FIND_ENTITY = gql(`
  query FindEntity($filter: EntityFilterType) {
    entity(filter: $filter) {
      entity_id
      name
      created_at
      date_modified
    }
  }
`);

export const UPDATE_ENTITY = gql(`
  mutation UpdateEntity($input: UpdateOneEntityInput!) {
    updateEntityAndRelationships(input: $input) {
      entity_id
    }
  }
`);

export const MERGE_ENTITIES = gql(`
  mutation MergeEntities($primaryId: String!, $secondaryId: String!, $keepEntity: Int!) {
    mergeEntities(primaryId: $primaryId, secondaryId: $secondaryId, keepEntity: $keepEntity){
      entity_id
      name
    }
  }
`);

export const SIMILAR_ENTITIES = gql(`
  query SimilarEntities($threshold: Int!, $offset: Int!, $limit: Int!) {
    similarEntities(threshold: $threshold, offset: $offset, limit: $limit) {
      pairs {
        entityId1
        entityName1
        entityId2
        entityName2
        similarity
      }
      hasMore
    }
  }
`);
