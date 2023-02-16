import React from 'react';
import IncidentsTable from '../../components/incidents/IncidentsTable';
import { FIND_INCIDENTS_TABLE } from '../../graphql/incidents';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import AiidHelmet from '../../components/AiidHelmet';
import Layout from 'components/Layout';
import ListSkeleton from 'elements/Skeletons/List';

export default function IncidentsPage(props) {
  const { data: incidentsData } = useQuery(FIND_INCIDENTS_TABLE);

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
        {incidentsData && incidentsData.incidents && (
          <div className="ms-3 mt-2 mb-2 overflow-x-auto">
            <IncidentsTable data={incidentsData.incidents} />
          </div>
        )}
      </div>
    </Layout>
  );
}
