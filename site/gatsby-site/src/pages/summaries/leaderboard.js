import React from 'react';
import AiidHelmet from 'components/AiidHelmet';

import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import SubmittersLeaderboard from 'components/leaderboards/SubmittersLeaderboard';
import AuthorsLeaderboard from 'components/leaderboards/AuthorsLeaderboard';
import DomainsLeaderboard from 'components/leaderboards/DomainsLeaderboard';
import OriginalSubmittersLeaderboard from 'components/leaderboards/OriginalSubmittersLeaderboard';
import UniqueSubmittersLeaderboard from 'components/leaderboards/UniqueSubmittersLeaderboard';
import { Trans } from 'react-i18next';

export default function Authors(props) {
  return (
    <Layout {...props}>
      <AiidHelmet path={props.location.pathname}>
        <title>Submissions Leaderboard</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <h1 className="font-karla font-bold flex-1 pt-0">Leaderboard</h1>
      </div>
      <div className="styled-main-wrapper max-w-full">
        <p className="paragraph">
          <Trans i18nKey="leaderboardHeader" ns="leaderboard">
            This is a ranking of the top submitters, authors, and domains by count. If you would
            like to explore the contents of the reports, you should work through the
            <Link to="/about_apps/1-discover"> Discover app</Link>.
          </Trans>
        </p>
        <div className="flex flex-wrap gap-10">
          <OriginalSubmittersLeaderboard />
          <UniqueSubmittersLeaderboard />
          <SubmittersLeaderboard />
          <AuthorsLeaderboard />
          <DomainsLeaderboard />
        </div>
      </div>
    </Layout>
  );
}
