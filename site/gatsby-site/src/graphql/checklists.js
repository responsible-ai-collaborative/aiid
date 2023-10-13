import gql from 'graphql-tag';

const allChecklistFields = `
  id
  owner_id
  name
  about
  tags_goals
  tags_methods
  tags_other
  risks {
    id
    title
    risk_status
    risk_notes
    severity
    likelihood
    touched
    generated
    tags
    precedents {
      tags
      incident_id
      description
      title
    }
  }
`;

export const FIND_CHECKLISTS = gql`
  query findChecklists {
    checklists {
      ${allChecklistFields}
    }
  }
`;

export const FIND_CHECKLIST = gql`
  query findChecklist($query: ChecklistQueryInput) {
    checklist(query: $query) {
      ${allChecklistFields}
    }
  }
`;

export const UPDATE_CHECKLIST = gql`
  mutation upsertChecklist(
    $query: ChecklistQueryInput,
    $checklist: ChecklistInsertInput!
  ) {
    upsertOneChecklist(query: $query, data: $checklist) {
      ${allChecklistFields}
    }
  }
`;

export const INSERT_CHECKLIST = gql`
  mutation insertChecklist($checklist: ChecklistInsertInput!) {
    insertOneChecklist(data: $checklist) {
      ${allChecklistFields}
    }
  }
`;

export const DELETE_CHECKLIST = gql`
  mutation DeleteOneChecklist($query: ChecklistQueryInput!) {
    deleteOneChecklist(query: $query) {
      id
    }
  }
`;
