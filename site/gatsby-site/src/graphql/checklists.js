import { gql } from '../../server/generated';

export const FIND_CHECKLISTS = gql(`
  query findChecklists($filter: ChecklistFilterType) {
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
`);

export const FIND_CHECKLIST = gql(`
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
`);

export const UPSERT_CHECKLIST = gql(`
  mutation upsertChecklist(
    $filter: ChecklistFilterType!,
    $checklist: ChecklistInsertType!
  ) {
    upsertOneChecklist(filter: $filter, update: $checklist) {
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
`);

export const INSERT_CHECKLIST = gql(`
  mutation insertChecklist($checklist: ChecklistInsertType!) {
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
`);

export const DELETE_CHECKLIST = gql(`
  mutation DeleteOneChecklist($filter: ChecklistFilterType!) {
    deleteOneChecklist(filter: $filter) {
      id
    }
  }
`);
