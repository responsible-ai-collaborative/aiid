import React from 'react';
import LayoutHideSidebar from '../../components/LayoutHideSidebar';
import IncidentsTable from '../../components/incidents/IncidentsTable';
import { FIND_INCIDENTS } from '../../graphql/incidents';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import AiidHelmet from '../../components/AiidHelmet';
import ListSkeleton from 'elements/Skeletons/List';

export default function IncidentsPage(props) {
  const { data: incidentsData } = useQuery(FIND_INCIDENTS);

  const { t } = useTranslation();

  return (
    <LayoutHideSidebar {...props}>
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
          <div className="ms-3 mt-2 mb-2">
            <IncidentsTable data={incidentsData.incidents} />
          </div>
        )}
      </div>
    </LayoutHideSidebar>
  );
}
