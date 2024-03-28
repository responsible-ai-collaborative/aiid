import gql from 'graphql-tag';

export const UPSERT_ENTITY = gql`
  mutation UpsertEntity($query: EntityQueryInput, $entity: EntityInsertInput!) {
    upsertOneEntity(query: $query, data: $entity) {
      entity_id
      name
    }
  }
`;

export const FIND_ENTITIES = gql`
  query FindEntities {
    entities(limit: 9999) {
      entity_id
      name
    }
  }
`;

export const FIND_ENTITY = gql`
  query FindEntity($query: EntityQueryInput) {
    entity(query: $query) {
      entity_id
      name
      created_at
      date_modified
    }
  }
`;

export const UPDATE_ENTITY = gql`
  mutation UpdateEntity($query: EntityQueryInput, $set: EntityUpdateInput!) {
    updateOneEntity(query: $query, set: $set) {
      entity_id
    }
  }
`;
