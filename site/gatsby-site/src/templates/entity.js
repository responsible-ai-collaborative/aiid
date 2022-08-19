import Layout from 'components/Layout';
import React from 'react';

const EntityPage = ({ pageContext, ...props }) => {
  const { key } = pageContext;

  return <Layout {...props}>{key}</Layout>;
};

export default EntityPage;
