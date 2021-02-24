import React, { useState } from 'react';
import { Layout } from '@components';
import { Button } from 'react-bootstrap';

const CollapsedSidebarAppTest = (props) => {
  const [collapse, setCollapse] = useState(false);

  return (
    <Layout {...props} collapse={collapse}>
      <Button variant="primary" onClick={() => setCollapse(!collapse)}>
        Open sidebar
      </Button>
      <div>test content</div>
    </Layout>
  );
};

export default CollapsedSidebarAppTest;
