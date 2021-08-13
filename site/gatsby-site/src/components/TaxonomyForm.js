import React, { useState, useEffect } from 'react';
import { Row, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { useUserContext } from 'contexts/userContext';
import { useMongo } from 'hooks/useMongo';
import { useFormik } from 'formik';
import Loader from 'components/Loader';

const ClassificationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
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

const EditTaxonomyForm = ({ namespace }) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  // fetch latest taxonomy data
  // populate form fields
  // save new data
  const formik = useFormik({
    initialValues: {
      email: '',
      name: 'lkjlkj',
      today: '2018-07-22',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

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
          'mongodb-atlas',
          'aiidprod',
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
            'classifications.Publish': true,
            incident_id: 1,
          },
          (res) => {
            resolve(res);
          },
          'mongodb-atlas',
          'aiidprod',
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
        console.log(results);

        // Building the for structure
        // TODO: handle multiple taxonomies/classifications
        const taxonomy = results[0][0];
        // console.log(taxonomy)

        taxonomy.field_list.forEach((taxaField) => {
          console.log({
            display_type: taxaField.display_type,
            mongo_type: taxaField.mongo_type,
            permitted_values: taxaField.permitted_values,
            placeholder: taxaField.placeholder,
            required: taxaField.required,
            short_description: taxaField.short_description,
            short_name: taxaField.short_name,
          });
        });

        const classifications = results[1][0].classifications;

        console.log(classifications);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching. Please try later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader loading={loading} />;
  }

  if (error !== '') {
    return <span>{error}</span>;
  }

  return (
    <FormContainer>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <input
          id="today"
          name="today"
          type="date"
          onChange={formik.handleChange}
          value={formik.values.today}
        />
        <button type="submit">Submit</button>
      </form>
    </FormContainer>
  );
};

const TaxonomyForm = ({ taxonomy }) => {
  if (!taxonomy) {
    return null;
  }

  const { isAdmin } = useUserContext();

  const [showAllClassifications, setShowAllClassifications] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    setIsEditing(false);
  };

  const renderTooltip = (props, displayText) => (
    <Tooltip id="button-tooltip" {...props}>
      {displayText}
    </Tooltip>
  );

  return (
    <Row key={taxonomy.namespace} className="mb-4">
      <Container className="card">
        <TaxaCardHeader className="card-header">
          <h4>{`${taxonomy.namespace} Taxonomy Classifications`}</h4>
          {isAdmin && (
            <>
              {isEditing ? (
                <Button onClick={handleSubmit}>Save</Button>
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
              {taxonomy.classificationsArray &&
                taxonomy.classificationsArray
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
                className="btn btn-secondary btn-sm btn-block assignment-button"
                onClick={() => setShowAllClassifications(!showAllClassifications)}
              >
                {`Show ${
                  showAllClassifications[taxonomy.namespace] ? 'Fewer' : 'All'
                } Classifications`}
              </button>
            </>
          ) : (
            <>
              <EditTaxonomyForm namespace={taxonomy.namespace} />
            </>
          )}
        </>
      </Container>
    </Row>
  );
};

export default TaxonomyForm;
