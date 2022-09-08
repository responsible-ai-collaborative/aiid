import EntitiesTable from 'components/entities/EntitiesTable';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import Container from 'elements/Container';
import { graphql } from 'gatsby';
import React, { useMemo } from 'react';

const incidentFields = [
  'incidentsAsBoth',
  'incidentsAsDeployer',
  'incidentsAsDeveloper',
  'incidentsHarmedBy',
];

const entitiesFields = ['relatedEntities'];

const EntitiesPage = ({ pageContext, data, ...props }) => {
  const { entities } = pageContext;

  const { incidents } = data;

  const incidentsHash = useMemo(
    () =>
      incidents.nodes.reduce((hash, incident) => {
        hash[incident.incident_id] = incident;
        return hash;
      }, {}),
    [incidents.nodes]
  );

  const entitiesHash = useMemo(
    () =>
      entities.reduce((hash, entity) => {
        hash[entity.id] = entity;
        return hash;
      }, {}),
    [entities]
  );

  const entitiesData = useMemo(
    () =>
      entities.map((entity) => {
        for (const field of incidentFields) {
          entity[field] = entity[field]
            .map((id) => incidentsHash[id])
            .sort((a, b) => b.reports.length - a.reports.length);
        }

        for (const field of entitiesFields) {
          entity[field] = entity[field].map((id) => entitiesHash[id]);
        }

        return {
          ...entity,
        };
      }),
    [incidentsHash, entitiesHash]
  );

  return (
    <LayoutHideSidebar {...props}>
      <Container className="tw-container-xl mt-6">
        <h1 className="text-5xl mt-6 font-extrabold dark:text-white">Entities</h1>
        <EntitiesTable data={entitiesData} className="mt-6" />
      </Container>
    </LayoutHideSidebar>
  );
};

export const query = graphql`
  query EntitiesPageQuery {
    incidents: allMongodbAiidprodIncidents {
      nodes {
        incident_id
        reports
        title
        description
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
      }
    }
  }
`;

export default EntitiesPage;
