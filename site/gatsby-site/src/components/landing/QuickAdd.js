import React from 'react';
import QuickAddForm from 'components/forms/QuickAddForm';
import { Trans } from 'react-i18next';
import Card from '../../elements/Card';

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
