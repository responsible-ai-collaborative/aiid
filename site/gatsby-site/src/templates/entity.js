import EntitiesCard from 'components/entities/EntitiesCard';
import IncidentCard from 'components/incidents/IncidentCard';
import Layout from 'components/Layout';
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
              <h4 className="mt-24">{section.header}</h4>
              <div className="grid gap-4 grid-flow-row-dense md:grid-cols-2 mt-6">
                {section.incidents.map((incident) => (
                  <IncidentCard key={incident.incident_id} incident={incident} />
                ))}
              </div>
            </>
          )}
        </>
      ))}

      {relatedEntities.length > 0 && (
        <>
          <h4 className="mt-24">Related Entities</h4>
          <EntitiesCard entities={relatedEntities} className="mt-6" />
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
        reports
        date
      }
    }

    incidentsAsDeveloper: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsAsDeveloper } }
    ) {
      nodes {
        title
        description
        incident_id
        reports
        date
      }
    }

    incidentsAsBoth: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsAsBoth } }
    ) {
      nodes {
        title
        description
        incident_id
        reports
        date
      }
    }
  }
`;
export default EntityPage;
