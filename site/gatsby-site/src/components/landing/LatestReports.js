import React from 'react';
import LatestIncidentReport from 'components/landing/LatestIncidentReport';
import { Trans } from 'react-i18next';
import Card from '../../elements/Card';

export default function LatestReports({ latestReport }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2">
          <Trans ns="landing">Latest Incident Report</Trans>
        </Card.Title>
        <LatestIncidentReport className="mt-3" report={latestReport} />
      </Card.Body>
    </Card>
  );
}
