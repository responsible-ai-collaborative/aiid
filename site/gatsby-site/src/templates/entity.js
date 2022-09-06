import IncidentCard from 'components/incidents/IncidentCard';
import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { graphql } from 'gatsby';
import React from 'react';

const sortByReports = (a, b) => b.reports.length - a.reports.length;

const EntityPage = ({ pageContext, data, ...props }) => {
  const { name, relatedEntities } = pageContext;

  const { incidentsAsDeployer, incidentsAsDeveloper, incidentsAsBoth } = data;

  const sections = [
    {
      header: 'Incidents involved as both Developer and Deployer',
      incidents: incidentsAsBoth.nodes.sort(sortByReports),
    },
    {
      header: 'Incidents involved as Developer',
      incidents: incidentsAsDeveloper.nodes
        .filter(
          (incident) => !incidentsAsBoth.nodes.some((i) => incident.incident_id === i.incident_id)
        )
        .sort(sortByReports),
    },
    {
      header: 'Incidents involved as Deployer',
      incidents: incidentsAsDeployer.nodes
        .filter(
          (incident) => !incidentsAsBoth.nodes.some((i) => incident.incident_id === i.incident_id)
        )
        .sort(sortByReports),
    },
  ];

  return (
    <Layout {...props}>
      <h3>
        <Link to="/entities">Entities</Link>
      </h3>
      <h1>{name}</h1>

      {sections.map((section) => (
        <div key={section.header}>
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
        </div>
      ))}

      {relatedEntities.length > 0 && (
        <>
          <h4 className="mt-24">Related Entities</h4>
          {relatedEntities.map((entity) => (
            <div
              key={entity.id}
              className={`mt-6 p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700`}
            >
              <Link to={`/entities/${entity.id}`}>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {entity.name}
                </h5>
              </Link>

              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {entity.incidents.sort(sortByReports).map((incident) => (
                  <li key={incident.incident_id} className="py-3 sm:py-4">
                    <Link
                      to={`/cite/${incident.incident_id}`}
                      className="tracking-tight text-gray-900 dark:text-white"
                    >
                      <div className="m-0">
                        <div className="inline-block text-muted-gray">
                          Incident {incident.incident_id}
                        </div>
                        <div className="ml-2 inline-block bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                          {incident.reports.length} Reports(s)
                        </div>
                      </div>
                      <p className="mt-1 mb-0 text-xl">{incident.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
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
