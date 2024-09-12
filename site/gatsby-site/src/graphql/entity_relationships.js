import { gql } from '../../server/generated';

export const FIND_ENTITY_RELATIONSHIPS = gql`
  query FindEntity_relationships($filter: Entity_relationshipFilterType) {
    entity_relationships(filter: $filter) {
      _id
      created_at
      pred
      sub {
        entity_id
        name
      }
      obj {
        entity_id
        name
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
        name
      }
      obj {
        entity_id
        name
      }
    }
  }
`;
