import Wordlist from 'components/WordList';
import { LocalizedLink } from 'gatsby-theme-i18n';
import React from 'react';
import { Trans } from 'react-i18next';

export default function WordCounts({ localWordCounts }) {
  return (
    <div className="flex flex-col p-6 w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Trans ns="landing">Wordcounts</Trans>
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        <Trans i18nKey="wordcountsDescription" ns="landing">
          These are the most common rooted and stemmed words across all incident reports. More
          details are available on its{' '}
          <LocalizedLink to="/summaries/wordcounts">data summary page.</LocalizedLink>
        </Trans>
      </p>
      <Wordlist content={localWordCounts} />
    </div>
  );
}
