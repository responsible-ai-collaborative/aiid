import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { graphql } from 'gatsby';
import React from 'react';

const EntityPage = ({ pageContext, data, ...props }) => {
  const { name } = pageContext;

  const { incidentsAsDeployer, incidentsAsDeveloper, incidentsAsBoth } = data;

  return (
    <Layout {...props}>
      <h1>{name}</h1>

      <h2>as deployer</h2>
      {incidentsAsDeployer.nodes.map((incident) => (
        <div key={incident.incident_id}>
          <h3 className="tw-pt-6">Incident {incident.incident_id}</h3>
          <Link to={`/cite/${incident.incident_id}`}>{incident.title}</Link>
        </div>
      ))}

      <h2>as developer</h2>
      {incidentsAsDeveloper.nodes.map((incident) => (
        <div key={incident.incident_id}>
          <h3 className="tw-pt-6">Incident {incident.incident_id}</h3>
          <Link to={`/cite/${incident.incident_id}`}>{incident.title}</Link>
        </div>
      ))}

      <h2>as both</h2>
      {incidentsAsBoth.nodes.map((incident) => (
        <div key={incident.incident_id}>
          <h3 className="tw-pt-6">Incident {incident.incident_id}</h3>
          <Link to={`/cite/${incident.incident_id}`}>{incident.title}</Link>
        </div>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query EntityPageQuery(
    $incidentsAsDeployer: [Int]
    $incidentsAsDeveloper: [Int]
    $incidentsAsBoth: [Int]
  ) {
    incidentsAsDeployer: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsAsDeployer } }
    ) {
      nodes {
        title
        incident_id
      }
    }

    incidentsAsDeveloper: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsAsDeveloper } }
    ) {
      nodes {
        title
        incident_id
      }
    }

    incidentsAsBoth: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsAsBoth } }
    ) {
      nodes {
        title
        incident_id
      }
    }
  }
`;
export default EntityPage;
