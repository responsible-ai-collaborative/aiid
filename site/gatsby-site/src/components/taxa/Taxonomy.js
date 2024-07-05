import React, { useState } from 'react';
import Markdown from 'react-markdown';
import TaxonomyForm from './TaxonomyForm';
import { Trans } from 'react-i18next';
import Card from 'elements/Card';
import { Button, Tooltip } from 'flowbite-react';

const Taxonomy = ({ taxonomy, incidentId, reportNumber, canEdit, initialEditing = false, id }) => {
  const [showAllClassifications, setShowAllClassifications] = useState(false);

  const [showBanner, setShowBanner] = useState(false);

  const handleSubmit = () => {
    setShowBanner(true);
    setEditing(false);
  };

  const [editing, setEditing] = useState(initialEditing);

  const heavyClassifications = taxonomy.classificationsArray.filter((field) => field.weight >= 50);

  const topClassifications = [];

  const sortedClassificationsArray = taxonomy.classificationsArray.sort(
    (a, b) => a.weight - b.weight
  );

  let topClassificationsTextLength = 0;

  let maxLength = 0;

  for (const classification of sortedClassificationsArray) {
    const valueLength = String(classification.value).length;

    if (valueLength + topClassificationsTextLength < 50 || topClassifications.length == 0) {
      topClassificationsTextLength += valueLength;
      topClassifications.push(classification);
      maxLength = Math.max(maxLength, valueLength);
    } else {
      break;
    }
  }

  const hasLong = maxLength > 60;

  return (
    <Card
      id={id}
      key={taxonomy.namespace}
      className="mt-6"
      data-cy={`taxonomy-${taxonomy.namespace}`}
    >
      <div
        className={
          'tw-taxa-card-header tw-card-header bg-gray-50 ' + (editing && ' sticky top-0 z-50')
        }
      >
        <h4 id={`${taxonomy.namespace}-classifications`} className="pr-0.8">
          <Trans namespace={taxonomy.namespace}>
            {{ namespace: taxonomy.namespace }} Taxonomy Classifications
          </Trans>
        </h4>
        <>
          {editing ? (
            <Button size="xs" color={'gray'} onClick={() => setEditing(false)}>
              <Trans>Cancel</Trans>
            </Button>
          ) : (
            canEdit && (
              <Button size="xs" color={'gray'} onClick={() => setEditing(true)}>
                <Trans>Edit</Trans>
              </Button>
            )
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
              <div
                className={`
                grid
                ${
                  hasLong || showAllClassifications
                    ? 'grid-cols-[1fr_3fr]'
                    : 'lg:grid-cols-[repeat(4,_auto)]'
                }
              `}
              >
                {canEdit && (
                  <div key={'NOTES'} className="tw-classification-container">
                    <div className="tw-field">
                      <Tooltip content={'Admin notes'}>
                        <p>{'Notes'}</p>
                      </Tooltip>
                    </div>
                    <Markdown>{taxonomy.notes}</Markdown>
                  </div>
                )}
                {(showAllClassifications ? taxonomy.classificationsArray : topClassifications)
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
                    // <div key={field.name} className="tw-classification-container">
                    <>
                      <div className="tw-field border-1 border-gray-200 w-full pl-4 pr-2 bg-gray-50">
                        <Tooltip content={field.shortDescription}>
                          <p>
                            {field.name} {field.renderAs}
                          </p>
                        </Tooltip>
                      </div>
                      <Markdown className=" border-1 border-gray-200 pl-4 pr-2">
                        {field.value}
                      </Markdown>
                    </>
                    // </div>
                  ))}
                {taxonomy.classificationsArray.length > heavyClassifications.length && (
                  <button
                    type="button"
                    className={`btn btn-secondary btn-sm w-100 ${
                      hasLong || showAllClassifications ? 'col-span-2' : 'col-span-2 lg:col-span-4'
                    }`}
                    onClick={() => setShowAllClassifications(!showAllClassifications)}
                  >
                    Show {`${showAllClassifications ? 'Fewer' : 'All'}`} Classifications
                  </button>
                )}
              </div>
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
          reportNumber={reportNumber}
          onSubmit={handleSubmit}
          active={editing}
        />
      </>
    </Card>
  );
};

export default Taxonomy;
