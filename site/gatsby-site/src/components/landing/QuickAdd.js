import React from 'react';
import QuickAddForm from 'components/forms/QuickAddForm';
import { Card } from 'react-bootstrap';

export default function QuickAdd() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Quick Add New Report URL</Card.Title>
        <QuickAddForm />
      </Card.Body>
    </Card>
  );
}
