import React from 'react';
import { Trans } from 'react-i18next';
import Card from '../../elements/Card';
import IncidentReportCard from 'components/IncidentReportCard';

export default function LatestReports({ latestReport }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2">
          <Trans ns="landing">Latest Incident Report</Trans>
        </Card.Title>
        <IncidentReportCard report={latestReport} imagePosition="left" textMaxChars={400} />
      </Card.Body>
    </Card>
  );
}
