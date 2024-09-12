import React, { useEffect, useState } from 'react';
import TextInputGroup from '../../components/forms/TextInputGroup';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner } from 'flowbite-react';
import { FIND_ENTITIES, FIND_ENTITY, UPDATE_ENTITY } from '../../graphql/entities';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { Form, Formik } from 'formik';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'gatsby';
import DefaultSkeleton from 'elements/Skeletons/Default';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { Typeahead } from 'react-bootstrap-typeahead';
import Label from '../../components/forms/Label';
import { FIND_ENTITY_RELATIONSHIPS } from '../../graphql/entity_relationships';

const schema = Yup.object().shape({
  name: Yup.string().required(),
});

function EditEntityPage(props) {
  const { t } = useTranslation();

  const [entity, setEntity] = useState(null);

  const [entities, setEntities] = useState([]);

  const [entityId] = useQueryParam('entity_id', withDefault(StringParam, ''));

  const [entityRelationships, setEntityRelationships] = useState([]);

  const [updatedEntityRelationships, setUpdatedEntityRelationships] = useState([]);

  const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const {
    data: entityData,
    loading: loadingEntity,
    refetch,
  } = useQuery(FIND_ENTITY, {
    variables: { filter: { entity_id: { EQ: entityId } } },
  });

  const loading = loadingEntity;

  const [updateEntityMutation] = useMutation(UPDATE_ENTITY);

  const {
    data: entityRelationshipsData,
    refetch: refetchEntityRelationships,
    loading: loadingEntityRelationships,
  } = useQuery(FIND_ENTITY_RELATIONSHIPS, {
    variables: {
      filter: {
        OR: [{ sub: { EQ: entityId } }, { obj: { EQ: entityId }, is_symmetric: { EQ: true } }],
      },
    },
  });

  useEffect(() => {
    if (!loadingEntities && entitiesData?.entities) {
      let entitiesOptions = entitiesData.entities.map((entity) => {
        return {
          id: entity.entity_id,
          label: entity.name,
        };
      });

      let options = [];

      if (!loadingEntityRelationships && entityRelationshipsData?.entity_relationships) {
        options = entityRelationshipsData.entity_relationships.map((entityRelationship) => {
          if (entityRelationship.sub.entity_id === entityId) {
            return {
              id: entityRelationship.obj.entity_id,
              label: entitiesData.entities.find(
                (entity) => entity.entity_id === entityRelationship.obj.entity_id
              ).name,
            };
          } else {
            return {
              id: entityRelationship.sub.entity_id,
              label: entitiesData.entities.find(
                (entity) => entity.entity_id === entityRelationship.sub.entity_id
              ).name,
            };
          }
        });
      }
      setEntityRelationships(options);
      setUpdatedEntityRelationships(options);

      entitiesOptions = entitiesOptions.filter((entity) => entity.id !== entityId);
      setEntities(entitiesOptions);
    }
  }, [loadingEntities, entitiesData, entityRelationshipsData, loadingEntityRelationships]);

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
      // Process the updated relationships and perform necessary updates in the database
      const relationshipsToAdd = updatedEntityRelationships.filter(
        (rel) => !entityRelationships.some((er) => er.id === rel.id)
      );

      const relationshipsToRemove = entityRelationships.filter(
        (er) => !updatedEntityRelationships.some((rel) => rel.id === er.id)
      );

      await updateEntityMutation({
        variables: {
          input: {
            entity_id: entityId,
            created_at: values.created_at,
            name: values.name,
            date_modified: new Date().toISOString(),
            entity_relationships_to_add: relationshipsToAdd,
            entity_relationships_to_remove: relationshipsToRemove,
          },
        },
      });

      refetch();
      refetchEntityRelationships();

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

                    <Label
                      label={t('Entity Relationships', { ns: 'entities' })}
                      popover="entityRelationships"
                    />
                    <Typeahead
                      id="ta-entity-relationships"
                      inputProps={{ 'data-cy': 'entity-relationships' }}
                      className={`Typeahead`}
                      onKeyDown={(e) => {
                        if (e.key === ',') {
                          e.preventDefault();
                        }
                      }}
                      multiple
                      onChange={(selected) => setUpdatedEntityRelationships(selected)}
                      options={entities}
                      selected={updatedEntityRelationships}
                      placeholder={
                        loadingEntityRelationships
                          ? t('Loading related entities...', { ns: 'entities' })
                          : t('Add or remove relationships to other entities', { ns: 'entities' })
                      }
                      loading={loadingEntityRelationships}
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
