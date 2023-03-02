import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import IncidentForm, { schema } from '../../components/incidents/IncidentForm';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner } from 'flowbite-react';
import { FIND_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { Formik } from 'formik';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'gatsby';
import { processEntities } from '../../utils/entities';
import DefaultSkeleton from 'elements/Skeletons/Default';

function EditCitePage(props) {
  const { t, i18n } = useTranslation();

  const [incident, setIncident] = useState(null);

  const [incidentId] = useQueryParam('incident_id', withDefault(NumberParam, 1));

  const { data: incidentData, loading: loadingIncident } = useQuery(FIND_INCIDENT, {
    variables: { query: { incident_id: incidentId } },
  });

  const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const loading = loadingIncident || loadingEntities;

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

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
    } catch (error) {
      addToast(updateErrorToast({ incidentId, error }));
    }
  };

  return (
    <Layout {...props} className={'w-full'}>
      {!loading && (
        <div className="flex flex-row justify-between flex-wrap">
          <h1 className="mb-5">
            <Trans>Editing Incident {{ incidentId }}</Trans>
          </h1>
          <Link to={`/cite/${incidentId}`} className="mb-5">
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
                className="mt-3 bootstrap flex disabled:opacity-50"
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
    </Layout>
  );
}

export default EditCitePage;
