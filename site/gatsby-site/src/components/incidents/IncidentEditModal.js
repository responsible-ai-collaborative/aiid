import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_FULL_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Spinner, Modal, Button } from 'flowbite-react';
import IncidentForm, { schema } from './IncidentForm';
import { Formik } from 'formik';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { processEntities } from '../../utils/entities';
import { getUnixTime } from 'date-fns';
import { useUserContext } from 'contexts/userContext';

export default function IncidentEditModal({ show, onClose, incidentId }) {
  const { user } = useUserContext();

  const { t, i18n } = useTranslation();

  const [incident, setIncident] = useState(null);

  const { data: incidentData } = useQuery(FIND_FULL_INCIDENT, {
    variables: { filter: { incident_id: { EQ: incidentId } } },
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
        editors: { link: values.editors },
        tsne: undefined,
        incidentSearch: undefined,
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

      updated.epoch_date_modified = getUnixTime(new Date());

      // Add the current user to the list of editors
      if (user && user.providerType != 'anon-user' && !updated.editors.link.includes(user.id)) {
        updated.editors.link.push(user.id);
      }

      await updateIncident({
        variables: {
          filter: {
            incident_id: { EQ: incidentId },
          },
          update: {
            set: {
              ...updated,
            },
          },
        },
      });

      addToast(updateSuccessToast({ incidentId }));

      onClose();
    } catch (error) {
      addToast(updateErrorToast({ incidentId, error }));
    }
  };

  if (!show) {
    return null;
  }

  return (
    <Modal show={show} onClose={onClose} className="submission-modal" size="3xl">
      <Modal.Header>Edit Incident {incident?.incident_id}</Modal.Header>

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
            editors: incident.editors.map((editor) => editor.userId),
          }}
        >
          {({ isValid, isSubmitting, submitForm }) => (
            <>
              <Modal.Body>
                <IncidentForm />
              </Modal.Body>
              <Modal.Footer>
                <Button color="gray" onClick={onClose}>
                  Close
                </Button>
                <Button
                  onClick={submitForm}
                  disabled={isSubmitting || !isValid}
                  className="flex gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
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
