import RandomIncidentsCarousel from 'components/landing/RandomIncidentsCarousel';
import React from 'react';
import { Trans } from 'react-i18next';

export default function RandomReports() {
  return (
    <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col h-full">
      <div className="flex h-full flex-col gap-4 p-6">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Trans ns="landing">Random Reports</Trans>
        </h5>
        <RandomIncidentsCarousel />
      </div>
    </div>
  );
}
