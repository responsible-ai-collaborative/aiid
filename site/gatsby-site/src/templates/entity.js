import EntityCard from 'components/entities/EntityCard';
import IncidentCard from 'components/incidents/IncidentCard';
import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { graphql } from 'gatsby';
import React, { Fragment, useState } from 'react';
import { Trans } from 'react-i18next';
import { computeEntities, makeEntitiesHash, makeIncidentsHash } from 'utils/entities';

const sortByReports = (a, b) => b.reports.length - a.reports.length;

const incidentFields = [
  'incidentsAsBoth',
  'incidentsAsDeployer',
  'incidentsAsDeveloper',
  'incidentsHarmedBy',
];

const EntityPage = ({ pageContext, data, ...props }) => {
  const { name, relatedEntities } = pageContext;

  const { incidentsAsDeployer, incidentsAsDeveloper, incidentsAsBoth, incidentsHarmedBy } = data;

  const entityIncidents = {
    incidentsAsBoth: incidentsAsBoth.nodes.sort(sortByReports),
    incidentsHarmedBy: incidentsHarmedBy.nodes.sort(sortByReports),
    incidentsAsDeveloper: incidentsAsDeveloper.nodes.sort(sortByReports),
    incidentsAsDeployer: incidentsAsDeployer.nodes.sort(sortByReports),
  };

  const sections = [
    {
      header: 'Incidents involved as both Developer and Deployer',
      key: 'incidentsAsBoth',
    },
    {
      header: 'Incindents Harmed By',
      key: 'incidentsHarmedBy',
    },
    {
      header: 'Incidents involved as Developer',
      key: 'incidentsAsDeveloper',
    },
    {
      header: 'Incidents involved as Deployer',
      key: 'incidentsAsDeployer',
    },
  ];

  const incidents = sections.reduce((array, s) => array.concat(entityIncidents[s.key]), []);

  const entities = computeEntities({ incidents });

  const incidentsHash = makeIncidentsHash(incidents);

  const entitiesHash = makeEntitiesHash(entities);

  const relatedEntitiesData = relatedEntities.map((id) => {
    const entity = { ...entitiesHash[id] };

    for (const field of incidentFields) {
      entity[field] = entity[field]
        .map((id) => incidentsHash[id])
        .sort((a, b) => b.reports.length - a.reports.length);
    }

    return entity;
  });

  return (
    <Layout {...props}>
      <h3>
        <Link to="/entities">Entities</Link>
      </h3>
      <h1>{name}</h1>

      {sections.map((section) => {
        const [open, setOpen] = useState(false);

        const visible = 4;

        const hidden = entityIncidents[section.key].length - visible;

        return (
          <div key={section.header}>
            {entityIncidents[section.key].length > 0 && (
              <>
                <h2 className="mt-24">
                  <Trans ns="entities">{section.header}</Trans>
                </h2>
                <div className="grid gap-4 grid-flow-row-dense md:grid-cols-2 mt-6">
                  {entityIncidents[section.key].map((incident, index) => {
                    if (index >= visible && !open) {
                      return null;
                    }

                    return <IncidentCard key={incident.incident_id} incident={incident} />;
                  })}
                </div>
                {entityIncidents[section.key].length > 3 && (
                  <button
                    onClick={() => setOpen((open) => !open)}
                    className="text-blue-700 border mt-4 ml-1 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xs p-1.5 text-center inline-flex items-center mr-2  dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
                  >
                    {open ? <Trans>View Less</Trans> : <Trans>View ({{ hidden }}) more</Trans>}
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}

      {relatedEntitiesData.length > 0 && (
        <>
          <h2 className="mt-24">
            <Trans ns="entities">Related Entities</Trans>
          </h2>
          <div className="grid gap-4 grid-flow-row-dense md:grid-cols-2 mt-6">
            {relatedEntitiesData.map((entity) => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
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
    $incidentsHarmedBy: [Int]
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
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
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
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
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
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
      }
    }

    incidentsHarmedBy: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsHarmedBy } }
    ) {
      nodes {
        title
        description
        incident_id
        reports
        date
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
      }
    }
  }
`;
export default EntityPage;
