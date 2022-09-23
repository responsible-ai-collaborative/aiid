import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';
import { useTranslation } from 'react-i18next';

const DomainsLeaderboard = ({ limit, className }) => {
  const { t } = useTranslation();

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
            title: t('Report Domains'),
          }}
          limit={limit}
          className={className}
        />
      )}
    />
  );
};

export default DomainsLeaderboard;
