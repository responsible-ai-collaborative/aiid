import RandomIncidentsCarousel from 'components/landing/RandomIncidentsCarousel';
import React from 'react';
import { Trans } from 'react-i18next';
import Card from '../../elements/Card';

export default function RandomReports() {
  return (
    <Card className="h-full">
      <Card.Body>
        <Card.Title as="h2">
          <Trans ns="landing">Random Reports</Trans>
        </Card.Title>
        <RandomIncidentsCarousel className="mt-3" />
      </Card.Body>
    </Card>
  );
}
