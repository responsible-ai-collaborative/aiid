import { useMutation, useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';
import { FIND_INCIDENTS, UPDATE_INCIDENT } from './incidents';

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

export const LAST_REPORT_NUMBER = gql`
  query {
    reports(sortBy: REPORT_NUMBER_DESC, limit: 1) {
      report_number
    }
  }
`;

export const REF_NUMBERS_BY_INCIDENT = gql`
  query RefsNumbersByIncident($incidentId: Int!) {
    incident(query: { incident_id: $incidentId }) {
      incident_id
      reports {
        report_number
        ref_number
      }
    }
  }
`;

// how will this work with many to many reports to incidents?

export const useGetLastRefNumber = () => {
  const client = useApolloClient();

  return async ({ incidentId }) => {
    const {
      data: { incident },
    } = await client.query({ query: REF_NUMBERS_BY_INCIDENT, variables: { incidentId } });

    if (!incident) {
      return 0;
    }

    return incident.reports.reduce(
      (last, report) => (report.ref_number > last ? report.ref_number : last),
      0
    );
  };
};

// There is no built-in support for making easy array operations in Realm yet, so this is somewhat inefficient
// https://feedback.mongodb.com/forums/923521-realm/suggestions/40765336-adding-or-removing-elements-from-array-fields

export const useUpdateLinkedReports = () => {
  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const client = useApolloClient();

  return async ({ reportNumber, incidentIds }) => {
    const {
      data: { incidents: incidentsToUnlink },
    } = await client.query({
      query: FIND_INCIDENTS,
      variables: {
        query: {
          reports_in: {
            report_number: reportNumber,
          },
        },
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

    const {
      data: { incidents: incidentsToLink },
    } = await client.query({
      query: FIND_INCIDENTS,
      variables: {
        query: {
          incident_id_in: incidentIds,
        },
      },
    });

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
