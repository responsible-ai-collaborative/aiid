import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const UniqueSubmittersLeaderboard = ({ limit, className }) => {
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

      allMongodbAiidprodReports(filter: { is_incident_report: { eq: true } }) {
        nodes {
          report_number
          submitters
          date_submitted
        }
      }
    }
  `);

  const submitters = {};

  for (const report of reports) {
    const { incident_id: id } = incidents.find((incident) =>
      incident.reports.includes(report.report_number)
    );

    const {
      submitters: [submitter],
    } = report;

    if (!submitters[submitter]) {
      submitters[submitter] = [];
    }

    if (!submitters[submitter].includes(id)) {
      submitters[submitter].push(id);
    }
  }

  const hash = {};

  for (const submitter in submitters) {
    hash[submitter] = { fieldValue: submitter, totalCount: submitters[submitter].length };
  }

  return (
    <Leaderboard
      dataHash={hash}
      leaderboard={{
        attribute: 'submitters',
        title: 'Distinct Incidents Reported',
      }}
      limit={limit}
      className={className}
    />
  );
};

export default UniqueSubmittersLeaderboard;
