import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button } from 'react-bootstrap';
import { Spinner, Modal } from 'flowbite-react';
import IncidentForm, { schema } from './IncidentForm';
import { Formik } from 'formik';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { processEntities } from '../../utils/entities';

export default function IncidentEditModal({ show, onClose, incidentId }) {
  const { t, i18n } = useTranslation();

  const [incident, setIncident] = useState(null);

  const { data: incidentData } = useQuery(FIND_INCIDENT, {
    variables: { query: { incident_id: incidentId } },
  });

  const { data: entitiesData } = useQuery(FIND_ENTITIES);

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const addToast = useToastContext();

  useEffect(() => {
    if (incidentData?.incident) {
      setIncident({ ...incidentData.incident });
    } else {
      setIncident(undefined);
    }
  }, [incidentData]);

  const updateSuccessToast = ({ incidentId }) => ({
    message: (
      <Trans i18n={i18n} incidentId={incidentId}>
        Incident {{ incidentId }} updated successfully.{' '}
        <LocalizedLink to={'/cite/' + incidentId}>View incident {{ incidentId }}</LocalizedLink>.
      </Trans>
    ),
    severity: SEVERITY.success,
  });

  const updateErrorToast = ({ incidentId, error }) => ({
    message: t('Error updating incident {{incident}}. \n {{message}}', {
      incidentId,
      message: error.message,
    }),
    severity: SEVERITY.danger,
    error,
  });

  const handleSubmit = async (values) => {
    try {
      const updated = {
        ...values,
        reports: undefined,
        __typename: undefined,
        embedding: undefined,
      };

      const { entities } = entitiesData;

      updated.AllegedDeveloperOfAISystem = await processEntities(
        entities,
        values.AllegedDeveloperOfAISystem,
        createEntityMutation
      );

      updated.AllegedDeployerOfAISystem = await processEntities(
        entities,
        values.AllegedDeployerOfAISystem,
        createEntityMutation
      );

      updated.AllegedHarmedOrNearlyHarmedParties = await processEntities(
        entities,
        values.AllegedHarmedOrNearlyHarmedParties,
        createEntityMutation
      );

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

      addToast(updateSuccessToast({ incidentId }));

      onClose();
    } catch (error) {
      addToast(updateErrorToast({ incidentId, error }));
    }
  };

  return (
    <Modal show={show} onClose={onClose} className="submission-modal" size="3xl">
      <Modal.Header>Edit Incident</Modal.Header>

      {!incident && (
        <Modal.Body>
          {incident === undefined && (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
          {incident === null && <div>Report not found</div>}
        </Modal.Body>
      )}

      {incident && entitiesData?.entities && (
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={{
            ...incident,
            AllegedDeveloperOfAISystem:
              incident.AllegedDeveloperOfAISystem === null
                ? []
                : incident.AllegedDeveloperOfAISystem.map((item) => item.name),
            AllegedDeployerOfAISystem:
              incident.AllegedDeployerOfAISystem === null
                ? []
                : incident.AllegedDeployerOfAISystem.map((item) => item.name),
            AllegedHarmedOrNearlyHarmedParties:
              incident.AllegedHarmedOrNearlyHarmedParties === null
                ? []
                : incident.AllegedHarmedOrNearlyHarmedParties.map((item) => item.name),
          }}
        >
          {({ isValid, isSubmitting, submitForm }) => (
            <>
              <Modal.Body>
                <IncidentForm />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={submitForm}
                  disabled={isSubmitting || !isValid}
                  className="bootstrap flex gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" />
                      <Trans>Updating</Trans>
                    </>
                  ) : (
                    <Trans>Update</Trans>
                  )}
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      )}
    </Modal>
  );
}
