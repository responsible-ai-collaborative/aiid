import React from 'react';
import LatestIncidentReport from 'components/landing/LatestIncidentReport';
import { Trans } from 'react-i18next';

export default function LatestReports({ latestReport }) {
  return (
    <>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Trans>Latest Incident Report</Trans>
      </h5>
      <div className="flex flex-col items-center">
        <LatestIncidentReport report={latestReport} />
      </div>
    </>
  );
}
