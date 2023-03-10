import React, { useEffect, useState } from 'react';
import IncidentsTable from '../../components/incidents/IncidentsTable';
import { FIND_INCIDENTS_TABLE } from '../../graphql/incidents';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import AiidHelmet from '../../components/AiidHelmet';
import Layout from 'components/Layout';
import ListSkeleton from 'elements/Skeletons/List';
import { graphql } from 'gatsby';
import { makeEntitiesHash } from 'utils/entities';
import { ToggleSwitch } from 'flowbite-react';

const IncidentsPage = ({ data, ...props }) => {
  const { data: incidents } = useQuery(FIND_INCIDENTS_TABLE);

  const [incidentsData, setIncidentsData] = useState(null);

  const [isLiveData, setIsLiveData] = useState(false);

  useEffect(() => {
    if (isLiveData) {
      if (incidents) {
        setIncidentsData(incidents.incidents);
      }
    } else if (data?.incidents?.nodes) {
      const entitiesHash = makeEntitiesHash(data?.entities?.nodes);

      const incidents = [];

      for (const incident of data.incidents.nodes) {
        incident.AllegedDeployerOfAISystem = incident.Alleged_deployer_of_AI_system.map(
          (entity_id) => entitiesHash[entity_id]
        );
        incident.AllegedDeveloperOfAISystem = incident.Alleged_developer_of_AI_system.map(
          (entity_id) => entitiesHash[entity_id]
        );
        incident.AllegedHarmedOrNearlyHarmedParties =
          incident.Alleged_harmed_or_nearly_harmed_parties.map(
            (entity_id) => entitiesHash[entity_id]
          );
        incidents.push(incident);
      }

      setIncidentsData(incidents);
    }
  }, [isLiveData, incidents, data]);

  const { t } = useTranslation();

  return (
    <Layout {...props} sidebarCollapsed={true} className="w-full">
      <AiidHelmet path={props.location.pathname}>
        <title>{t('Incidents')}</title>
      </AiidHelmet>
      <div className="bootstrap">
        {!incidentsData && (
          <div className="px-3">
            <ListSkeleton />
          </div>
        )}
        {incidentsData && (
          <div className="overflow-x-auto">
            <div className="flex justify-end mb-2 pt-1">
              <ToggleSwitch
                checked={isLiveData}
                label={t('Show Live data')}
                onChange={(checked) => {
                  setIsLiveData(checked);
                }}
                name="live-data-switch"
              />
            </div>
            <IncidentsTable data={incidentsData} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query IncidentsPageQuery {
    incidents: allMongodbAiidprodIncidents {
      nodes {
        incident_id
        title
        description
        editors
        date
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
      }
    }
    entities: allMongodbAiidprodEntities {
      nodes {
        id: entity_id
        name
      }
    }
  }
`;

export default IncidentsPage;
