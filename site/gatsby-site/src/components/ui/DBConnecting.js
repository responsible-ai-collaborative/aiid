import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

const DBConnecting = () => (
  <div className="d-grid gap-2">
    <Button variant="primary" disabled>
      <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
      Connecting to Database...
    </Button>
  </div>
);

export default DBConnecting;
