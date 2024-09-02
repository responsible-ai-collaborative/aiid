import React, { useEffect, useState } from 'react';
import TextInputGroup from '../../components/forms/TextInputGroup';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner } from 'flowbite-react';
import { FIND_ENTITY, UPDATE_ENTITY } from '../../graphql/entities';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { Form, Formik } from 'formik';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'gatsby';
import DefaultSkeleton from 'elements/Skeletons/Default';
import * as Yup from 'yup';
import { format } from 'date-fns';

const schema = Yup.object().shape({
  name: Yup.string().required(),
});

function EditEntityPage(props) {
  const { t } = useTranslation();

  const [entity, setEntity] = useState(null);

  const [entityId] = useQueryParam('entity_id', withDefault(StringParam, ''));

  const {
    data: entityData,
    loading: loadingEntity,
    refetch,
  } = useQuery(FIND_ENTITY, {
    variables: { filter: { entity_id: { EQ: entityId } } },
  });

  const loading = loadingEntity;

  const [updateEntityMutation] = useMutation(UPDATE_ENTITY);

  const addToast = useToastContext();

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
          filter: {
            entity_id: { EQ: entityId },
          },
          update: {
            set: {
              name: values.name,
              date_modified: new Date().toISOString(),
            },
          },
        },
      });

      refetch();

      addToast({
        message: t('Entity updated successfully.'),
        severity: SEVERITY.success,
      });
    } catch (error) {
      addToast({
        message: t('Error updating Entity.'),
        severity: SEVERITY.danger,
        error,
      });
    }
  };

  return (
    <div className={'w-full'} {...props}>
      {!loading && entity && (
        <div className="flex flex-row justify-between flex-wrap">
          <h1 className="mb-5">
            <Trans ns="entities">Editing Entity</Trans>
          </h1>
          <Link to={`/entities/${entityId}`} className="hover:no-underline mb-5">
            <Button outline={true} color={'light'}>
              <Trans ns="entities">Back to Entity: {{ name: entity.name }}</Trans>
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
            enableReinitialize
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
                      type="text"
                      value={
                        values.created_at
                          ? format(new Date(values.created_at), 'yyyy-MM-dd')
                          : undefined
                      }
                      disabled={true}
                    />

                    <TextInputGroup
                      name="date_modified"
                      label={t('Last modified')}
                      type="text"
                      value={
                        values.date_modified
                          ? format(new Date(values.date_modified), 'yyyy-MM-dd hh:mm a')
                          : undefined
                      }
                      disabled={true}
                    />
                  </div>
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
