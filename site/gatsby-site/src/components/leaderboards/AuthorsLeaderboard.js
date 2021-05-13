import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const AuthorsLeaderboard = ({ limit }) => {
  return (
    <StaticQuery
      query={graphql`
        query AuthorsLeaderboard {
          allMongodbAiidprodIncidents {
            group(field: authors) {
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
            attribute: 'authors',
            title: 'Authors',
          }}
          limit={limit}
        />
      )}
    />
  );
};

export default AuthorsLeaderboard;
