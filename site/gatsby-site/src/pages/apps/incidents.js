import React from 'react';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import { Spinner } from 'react-bootstrap';
import IncidentsTable from 'components/incidents/IncidentsTable';
import { FIND_INCIDENTS } from '../../graphql/incidents';
import { useQuery } from '@apollo/client';

export default function IncidentsPage(props) {
  const { data: incidentsData } = useQuery(FIND_INCIDENTS);

  return (
    <LayoutHideSidebar {...props}>
      {!incidentsData && <Spinner size="sm" animation="border" />}
      {incidentsData && incidentsData.incidents && (
        <div className="ms-3 mt-2 mb-2">
          <IncidentsTable data={incidentsData.incidents} />
        </div>
      )}
    </LayoutHideSidebar>
  );
}
