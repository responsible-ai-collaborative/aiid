import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const SubmittersLeaderboard = ({ limit = 0, className = '' }) => {
  return (
    <StaticQuery
      query={graphql`
        query SubmittersLeaderboard {
          allMongodbAiidprodReports {
            group(field: { submitters: SELECT }) {
              field
              fieldValue
              totalCount
            }
          }
        }
      `}
      render={({ allMongodbAiidprodReports: { group } }) => (
        <Leaderboard
          dataHash={group}
          leaderboard={{
            attribute: 'submitters',
            title: 'Total Incident Reports',
          }}
          limit={limit}
          className={className}
        />
      )}
    />
  );
};

export default SubmittersLeaderboard;
