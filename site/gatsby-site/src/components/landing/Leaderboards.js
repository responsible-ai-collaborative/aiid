import React from 'react';
import UniqueSubmittersLeaderboard from 'components/leaderboards/UniqueSubmittersLeaderboard';
import OriginalSubmitersLeaderboard from 'components/leaderboards/OriginalSubmittersLeaderboard';
import SubmittersLeaderboard from 'components/leaderboards/SubmittersLeaderboard';
import { Trans } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';

export default function Featured() {
  return (
    <>
      <div className="flex flex-col items-center">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-0">
          <Trans ns="landing">Incident Report Submission Leaderboards</Trans>
        </h5>
        <p className="mt-2">
          <Trans i18nKey="leaderboardDescription" ns="landing">
            These are the persons and entities credited with creating and submitted incident
            reports. More details are available on the{' '}
            <LocalizedLink to="/summaries/leaderboard">leaderboard page.</LocalizedLink>
          </Trans>
        </p>
        <div className="flex justify-center items-center gap-5 md:gap-6 flex-wrap w-full">
          <OriginalSubmitersLeaderboard limit={3} className="flex-1-1-auto" />
          <UniqueSubmittersLeaderboard limit={3} className="flex-1-1-auto" />
          <SubmittersLeaderboard limit={3} className="flex-1-1-auto" />
        </div>
      </div>
    </>
  );
}
