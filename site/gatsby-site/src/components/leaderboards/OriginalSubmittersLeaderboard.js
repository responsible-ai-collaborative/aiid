import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const OriginalSubmitersLeaderboard = ({ limit, className }) => {
  const {
    allMongodbAiidprodReports: { nodes: reports },
    allMongodbAiidprodIncidents: { nodes: incidents },
  } = useStaticQuery(graphql`
    {
      allMongodbAiidprodIncidents {
        nodes {
          incident_id
          reports
        }
      }

      allMongodbAiidprodReports(
        filter: { is_incident_report: { eq: true } }
        sort: { order: ASC, fields: date_submitted }
      ) {
        nodes {
          report_number
          submitters
          date_submitted
        }
      }
    }
  `);

  const incidentsHash = {};

  const submitters = {};

  for (const report of reports) {
    const { incident_id: id } = incidents.find((incident) =>
      incident.reports.includes(report.report_number)
    );

    const {
      submitters: [submitter],
    } = report;

    if (!incidentsHash[id]) {
      incidentsHash[id] = true;

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
        title: 'First Incident Reports',
      }}
      limit={limit}
      className={className}
    />
  );
};

export default OriginalSubmitersLeaderboard;
