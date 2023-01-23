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

const FormContainer = styled.div`
  padding: 1em;
`;

const TaxonomyForm = forwardRef(function TaxonomyForm({ namespace, incidentId, onSubmit }, ref) {
  const [loading, setLoading] = useState(true);

  const [error] = useState('');

  const [initialValues, setInitialValues] = useState({});

  const [fieldsWithDefaultValues, setFieldsWithDefaultValues] = useState([]);

  const [taxonomy, setTaxonomy] = useState(null);

  const { runQuery } = useMongo();

  const addToast = useToastContext();

  const formRef = useRef(null);

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
  });

  const classification =
    classificationsData &&
    taxonomy &&
    classificationsData.classifications.find(
      (classification) => classification.namespace == taxonomy.namespace
    );

  const [updateClassification] = useMutation(UPDATE_CLASSIFICATION);

  useEffect(() => {
    if (taxonomy && classificationsData) {
      const notes = classification?.notes || '';

      const fieldsArray = [];

      const defaultValues = {};

      taxonomy.field_list.forEach((field) => {
        fieldsArray.push(field);

        let classificationValue =
          classification && getClassificationValue(classification, field.short_name);

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
  }, [classificationsData, taxonomy]);

  const submit = async (values, { setSubmitting }) => {
    try {
      const data = {
        __typename: undefined,
        incident_id: incidentId,
        namespace,
        notes: values.notes,
        attributes: Object.keys(values)
          .filter((key) => key != 'notes')
          .map((key) => ({
            short_name: key,
            value_json: JSON.stringify(values[key]),
            mongo_type: Array.isArray(values[key])
              ? 'array'
              : typeof values[key] === 'boolean'
              ? 'bool'
              : 'string',
          })),
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

  console.log(`loading`, loading);
  console.log(`initialValues`, initialValues);

  return (
    <FormContainer data-cy="taxonomy-form" className="bootstrap">
      <Formik initialValues={initialValues} onSubmit={submit} innerRef={formRef}>
        {({ values, handleChange, handleSubmit, setFieldTouched, setFieldValue, isSubmitting }) => (
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
              {fieldsWithDefaultValues.map((rawField) =>
                generateFormField(rawField, handleChange, values, setFieldTouched, setFieldValue)
              )}
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </fieldset>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
});

function generateFormField(rawField, handleChange, formikValues, setFieldTouched, setFieldValue) {
  return (
    <div key={rawField.short_name} className="bootstrap">
      <Form.Label>
        {rawField.field_number ? rawField.field_number + '. ' : ''}
        {rawField.short_name}
      </Form.Label>
      {rawField.display_type === 'enum' &&
        rawField.permitted_values.length <= 5 &&
        rawField.permitted_values.map((v) => (
          <Form.Check
            key={v}
            type="radio"
            name={rawField.short_name}
            label={v}
            id={`${rawField.short_name}-${v}`}
            value={v}
            onChange={handleChange}
            checked={(formikValues[rawField.short_name] || []).includes(v)}
          />
        ))}
      {rawField.display_type === 'enum' && rawField.permitted_values.length > 5 && (
        <>
          <Form.Select
            as="select"
            id={rawField.short_name}
            name={rawField.short_name}
            type="select"
            onChange={handleChange}
            value={formikValues[rawField.short_name]}
          >
            <option>--</option>
            {rawField.permitted_values.map((v) => (
              /*<Form.Check
              key={v}
              type="radio"
              name={rawField.short_name}
              label={v}
              id={`${rawField.short_name}-${v}`}
              value={v}
              onChange={handleChange}
              checked={(formikValues[rawField.short_name] || []).includes(v)}
            />*/
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Form.Select>
        </>
      )}

      {rawField.display_type === 'string' && (
        <Form.Control
          id={rawField.short_name}
          name={rawField.short_name}
          type="text"
          onChange={handleChange}
          value={formikValues[rawField.short_name]}
        />
      )}

      {rawField.display_type === 'long_string' && (
        <Form.Control
          as="textarea"
          rows={3}
          id={rawField.short_name}
          name={rawField.short_name}
          type="text"
          onChange={handleChange}
          value={formikValues[rawField.short_name]}
        />
      )}

      {rawField.display_type === 'bool' && (
        <>
          <Form.Check
            key="yes"
            type="radio"
            name={rawField.short_name}
            label="yes"
            id={`${rawField.short_name}-yes`}
            value={true}
            onChange={handleChange}
            checked={formikValues[rawField.short_name]}
          />
          <Form.Check
            key="no"
            type="radio"
            name={rawField.short_name}
            label="no"
            id={`${rawField.short_name}-no`}
            value={false}
            onChange={handleChange}
            checked={formikValues[rawField.short_name]}
          />
        </>
      )}

      {/*rawField.display_type === 'bool' && (
        <Form.Control
          as="select"
          id={rawField.short_name}
          name={rawField.short_name}
          type="text"
          onChange={handleChange}
          value={formikValues[rawField.short_name]}
        >
          <option key={''} value={''}>
            {''}
          </option>
          <option key={'yes'} value={true}>
            {'Yes'}
          </option>
          <option key={'no'} value={false}>
            {'No'}
          </option>
        </Form.Control>
      )*/}

      {rawField.display_type == 'int' && (
        <Form.Control
          id={rawField.short_name}
          name={rawField.short_name}
          type="number"
          step={1}
          onChange={handleChange}
          value={formikValues[rawField.short_name]}
        />
      )}

      {rawField.display_type === 'date' && (
        <Form.Control
          id={rawField.short_name}
          name={rawField.short_name}
          type="date"
          onChange={handleChange}
          value={formikValues[rawField.short_name]}
        />
      )}

      {rawField.display_type === 'location' && (
        <Form.Control
          id={rawField.short_name}
          name={rawField.short_name}
          type="text"
          onChange={handleChange}
          value={formikValues[rawField.short_name]}
        />
      )}

      {rawField.display_type === 'list' && (
        <Tags
          id={`${rawField.short_name}-tags`}
          inputId={rawField.short_name}
          placeHolder="Type and press Enter to add an item"
          value={formikValues[rawField.short_name]}
          onChange={(value) => {
            setFieldTouched(rawField.short_name, true);
            setFieldValue(rawField.short_name, value);
          }}
        />
      )}

      {rawField.display_type === 'multi' && (
        <>
          {rawField.permitted_values.map((v) => (
            <Form.Check
              key={v}
              type="checkbox"
              name={rawField.short_name}
              label={v}
              id={`${rawField.short_name}-${v}`}
              value={v}
              onChange={handleChange}
              checked={(formikValues[rawField.short_name] || []).includes(v)}
            />
          ))}
        </>
      )}

      {
        // TODO: Make this work for multiple entities,
        // store values in parent field.
        rawField.display_type === 'object-list' &&
          rawField.subfields.map((subfield) => {
            console.log(`subfield`, subfield);
            const result = generateFormField(
              subfield,
              handleChange,
              formikValues,
              setFieldTouched,
              setFieldValue
            );

            console.log(`result`, result);
            return result;
          })
      }

      <Form.Text className="text-muted-gray mb-4 d-block">{rawField.short_description}</Form.Text>
    </div>
  );
}

export default TaxonomyForm;
