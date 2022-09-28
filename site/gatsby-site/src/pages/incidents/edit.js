import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import IncidentForm, { schema } from '../../components/incidents/IncidentForm';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button } from 'react-bootstrap';
import { Spinner } from 'flowbite-react';
import { FIND_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { Formik } from 'formik';

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
      const updated = {
        ...values,
        reports: undefined,
        embedding: {
          ...values.embedding,
          __typename: undefined,
        },
        __typename: undefined,
      };

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
    <Layout {...props} className={'w-100 bootstrap'}>
      <h1 className="mb-5">Editing Incident {incidentId}</h1>

      {incident === undefined && <Spinner />}
      {incident === null && <div>Report not found</div>}

      {incident && (
        <Formik validationSchema={schema} onSubmit={handleSubmit} initialValues={incident}>
          {({ isValid, isSubmitting, submitForm }) => (
            <>
              <IncidentForm />
              <Button
                onClick={submitForm}
                className="mt-3"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </>
          )}
        </Formik>
      )}
    </Layout>
  );
}

export default EditCitePage;
