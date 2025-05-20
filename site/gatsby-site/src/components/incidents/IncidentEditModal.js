import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_FULL_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import {
  UPDATE_INCIDENT_TRANSLATION,
  translationsFields,
} from '../../graphql/incident_translations';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Spinner, Modal, Button } from 'flowbite-react';
import IncidentForm, { schema } from './IncidentForm';
import { Formik } from 'formik';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { processEntities } from '../../utils/entities';
import { getUnixTime } from 'date-fns';
import { useUserContext } from 'contexts/UserContext';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import pick from 'lodash/pick';

export default function IncidentEditModal({ show, onClose, incidentId }) {
  const { user } = useUserContext();

  const { t, i18n } = useTranslation();

  const { config: availableLanguages } = useLocalization();

  const [incident, setIncident] = useState(null);

  const [incidentTranslations, setIncidentTranslations] = useState(null);

  const { data: incidentData } = useQuery(FIND_FULL_INCIDENT, {
    variables: {
      filter: { incident_id: { EQ: incidentId } },
      translationLanguages: availableLanguages.filter((c) => c.code !== 'en').map((c) => c.code), // Exclude English since it's the default language
    },
  });

  const { data: entitiesData } = useQuery(FIND_ENTITIES);

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const [updateIncidentTranslation] = useMutation(UPDATE_INCIDENT_TRANSLATION);

  const addToast = useToastContext();

  useEffect(() => {
    if (incidentData?.incident) {
      const translations = availableLanguages
        .map((c) => c.code)
        .reduce((acc, languageCode) => {
          // Find existing translation for this language
          const existingTranslation = incidentData.incident.translations?.find(
            (t) => t.language === languageCode && t.title !== null && t.description !== null
          );

          // If translation exists use its values, otherwise use empty values
          acc[`translations_${languageCode}`] = existingTranslation
            ? pick(existingTranslation, translationsFields)
            : translationsFields.reduce((obj, field) => {
                obj[field] = '';
                return obj;
              }, {});

          return acc;
        }, {});

      setIncidentTranslations(translations);
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

      updated.implicated_systems = await processEntities(
        entities,
        values.implicated_systems,
        createEntityMutation
      );

      updated.epoch_date_modified = getUnixTime(new Date());

      // Add the current user to the list of editors
      if (user && user.providerType != 'anon-user' && !updated.editors.link.includes(user.id)) {
        updated.editors.link.push(user.id);
      }

      // remove "translations" field from updated
      delete updated.translations;
      // remove "translations_${code}" fields from updated
      for (const { code } of availableLanguages.filter((c) => c.code !== values.language)) {
        delete updated[`translations_${code}`];
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

      // update incident translations
      for (const { code } of availableLanguages.filter((c) => c.code !== 'en')) {
        const updatedTranslation = pick(values[`translations_${code}`], translationsFields);

        // check if at least one of the translationsFields is not empty
        const shouldUpdateTranslation = translationsFields.some(
          (field) => updatedTranslation[field] && updatedTranslation[field] !== ''
        );

        if (shouldUpdateTranslation) {
          await updateIncidentTranslation({
            variables: {
              input: {
                ...updatedTranslation,
                language: code,
                incident_id: incidentId,
              },
            },
          });
        }
      }

      addToast(updateSuccessToast({ incidentId }));

      onClose();
    } catch (error) {
      addToast(updateErrorToast({ incidentId, error }));
    }
  };

  if (!show) {
    return null;
  }

  const entityNames = entitiesData?.entities
    ? entitiesData.entities.map((node) => node.name).sort()
    : [];

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
            implicated_systems:
              incident.implicated_systems === null
                ? []
                : incident.implicated_systems.map((item) => item.name),
            editors: incident.editors.map((editor) => editor.userId),
            ...incidentTranslations,
          }}
        >
          {({ isValid, isSubmitting, submitForm }) => (
            <>
              <Modal.Body>
                <IncidentForm entityNames={entityNames} />
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
