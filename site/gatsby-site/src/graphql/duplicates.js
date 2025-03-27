import gql from 'graphql-tag';

export const INSERT_DUPLICATE = gql`
  mutation InsertDuplicate($duplicate: DuplicateInsertType!) {
    insertOneDuplicate(data: $duplicate) {
      duplicate_incident_number
      true_incident_number
    }
  }
`;
