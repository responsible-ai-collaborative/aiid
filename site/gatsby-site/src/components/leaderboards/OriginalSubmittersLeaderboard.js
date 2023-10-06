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
          }
        }
      }
    }
  `);

  const submitters = {};

  const allReports = incidents
    .flatMap((incident) => incident.reports)
    .sort((a, b) => a.date_submitted - b.date_submitted);

  const incidentsHash = new Set();

  for (const report of allReports) {
    const incident = incidents.find((incident) =>
      incident.reports.some((r) => r.report_number === report.report_number)
    );

    if (!incident) {
      continue;
    }

    const {
      submitters: [submitter],
    } = report;

    if (!incidentsHash.has(incident.incident_id)) {
      incidentsHash.add(incident.incident_id);

      submitters[submitter] = (submitters[submitter] || 0) + 1;
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
