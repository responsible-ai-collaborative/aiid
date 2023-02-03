import gql from 'graphql-tag';

export const FIND_CLASSIFICATION = gql`
  query FindClassifications($query: ClassificationQueryInput) {
    classifications(query: $query) {
      _id
      incident_id
      notes
      namespace
      attributes {
        short_name
        value_json
      }
      publish
    }
  }
`;

export const UPDATE_CLASSIFICATION = gql`
  mutation UpsertClassification(
    $query: ClassificationQueryInput
    $data: ClassificationInsertInput!
  ) {
    upsertOneClassification(query: $query, data: $data) {
      _id
      incident_id
      notes
      namespace
      attributes {
        short_name
        value_json
      }
      publish
    }
  }
`;
