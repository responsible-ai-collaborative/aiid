import React from 'react';
import { Card } from 'react-bootstrap';
import LatestIncidentReport from 'components/LatestIncidentReport';

export default function LatestReports() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Latest Incident Report</Card.Title>
        <LatestIncidentReport />
      </Card.Body>
    </Card>
  );
}
