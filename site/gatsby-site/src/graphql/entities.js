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
