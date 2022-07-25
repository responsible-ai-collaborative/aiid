import RandomIncidentsCarousel from 'components/landing/RandomIncidentsCarousel';
import React from 'react';
import { Card } from 'react-bootstrap';
import { Trans } from 'react-i18next';

export default function RandomReports() {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2">
          <Trans ns="landing">Random Reports</Trans>
        </Card.Title>
        <RandomIncidentsCarousel className="mt-3" />
      </Card.Body>
    </Card>
  );
}
