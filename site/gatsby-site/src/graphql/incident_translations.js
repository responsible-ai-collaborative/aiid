import { gql } from '../../server/generated';

export const translationsFields = ['title', 'description'];

export const UPDATE_INCIDENT_TRANSLATION = gql(`
  mutation UpdateIncidentTranslation($input: UpdateOneIncidentTranslationInput!) {
    updateOneIncidentTranslation(input: $input) {
      incident_id
    }
  }
`);
