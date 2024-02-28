import React, { useEffect, useState } from 'react';
import TextInputGroup from '../../components/forms/TextInputGroup';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
//import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner } from 'flowbite-react';
import { FIND_ENTITY } from '../../graphql/entities';
import { /*useMutation,*/ useQuery } from '@apollo/client/react/hooks';
import { Form, Formik } from 'formik';
//import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'gatsby';
//import { processEntities } from '../../utils/entities';
import DefaultSkeleton from 'elements/Skeletons/Default';
//import { getUnixTime } from 'date-fns';
//import { useUserContext } from 'contexts/userContext';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string().required(),
});

function EditEntityPage(props) {
  // const { user } = useUserContext();

  const { t /*i18n*/ } = useTranslation();

  const [entity, setEntity] = useState(null);

  const [entityId] = useQueryParam('entity_id', withDefault(StringParam, ''));

  const {
    data: entityData,
    loading: loadingEntity,
    error,
  } = useQuery(FIND_ENTITY, {
    variables: { query: { entity_id: entityId } },
  });

  // const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const loading = loadingEntity;

  // const [updateIncident] = useMutation(UPDATE_INCIDENT);

  // const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  // const addToast = useToastContext();

  // const { logIncidentHistory } = useLogIncidentHistory();

  // const updateSuccessToast = ({ incidentId }) => ({
  //   message: (
  //     <Trans i18n={i18n} incidentId={incidentId}>
  //       Incident {{ incidentId }} updated successfully.{' '}
  //       <LocalizedLink to={'/cite/' + incidentId}>View incident {{ incidentId }}</LocalizedLink>.
  //     </Trans>
  //   ),
  //   severity: SEVERITY.success,
  // });

  // const updateErrorToast = ({ incidentId, error }) => ({
  //   message: t('Error updating incident {{incidentId}}.', { incidentId }),
  //   severity: SEVERITY.danger,
  //   error,
  // });

  useEffect(() => {
    console.log('entityData', entityData, error);

    if (entityData?.entity) {
      setEntity({
        ...entityData.entity,
      });
    }
  }, [entityData]);

  const handleSubmit = async (/*values*/) => {
    alert('submitting...');

    // try {
    //   const updated = {
    //     ...values,
    //     editors: { link: values.editors },
    //     reports: undefined,
    //     embedding: {
    //       ...values.embedding,
    //       __typename: undefined,
    //     },
    //     tsne: {
    //       ...values.tsne,
    //       __typename: undefined,
    //     },
    //     __typename: undefined,
    //   };

    //   const { entities } = entitiesData;

    //   updated.AllegedDeveloperOfAISystem = await processEntities(
    //     entities,
    //     values.AllegedDeveloperOfAISystem,
    //     createEntityMutation
    //   );

    //   updated.AllegedDeployerOfAISystem = await processEntities(
    //     entities,
    //     values.AllegedDeployerOfAISystem,
    //     createEntityMutation
    //   );

    //   updated.AllegedHarmedOrNearlyHarmedParties = await processEntities(
    //     entities,
    //     values.AllegedHarmedOrNearlyHarmedParties,
    //     createEntityMutation
    //   );

    //   updated.epoch_date_modified = getUnixTime(new Date());

    //   // Add the current user to the list of editors
    //   if (user && user.providerType != 'anon-user' && !updated.editors.link.includes(user.id)) {
    //     updated.editors.link.push(user.id);
    //   }

    //   await updateIncident({
    //     variables: {
    //       query: {
    //         incident_id: incidentId,
    //       },
    //       set: {
    //         ...updated,
    //       },
    //     },
    //   });

    //   await logIncidentHistory(
    //     {
    //       ...incident,
    //       ...updated,
    //       reports: incident.reports,
    //       embedding: incident.embedding,
    //     },
    //     user
    //   );

    //   addToast(updateSuccessToast({ incidentId }));
    // } catch (error) {
    //   addToast(updateErrorToast({ incidentId, error }));
    // }
  };

  return (
    <div className={'w-full'} {...props}>
      {!loading && entity && (
        <div className="flex flex-row justify-between flex-wrap">
          <h1 className="mb-5">
            <Trans>Editing Entity {{ name: entity.name }}</Trans>
          </h1>
          <Link to={`/entities/${entityId}`} className="hover:no-underline mb-5">
            <Button outline={true} color={'light'}>
              <Trans>Back to Entity {{ name: entity.name }}</Trans>
            </Button>
          </Link>
        </div>
      )}

      {loading && <DefaultSkeleton />}
      {entity === null && !loading && <div>Entity not found</div>}

      {entity && (
        <>
          <Formik
            validationSchema={schema}
            onSubmit={handleSubmit}
            initialValues={{
              ...entity,
            }}
          >
            {({
              values,
              isValid,
              isSubmitting,
              submitForm,
              errors,
              touched,
              handleChange,
              handleBlur,
            }) => (
              <>
                <Form>
                  <div className="mb-3" id="formBasicEmail">
                    <TextInputGroup
                      label={t('Name')}
                      type="text"
                      placeholder={t('Name')}
                      name="name"
                      value={values.name}
                      handleChange={handleChange}
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleBlur={handleBlur}
                    />
                  </div>

                  {/* <Button
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
                  </Button> */}
                </Form>
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
        </>
      )}
    </div>
  );
}

export default EditEntityPage;
