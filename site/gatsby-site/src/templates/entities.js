import EntitiesTable from 'components/entities/EntitiesTable';
import Container from 'elements/Container';
import { graphql } from 'gatsby';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeEntitiesHash, makeIncidentsHash } from 'utils/entities';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';

const incidentFields = [
  'incidentsAsBoth',
  'incidentsAsDeployer',
  'incidentsAsDeveloper',
  'incidentsHarmedBy',
];

const entitiesFields = ['relatedEntities'];

const EntitiesPage = ({ pageContext, data, ...props }) => {
  const { t } = useTranslation(['entities']);

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

  const metaTitle = t('Entities');

  return (
    <>
      <AiidHelmet
        {...{
          metaTitle,
          metaDescription: t('Entities involved in AI Incidents'),
          canonicalUrl: 'https://incidentdatabase.ai/entities',
          path: props.location.pathname,
        }}
      />
      <Layout {...props} sidebarCollapsed={true}>
        <Container className="ml-auto mr-auto pl-3 pr-3 w-full lg:max-w-6xl xl:max-w-7xl mt-6">
          <h1 className="text-5xl mt-6 font-extrabold dark:text-white">{t(metaTitle)}</h1>
          <EntitiesTable data={entitiesData} className="mt-6" data-cy="entities" />
        </Container>
      </Layout>
    </>
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
