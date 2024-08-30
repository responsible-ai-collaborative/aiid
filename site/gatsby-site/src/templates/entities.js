import EntitiesTable from 'components/entities/EntitiesTable';
import { graphql } from 'gatsby';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeEntitiesHash, makeIncidentsHash } from 'utils/entities';
import HeadContent from 'components/HeadContent';

const incidentFields = [
  'incidentsAsBoth',
  'incidentsAsDeployer',
  'incidentsAsDeveloper',
  'incidentsHarmedBy',
  'incidentsImplicatedSystems',
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
    <div {...props}>
      <div className="w-full">
        <div className="titleWrapper">
          <h1>{t(metaTitle)}</h1>
        </div>
        <EntitiesTable data={entitiesData} className="mt-6" data-cy="entities" />
      </div>
    </div>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation(['entities']);

  const metaTitle = t('Entities');

  const metaDescription = t('Entities involved in AI Incidents');

  const canonicalUrl = 'https://incidentdatabase.ai/entities';

  return <HeadContent path={pathname} {...{ metaTitle, metaDescription, canonicalUrl }} />;
};

export const query = graphql`
  query EntitiesPageQuery {
    incidents: allMongodbAiidprodIncidents {
      nodes {
        incident_id
        reports {
          report_number
        }
        title
        description
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
        implicated_systems
      }
    }
  }
`;

export default EntitiesPage;
