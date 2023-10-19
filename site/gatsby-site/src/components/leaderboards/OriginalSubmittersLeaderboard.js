import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const OriginalSubmitersLeaderboard = ({ limit = 0, className = '' }) => {
  const {
    allMongodbAiidprodIncidents: { nodes: incidents },
  } = useStaticQuery(graphql`
    {
      allMongodbAiidprodIncidents(
        filter: { reports: { elemMatch: { is_incident_report: { eq: true } } } }
        sort: { reports: { date_submitted: ASC } }
      ) {
        nodes {
          incident_id
          reports {
            report_number
            submitters
            date_submitted
            is_incident_report
          }
        }
      }
    }
  `);

  const submitters = {};

  let allReports = incidents
    .flatMap((incident) => incident.reports)
    .filter((item, index, arr) => {
      // If the current item's is_incident_report is false, exclude it.
      if (!item.is_incident_report) return false;

      // Check if there's another item ahead with the same report_number and is_incident_report set to true.
      return !arr
        .slice(index + 1)
        .some(
          (nextItem) => nextItem.report_number === item.report_number && nextItem.is_incident_report
        );
    });

  const incidentsHash = new Set();

  for (const report of allReports) {
    const incident = incidents.find((incident) => {
      return incident.reports.some((r) => r.report_number === report.report_number);
    });

    if (!incident) {
      continue;
    }

    const {
      submitters: [submitter],
    } = report;

    if (!incidentsHash[incident.incident_id]) {
      incidentsHash[incident.incident_id] = true;

      if (!submitters[submitter]) {
        submitters[submitter] = 0;
      }
      submitters[submitter]++;
    }
  }

  const hash = {};

  for (const submitter in submitters) {
    hash[submitter] = { fieldValue: submitter, totalCount: submitters[submitter] };
  }

  return (
    <Leaderboard
      dataHash={hash}
      leaderboard={{
        attribute: 'submitters',
        title: 'New Incidents Contributed',
      }}
      limit={limit}
      className={className}
    />
  );
};

export default OriginalSubmitersLeaderboard;
