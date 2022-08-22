import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import React from 'react';

const EntitiesPage = ({ pageContext, ...props }) => {
  const { entititiesHash } = pageContext;

  return (
    <Layout {...props}>
      <h1>Entities</h1>

      {Object.entries(entititiesHash).map(([key, value]) => {
        return (
          <div key={key} className="pt-2">
            <Link to={`/entities/${key}`}>{value.name}</Link>
          </div>
        );
      })}
    </Layout>
  );
};

export default EntitiesPage;
