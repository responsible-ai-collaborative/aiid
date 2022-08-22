import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { graphql } from 'gatsby';
import React from 'react';

const EntityPage = ({ pageContext, data, ...props }) => {
  const { name } = pageContext;

  const { incidents } = data;

  return (
    <Layout {...props}>
      <h1>{name}</h1>

      <h2>Associated incidents</h2>
      {incidents.nodes.map((incident) => (
        <div key={incident.incident_id}>
          <h3 className="tw-pt-6">Incident {incident.incident_id}</h3>
          <Link to={`/cite/${incident.incident_id}`}>{incident.title}</Link>
        </div>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query EntityPageQuery($incidents: [Int]) {
    incidents: allMongodbAiidprodIncidents(filter: { incident_id: { in: $incidents } }) {
      nodes {
        title
        incident_id
      }
    }
  }
`;
export default EntityPage;
