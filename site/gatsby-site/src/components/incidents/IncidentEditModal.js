import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { Button, Modal, Spinner } from 'react-bootstrap';
import IncidentForm, { schema } from './IncidentForm';
import { Formik } from 'formik';

export default function IncidentEditModal({ show, onClose, incidentId }) {
  const [incident, setIncident] = useState();

  const { data: incidentData } = useQuery(FIND_INCIDENT, {
    variables: { query: { incident_id: incidentId } },
  });

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const addToast = useToastContext();

  useEffect(() => {
    if (incidentData?.incident) {
      setIncident({ ...incidentData.incident });
    } else {
      setIncident(undefined);
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

      onClose();
    } catch (e) {
      addToast({
        message: `Error updating incident ${incident} \n ${e.message}`,
        severity: SEVERITY.danger,
      });
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Incident</Modal.Title>
      </Modal.Header>

      {!incident && (
        <Modal.Body>
          {incident === undefined && (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          )}
          {incident === null && <div>Report not found</div>}
        </Modal.Body>
      )}

      {incident && (
        <Formik validationSchema={schema} onSubmit={handleSubmit} initialValues={incident}>
          {({ isValid, isSubmitting, submitForm }) => (
            <>
              <Modal.Body>
                <IncidentForm />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={submitForm} disabled={isSubmitting || !isValid}>
                  Update
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      )}
    </Modal>
  );
}
