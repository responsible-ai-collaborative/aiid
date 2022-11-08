import React from 'react';
import { Spinner } from 'flowbite-react';
import IncidentsTable from '../../components/incidents/IncidentsTable';
import { FIND_INCIDENTS } from '../../graphql/incidents';
import { useQuery } from '@apollo/client';
import { Trans, useTranslation } from 'react-i18next';
import AiidHelmet from '../../components/AiidHelmet';
import Layout from 'components/Layout';

export default function IncidentsPage(props) {
  const { data: incidentsData } = useQuery(FIND_INCIDENTS);

  const { t } = useTranslation();

  return (
    <Layout {...props} sidebarCollapsed={true}>
      <AiidHelmet>
        <title>{t('Incidents')}</title>
      </AiidHelmet>
      <div className="bootstrap">
        {!incidentsData && (
          <div className="p-4 flex justify-center align-items-center gap-2">
            <Spinner />
            <Trans>Fetching Incidents...</Trans>
          </div>
        )}
        {incidentsData && incidentsData.incidents && (
          <div className="ms-3 mt-2 mb-2">
            <IncidentsTable data={incidentsData.incidents} />
          </div>
        )}
      </div>
    </Layout>
  );
}
