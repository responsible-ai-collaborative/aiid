import RandomIncidentsCarousel from 'components/landing/RandomIncidentsCarousel';
import React from 'react';
import { Card } from 'react-bootstrap';

export default function RandomReports() {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2">Random Reports</Card.Title>
        <RandomIncidentsCarousel className="mt-3" />
      </Card.Body>
    </Card>
  );
}
