import React from 'react';
import { Trans } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

export default function AboutDatabase() {
  return (
    <div className="flex flex-col h-full max-h-full p-6 w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Trans ns="landing">About the Database</Trans>
      </h5>
      <span className="relative z-2 pt-8">
        <FontAwesomeIcon
          icon={faQuoteLeft}
          className="text-gray-300 absolute -z-2 opacity-50 -top-0"
          size="5x"
        />
        <p className="font-normal text-gray-700 dark:text-gray-400 italic leading-loose z-3 pl-4">
          <Trans i18nKey="aboutLine1" ns="landing">
            The AI Incident Database is dedicated to indexing the collective history of harms or
            near harms realized in the real world by the deployment of artificial intelligence
            systems. Like similar databases in aviation and computer security, the AI Incident
            Database aims to learn from experience so we can prevent or mitigate bad outcomes.
          </Trans>
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400 italic leading-loose pl-4">
          <Trans i18nKey="aboutLine2" ns="landing">
            You are invited to <LocalizedLink to="/apps/submit">submit</LocalizedLink> incident
            reports, whereupon submissions will be indexed and made{' '}
            <LocalizedLink to="/apps/discover">discoverable</LocalizedLink> to the world. Artificial
            intelligence will only be a benefit to people and society if we collectively record and
            learn from its failings. <LocalizedLink to={`/about`}>(Learn More)</LocalizedLink>
          </Trans>
        </p>
      </span>
    </div>
  );
}
