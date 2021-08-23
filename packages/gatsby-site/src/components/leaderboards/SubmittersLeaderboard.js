import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const SubmittersLeaderboard = ({ limit }) => {
  return (
    <StaticQuery
      query={graphql`
        query SubmittersLeaderboard {
          allMongodbAiidprodIncidents {
            group(field: submitters) {
              field
              fieldValue
              totalCount
            }
          }
        }
      `}
      render={({ allMongodbAiidprodIncidents: { group } }) => (
        <Leaderboard
          dataHash={group}
          leaderboard={{
            attribute: 'submitters',
            title: 'Total Incident Reports',
          }}
          limit={limit}
        />
      )}
    />
  );
};

export default SubmittersLeaderboard;
