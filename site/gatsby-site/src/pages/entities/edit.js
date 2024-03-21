import React, { useEffect, useState } from 'react';
import TextInputGroup from '../../components/forms/TextInputGroup';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner } from 'flowbite-react';
import { FIND_ENTITY, UPDATE_ENTITY } from '../../graphql/entities';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { Form, Formik } from 'formik';
//import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'gatsby';
//import { processEntities } from '../../utils/entities';
import DefaultSkeleton from 'elements/Skeletons/Default';
//import { getUnixTime } from 'date-fns';
//import { useUserContext } from 'contexts/userContext';
import * as Yup from 'yup';
import { format } from 'date-fns';

const schema = Yup.object().shape({
  name: Yup.string().required(),
});

function EditEntityPage(props) {
  // const { user } = useUserContext();

  const { t /*i18n*/ } = useTranslation();

  const [entity, setEntity] = useState(null);

  const [entityId] = useQueryParam('entity_id', withDefault(StringParam, ''));

  console.log('entityId', entityId);

  const {
    data: entityData,
    loading: loadingEntity,
    refetch,
  } = useQuery(FIND_ENTITY, {
    variables: { query: { entity_id: entityId } },
  });

  // const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const loading = loadingEntity;

  const [updateEntityMutation] = useMutation(UPDATE_ENTITY);

  const addToast = useToastContext();

  const updateSuccessToast = () => ({
    message: t('Entity updated successfully.'),
    severity: SEVERITY.success,
  });

  const updateErrorToast = ({ entityId, error }) => ({
    message: t('Error updating entity {{entityId}}.', { entityId }),
    severity: SEVERITY.danger,
    error,
  });

  useEffect(() => {
    if (entityData?.entity) {
      setEntity({
        ...entityData.entity,
      });
    }
  }, [entityData]);

  const handleSubmit = async (values) => {
    try {
      await updateEntityMutation({
        variables: {
          query: {
            entity_id: entityId,
          },
          set: {
            name: values.name,
            date_modified: new Date(),
          },
        },
      });

      refetch();

      addToast(updateSuccessToast());
    } catch (error) {
      addToast(updateErrorToast({ entityId, error }));
    }

    return;

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
                  <div className="mb-3 flex flex-col gap-2">
                    <TextInputGroup
                      label={`*${t('Name')}`}
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

                    <TextInputGroup
                      name="created_at"
                      label={t('Creation Date')}
                      type="date"
                      value={
                        values.created_at ? format(new Date(values.created_at), 'yyyy-MM-dd') : null
                      }
                      disabled={true}
                    />

                    <TextInputGroup
                      name="date_modified"
                      label={t('Last modified')}
                      type="date"
                      value={
                        values.date_modified
                          ? format(new Date(values.date_modified), 'yyyy-MM-dd')
                          : null
                      }
                      disabled={true}
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
