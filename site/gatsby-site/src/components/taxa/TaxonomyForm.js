import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import styled from 'styled-components';
import { Formik } from 'formik';
import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';

import { FIND_CLASSIFICATION, UPDATE_CLASSIFICATION } from '../../graphql/classifications';
import Loader from 'components/ui/Loader';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import Tags from 'components/forms/Tags.js';
import { getClassificationValue } from 'utils/classifications';
import { debounce } from 'debounce';

const FormContainer = styled.div`
  padding: 1em;
`;

const TaxonomyForm = forwardRef(function TaxonomyForm(
  { taxonomy, incidentId, onSubmit, active },
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

  const { data: classificationsData } = useQuery(FIND_CLASSIFICATION, {
    variables: { query: { incident_id: incidentId } },
    skip: !active,
  });

  const { data: allClassificationsData } = useQuery(FIND_CLASSIFICATION, {
    variables: { query: { namespace: taxonomy.namespace } },
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
            query: gql`
              query FindEntities {
                entities(limit: 9999) {
                  name
                }
              }
            `,
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

  const [updateClassification] = useMutation(UPDATE_CLASSIFICATION);

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
      const attributes = [];

      const subfields = [];

      const superfieldKeys = [];

      Object.keys(values)
        .filter((key) => !['notes', 'publish'].includes(key))
        .map((key) => {
          const taxonomyField = allTaxonomyFields.find(
            (field) => field.short_name == key.replace(/.*___/g, '')
          );

          const mongo_type = taxonomyField.mongo_type;

          let value = values[key];

          if (mongo_type == 'bool') value = Boolean(value);
          if (mongo_type == 'int') value = Number(value);
          if (mongo_type == 'object') value = {};
          return {
            short_name: key,
            value_json: JSON.stringify(value),
          };
        })
        .forEach((attribute) => {
          // E.g. {short_name: 'Entities___0___Entity', value_json: '"Google"'}
          if (attribute.short_name.split('___').length > 1) {
            subfields.push(attribute);
            superfieldKeys.push(attribute.short_name.split('___')[0]);
          } else {
            attributes.push(attribute);
          }
        });

      const superfields = attributes.filter((attribute) =>
        superfieldKeys.includes(attribute.short_name)
      );

      for (const superfield of superfields) {
        // E.g. { short_name: "Entities", value_json: "{}" }

        // E.g. [{short_name: 'Entities___0___Entity',      value_json: '"Google"'                 },
        //       {short_name: 'Entities___0___Entity Type', value_json: '"for-profit organization"'},
        //       {short_name: 'Entities___1___Entity',      value_json: '"Google Users"'           },
        //       {short_name: 'Entities___1___Entity Type', value_json: '"Group"'                  } ]
        const superfieldSubfields = subfields.filter(
          (subfield) => subfield.short_name.split('___')[0] == superfield.short_name
        );

        // E.g. ["0", "1"]
        const subClassificationIds = Array.from(
          new Set(superfieldSubfields.map((subfield) => subfield.short_name.split('___')[1]))
        );

        const subClassifications = [];

        for (const subClassificationId of subClassificationIds) {
          // E.g. "0"

          if (deletedSubClassificationIds.includes(subClassificationId)) continue;

          // E.g. [{short_name: 'Entity',      value_json: '"Google"'                 },
          //       {short_name: 'Entity Type', value_json: '"for-profit organization"'} ]
          const subClassificationAttributes = superfieldSubfields
            .filter((subfield) => subfield.short_name.split('___')[1] == subClassificationId)
            .map((subfield) => ({ ...subfield, short_name: subfield.short_name.split('___')[2] }));

          const subClassification = { attributes: subClassificationAttributes };

          subClassifications.push(subClassification);
        }

        superfield.value_json = JSON.stringify(
          // E.g.
          // [ { attributes: [
          //       {short_name: 'Entities___0___Entity',      value_json: '"Google"'                 },
          //       {short_name: 'Entities___0___Entity Type', value_json: '"for-profit organization"'}
          //     ]
          //   },
          //   { attributes: [
          //        {short_name: 'Entities___1___Entity',      value_json: '"Google Users"'           },
          //        {short_name: 'Entities___1___Entity Type', value_json: '"Group"'                  }
          //     ]
          //   }
          // ]
          subClassifications
        );
      }

      const data = {
        __typename: undefined,
        incident_id: incidentId,
        notes: values.notes,
        publish: values.publish,
        attributes: attributes.map((a) => a),
        namespace,
      };

      await updateClassification({
        variables: {
          query: {
            incident_id: incidentId,
            namespace,
          },
          data,
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
      <FormContainer>
        <Loader loading={loading} />
      </FormContainer>
    );
  }

  if (error !== '') {
    return (
      <FormContainer>
        <span>{error}</span>
      </FormContainer>
    );
  }

  if (fieldsWithDefaultValues.length === 0) {
    return (
      <FormContainer>
        <span>{'Could not render form edit'}</span>
      </FormContainer>
    );
  }

  const dummyFields = (taxonomy.dummyFields || []).map((field) => ({ ...field, dummy: true }));

  return (
    <FormContainer data-cy="taxonomy-form" className="bootstrap">
      <Formik initialValues={initialValues} onSubmit={submit} innerRef={formRef}>
        {({ values, handleChange, handleSubmit, setFieldTouched, setFieldValue, isSubmitting }) => {
          debouncedSetInitialValues(values);
          return (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  id={'notes'}
                  name={'notes'}
                  type="text"
                  as="textarea"
                  rows={4}
                  onChange={handleChange}
                  value={values.notes}
                />
              </Form.Group>
              <fieldset disabled={isSubmitting}>
                {fieldsWithDefaultValues
                  .concat(dummyFields)
                  .sort(sortByFieldNumbers)
                  .map((rawField) =>
                    rawField.dummy ? (
                      <h5 className="mb-3 text-xl border-b-2 pb-1 border-gray-200">
                        {rawField.field_number}. {rawField.short_name}
                      </h5>
                    ) : (
                      <FormField
                        key={`${rawField.field_number || ''}${rawField.short_name}`}
                        field={rawField}
                        formikValues={values}
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
              <Form.Group className="mb-4">
                <Form.Label>Publish</Form.Label>
                <Form.Check
                  type="radio"
                  name="publish"
                  label="yes"
                  id={`publish-yes`}
                  value="true"
                  onChange={handleChange}
                  checked={[true, 'true'].includes(values.publish)}
                />
                <Form.Check
                  type="radio"
                  name="publish"
                  label="no"
                  id="publish-no"
                  value="false"
                  onChange={handleChange}
                  checked={[false, 'false'].includes(values.publish)}
                />
              </Form.Group>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    </FormContainer>
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
        combinedAttributedValues = combinedAttributedValues.concat(formikValues[key]);
      }
    }

    combinedAttributedValues = autocompleteValues.concat(combinedAttributedValues);

    autocompleteValues = Array.from(new Set(combinedAttributedValues));
  }
  if (entitiesData?.data?.entities && field?.complete_from?.entities) {
    autocompleteValues = autocompleteValues.concat(entitiesData.data.entities.map((e) => e.name));
  }

  return (
    <div key={field.short_name} className="bootstrap">
      <Form.Label>
        {field.field_number ? field.field_number + '. ' : ''}
        {field.short_name}
      </Form.Label>
      {field.display_type === 'enum' &&
        field.permitted_values.length <= 5 &&
        field.permitted_values.map((v) => (
          <Form.Check
            key={v}
            type="radio"
            name={identifier}
            label={v}
            id={`${identifier}-${v}`}
            value={v}
            onChange={handleChange}
            checked={(formikValues[identifier] || []).includes(v)}
          />
        ))}
      {field.display_type === 'enum' && field.permitted_values.length > 5 && (
        <>
          <Form.Select
            as="select"
            id={identifier}
            name={identifier}
            type="select"
            onChange={handleChange}
            value={formikValues[identifier]}
          >
            <option>--</option>
            {field.permitted_values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Form.Select>
        </>
      )}

      {field.display_type === 'string' && (
        <>
          <Form.Control
            id={identifier}
            name={identifier}
            type="text"
            onChange={handleChange}
            value={formikValues[identifier]}
            list={`${identifier}-possible-values`}
          />
          <datalist id={`${identifier}-possible-values`}>
            {autocompleteValues.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </datalist>
        </>
      )}

      {field.display_type === 'long_string' && (
        <Form.Control
          as="textarea"
          rows={3}
          id={identifier}
          name={identifier}
          type="text"
          onChange={handleChange}
          value={formikValues[identifier]}
        />
      )}

      {field.display_type === 'bool' && (
        <>
          <Form.Check
            key="yes"
            type="radio"
            name={identifier}
            label="yes"
            id={`${identifier}-yes`}
            value="true"
            onChange={handleChange}
            checked={[true, 'true'].includes(formikValues[identifier])}
          />
          <Form.Check
            key="no"
            type="radio"
            name={identifier}
            label="no"
            id={`${identifier}-no`}
            value="false"
            onChange={handleChange}
            checked={[false, 'false'].includes(formikValues[identifier])}
          />
        </>
      )}

      {field.display_type == 'int' && (
        <Form.Control
          id={identifier}
          name={identifier}
          type="number"
          step={1}
          onChange={handleChange}
          value={formikValues[identifier]}
        />
      )}

      {field.display_type === 'date' && (
        <Form.Control
          id={identifier}
          name={identifier}
          type="date"
          onChange={handleChange}
          value={formikValues[identifier]}
        />
      )}

      {field.display_type === 'location' && (
        <Form.Control
          id={identifier}
          name={identifier}
          type="text"
          onChange={handleChange}
          value={formikValues[identifier]}
        />
      )}

      {field.display_type === 'list' && (
        <Tags
          id={`${identifier}-tags`}
          inputId={identifier}
          placeHolder="Type and press Enter to add an item"
          value={formikValues[identifier]}
          options={autocompleteValues}
          onChange={(value) => {
            setFieldTouched(identifier, true);
            setFieldValue(identifier, value);
          }}
        />
      )}

      {field.display_type === 'multi' && (
        <>
          {field.permitted_values.map((v) => (
            <Form.Check
              key={v}
              type="checkbox"
              name={identifier}
              label={v}
              id={`${identifier}-${v}`}
              value={v}
              onChange={handleChange}
              checked={(formikValues[identifier] || []).includes(v)}
            />
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
          }}
        />
      )}

      <Form.Text className="text-muted-gray mb-4 d-block whitespace-pre-wrap">
        {field.short_description}
      </Form.Text>
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
          <Card key={id} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <Card.Header
              style={{ borderBottom: openItemId == id ? undefined : '0px', cursor: 'pointer' }}
              onClick={() => setOpenItemID((old) => (old == id ? null : id))}
            >
              {headerValue}
            </Card.Header>
            <Card.Body
              style={
                openItemId == id
                  ? undefined
                  : {
                      height: '0px',
                      padding: '0px',
                      border: '0px',
                      opacity: '0',
                      overflow: 'hidden',
                    }
              }
            >
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
                  }}
                />
              ))}
              <Button
                variant="outline-danger"
                onClick={() => {
                  setObjectListItemsIds((ids) => ids.filter((itemId) => itemId != id));
                  setDeletedSubClassificationIds((ids) => ids.concat(id));
                }}
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        );
      })}
      <div>
        <Button
          variant="secondary"
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
