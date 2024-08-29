import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Form, Formik } from 'formik';
import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { FIND_CLASSIFICATION, UPSERT_CLASSIFICATION } from '../../graphql/classifications';
import Loader from 'components/ui/Loader';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import Tags from 'components/forms/Tags.js';
import { getClassificationValue, serializeClassification } from 'utils/classifications';
import { debounce } from 'debounce';
import { Button, Radio, Label, Checkbox, Select } from 'flowbite-react';
import TextInputGroup from 'components/forms/TextInputGroup';
import Card from 'elements/Card';
import SubmitButton from 'components/ui/SubmitButton';
import { uniq } from 'lodash';
import { FIND_ENTITIES } from '../../graphql/entities';

const TaxonomyForm = forwardRef(function TaxonomyForm(
  { taxonomy, incidentId, reportNumber, onSubmit, active },
  ref
) {
  const namespace = taxonomy.namespace;

  const [loading, setLoading] = useState(true);

  const [error] = useState('');

  const [initialValues, setInitialValues] = useState({});

  const [fieldsWithDefaultValues, setFieldsWithDefaultValues] = useState([]);

  const [deletedSubClassificationIds, setDeletedSubClassificationIds] = useState([]);

  const addToast = useToastContext();

  const formRef = useRef(null);

  const debouncedSetInitialValues = useRef(
    debounce((values) => setInitialValues(values), 500)
  ).current;

  useImperativeHandle(ref, () => ({
    submit() {
      formRef.current.submitForm();
    },
  }));

  const incidentsQuery = incidentId ? { incidents: { EQ: incidentId } } : {};

  const reportsQuery = reportNumber ? { reports: { EQ: reportNumber } } : {};

  const { data: classificationsData } = useQuery(FIND_CLASSIFICATION, {
    variables: { filter: { ...incidentsQuery, ...reportsQuery }, namespace: { EQ: namespace } },
    skip: !active,
  });

  //TODO: why does this fetch all classifications? 🤔
  const { data: allClassificationsData } = useQuery(FIND_CLASSIFICATION, {
    variables: {
      filter: { namespace: { EQ: taxonomy.namespace } },
    },
    skip: !active,
  });

  const [entitiesData, setEntitiesData] = useState();

  // We can't use a hook because we want to load the entities data
  // only if it will be used.
  const client = useApolloClient();

  useEffect(() => {
    (async () => {
      if (taxonomy.complete_entities) {
        setEntitiesData(
          await client.query({
            query: FIND_ENTITIES,
          })
        );
      }
    })();
  }, []);

  const classification =
    classificationsData &&
    taxonomy &&
    classificationsData.classifications.find(
      (classification) => classification.namespace == taxonomy.namespace
    );

  const [upsertClassification] = useMutation(UPSERT_CLASSIFICATION, {
    refetchQueries: [FIND_CLASSIFICATION],
    awaitRefetchQueries: true,
  });

  const allTaxonomyFields =
    taxonomy &&
    taxonomy.taxonomyFields.reduce(
      (fields, field) => fields.concat([field]).concat(field.subfields || []),
      []
    );

  const loadInitialValues = () => {
    if (taxonomy && classificationsData) {
      const notes = classification?.notes || '';

      const publish = classification?.publish || false;

      const fieldsArray = [];

      const defaultValues = {};

      taxonomy.taxonomyFields.forEach((field) => {
        fieldsArray.push(field);

        let classificationValue =
          classification && getClassificationValue(classification, field.short_name);

        if (classificationValue && field.display_type == 'object-list') {
          classificationValue.forEach((subClassification, i) => {
            for (const subAttribute of subClassification.attributes) {
              const formValue = JSON.parse(subAttribute.value_json);

              const formKey = [field.short_name, i, subAttribute.short_name].join('___');

              defaultValues[formKey] = formValue;
            }
          });
        }

        if (classificationValue === null) {
          if (field.display_type === 'multi') {
            classificationValue = [];
          } else {
            classificationValue = '';
          }
        }
        if (classificationValue) {
          if (field.display_type === 'date') {
            classificationValue = classificationValue.split('T')[0];
          }
        }

        defaultValues[field.short_name] = classificationValue;
      });

      setFieldsWithDefaultValues(fieldsArray);

      setInitialValues({
        ...defaultValues,
        notes,
        publish,
      });
      setLoading(false);
    }
  };

  useEffect(loadInitialValues, [classificationsData, taxonomy]);

  const submit = async (values, { setSubmitting }) => {
    try {
      const attributes = serializeClassification(
        values,
        allTaxonomyFields,
        deletedSubClassificationIds
      );

      const data = {
        notes: values.notes,
        publish: values.publish,
        attributes: attributes.map((a) => a),
        namespace,
      };

      if (classification) {
        data.reports = {
          link: reportNumber
            ? uniq([
                ...classification.reports.map(({ report_number }) => report_number),
                reportNumber,
              ])
            : classification.reports.map(({ report_number }) => report_number),
        };
        data.incidents = {
          link: incidentId
            ? uniq([...classification.incidents.map(({ incident_id }) => incident_id), incidentId])
            : classification.incidents.map(({ incident_id }) => incident_id),
        };
      } else {
        data.reports = {
          link: reportNumber ? [reportNumber] : [],
        };
        data.incidents = {
          link: incidentId ? [incidentId] : [],
        };
      }

      await upsertClassification({
        variables: {
          filter: {
            ...incidentsQuery,
            ...reportsQuery,
            namespace: { EQ: namespace },
          },
          update: data,
        },
      });
    } catch (e) {
      addToast({
        message: <>Error updating classification data: {e.message}</>,
        severity: SEVERITY.danger,
        error: e,
      });
    }

    setSubmitting(false);

    if (onSubmit) {
      onSubmit();
    }
  };

  if (!active) {
    return <></>;
  }
  if (loading) {
    return (
      <div className="p-4">
        <Loader loading={loading} />
      </div>
    );
  }

  if (error !== '') {
    return (
      <div className="p-4">
        <span>{error}</span>
      </div>
    );
  }

  if (fieldsWithDefaultValues.length === 0) {
    return (
      <div className="p-4">
        <span>{'Could not render form edit'}</span>
      </div>
    );
  }

  const dummyFields = (taxonomy.dummyFields || []).map((field) => ({ ...field, dummy: true }));

  return (
    <div className="p-4" data-cy="taxonomy-form">
      <Formik initialValues={initialValues} onSubmit={submit} innerRef={formRef}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldTouched,
          setFieldValue,
          isSubmitting,
        }) => {
          debouncedSetInitialValues(values);
          return (
            <Form onSubmit={handleSubmit}>
              <div className="mb-4" data-cy="Notes">
                <TextInputGroup
                  label="Notes"
                  placeholder={'Notes'}
                  id={'notes'}
                  name={'notes'}
                  type="textarea"
                  rows={4}
                  handleChange={handleChange}
                  value={values.notes}
                  errors={errors}
                  touched={touched}
                  values={values}
                />
              </div>
              <fieldset disabled={isSubmitting}>
                {fieldsWithDefaultValues
                  .concat(dummyFields)
                  .sort(sortByFieldNumbers)
                  .map((rawField) =>
                    rawField.dummy ? (
                      <h5
                        key={`${rawField.field_number || ''}${rawField.short_name}`}
                        className="mb-3 text-xl border-b-2 pb-1 border-gray-200"
                      >
                        {rawField.field_number}. {rawField.short_name}
                      </h5>
                    ) : (
                      <FormField
                        key={`${rawField.field_number || ''}${rawField.short_name}`}
                        field={rawField}
                        formikValues={values}
                        formikErrors={errors}
                        formikTouched={touched}
                        {...{
                          handleChange,
                          setFieldTouched,
                          setFieldValue,
                          setDeletedSubClassificationIds,
                          allClassificationsData,
                          entitiesData,
                        }}
                      />
                    )
                  )}
              </fieldset>
              <div className="mb-4" data-cy="Publish">
                <Label>Publish</Label>
                <div>
                  <Radio
                    name="publish"
                    id={`publish-yes`}
                    value="true"
                    onChange={handleChange}
                    checked={[true, 'true'].includes(values.publish)}
                    className="mr-2"
                  />
                  <Label htmlFor="publish-yes">yes</Label>
                </div>
                <div>
                  <Radio
                    name="publish"
                    id="publish-no"
                    value="false"
                    onChange={handleChange}
                    checked={[false, 'false'].includes(values.publish)}
                    className="mr-2"
                  />
                  <Label htmlFor="publish-no">no</Label>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white p-2 border-t-1 -mx-2 z-50">
                <SubmitButton loading={isSubmitting} onClick={handleSubmit} disabled={isSubmitting}>
                  Submit
                </SubmitButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
});

function FormField({
  field,
  handleChange,
  formikValues,
  setFieldTouched,
  setFieldValue,
  superfield,
  superfieldIndex,
  setDeletedSubClassificationIds,
  allClassificationsData,
  entitiesData,
  formikErrors,
  formikTouched,
}) {
  const identifier = superfield
    ? `${superfield.short_name}___${superfieldIndex}___${field.short_name}`
    : field.short_name;

  let autocompleteValues = Array.isArray(field.permitted_values) ? field.permitted_values : [];

  if (allClassificationsData && ['list', 'string'].includes(field.display_type)) {
    const classifications = allClassificationsData.classifications;

    const matchingAttributes = classifications.map((classification) =>
      (classification.attributes || []).find((a) =>
        (field?.complete_from?.all || [field.short_name]).includes(a.short_name)
      )
    );

    const matchingAttributesWithValues = matchingAttributes.filter(
      (attribute) => attribute?.value_json
    );

    const attributeValues = matchingAttributesWithValues.map((attribute) =>
      JSON.parse(attribute.value_json)
    );

    let combinedAttributedValues =
      field.display_type === 'string'
        ? attributeValues
        : attributeValues.reduce((combined, array) => combined.concat(array), []);

    if (field?.complete_from?.current) {
      for (const key of field.complete_from.current) {
        if (formikValues[key]) {
          combinedAttributedValues = combinedAttributedValues.concat(formikValues[key]);
        }
      }
    }

    combinedAttributedValues = autocompleteValues.concat(combinedAttributedValues);

    autocompleteValues = Array.from(new Set(combinedAttributedValues));
  }
  if (entitiesData?.data?.entities && field?.complete_from?.entities) {
    autocompleteValues = autocompleteValues.concat(entitiesData.data.entities.map((e) => e.name));
  }

  const radio = {
    type: 'radio',
    onClick: (event) => {
      if (event.target.checked) {
        setFieldValue(identifier, null);
      }
    },
  };

  return (
    <div data-cy={field.short_name} key={field.short_name}>
      <Label>
        {field.field_number ? field.field_number + '. ' : ''}
        {field.short_name}
      </Label>
      {field.display_type === 'enum' &&
        field.permitted_values.length <= 5 &&
        field.permitted_values.map((v) => {
          const checked = formikValues[identifier] == v;

          const id = `${field.field_number || ''}${identifier}-${v}`;

          return (
            <div key={v}>
              <Radio
                {...radio}
                id={id}
                name={`${field.field_number}${identifier}`}
                value={v}
                onChange={() => {
                  setFieldValue(identifier, v);
                }}
                defaultChecked={checked}
                checked={checked}
                className="mr-2"
              />
              <Label htmlFor={id}>{v}</Label>
            </div>
          );
        })}
      {field.display_type === 'enum' && field.permitted_values.length > 5 && (
        <>
          <Select
            id={identifier}
            name={identifier}
            onChange={handleChange}
            value={formikValues[identifier]}
          >
            <option>--</option>
            {field.permitted_values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </>
      )}

      {field.display_type === 'string' && (
        <>
          <TextInputGroup
            id={identifier}
            name={identifier}
            type="text"
            handleChange={handleChange}
            value={formikValues[identifier]}
            list={`${identifier}-possible-values`}
            values={formikValues}
            label=""
            placeholder={''}
            errors={formikErrors}
            touched={formikTouched}
            handleBlur={() => {}}
          />
          <datalist id={`${identifier}-possible-values`}>
            {autocompleteValues.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </datalist>
        </>
      )}

      {field.display_type === 'long_string' && (
        <TextInputGroup
          type="textarea"
          rows={3}
          id={identifier}
          name={identifier}
          handleChange={handleChange}
          value={formikValues[identifier]}
          values={formikValues}
          label=""
          placeholder={''}
          errors={formikErrors}
          touched={formikTouched}
          handleBlur={() => {}}
        />
      )}

      {field.display_type === 'bool' && (
        <>
          <div>
            <Radio
              {...radio}
              key="yes"
              name={identifier}
              id={`${identifier}-yes`}
              value="true"
              onChange={handleChange}
              checked={[true, 'true'].includes(formikValues[identifier])}
              className="mr-2"
            />
            <Label htmlFor={`${identifier}-yes`}>yes</Label>
          </div>
          <div>
            <Radio
              {...radio}
              key="no"
              name={identifier}
              id={`${identifier}-no`}
              value="false"
              onChange={handleChange}
              checked={[false, 'false'].includes(formikValues[identifier])}
              className="mr-2"
            />
            <Label htmlFor={`${identifier}-no`}>no</Label>
          </div>
        </>
      )}

      {field.display_type == 'int' && (
        <TextInputGroup
          id={identifier}
          name={identifier}
          type="number"
          step={1}
          handleChange={handleChange}
          value={formikValues[identifier]}
          values={formikValues}
          label=""
          placeholder={''}
          errors={formikErrors}
          touched={formikTouched}
          handleBlur={() => {}}
          onWheel={(evt) => evt.target.blur()}
        />
      )}

      {field.display_type === 'date' && (
        <TextInputGroup
          id={identifier}
          name={identifier}
          type="date"
          handleChange={handleChange}
          value={formikValues[identifier]}
          values={formikValues}
          label=""
          placeholder={''}
          errors={formikErrors}
          touched={formikTouched}
          handleBlur={() => {}}
        />
      )}

      {field.display_type === 'location' && (
        <TextInputGroup
          id={identifier}
          name={identifier}
          type="text"
          handleChange={handleChange}
          value={formikValues[identifier]}
          values={formikValues}
          label=""
          placeholder={''}
          errors={formikErrors}
          touched={formikTouched}
          handleBlur={() => {}}
        />
      )}

      {field.display_type === 'list' && (
        <Tags
          id={`${identifier}-tags`}
          inputId={identifier}
          placeHolder="Type and press Enter to add an item"
          value={formikValues[identifier]}
          options={autocompleteValues}
          stayOpen={true}
          onChange={(value) => {
            setFieldTouched(identifier, true);
            setFieldValue(
              identifier,
              value.map((item) => (item.label ? item.label : item))
            );
          }}
        />
      )}

      {field.display_type === 'multi' && (
        <>
          {field.permitted_values.map((v) => (
            <div key={v}>
              <Checkbox
                name={identifier}
                id={`${identifier}-${v}`}
                value={v}
                onChange={handleChange}
                checked={(formikValues[identifier] || []).includes(v)}
                className="mr-2"
              />
              <Label htmlFor={`${identifier}-${v}`}>{v}</Label>
            </div>
          ))}
        </>
      )}

      {field.display_type === 'object-list' && (
        <ObjectListField
          {...{
            field,
            handleChange,
            formikValues,
            setFieldTouched,
            setFieldValue,
            setDeletedSubClassificationIds,
            allClassificationsData,
            entitiesData,
            formikErrors,
            formikTouched,
          }}
        />
      )}

      <p className="text-muted-gray mb-4 d-block whitespace-pre-wrap text-sm">
        {field.short_description}
      </p>
    </div>
  );
}

function ObjectListField({
  field,
  handleChange,
  formikValues,
  setFieldTouched,
  setFieldValue,
  setDeletedSubClassificationIds,
  allClassificationsData,
  entitiesData,
  formikErrors,
  formikTouched,
}) {
  // These are client-side only
  const [objectListItemIds, setObjectListItemsIds] = useState(
    Array.from(
      new Set(
        Object.keys(formikValues).reduce((ids, key) => {
          const parts = key.split('___');

          if (parts.length > 1 && parts[0] == field.short_name) {
            ids.push(parts[1]);
          }
          return ids;
        }, [])
      )
    )
  );

  const [openItemId, setOpenItemID] = useState();

  return (
    <>
      {objectListItemIds.map((id) => {
        const headerKey = field.short_name + '___' + id + '___' + field.subfields[0].short_name;

        let headerValue = (openItemId == id ? '(-) ' : '(+) ') + (formikValues[headerKey] || 'New');

        if (headerValue.length > 60) {
          headerValue = headerValue.slice(0, 60) + '…';
        }
        return (
          <Card key={id} className="mb-2">
            <Card.Header
              className={`${openItemId === id ? '' : 'border-b-0'} cursor-pointer sticky top-0`}
            >
              <button
                type="button"
                className="border-none bg-none w-full text-left"
                onClick={() => setOpenItemID((old) => (old == id ? null : id))}
              >
                {headerValue}
              </button>
            </Card.Header>
            {openItemId === id && (
              <Card.Body>
                {field.subfields.map((subfield) => (
                  <FormField
                    key={subfield.short_name + '-form-field'}
                    field={subfield}
                    superfield={field}
                    superfieldIndex={id}
                    {...{
                      handleChange,
                      formikValues,
                      setFieldTouched,
                      setFieldValue,
                      setDeletedSubClassificationIds,
                      allClassificationsData,
                      entitiesData,
                      formikErrors,
                      formikTouched,
                    }}
                  />
                ))}
                <div>
                  <Button
                    color="failure"
                    onClick={() => {
                      setObjectListItemsIds((ids) => ids.filter((itemId) => itemId != id));
                      setDeletedSubClassificationIds((ids) => ids.concat(id));
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            )}
          </Card>
        );
      })}
      <div>
        <Button
          color="dark"
          onClick={() => {
            const newItemId = new Date().getTime();

            setObjectListItemsIds((ids) => ids.concat(newItemId));
            setOpenItemID(newItemId);
          }}
        >
          Add
        </Button>
      </div>
    </>
  );
}

function sortByFieldNumbers(a, b) {
  var exists = (e) => e !== undefined && e !== null;

  if (exists(a.field_number) && !exists(b.field_number)) return 1;
  if (exists(b.field_number) && !exists(a.field_number)) return -1;
  if (exists(a.field_number) && exists(b.field_number)) {
    if (a.field_number == b.field_number) {
      if (a.dummy && !b.dummy) return -1;
      if (b.dummy && !a.dummy) return 1;
    }

    const [fieldNumsA, fieldNumsB] = [a, b].map((e) =>
      e.field_number.split('.').map((s) => Number(s))
    );

    for (let i = 0; i < Math.max(fieldNumsA.length, fieldNumsB.length); i++) {
      if (exists(fieldNumsA[i]) && !exists(fieldNumsB[i])) return 1;
      if (exists(fieldNumsB[i]) && !exists(fieldNumsA[i])) return -1;
      if (!exists(fieldNumsA[i]) && !exists(fieldNumsB[i])) return 0;
      if (fieldNumsA[i] > fieldNumsB[i]) return 1;
      if (fieldNumsA[i] < fieldNumsB[i]) return -1;
    }
  }
  return 0;
}

export default TaxonomyForm;
