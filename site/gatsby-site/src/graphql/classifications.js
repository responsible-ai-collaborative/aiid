import { gql } from '../../server/generated/gql';

export const FIND_CLASSIFICATION = gql(`
  query FindClassifications($filter: ClassificationFilterType) {
    classifications(filter: $filter) {
      _id
      incidents {
        incident_id
      }
      reports {
        report_number
      }
      notes
      namespace
      attributes {
        short_name
        value_json
      }
      publish
    }
  }
`);

export const UPSERT_CLASSIFICATION = gql(`
  mutation UpsertClassification(
    $filter: ClassificationFilterType!
    $update: ClassificationInsertType!
  ) {
    upsertOneClassification(filter: $filter, update: $update) {
      _id
      incidents {
        incident_id
      }
      reports {
        report_number
      }
      notes
      namespace
      attributes {
        short_name
        value_json
      }
      publish
    }
  }
`);
