import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Markdown from 'react-markdown';
import TaxonomyForm from './TaxonomyForm';
import { Trans } from 'react-i18next';
import Card from '../../elements/Card';
import Button from '../../elements/Button';

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
      <div className="tw-taxa-card-header tw-card-header">
        <h4 className="tw-pr-0.8">
          <Trans namespace={taxonomy.namespace}>
            {{ namespace: taxonomy.namespace }} Taxonomy Classifications
          </Trans>
        </h4>
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
      </div>
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
                  <div key={'NOTES'} className="tw-classification-container tw-card-body">
                    <div className="tw-field">
                      <OverlayTrigger
                        placement="left"
                        delay={{ show: 100, hide: 400 }}
                        overlay={(e) => renderTooltip(e, 'Admin notes')}
                      >
                        <p>{'Notes'}</p>
                      </OverlayTrigger>
                    </div>
                    <Markdown className="tw-w-4/5">{taxonomy.notes}</Markdown>
                  </div>
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
                    <div key={field.name} className="tw-classification-container tw-card-body">
                      <div className="tw-field">
                        <OverlayTrigger
                          placement="left"
                          delay={{ show: 100, hide: 400 }}
                          overlay={(e) => renderTooltip(e, field.shortDescription)}
                        >
                          <p>{field.name}</p>
                        </OverlayTrigger>
                      </div>
                      <Markdown className="tw-w-4/5">{field.value}</Markdown>
                    </div>
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
                    <Card.Text className="last:tw-mb-0">
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
