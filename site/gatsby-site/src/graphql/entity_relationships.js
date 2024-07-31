import gql from 'graphql-tag';

export const UPSERT_ENTITY_RELATHIONSHIP = gql`
  mutation UpsertEntityRelationship(
    $query: Entity_RelationshipQueryInput
    $entity: Entity_RelationshipInsertInput!
  ) {
    upsertOneEntity_relationship(query: $query, data: $entity) {
      pred
      sub
      obj
    }
  }
`;

export const FIND_ENTITY_RELATIONSHIPS = gql`
  query FindEntityRelationships {
    entity_relationships(limit: 9999) {
      _id
      pred
      sub
      obj
      is_symmetric
    }
  }
`;

export const FIND_ENTITY_RELATIONSHIP = gql`
  query FindEntityRelationship($query: Entity_RelationshipQueryInput) {
    entity_relationship(query: $query) {
      _id
      created_at
      pred
      sub
      obj
      is_symmetric
    }
  }
`;

export const UPDATE_ENTITY_RELATIONSHIP = gql`
  mutation UpdateEntity(
    $query: Entity_RelationshipQueryInput
    $set: Entity_RelationshipUpdateInput!
  ) {
    updateOneEntity_relationship(query: $query, set: $set) {
      pred
      sub
      obj
    }
  }
`;
