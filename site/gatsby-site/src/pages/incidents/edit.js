import React, { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import IncidentForm from 'components/incidents/IncidentForm';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Spinner } from 'react-bootstrap';
import { FIND_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import { useMutation, useQuery } from '@apollo/client/react/hooks';

function EditCitePage(props) {
  const [incident, setIncident] = useState();

  const [incidentId] = useQueryParam('incident_id', withDefault(NumberParam, 1));

  const { data: incidentData } = useQuery(FIND_INCIDENT, {
    variables: { query: { incident_id: incidentId } },
  });

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const addToast = useToastContext();

  useEffect(() => {
    if (incidentData?.incident) {
      setIncident({
        ...incidentData.incident,
      });
    }
  }, [incidentData]);

  const handleSubmit = async (values) => {
    try {
      const updated = { ...values, reports: undefined, __typename: undefined };

      await updateIncident({
        variables: {
          query: {
            incident_id: incidentId,
          },
          set: {
            ...updated,
          },
        },
      });

      addToast({
        message: `Incident ${incidentId} updated successfully.`,
        severity: SEVERITY.success,
      });
    } catch (e) {
      addToast({
        message: `Error updating incident ${incident} \n ${e.message}`,
        severity: SEVERITY.danger,
      });
    }
  };

  return (
    <Layout {...props} className={'w-100'}>
      <h1 className="mb-5">Editing Incident {incidentId}</h1>

      {incident === undefined && (
        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
      )}
      {incident === null && <div>Report not found</div>}

      {incident && <IncidentForm incident={incident} onSubmit={handleSubmit} />}
    </Layout>
  );
}

export default EditCitePage;
