import EntitiesTable from 'components/entities/EntitiesTable';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import Container from 'elements/Container';
import { graphql } from 'gatsby';
import React, { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { makeEntitiesHash, makeIncidentsHash } from 'utils/entities';

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

  const incidentsHash = useMemo(() => makeIncidentsHash(incidents.nodes), [incidents.nodes]);

  const entitiesHash = useMemo(() => makeEntitiesHash(entities), [entities]);

  const entitiesData = useMemo(
    () =>
      entities.map((entity) => {
        const updates = {};

        for (const field of incidentFields) {
          updates[field] = entity[field]
            .map((id) => incidentsHash[id])
            .sort((a, b) => b.reports.length - a.reports.length);
        }

        for (const field of entitiesFields) {
          updates[field] = entity[field].map((id) => entitiesHash[id]);
        }

        return {
          ...entity,
          ...updates,
        };
      }),
    [incidentsHash, entitiesHash]
  );

  return (
    <LayoutHideSidebar {...props}>
      <Container className="tw-container-xl mt-6">
        <h1 className="text-5xl mt-6 font-extrabold dark:text-white">
          <Trans ns="entities">Entities</Trans>
        </h1>
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
