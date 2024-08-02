import gql from 'graphql-tag';

export const UPSERT_ENTITY_RELATHIONSHIP = gql`
  mutation UpsertEntityRelationship(
    $query: Entity_relationshipQueryInput
    $entity: Entity_relationshipInsertInput!
  ) {
    upsertOneEntity_relationship(query: $query, data: $entity) {
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

export const FIND_ENTITY_RELATIONSHIPS = gql`
  query FindEntityRelationships($query: Entity_relationshipQueryInput) {
    entity_relationships(query: $query) {
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
  mutation UpdateEntity(
    $query: Entity_relationshipQueryInput
    $set: Entity_relationshipUpdateInput!
  ) {
    updateOneEntity_relationship(query: $query, set: $set) {
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

export const ADD_ENTITY_RELATIONSHIP = gql`
  mutation AddEntityRelationship($entity: Entity_relationshipInsertInput!) {
    insertOneEntity_relationship(data: $entity) {
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

export const DELETE_ENTITY_RELATIONSHIP = gql`
  mutation DeleteEntityRelationship($query: Entity_relationshipQueryInput) {
    deleteOneEntity_relationship(query: $query) {
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
