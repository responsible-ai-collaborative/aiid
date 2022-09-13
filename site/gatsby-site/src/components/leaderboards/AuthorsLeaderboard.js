import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Leaderboard } from './Leaderboard';
import { useTranslation } from 'react-i18next';

const AuthorsLeaderboard = ({ limit, className }) => {
  const { t } = useTranslation();

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
            title: t('Report Authorship'),
          }}
          limit={limit}
          className={className}
        />
      )}
    />
  );
};

export default AuthorsLeaderboard;
