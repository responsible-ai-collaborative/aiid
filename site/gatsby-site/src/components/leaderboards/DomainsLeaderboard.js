import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const DomainsLeaderboard = ({ limit }) => {
  return (
    <StaticQuery
      query={graphql`
        query DomainsLeaderboard {
          allMongodbAiidprodIncidents {
            group(field: source_domain) {
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
            attribute: 'source_domain',
            title: 'Domains',
          }}
          limit={limit}
        />
      )}
    />
  );
};

export default DomainsLeaderboard;
