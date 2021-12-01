import React, { useState, useEffect } from 'react';
import { Row, OverlayTrigger, Tooltip, Button, Form, Card } from 'react-bootstrap';
import styled from 'styled-components';
import { useUserContext } from 'contexts/userContext';
import { useMongo } from 'hooks/useMongo';
import { Formik } from 'formik';
import Loader from 'components/Loader';
import config from '../../config.js';

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

const Value = styled.div`
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

const EditTaxonomyForm = ({
  namespace,
  incidentId,
  setIsEditing,
  setShowBanner,
  doneSubmittingCallback,
}) => {
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const { user } = useUserContext();

  const [initialValues, setInitialValues] = useState({});

  const [fieldsWithDefaultValues, setFieldsWithDefaultValues] = useState([]);

  const useRunTaxaQuery = () => {
    return new Promise((resolve, reject) => {
      const { runQuery } = useMongo();

      try {
        runQuery(
          {
            namespace,
          },
          (res) => {
            resolve(res);
          },
          config.realm.production_db.db_service,
          config.realm.production_db.db_name,
          'taxa'
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  const useRunClassificationsQuery = () => {
    return new Promise((resolve, reject) => {
      const { runQuery } = useMongo();

      try {
        runQuery(
          {
            // 'classifications.Publish': true,
            incident_id: incidentId,
            namespace,
          },
          (res) => {
            resolve(res);
          },
          config.realm.production_db.db_service,
          config.realm.production_db.db_name,
          'classifications'
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([useRunTaxaQuery(), useRunClassificationsQuery()])
      .then((results) => {
        const taxonomy = results[0][0];

        let classifications = {};

        if (results[1].length > 0) {
          classifications = results[1][0].classifications;
        }

        const fieldsArray = [];

        const defaultValues = {};

        taxonomy.field_list.forEach((taxaField) => {
          fieldsArray.push({
            display_type: taxaField.display_type,
            mongo_type: taxaField.mongo_type,
            permitted_values: taxaField.permitted_values,
            placeholder: taxaField.placeholder,
            required: taxaField.required,
            short_description: taxaField.short_description,
            short_name: taxaField.short_name.split(' ').join('_'),
          });

          let classificationValue = classifications[taxaField.short_name];

          if (classificationValue === undefined) {
            classificationValue = '';
          } else {
            if (taxaField.display_type === 'date') {
              classificationValue = classifications[taxaField.short_name].split('T')[0];
            }
          }

          defaultValues[taxaField.short_name.split(' ').join('_')] = classificationValue;
        });
        setFieldsWithDefaultValues(fieldsArray);

        setInitialValues(defaultValues);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching. Please try later.');
        setLoading(false);
      });
  }, []);

  const generateFormField = (rawField, handleChange, formikValues) => {
    const validateListField = (value) => {
      if (Array.isArray(value)) {
        return value.join(';');
      }

      return value.replace(',', ';');
    };

    return (
      <div key={rawField.short_name}>
        <Form.Label>{rawField.short_name.split('_').join(' ')}</Form.Label>
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
            name={rawField.short_name}
            type="text"
            onChange={handleChange}
            value={formikValues[rawField.short_name]}
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
          formikValues[rawField.short_name].length <= TEXTAREA_LIMIT && (
            <Form.Control
              id={rawField.short_name}
              name={rawField.short_name}
              type="text"
              onChange={handleChange}
              value={formikValues[rawField.short_name]}
            />
          )}

        {rawField.display_type === 'string' &&
          formikValues[rawField.short_name].length > TEXTAREA_LIMIT && (
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
          <Form.Control
            id={rawField.short_name}
            name={rawField.short_name}
            type="text"
            onChange={handleChange}
            value={validateListField(formikValues[rawField.short_name])}
          />
        )}

        {rawField.display_type === 'multi' && (
          <Form.Control
            as="select"
            multiple={true}
            id={rawField.short_name}
            name={rawField.short_name}
            type="text"
            onChange={handleChange}
            value={formikValues[rawField.short_name]}
          >
            {rawField.permitted_values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Form.Control>
        )}
        <Form.Text className={['text-muted', 'mb-4', 'd-block']}>
          {rawField.short_description}
        </Form.Text>
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
    let newValues = values;

    fieldsWithDefaultValues.forEach((f) => {
      //Convert string values into array
      if (f.display_type === 'list') {
        if (Array.isArray(values[f.short_name])) {
          newValues[f.short_name] = values[f.short_name]
            .map((f) => f.trim())
            .filter((f) => f !== '');
        } else {
          newValues[f.short_name] = values[f.short_name]
            .split(';')
            .map((f) => f.trim())
            .filter((f) => f !== '');
        }
      }
    });

    const newValuesNoUnderscore = {};

    for (const key in newValues) {
      newValuesNoUnderscore[key.split('_').join(' ')] = newValues[key];
    }

    if (JSON.stringify(initialValues) !== JSON.stringify(newValues)) {
      await user.functions.updateIncidentClassification({
        incident_id: incidentId,
        namespace,
        newClassifications: newValuesNoUnderscore,
      });

      setShowBanner(true);
    }

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
            <Form.Control
              id={'notes'}
              name={'notes'}
              type="text"
              as="textarea"
              rows={4}
              onChange={handleChange}
              value={values.notes}
            />
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

const TaxonomyForm = ({ taxonomy, incidentId, doneSubmittingCallback }) => {
  if (!taxonomy) {
    return null;
  }

  const { isAdmin } = useUserContext();

  const [showAllClassifications, setShowAllClassifications] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [showBanner, setShowBanner] = useState(false);

  const renderTooltip = (props, displayText) => (
    <Tooltip id="button-tooltip" {...props}>
      {displayText}
    </Tooltip>
  );

  if (!isAdmin && taxonomy.classificationsArray.length === 0) {
    return <></>;
  }

  return (
    <Row key={taxonomy.namespace} className="mb-4">
      <Container className="card ps-0 pe-0">
        <TaxaCardHeader className="card-header">
          <TaxaHeader>{`${taxonomy.namespace} Taxonomy Classifications`}</TaxaHeader>
          {isAdmin && (
            <>
              {isEditing ? (
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </>
          )}
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
                  {isAdmin && (
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
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm w-100"
                    onClick={() => setShowAllClassifications(!showAllClassifications)}
                  >
                    {`Show ${
                      showAllClassifications[taxonomy.namespace] ? 'Fewer' : 'All'
                    } Classifications`}
                  </button>
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
