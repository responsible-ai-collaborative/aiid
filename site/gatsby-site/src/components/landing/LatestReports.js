import React from 'react';
import { Card } from 'react-bootstrap';
import LatestIncidentReport from 'components/LatestIncidentReport';

export default function LatestReports() {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2">Latest Incident Report</Card.Title>
        <LatestIncidentReport className="mt-3" />
      </Card.Body>
    </Card>
  );
}
