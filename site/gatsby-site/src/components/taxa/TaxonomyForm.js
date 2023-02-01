import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { useMongo } from 'hooks/useMongo';
import { Formik } from 'formik';

import Loader from 'components/ui/Loader';
import config from '../../../config.js';

import { useMutation, useQuery } from '@apollo/client';
import { FIND_CLASSIFICATION, UPDATE_CLASSIFICATION } from '../../graphql/classifications.js';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import Tags from 'components/forms/Tags.js';
import { getClassificationValue } from 'utils/classifications';
import { debounce } from 'debounce';

const FormContainer = styled.div`
  padding: 1em;
`;

const TaxonomyForm = forwardRef(function TaxonomyForm(
  { namespace, incidentId, onSubmit, active },
  ref
) {
  const [loading, setLoading] = useState(true);

  const [error] = useState('');

  const [initialValues, setInitialValues] = useState({});

  const [fieldsWithDefaultValues, setFieldsWithDefaultValues] = useState([]);

  const [taxonomy, setTaxonomy] = useState(null);

  const { runQuery } = useMongo();

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

  // this should be updated to use the useQuery hook but some
  // fields need to be normalized to play nice with graphql
  useEffect(() => {
    runQuery(
      {
        namespace,
      },
      (res) => {
        setTaxonomy(res[0]);
      },
      config.realm.production_db.db_service,
      config.realm.production_db.db_name,
      'taxa'
    );
  }, []);

  const { data: classificationsData } = useQuery(FIND_CLASSIFICATION, {
    variables: { query: { incident_id: incidentId } },
    skip: !active,
  });

  const classification =
    classificationsData &&
    taxonomy &&
    classificationsData.classifications.find(
      (classification) => classification.namespace == taxonomy.namespace
    );

  const [updateClassification] = useMutation(UPDATE_CLASSIFICATION);

  const allTaxonomyFields =
    taxonomy &&
    taxonomy.field_list.reduce(
      (fields, field) => fields.concat([field]).concat(field.subfields || []),
      []
    );

  const loadInitialValues = () => {
    if (taxonomy && classificationsData) {
      const notes = classification?.notes || '';

      const fieldsArray = [];

      const defaultValues = {};

      taxonomy.field_list.forEach((field) => {
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
        .filter((key) => key != 'notes')
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
        namespace,
        notes: values.notes,
        attributes,
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
                {fieldsWithDefaultValues.map((rawField) => (
                  <FormField
                    key={rawField}
                    field={rawField}
                    formikValues={values}
                    {...{ handleChange, setFieldTouched, setFieldValue }}
                  />
                ))}
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </fieldset>
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
}) {
  const identifier = superfield
    ? `${superfield.short_name}___${superfieldIndex}___${field.short_name}`
    : field.short_name;

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
        <Form.Control
          id={identifier}
          name={identifier}
          type="text"
          onChange={handleChange}
          value={formikValues[identifier]}
        />
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
          }}
        />
      )}

      <Form.Text className="text-muted-gray mb-4 d-block">{field.short_description}</Form.Text>
    </div>
  );
}

function ObjectListField({ field, handleChange, formikValues, setFieldTouched, setFieldValue }) {
  // These are client-side only
  const [objectListItemIds, setObjectListItemsIds] = useState(
    getSubclassificationIds(Object.keys(formikValues))
  );

  return (
    <>
      {objectListItemIds.map((id) => (
        <div key={id}>
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
              }}
            />
          ))}
        </div>
      ))}
      <Button onClick={() => setObjectListItemsIds((ids) => ids.concat(new Date().getTime()))}>
        Add
      </Button>
    </>
  );
}

var getSubclassificationIds = (formikKeys) =>
  Array.from(new Set(formikKeys.map((key) => key.split('___')[1]))).filter(
    (id) => id !== undefined
  );

export default TaxonomyForm;
