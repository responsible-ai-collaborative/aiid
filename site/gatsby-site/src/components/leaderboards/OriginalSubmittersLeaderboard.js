import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const OriginalSubmitersLeaderboard = ({ limit = 0, className = '' }) => {
  const {
    allMongodbAiidprodIncidents: { nodes: incidents },
  } = useStaticQuery(graphql`
    {
      allMongodbAiidprodIncidents {
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

  incidents.forEach((incident) => {
    incident.reports.forEach((report) => {
      if (!submitters[report.submitters]) {
        submitters[report.submitters] = 0;
      }
      submitters[report.submitters]++;
    });
  });

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
