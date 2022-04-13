import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const AuthorsLeaderboard = ({ limit, className }) => {
  return (
    <StaticQuery
      query={graphql`
        query AuthorsLeaderboard {
          allMongodbAiidprodReports {
            group(field: authors) {
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
            attribute: 'authors',
            title: 'Report Authorship',
          }}
          limit={limit}
          className={className}
        />
      )}
    />
  );
};

export default AuthorsLeaderboard;
