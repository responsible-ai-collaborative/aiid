import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const UniqueSubmittersLeaderboard = ({ limit, className }) => {
  const {
    allMongodbAiidprodReports: { nodes },
  } = useStaticQuery(graphql`
    {
      allMongodbAiidprodReports {
        nodes {
          submitters
          incident_id
          date_submitted
        }
      }
    }
  `);

  const submitters = {};

  for (const report of nodes) {
    const {
      incident_id: id,
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
