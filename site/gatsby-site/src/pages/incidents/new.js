import React, { useEffect, useState } from 'react';
import IncidentForm, { schema } from '../../components/incidents/IncidentForm';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { Button, Spinner } from 'flowbite-react';
import {
  FIND_INCIDENT,
  GET_LATEST_INCIDENT_ID,
  INSERT_INCIDENT,
  LOG_INCIDENT_HISTORY,
} from '../../graphql/incidents';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { Formik } from 'formik';
import { LocalizedLink, useLocalization } from 'plugins/gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { processEntities } from '../../utils/entities';
import DefaultSkeleton from 'elements/Skeletons/Default';
import { useUserContext } from '../../contexts/userContext';
import { getUnixTime } from 'date-fns';

function NewIncidentPage() {
  const [incidentIdToClone] = useQueryParam('incident_id', withDefault(NumberParam, 0));

  const { user } = useUserContext();

  const { t, i18n } = useTranslation();

  const { data: incidentToCloneData, loading: loadingIncidentToClone } = useQuery(FIND_INCIDENT, {
    variables: { filter: { incident_id: { EQ: incidentIdToClone } } },
  });

  const [initialValues, setInitialValues] = useState(null);

  const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const { data: lastIncident, loading: loadingLastIncident } = useQuery(GET_LATEST_INCIDENT_ID);

  const loading = loadingLastIncident || loadingEntities || loadingIncidentToClone;

  const [insertIncident] = useMutation(INSERT_INCIDENT);

  const [logIncidentHistory] = useMutation(LOG_INCIDENT_HISTORY);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const addToast = useToastContext();

  const { locale } = useLocalization();

  const insertSuccessToast = ({ newIncidentId }) => ({
    message: (
      <Trans i18n={i18n} newIncidentId={newIncidentId}>
        You have successfully create Incident {{ newIncidentId }}.{' '}
        <LocalizedLink language={locale} to={'/cite/' + newIncidentId}>
          View incident
        </LocalizedLink>
        .
      </Trans>
    ),
    severity: SEVERITY.success,
  });

  const updateErrorToast = ({ newIncidentId, error }) => ({
    message: t('Error creating incident {{incidentId}}.', { newIncidentId }),
    severity: SEVERITY.danger,
    error,
  });

  const handleSubmit = async (values) => {
    const newIncidentId = lastIncident.incidents[0].incident_id + 1;

    try {
      const newIncident = {
        ...values,
        incident_id: newIncidentId,
        reports: { link: [] },
        editors: { link: values.editors },
        embedding: {
          ...values.embedding,
        },
      };

      const { entities } = entitiesData;

      newIncident.AllegedDeveloperOfAISystem = await processEntities(
        entities,
        values.AllegedDeveloperOfAISystem,
        createEntityMutation
      );

      newIncident.AllegedDeployerOfAISystem = await processEntities(
        entities,
        values.AllegedDeployerOfAISystem,
        createEntityMutation
      );

      newIncident.AllegedHarmedOrNearlyHarmedParties = await processEntities(
        entities,
        values.AllegedHarmedOrNearlyHarmedParties,
        createEntityMutation
      );

      newIncident.editor_similar_incidents = [];
      newIncident.editor_dissimilar_incidents = [];
      newIncident.flagged_dissimilar_incidents = [];

      await insertIncident({ variables: { data: newIncident } });

      // Set the user as the last modifier
      newIncident.modifiedBy = user && user.providerType != 'anon-user' ? user.id : '';

      newIncident.epoch_date_modified = getUnixTime(new Date());

      newIncident.AllegedDeployerOfAISystem = newIncident.AllegedDeployerOfAISystem.link;
      newIncident.AllegedDeveloperOfAISystem = newIncident.AllegedDeveloperOfAISystem.link;
      newIncident.AllegedHarmedOrNearlyHarmedParties =
        newIncident.AllegedHarmedOrNearlyHarmedParties.link;
      newIncident.editors = newIncident.editors.link;

      await logIncidentHistory({ variables: { input: { ...newIncident, reports: [] } } });

      addToast(insertSuccessToast({ newIncidentId }));
    } catch (error) {
      addToast(updateErrorToast({ newIncidentId, error }));
    }
  };

  useEffect(() => {
    if (incidentToCloneData) {
      if (incidentToCloneData.incident) {
        const {
          title,
          description,
          date,
          AllegedDeployerOfAISystem,
          AllegedDeveloperOfAISystem,
          AllegedHarmedOrNearlyHarmedParties,
          editors,
          editor_notes,
        } = incidentToCloneData.incident;

        setInitialValues({
          title,
          description,
          date,
          AllegedDeployerOfAISystem: AllegedDeployerOfAISystem.map((entity) => entity.entity_id),
          AllegedDeveloperOfAISystem: AllegedDeveloperOfAISystem.map((entity) => entity.entity_id),
          AllegedHarmedOrNearlyHarmedParties: AllegedHarmedOrNearlyHarmedParties.map(
            (entity) => entity.entity_id
          ),
          editor_notes: editor_notes ?? '',
          editors: editors.map((editor) => editor.userId),
        });
      } else {
        setInitialValues({ editors: [], editor_notes: '' });
      }
    }
  }, [incidentToCloneData]);

  return (
    <div className={'w-full'}>
      {!loading && (
        <div className="flex flex-row justify-between flex-wrap">
          <h1 className="mb-5">
            <Trans>New Incident</Trans>
          </h1>
        </div>
      )}

      {loading && <DefaultSkeleton />}

      {!loading && initialValues && (
        <Formik validationSchema={schema} onSubmit={handleSubmit} initialValues={initialValues}>
          {({ isValid, isSubmitting, submitForm }) => (
            <>
              <IncidentForm />
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
                      <Trans>Saving...</Trans>
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

export default NewIncidentPage;
