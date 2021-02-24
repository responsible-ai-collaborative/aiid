import React from 'react';
import { Layout } from '@components';

const Default404 = (props) => {
  return (
    <Layout {...props}>
      <h4>Wrong page. This page does not exist.</h4>
      <h5>Use the menu to navigate to an existing page.</h5>
    </Layout>
  );
};

export default Default404;
