import IncidentCard from 'components/incidents/IncidentCard';
import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { graphql } from 'gatsby';
import React from 'react';

const EntityPage = ({ pageContext, data, ...props }) => {
  const { name, relatedEntities } = pageContext;

  const { incidentsAsDeployer, incidentsAsDeveloper, incidentsAsBoth } = data;

  const sections = [
    {
      header: 'Incidents involved as Deployer',
      incidents: incidentsAsDeployer.nodes,
    },
    {
      header: 'Incidents involved as Developer',
      incidents: incidentsAsDeveloper.nodes,
    },
    {
      header: 'Incidents involved as both Developer and Deployer',
      incidents: incidentsAsBoth.nodes,
    },
  ];

  return (
    <Layout {...props}>
      <h1>{name}</h1>

      {sections.map((section) => (
        <>
          {section.incidents.length > 0 && (
            <>
              <h4 className="tw-mt-6">{section.header}</h4>
              {section.incidents.map((incident) => (
                <IncidentCard key={incident.incident_id} incident={incident} className="tw-mt-4" />
              ))}
            </>
          )}
        </>
      ))}

      {relatedEntities.length > 0 && (
        <>
          <h4 className="tw-mt-6">Related Entities</h4>
          {relatedEntities.map((entity) => (
            <div key={entity.id}>
              <h3 className="tw-pt-6">{entity}</h3>
              <Link to={`/entities/${entity}`}>{entity}</Link>
            </div>
          ))}
        </>
      )}
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
        description
        incident_id
      }
    }

    incidentsAsDeveloper: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsAsDeveloper } }
    ) {
      nodes {
        title
        description
        incident_id
      }
    }

    incidentsAsBoth: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsAsBoth } }
    ) {
      nodes {
        title
        description
        incident_id
      }
    }
  }
`;
export default EntityPage;
