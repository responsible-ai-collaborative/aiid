import React from 'react';
import HeadContent from 'components/HeadContent';

import Link from 'components/ui/Link';
import SubmittersLeaderboard from 'components/leaderboards/SubmittersLeaderboard';
import AuthorsLeaderboard from 'components/leaderboards/AuthorsLeaderboard';
import DomainsLeaderboard from 'components/leaderboards/DomainsLeaderboard';
import OriginalSubmittersLeaderboard from 'components/leaderboards/OriginalSubmittersLeaderboard';
import UniqueSubmittersLeaderboard from 'components/leaderboards/UniqueSubmittersLeaderboard';
import { Trans } from 'react-i18next';

export default function Authors() {
  return (
    <>
      <div className={'titleWrapper'}>
        <h1>
          <Trans>Leaderboard</Trans>
        </h1>
      </div>
      <div className="styled-main-wrapper max-w-full">
        <p className="paragraph">
          <Trans i18nKey="leaderboardHeader" ns="leaderboard">
            This is a ranking of the top submitters, authors, and domains by count. If you would
            like to explore the contents of the reports, you should work through the
            <Link to="/about_apps/1-discover"> Discover app</Link>.
          </Trans>
        </p>
        <div className="flex flex-wrap gap-6">
          <OriginalSubmittersLeaderboard />
          <UniqueSubmittersLeaderboard />
          <SubmittersLeaderboard />
          <AuthorsLeaderboard />
          <DomainsLeaderboard />
        </div>
      </div>
    </>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const metaTitle = 'Submissions Leaderboard';

  const metaDescription = 'Leaderboard of top submitters, authors, and domains by count.';

  return <HeadContent path={pathname} metaTitle={metaTitle} metaDescription={metaDescription} />;
};
