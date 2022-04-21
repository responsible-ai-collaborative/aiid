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
        <IncidentsTable data={incidentsData.incidents} />
      )}
    </LayoutHideSidebar>
  );
}
