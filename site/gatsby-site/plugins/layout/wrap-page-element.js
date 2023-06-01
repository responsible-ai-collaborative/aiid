import * as React from 'react';
import Layout from '../../src/components/Layout';

const wrapPageElement = ({ element, props }) => <Layout {...props}>{element}</Layout>;

export { wrapPageElement };
