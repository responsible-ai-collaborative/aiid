import EntitiesCard from 'components/entities/EntitiesCard';
import Layout from 'components/Layout';
import React from 'react';

const EntitiesPage = ({ pageContext, ...props }) => {
  const { entities } = pageContext;

  return (
    <Layout {...props}>
      <h1>Entities</h1>
      <EntitiesCard entities={entities} />
    </Layout>
  );
};

export default EntitiesPage;
