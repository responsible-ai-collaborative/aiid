import React from 'react';
import LatestIncidentReport from 'components/landing/LatestIncidentReport';
import { Trans } from 'react-i18next';

export default function LatestReports({ latestReport }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white">
        <Trans ns="landing">Latest Incident Report</Trans>
      </h2>

      <LatestIncidentReport className="mt-3 flex justify-center" report={latestReport} />
    </div>
  );
}
