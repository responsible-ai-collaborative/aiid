import * as React from 'react';
import Layout from '../../src/components/Layout';
import { LayoutContextProvider } from 'contexts/LayoutContext';

const wrapPageElement = ({ element, props }) => (
  <LayoutContextProvider>
    <Layout {...props}>{element}</Layout>
  </LayoutContextProvider>
);

export { wrapPageElement };
