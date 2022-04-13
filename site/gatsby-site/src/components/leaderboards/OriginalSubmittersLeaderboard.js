import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const OriginalSubmitersLeaderboard = ({ limit, className }) => {
  const {
    allMongodbAiidprodReports: { nodes },
  } = useStaticQuery(graphql`
    {
      allMongodbAiidprodReports(sort: { order: ASC, fields: date_submitted }) {
        nodes {
          submitters
          incident_id
          date_submitted
        }
      }
    }
  `);

  const incidents = {};

  const submitters = {};

  for (const report of nodes) {
    const {
      incident_id: id,
      submitters: [submitter],
    } = report;

    if (!incidents[id]) {
      incidents[id] = true;

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
