import React from 'react';
import Layout from '../../components/Layout';
import IncidentForm, { schema } from '../../components/incidents/IncidentForm';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner } from 'flowbite-react';
import { GET_LATEST_INCIDENT_ID, INSERT_INCIDENT } from '../../graphql/incidents';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { Formik } from 'formik';
import { LocalizedLink, useLocalization } from 'plugins/gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { processEntities } from '../../utils/entities';
import DefaultSkeleton from 'elements/Skeletons/Default';

function NewIncidentPage(props) {
  const { t, i18n } = useTranslation();

  const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const { data: lastIncident, loading: loadingLastIncident } = useQuery(GET_LATEST_INCIDENT_ID);

  const loading = loadingLastIncident || loadingEntities;

  const [insertIncident] = useMutation(INSERT_INCIDENT);

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

      await insertIncident({ variables: { incident: newIncident } });

      addToast(insertSuccessToast({ newIncidentId }));
    } catch (error) {
      addToast(updateErrorToast({ newIncidentId, error }));
    }
  };

  return (
    <Layout {...props} className={'w-full'}>
      {!loading && (
        <div className="flex flex-row justify-between flex-wrap">
          <h1 className="mb-5">
            <Trans>New Incident</Trans>
          </h1>
        </div>
      )}

      {loading && <DefaultSkeleton />}

      {!loading && (
        <Formik validationSchema={schema} onSubmit={handleSubmit} initialValues={{ editors: [] }}>
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
    </Layout>
  );
}

export default NewIncidentPage;
