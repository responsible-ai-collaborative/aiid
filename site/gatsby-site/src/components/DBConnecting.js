import { Button, Spinner } from 'react-bootstrap';

const DBConnecting = () => (
  <Button variant="primary" disabled block>
    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
    Connecting to Database...
  </Button>
);

export default DBConnecting;
