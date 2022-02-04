import React, { useState, useEffect } from 'react';
import { Row, OverlayTrigger, Tooltip, Button, Form, Card } from 'react-bootstrap';
import styled from 'styled-components';
import { useUserContext } from 'contexts/userContext';
import { useMongo } from 'hooks/useMongo';
import { Formik } from 'formik';
import Loader from 'components/Loader';
import config from '../../config.js';
import { useMutation, useQuery } from '@apollo/client';
import {
  FIND_CSET_CLASSIFICATION,
  FIND_RESOURCE_CLASSIFICATION,
  UPDATE_CSET_CLASSIFICATION,
  UPDATE_RESOURCE_CLASSIFICATION,
} from '../graphql/classifications.js';
import Markdown from 'react-markdown';
import useToastContext, { SEVERITY } from 'hooks/useToast';

const ClassificationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

const UsageInfoSpan = styled.span`
  font-size: 0.8em;
  color: grey;
`;

const TaxaCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  p {
    margin: 0;
  }
`;

const Field = styled.div`
  width: 20%;
  border-right: 2.5px solid #d9deee;
  margin-right: 1em;
  color: grey;
  font-weight: 700;
`;

const Value = styled(Markdown)`
  width: 80%;
`;

const Container = styled.div`
  width: 100%;
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  h4 {
    margin: 0 !important;
  }
`;

const FormContainer = styled.div`
  padding: 1em;
`;

const TaxaHeader = styled.h4`
  padding-right: 0.8em;
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

const EditTaxonomyForm = ({
  namespace,
  incidentId,
  setIsEditing,
  setShowBanner,
  doneSubmittingCallback,
}) => {
  const [loading, setLoading] = useState(true);

  const [error] = useState('');

  const [initialValues, setInitialValues] = useState({});

  const [fieldsWithDefaultValues, setFieldsWithDefaultValues] = useState([]);

  const [taxonomy, setTaxonomy] = useState(null);

  const { runQuery } = useMongo();

  const addToast = useToastContext();

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
        {rawField.display_type === 'multi' && (
          <UsageInfoSpan>{" (use 'command' or 'ctrl' keys for multiple selections)"}</UsageInfoSpan>
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
          <Form.Control
            as="select"
            multiple={true}
            id={rawField.key}
            name={rawField.key}
            type="text"
            onChange={handleChange}
            value={formikValues[rawField.key]}
          >
            {rawField.permitted_values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Form.Control>
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

  const onSubmit = async (values, { setSubmitting }) => {
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

    setShowBanner(true);
    setIsEditing(false);
    setSubmitting(false);

    if (doneSubmittingCallback) {
      doneSubmittingCallback();
    }
  };

  return (
    <FormContainer>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({
          values,
          // errors,
          // touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
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
};

const TaxonomyForm = ({ taxonomy, incidentId, doneSubmittingCallback = null }) => {
  if (!taxonomy) {
    return null;
  }

  const { isRole } = useUserContext();

  const [showAllClassifications, setShowAllClassifications] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [showBanner, setShowBanner] = useState(false);

  const renderTooltip = (props, displayText) => (
    <Tooltip id="button-tooltip" {...props}>
      {displayText}
    </Tooltip>
  );

  const canEdit =
    isRole('taxonomy_editor') || isRole('taxonomy_editor_' + taxonomy.namespace.toLowerCase());

  return (
    <Row key={taxonomy.namespace} className="mb-4" data-cy="taxonomy-form">
      <Container className="card ps-0 pe-0">
        <TaxaCardHeader className="card-header">
          <TaxaHeader>{`${taxonomy.namespace} Taxonomy Classifications`}</TaxaHeader>
          <>
            {isEditing ? (
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            ) : (
              canEdit && <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </>
          <a
            style={{ order: 2, marginLeft: 'auto' }}
            href={`/taxonomy/${taxonomy.namespace.toLowerCase()}`}
          >
            Taxonomy Details
          </a>
        </TaxaCardHeader>
        <>
          {!isEditing ? (
            <>
              {showBanner && (
                <div style={{ padding: '0.5em' }}>
                  <Card bg="secondary" style={{ width: '100%' }} text="light" className="mb-2">
                    <Card.Body>
                      <Card.Text>
                        Classifications will update in production within 24 hours.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              )}
              {taxonomy.classificationsArray.length > 0 ? (
                <>
                  {canEdit && (
                    <ClassificationContainer key={'NOTES'} className="card-body">
                      <Field>
                        <OverlayTrigger
                          placement="left"
                          delay={{ show: 100, hide: 400 }}
                          overlay={(e) => renderTooltip(e, 'Admin notes')}
                        >
                          <p>{'Notes'}</p>
                        </OverlayTrigger>
                      </Field>
                      <Value>{taxonomy.notes}</Value>
                    </ClassificationContainer>
                  )}
                  {taxonomy.classificationsArray
                    .filter((field) => {
                      if (showAllClassifications) return true;
                      if (!showAllClassifications && field.weight >= 50) {
                        return true;
                      }
                      return false;
                    })
                    .filter((field) => {
                      if (field.name === 'Datasheets for Datasets' && field.value == 'No') {
                        return false;
                      }

                      return true;
                    })
                    .map((field) => {
                      if (field.name === 'Datasheets for Datasets') {
                        return { ...field, value: field.longDescription };
                      }

                      return field;
                    })
                    .map((field) => (
                      <ClassificationContainer key={field.name} className="card-body">
                        <Field>
                          <OverlayTrigger
                            placement="left"
                            delay={{ show: 100, hide: 400 }}
                            overlay={(e) => renderTooltip(e, field.shortDescription)}
                          >
                            <p>{field.name}</p>
                          </OverlayTrigger>
                        </Field>
                        <Value>{field.value}</Value>
                      </ClassificationContainer>
                    ))}
                  {taxonomy.classificationsArray.length > 2 && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm w-100"
                      onClick={() => setShowAllClassifications(!showAllClassifications)}
                    >
                      Show {`${showAllClassifications ? 'Fewer' : 'All'}`} Classifications
                    </button>
                  )}
                </>
              ) : (
                <div style={{ padding: '0.5em' }}>
                  <Card bg="secondary" style={{ width: '100%' }} text="light" className="mb-2">
                    <Card.Body>
                      <Card.Text>No classifications for this taxonomy.</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </>
          ) : (
            <>
              <EditTaxonomyForm
                namespace={taxonomy.namespace}
                incidentId={incidentId}
                setShowBanner={setShowBanner}
                setIsEditing={setIsEditing}
                doneSubmittingCallback={doneSubmittingCallback}
              />
            </>
          )}
        </>
      </Container>
    </Row>
  );
};

export default TaxonomyForm;
