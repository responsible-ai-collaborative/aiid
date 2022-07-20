import React from 'react';
import { Card } from 'react-bootstrap';
import LatestIncidentReport from 'components/landing/LatestIncidentReport';
import { Trans } from 'react-i18next';

export default function LatestReports() {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2">
          <Trans ns="landing">Latest Incident Report</Trans>
        </Card.Title>
        <LatestIncidentReport className="mt-3" />
      </Card.Body>
    </Card>
  );
}
