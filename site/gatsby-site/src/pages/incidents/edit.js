import React, { useEffect, useState } from 'react';
import IncidentForm, { schema } from '../../components/incidents/IncidentForm';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner } from 'flowbite-react';
import { FIND_FULL_INCIDENT, LOG_INCIDENT_HISTORY, UPDATE_INCIDENT } from '../../graphql/incidents';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { Formik } from 'formik';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'gatsby';
import { processEntities } from '../../utils/entities';
import { transformIncidentData } from '../../utils/cite';
import DefaultSkeleton from 'elements/Skeletons/Default';
import { getUnixTime } from 'date-fns';
import { useUserContext } from 'contexts/userContext';

function EditCitePage(props) {
  const { user } = useUserContext();

  const { t, i18n } = useTranslation();

  const [incident, setIncident] = useState(null);

  const [incidentId] = useQueryParam('incident_id', withDefault(NumberParam, 1));

  const { data: incidentData, loading: loadingIncident } = useQuery(FIND_FULL_INCIDENT, {
    variables: { query: { incident_id: incidentId } },
  });

  const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const loading = loadingIncident || loadingEntities;

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const [logIncidentHistory] = useMutation(LOG_INCIDENT_HISTORY);

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
        tsne: {
          ...values.tsne,
          __typename: undefined,
        },
        __typename: undefined,
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

      const updatedIncident = transformIncidentData(
        {
          ...incident,
          ...updated,
          reports: incident.reports,
          embedding: incident.embedding,
        },
        user
      );

      await logIncidentHistory({ variables: { input: updatedIncident } });

      addToast(updateSuccessToast({ incidentId }));
    } catch (error) {
      addToast(updateErrorToast({ incidentId, error }));
    }
  };

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
      {incident === null && !loading && <div>Report not found</div>}

      {incident && (
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
