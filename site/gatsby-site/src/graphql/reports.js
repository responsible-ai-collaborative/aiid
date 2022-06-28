import { useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';

export const FIND_REPORT = gql`
  query FindReport($query: ReportQueryInput!) {
    report(query: $query) {
      url
      title
      authors
      submitters
      date_published
      date_downloaded
      image_url
      text
      plain_text
      tags
      flag
      report_number
      editor_notes
    }
  }
`;

export const UPDATE_REPORT = gql`
  mutation UpdateReport($query: ReportQueryInput!, $set: ReportUpdateInput!) {
    updateOneReport(query: $query, set: $set) {
      url
      title
      authors
      submitters
      date_published
      date_downloaded
      date_modified
      epoch_date_published
      epoch_date_downloaded
      epoch_date_modified
      image_url
      text
      plain_text
      tags
      flag
      report_number
      editor_notes
    }
  }
`;

export const DELETE_REPORT = gql`
  mutation DeleteOneReport($query: ReportQueryInput!) {
    deleteOneReport(query: $query) {
      report_number
    }
  }
`;

export const INSERT_REPORT = gql`
  mutation InsertReport($report: ReportInsertInput!) {
    insertOneReport(data: $report) {
      report_number
    }
  }
`;

// There is no built-in support for making easy array operations in Realm yet, so this is somewhat inefficient
// https://feedback.mongodb.com/forums/923521-realm/suggestions/40765336-adding-or-removing-elements-from-array-fields

export const useUpdateLinkedReports = () => {
  const client = useApolloClient();

  const query = gql`
    query RelatedIncidents($reports: [ReportQueryInput]!, $incidentIds: [Int]!) {
      incidentsToUnlink: incidents(query: { reports_in: $reports }, limit: 999) {
        incident_id
        reports {
          report_number
        }
      }
      incidentsToLink: incidents(query: { incident_id_in: $incidentIds }) {
        incident_id
        reports {
          report_number
        }
      }
    }
  `;

  const updateMutation = gql`
    mutation UpdateIncident($query: IncidentQueryInput!, $set: IncidentUpdateInput!) {
      updateOneIncident(query: $query, set: $set) {
        incident_id
        reports {
          report_number
        }
      }
    }
  `;

  return async ({ reportNumber, incidentIds }) => {
    const {
      data: { incidentsToUnlink, incidentsToLink },
    } = await client.query({
      query,
      variables: {
        reports: [{ report_number: reportNumber }],
        incidentIds: incidentIds,
      },
    });

    const operations = [];

    for (const incident of incidentsToUnlink) {
      const reportNumbers = incident.reports
        .filter((r) => r.report_number !== reportNumber)
        .map((r) => r.report_number);

      const operation = client.mutate({
        mutation: updateMutation,
        variables: {
          query: { incident_id: incident.incident_id },
          set: { reports: { link: reportNumbers } },
        },
      });

      operations.push(operation);
    }

    for (const incident of incidentsToLink) {
      const reportNumbers = incident.reports.map((r) => r.report_number);

      reportNumbers.push(reportNumber);

      const operation = client.mutate({
        mutation: updateMutation,
        variables: {
          query: { incident_id: incident.incident_id },
          set: { reports: { link: reportNumbers } },
        },
      });

      operations.push(operation);
    }

    await Promise.all(operations);
  };
};
