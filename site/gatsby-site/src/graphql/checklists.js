//import gql from 'graphql-tag';
import { gql } from '../../server/generated';

const allChecklistFields = `
  id
  owner_id
  date_created
  date_updated
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
  filter findChecklists($filter: ChecklistFilterType) {
    checklists(filter: $filter) {
      id
      owner_id
      date_created
      date_updated
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
    }
  }
`;

export const FIND_CHECKLIST = gql`
  query findChecklist($filter: ChecklistFilterType) {
    checklist(filter: $filter) {
      id
      owner_id
      date_created
      date_updated
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
    }
  }
`;

export const UPDATE_CHECKLIST = gql`
  mutation upsertChecklist(
    $filter: ChecklistFilterType,
    $checklist: ChecklistInsertInput!
  ) {
    upsertOneChecklist(filter: $filter, data: $checklist) {
      id
      owner_id
      date_created
      date_updated
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
    }
  }
`;

export const INSERT_CHECKLIST = gql`
  mutation insertChecklist($checklist: ChecklistInsertInput!) {
    insertOneChecklist(data: $checklist) {
      id
      owner_id
      date_created
      date_updated
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
    }
  }
`;

export const DELETE_CHECKLIST = gql`
  mutation DeleteOneChecklist($filter: ChecklistFilterType!) {
    deleteOneChecklist(filter: $filter) {
      id
    }
  }
`;
