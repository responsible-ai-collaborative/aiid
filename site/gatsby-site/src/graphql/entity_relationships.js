import { gql } from '../../server/generated';

export const FIND_ENTITY_RELATIONSHIPS = gql`
  query FindEntity_relationships($filter: Entity_relationshipFilterType) {
    entity_relationships(filter: $filter) {
      _id
      created_at
      pred
      sub {
        entity_id
      }
      obj {
        entity_id
      }
      is_symmetric
    }
  }
`;

export const UPDATE_ENTITY_RELATIONSHIP = gql`
  mutation UpdateEntity_relationship(
    $filter: Entity_relationshipFilterType!
    $update: Entity_relationshipUpdateType!
  ) {
    updateOneEntity_relationship(filter: $filter, update: $update) {
      pred
      sub {
        entity_id
      }
      obj {
        entity_id
      }
    }
  }
`;

export const UPSERT_ENTITY_RELATIONSHIP = gql(`
  mutation UpsertEntity_relationship($filter: Entity_relationshipFilterType!, $update: Entity_relationshipInsertType!) {
    upsertOneEntity_relationship(filter: $filter, update: $update) {
      pred
      sub {
        entity_id
      }
      obj {
        entity_id
      }
    }
  }
`);

export const DELETE_ENTITY_RELATIONSHIP = gql`
  mutation DeleteEntity_relationship($filter: Entity_relationshipFilterType!) {
    deleteOneEntity_relationship(filter: $filter) {
      pred
      sub {
        entity_id
      }
      obj {
        entity_id
      }
    }
  }
`;
