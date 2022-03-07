import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';

const DomainsLeaderboard = ({ limit, className }) => {
  return (
    <StaticQuery
      query={graphql`
        query DomainsLeaderboard {
          allMongodbAiidprodReports {
            group(field: source_domain) {
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
            attribute: 'source_domain',
            title: 'Report Domains',
          }}
          limit={limit}
          className={className}
        />
      )}
    />
  );
};

export default DomainsLeaderboard;
