import React from 'react';
import QuickAddForm from 'components/forms/QuickAddForm';
import { Card } from 'react-bootstrap';
import { Trans } from 'react-i18next';

export default function QuickAdd() {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2">
          <Trans ns="landing">Quick Add New Report URL</Trans>
        </Card.Title>
        <QuickAddForm className="mt-3" />
      </Card.Body>
    </Card>
  );
}
