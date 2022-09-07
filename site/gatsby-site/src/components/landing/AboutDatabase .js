import React from 'react';
import { Trans } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { Card } from 'flowbite-react';

export default function AboutDatabase() {
  return (
    <Card>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Trans ns="landing">About the Database</Trans>
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400 italic">
        <Trans i18nKey="aboutLine1" ns="landing">
          The AI Incident Database is dedicated to indexing the collective history of harms or near
          harms realized in the real world by the deployment of artificial intelligence systems.
          Like similar databases in aviation and computer security, the AI Incident Database aims to
          learn from experience so we can prevent or mitigate bad outcomes.
        </Trans>
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400 italic">
        <Trans i18nKey="aboutLine2" ns="landing">
          You are invited to <LocalizedLink to="/apps/submit">submit</LocalizedLink> incident
          reports, whereupon submissions will be indexed and made{' '}
          <LocalizedLink to="/apps/discover">discoverable</LocalizedLink> to the world. Artificial
          intelligence will only be a benefit to people and society if we collectively record and
          learn from its failings. <LocalizedLink to={`/about`}>(Learn More)</LocalizedLink>
        </Trans>
      </p>
    </Card>
  );
}
