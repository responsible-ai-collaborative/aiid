import React from 'react';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import { Spinner } from 'react-bootstrap';
import IncidentsTable from 'components/incidents/IncidentsTable';
import { FIND_INCIDENTS } from '../../graphql/incidents';
import { useQuery } from '@apollo/client';
import AiidHelmet from 'components/AiidHelmet';
import { useTranslation } from 'react-i18next';

export default function IncidentsPage(props) {
  const { data: incidentsData } = useQuery(FIND_INCIDENTS);

  const { t } = useTranslation();

  return (
    <LayoutHideSidebar {...props} className="bootstrap">
      <AiidHelmet>
        <title>{t('Incidents')}</title>
      </AiidHelmet>
      {!incidentsData && (
        <div className="p-2">
          <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> Fetching
          Incidents...
        </div>
      )}
      {incidentsData && incidentsData.incidents && (
        <div className="ms-3 mt-2 mb-2">
          <IncidentsTable data={incidentsData.incidents} />
        </div>
      )}
    </LayoutHideSidebar>
  );
}
