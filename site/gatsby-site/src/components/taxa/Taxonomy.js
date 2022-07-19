import React, { useState } from 'react';
import { OverlayTrigger, Tooltip, Button, Card } from 'react-bootstrap';
import styled from 'styled-components';
import Markdown from 'react-markdown';
import TaxonomyForm from './TaxonomyForm';
import { Trans } from 'react-i18next';

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

const Value = styled(Markdown)`
  width: 80%;
`;

const TaxaHeader = styled.h4`
  padding-right: 0.8em;
`;

const renderTooltip = (props, displayText) => (
  <Tooltip id="button-tooltip" {...props}>
    {displayText}
  </Tooltip>
);

const Taxonomy = ({ taxonomy, incidentId, canEdit }) => {
  const [showAllClassifications, setShowAllClassifications] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [showBanner, setShowBanner] = useState(false);

  const handleSubmit = () => {
    setIsEditing(false);
    setShowBanner(true);
  };

  return (
    <Card key={taxonomy.namespace} className="mt-4" data-cy={taxonomy.namespace}>
      <TaxaCardHeader className="card-header">
        <TaxaHeader>
          <Trans namespace={taxonomy.namespace}>
            {{ namespace: taxonomy.namespace }} Taxonomy Classifications
          </Trans>
        </TaxaHeader>
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
          <Trans>Taxonomy Details</Trans>
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
                      <Trans>Classifications will update in production within 24 hours.</Trans>
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
                  .filter(
                    (field) => !(field.renderAs === 'description_toggle' && field.value == 'No')
                  )
                  .map((field) => {
                    if (field.renderAs === 'description_toggle') {
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
                    <Card.Text>
                      <Trans>No classifications for this taxonomy.</Trans>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            )}
          </>
        ) : (
          <>
            <TaxonomyForm
              namespace={taxonomy.namespace}
              incidentId={incidentId}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </>
    </Card>
  );
};

export default Taxonomy;
