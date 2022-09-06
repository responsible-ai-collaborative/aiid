import RandomIncidentsCarousel from 'components/landing/RandomIncidentsCarousel';
import { Card } from 'flowbite-react';
import React from 'react';
import { Trans } from 'react-i18next';

export default function RandomReports() {
  return (
    <Card>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Trans ns="landing">Random Reports</Trans>
      </h5>
      <RandomIncidentsCarousel className="mt-3" />
    </Card>
  );
}
