import gql from 'graphql-tag';

export const UPSERT_ENTITY = gql`
  mutation UpsertEntity($filter: EntityFilterType!, $update: EntityInsertType!) {
    upsertOneEntity(filter: $filter, update: $update) {
      entity_id
      name
    }
  }
`;

export const FIND_ENTITIES = gql`
  query FindEntities {
    entities {
      entity_id
      name
    }
  }
`;

export const FIND_ENTITY = gql`
  query FindEntity($filter: EntityFilterType) {
    entity(filter: $filter) {
      entity_id
      name
      created_at
      date_modified
    }
  }
`;

export const UPDATE_ENTITY = gql`
  mutation UpdateEntity($filter: EntityFilterType!, $update: EntityInsertType!) {
    updateOneEntity(filter: $filter, update: $update) {
      entity_id
    }
  }
`;
