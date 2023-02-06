import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import Markdown from 'react-markdown';
import TaxonomyForm from './TaxonomyForm';
import { Trans } from 'react-i18next';
import Card from 'elements/Card';
import Button from 'elements/Button';
import PopoverWrapper from 'elements/PopoverWrapper';

const renderTooltip = (props, displayText) => (
  <PopoverWrapper {...props}>
    <Popover.Body>{displayText}</Popover.Body>
  </PopoverWrapper>
);

const Taxonomy = ({
  taxonomy,
  incidentId,
  canEdit,
  taxonomyBeingEdited,
  setTaxonomyBeingEdited,
  id,
}) => {
  const [showAllClassifications, setShowAllClassifications] = useState(false);

  const [showBanner, setShowBanner] = useState(false);

  const handleSubmit = () => {
    setTaxonomyBeingEdited(null);
    setShowBanner(true);
  };

  const editing = taxonomyBeingEdited?.namespace == taxonomy?.namespace;

  const heavyClassifications = taxonomy.classificationsArray.filter((field) => field.weight >= 50);

  return (
    <Card id={id} key={taxonomy.namespace} className="mt-6" data-cy={taxonomy.namespace}>
      <div className="tw-taxa-card-header tw-card-header">
        <h4 className="pr-0.8">
          <Trans namespace={taxonomy.namespace}>
            {{ namespace: taxonomy.namespace }} Taxonomy Classifications
          </Trans>
        </h4>
        <>
          {editing ? (
            <Button onClick={() => setTaxonomyBeingEdited(null)}>Cancel</Button>
          ) : (
            canEdit && <Button onClick={() => setTaxonomyBeingEdited(taxonomy)}>Edit</Button>
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
        {!editing && (
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
                    <div className="tw-field bootstrap">
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 400 }}
                        overlay={(e) => renderTooltip(e, 'Admin notes')}
                      >
                        <p>{'Notes'}</p>
                      </OverlayTrigger>
                    </div>
                    <Markdown className="w-4/5">{taxonomy.notes}</Markdown>
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
                      <div className="tw-field bootstrap">
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 100, hide: 400 }}
                          overlay={(e) => renderTooltip(e, field.shortDescription)}
                        >
                          <p>{field.name}</p>
                        </OverlayTrigger>
                      </div>
                      <Markdown className="w-4/5">{field.value}</Markdown>
                    </div>
                  ))}
                {taxonomy.classificationsArray.length > heavyClassifications.length && (
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
                    <Card.Text className="last:mb-0">
                      <Trans>No classifications for this taxonomy.</Trans>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            )}
          </>
        )}
        <TaxonomyForm
          taxonomy={taxonomy}
          incidentId={incidentId}
          onSubmit={handleSubmit}
          active={editing}
        />
      </>
    </Card>
  );
};

export default Taxonomy;
