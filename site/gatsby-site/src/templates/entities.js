import EntitiesTable from 'components/entities/EntitiesTable';
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
      <Layout {...props} sidebarCollapsed={true} className="w-full">
        <div className="titleWrapper">
          <h1>{t(metaTitle)}</h1>
        </div>
        <EntitiesTable data={entitiesData} className="mt-6" data-cy="entities" />
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
