import React from 'react';
import LatestIncidentReport from 'components/landing/LatestIncidentReport';

export default function LatestReports({ latestReport }) {
  return (
    <>
      <div className="flex flex-col items-center">
        <LatestIncidentReport report={latestReport} />
      </div>
    </>
  );
}
