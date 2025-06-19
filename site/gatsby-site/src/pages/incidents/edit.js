import React, { useEffect, useState } from 'react';
import IncidentForm, { schema } from '../../components/incidents/IncidentForm';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner } from 'flowbite-react';
import { FIND_FULL_INCIDENT, UPDATE_INCIDENT, UPDATE_INCIDENTS } from '../../graphql/incidents';
import {
  UPDATE_INCIDENT_TRANSLATION,
  translationsFields,
} from '../../graphql/incident_translations';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { Formik } from 'formik';
import pick from 'lodash/pick';
import { LocalizedLink, useLocalization } from 'plugins/gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'gatsby';
import { processEntities } from '../../utils/entities';
import DefaultSkeleton from 'elements/Skeletons/Default';
import { getUnixTime } from 'date-fns';
import { useUserContext } from 'contexts/UserContext';

function EditCitePage(props) {
  const { user } = useUserContext();

  const { t, i18n } = useTranslation();

  const { config: availableLanguages } = useLocalization();

  const [incident, setIncident] = useState(null);

  const [incidentId] = useQueryParam('incident_id', withDefault(NumberParam, 1));

  const { data: incidentData, loading: loadingIncident } = useQuery(FIND_FULL_INCIDENT, {
    variables: {
      filter: { incident_id: { EQ: incidentId } },
      translationLanguages: availableLanguages.filter((c) => c.code !== 'en').map((c) => c.code), // Exclude English since it's the default language
    },
  });

  const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const [incidentTranslations, setIncidentTranslations] = useState(null);

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [updateIncidents] = useMutation(UPDATE_INCIDENTS);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const [updateIncidentTranslation] = useMutation(UPDATE_INCIDENT_TRANSLATION);

  const loading = loadingIncident || loadingEntities || incidentTranslations === null;

  const addToast = useToastContext();

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
    message: t('Error updating incident {{incidentId}}.', { incidentId }),
    severity: SEVERITY.danger,
    error,
  });

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

      setIncident({
        ...incidentData.incident,
      });
    }
  }, [incidentData]);

  const handleSubmit = async (values) => {
    try {
      const updated = {
        ...values,
        editors: { link: values.editors },
        reports: undefined,
        embedding: {
          ...values.embedding,
          __typename: undefined,
        },
        tsne: {
          ...values.tsne,
          __typename: undefined,
        },
        __typename: undefined,
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

      const hasTitleChanged = values.title !== incident.title;

      const hasDescriptionChanged = values.description !== incident.description;

      const hasDirty = hasTitleChanged || hasDescriptionChanged;

      // update incident translations
      for (const { code } of availableLanguages.filter((c) => c.code !== 'en')) {
        const updatedTranslation = pick(values[`translations_${code}`], translationsFields);

        // check if at least one of the translationsFields is not empty
        const shouldUpdateTranslation = translationsFields.some(
          (field) => updatedTranslation[field] && updatedTranslation[field] !== ''
        );

        if (hasDirty) {
          updatedTranslation.dirty = true;
        }

        if (shouldUpdateTranslation || hasDirty) {
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

      await updateSimilarIncidentsReciprocal(
        updated.editor_similar_incidents,
        updated.editor_dissimilar_incidents
      );

      addToast(updateSuccessToast({ incidentId }));
    } catch (error) {
      addToast(updateErrorToast({ incidentId, error }));
    }
  };

  const updateSimilarIncidentsReciprocal = async (similarIncidents, dissimilarIncidents) => {
    const updateIncidentSet = async (incidents, setKey) => {
      if (incidents.length > 0) {
        const querySet = {
          [setKey]: [incident.incident_id],
        };

        await updateIncidents({
          variables: {
            filter: { incident_id: { IN: incidents } },
            update: { set: querySet },
          },
        });
      }
    };

    await Promise.all([
      updateIncidentSet(similarIncidents, 'editor_similar_incidents'),
      updateIncidentSet(dissimilarIncidents, 'editor_dissimilar_incidents'),
    ]);
  };

  const entityNames = entitiesData?.entities
    ? entitiesData.entities.map((node) => node.name).sort()
    : [];

  return (
    <div className={'w-full'} {...props}>
      {!loading && (
        <div className="flex flex-row justify-between flex-wrap">
          <h1 className="mb-5">
            <Trans>Editing Incident {{ incidentId }}</Trans>
          </h1>
          <Link to={`/cite/${incidentId}`} className="hover:no-underline mb-5">
            <Button outline={true} color={'light'}>
              <Trans>Back to Incident {{ incidentId }}</Trans>
            </Button>
          </Link>
        </div>
      )}

      {loading && <DefaultSkeleton />}
      {incident === null && !loading && <div>Incident not found</div>}

      {!loading && incident && (
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
            editors: incident.editors.map((user) => user.userId),
            implicated_systems:
              incident.implicated_systems === null
                ? []
                : incident.implicated_systems.map((item) => item.name),
            ...incidentTranslations,
          }}
        >
          {({ isValid, isSubmitting, submitForm, errors }) => (
            <>
              <IncidentForm entityNames={entityNames} />
              {!isValid && (
                <div className="text-red-500">
                  Could not validate form:{' '}
                  {Object.values(errors).map((error, index) => (
                    <div key={`error-${index}`}>{error}</div>
                  ))}
                </div>
              )}
              <Button
                onClick={submitForm}
                type="submit"
                disabled={!isValid || isSubmitting}
                className="mt-3 flex disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" />
                    <div className="ml-2">
                      <Trans>Updating...</Trans>
                    </div>
                  </>
                ) : (
                  <Trans>Save</Trans>
                )}
              </Button>
            </>
          )}
        </Formik>
      )}
    </div>
  );
}

export default EditCitePage;
