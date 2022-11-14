import gql from 'graphql-tag';

export const UPSERT_ENTITY = gql`
  mutation UpsertEntity($query: EntityQueryInput, $entity: EntityInsertInput!) {
    upsertOneEntity(query: $query, data: $entity) {
      entity_id
      name
    }
  }
`;
