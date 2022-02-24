import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { useMongo } from 'hooks/useMongo';
import { Formik } from 'formik';

import Loader from 'components/ui/Loader';
import config from '../../../config.js';

import { useMutation, useQuery } from '@apollo/client';
import {
  FIND_CSET_CLASSIFICATION,
  FIND_RESOURCE_CLASSIFICATION,
  UPDATE_CSET_CLASSIFICATION,
  UPDATE_RESOURCE_CLASSIFICATION,
} from '../../graphql/classifications.js';
import useToastContext, { SEVERITY } from 'hooks/useToast';

const UsageInfoSpan = styled.span`
  font-size: 0.8em;
  color: grey;
`;

const FormContainer = styled.div`
  padding: 1em;
`;

const TEXTAREA_LIMIT = 120;

const queryMap = {
  CSET: FIND_CSET_CLASSIFICATION,
  resources: FIND_RESOURCE_CLASSIFICATION,
};

const mutationMap = {
  CSET: UPDATE_CSET_CLASSIFICATION,
  resources: UPDATE_RESOURCE_CLASSIFICATION,
};

const getTaxaFieldKey = (key) => {
  key = key.split(' ').join('');

  switch (key) {
    case 'LevelofAutonomy':
      return 'LevelOfAutonomy';
    case 'NatureofEndUser':
      return 'NatureOfEndUser';
    case 'SectorofDeployment':
      return 'SectorOfDeployment';
    case 'RelevantAIfunctions':
      return 'RelevantAIFunctions';
    case 'DatasheetsforDatasets':
      return 'DatasheetsForDatasets';
  }
  return key;
};

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

  const { data: classificationsData } = useQuery(queryMap[namespace], {
    variables: { query: { incident_id: incidentId } },
  });

  const key = namespace === 'CSET' ? 'classifications' : namespace;

  const [updateClassification] = useMutation(mutationMap[namespace]);

  useEffect(() => {
    if (classificationsData && taxonomy) {
      const classification = classificationsData[key][0];

      const classifications = classification?.classifications || {};

      const notes = classification?.notes || '';

      const fieldsArray = [];

      const defaultValues = {};

      taxonomy.field_list.forEach((taxaField) => {
        const field = {
          display_type: taxaField.display_type,
          mongo_type: taxaField.mongo_type,
          permitted_values: taxaField.permitted_values,
          placeholder: taxaField.placeholder,
          required: taxaField.required,
          short_description: taxaField.short_description,
          short_name: taxaField.short_name,
          key: getTaxaFieldKey(taxaField.short_name),
        };

        fieldsArray.push(field);

        let classificationValue = classifications[field.key];

        if (classificationValue === undefined) {
          if (taxaField.display_type === 'multi') {
            classificationValue = [];
          } else {
            classificationValue = '';
          }
        } else {
          if (taxaField.display_type === 'date') {
            classificationValue = classifications[field.key].split('T')[0];
          }
        }

        defaultValues[field.key] = classificationValue;
      });

      setFieldsWithDefaultValues(fieldsArray);

      setInitialValues({
        ...defaultValues,
        notes,
      });
      setLoading(false);
    }
  }, [classificationsData, taxonomy]);

  const generateFormField = (rawField, handleChange, formikValues) => {
    const validateListField = (value) => {
      if (Array.isArray(value)) {
        return value.join(';');
      }

      return value.replace(',', ';');
    };

    return (
      <div key={rawField.key}>
        <Form.Label>{rawField.short_name}</Form.Label>
        {rawField.display_type === 'list' && (
          <UsageInfoSpan>{' (use semicolon for term separation)'}</UsageInfoSpan>
        )}
        {rawField.display_type === 'enum' && (
          <Form.Control
            as="select"
            id={rawField.short_name}
            name={rawField.key}
            type="text"
            onChange={handleChange}
            value={formikValues[rawField.key]}
          >
            <option key={''} value={''}>
              {''}
            </option>
            {rawField.permitted_values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Form.Control>
        )}

        {rawField.display_type === 'string' &&
          formikValues[rawField.key].length <= TEXTAREA_LIMIT && (
            <Form.Control
              id={rawField.short_name}
              name={rawField.key}
              type="text"
              onChange={handleChange}
              value={formikValues[rawField.key]}
            />
          )}

        {rawField.display_type === 'string' &&
          formikValues[rawField.key].length > TEXTAREA_LIMIT && (
            <Form.Control
              as="textarea"
              rows={3}
              id={rawField.short_name}
              name={rawField.key}
              type="text"
              onChange={handleChange}
              value={formikValues[rawField.key]}
            />
          )}

        {rawField.display_type === 'bool' && (
          <Form.Control
            as="select"
            id={rawField.key}
            name={rawField.key}
            type="text"
            onChange={handleChange}
            value={formikValues[rawField.key]}
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
        )}

        {rawField.display_type === 'date' && (
          <Form.Control
            id={rawField.key}
            name={rawField.key}
            type="date"
            onChange={handleChange}
            value={formikValues[rawField.key]}
          />
        )}

        {rawField.display_type === 'location' && (
          <Form.Control
            id={rawField.key}
            name={rawField.key}
            type="text"
            onChange={handleChange}
            value={formikValues[rawField.key]}
          />
        )}

        {rawField.display_type === 'list' && (
          <Form.Control
            id={rawField.key}
            name={rawField.key}
            type="text"
            onChange={handleChange}
            value={validateListField(formikValues[rawField.key])}
          />
        )}

        {rawField.display_type === 'multi' && (
          <>
            {rawField.permitted_values.map((v) => (
              <Form.Check
                key={v}
                type="checkbox"
                name={rawField.key}
                label={v}
                id={`${rawField.key}-${v}`}
                value={v}
                onChange={handleChange}
                checked={formikValues[rawField.key].includes(v)}
              />
            ))}
          </>
        )}
        <Form.Text className="text-muted mb-4 d-block">{rawField.short_description}</Form.Text>
      </div>
    );
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

  const submit = async (values, { setSubmitting }) => {
    const { notes, ...classifications } = values;

    fieldsWithDefaultValues.forEach((f) => {
      //Convert string values into array
      if (f.display_type === 'list') {
        if (Array.isArray(values[f.key])) {
          classifications[f.key] = values[f.key].map((f) => f.trim()).filter((f) => f !== '');
        } else {
          classifications[f.key] = values[f.key]
            .split(';')
            .map((f) => f.trim())
            .filter((f) => f !== '');
        }
      }

      //Convert string into boolean
      if (f.display_type === 'bool') {
        if (values[f.key] === '') {
          classifications[f.key] = undefined;
        } else if (values[f.key] === 'true') {
          classifications[f.key] = true;
        } else if (values[f.key] === 'false') {
          classifications[f.key] = false;
        }
      }
    });

    try {
      await updateClassification({
        variables: {
          query: {
            incident_id: incidentId,
          },
          data: {
            incident_id: incidentId,
            notes,
            namespace,
            classifications,
          },
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

  return (
    <FormContainer data-cy="taxonomy-form">
      <Formik initialValues={initialValues} onSubmit={submit} innerRef={formRef}>
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
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
                generateFormField(rawField, handleChange, values)
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

export default TaxonomyForm;
