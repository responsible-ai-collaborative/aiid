import { useMutation, useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';
import { UPDATE_INCIDENT } from './incidents';

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
      incident_id
      text
      tags
      flag
      report_number
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
      image_url
      incident_id
      text
      tags
      flag
      report_number
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
  const [updateIncident] = useMutation(UPDATE_INCIDENT);

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

    for (const incident of incidentsToUnlink) {
      const reportNumbers = incident.reports
        .filter((r) => r.report_number !== reportNumber)
        .map((r) => r.report_number);

      await updateIncident({
        variables: {
          query: { incident_id: incident.incident_id },
          set: { reports: { link: reportNumbers } },
        },
      });
    }

    for (const incident of incidentsToLink) {
      const reportNumbers = incident.reports.map((r) => r.report_number);

      reportNumbers.push(reportNumber);

      await updateIncident({
        variables: {
          query: { incident_id: incident.incident_id },
          set: { reports: { link: reportNumbers } },
        },
      });
    }
  };
};
