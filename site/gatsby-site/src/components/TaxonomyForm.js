import React, { useState } from 'react';
import { Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styled from 'styled-components';

const ClassificationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

const TaxaCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

const TaxonomyForm = ({ taxonomy }) => {
  if (!taxonomy) {
    return null;
  }

  const [showAllClassifications, setShowAllClassifications] = useState(false);

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
          <a href={`/taxonomy/${taxonomy.namespace.toLowerCase()}`}>Taxonomy Details</a>
        </TaxaCardHeader>
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
          {`Show ${showAllClassifications[taxonomy.namespace] ? 'Fewer' : 'All'} Classifications`}
        </button>
      </Container>
    </Row>
  );
};

export default TaxonomyForm;
