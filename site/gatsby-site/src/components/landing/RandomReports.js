import RandomIncidentsCarousel from 'components/RandomIncidentsCarousel';
import React from 'react';
import { Card } from 'react-bootstrap';

export default function RandomReports() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Random Reports</Card.Title>
        <RandomIncidentsCarousel />
      </Card.Body>
    </Card>
  );
}
