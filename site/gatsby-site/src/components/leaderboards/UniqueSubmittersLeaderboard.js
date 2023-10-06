import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const UniqueSubmittersLeaderboard = ({ limit = 0, className = '' }) => {
  const {
    allMongodbAiidprodIncidents: { nodes: incidents },
  } = useStaticQuery(graphql`
    {
      allMongodbAiidprodIncidents(
        filter: { reports: { elemMatch: { is_incident_report: { eq: true } } } }
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

  incidents.forEach((incident) => {
    incident.reports.forEach((report) => {
      const {
        submitters: [submitter],
      } = report;

      if (!submitters[submitter]) {
        submitters[submitter] = [];
      }

      if (!submitters[submitter].includes(incident.incident_id)) {
        submitters[submitter].push(incident.incident_id);
      }
    });
  });

  const hash = {};

  for (const submitter in submitters) {
    hash[submitter] = { fieldValue: submitter, totalCount: submitters[submitter].length };
  }

  return (
    <Leaderboard
      dataHash={hash}
      leaderboard={{
        attribute: 'submitters',
        title: 'Reports added to Existing Incidents',
      }}
      limit={limit}
      className={className}
    />
  );
};

export default UniqueSubmittersLeaderboard;
