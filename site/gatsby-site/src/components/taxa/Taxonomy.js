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

  const { hasLong, topClassifications } = getTopClassifications({ taxonomy });

  const singleColumn = hasLong || showAllClassifications;

  const colorSchemes = {
    blue: {
      textColor: 'text-blue-900',
      borderColor: 'border-blue-200',
      keyBackround: 'bg-blue-100',
      valueBackgroundEven: 'bg-[#f6faff]', // A little bit lighter than blue-50
      valueBackgroundOdd: 'bg-blue-50',
    },
    orange: {
      textColor: 'text-orange-800',
      borderColor: 'border-orange-200',
      keyBackround: 'bg-orange-100',
      valueBackgroundEven: 'bg-[#fffcf9]', // A little bit lighter than orange-50
      valueBackgroundOdd: 'bg-orange-50',
    },
    gray: {
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      keyBackround: 'bg-gray-100',
      valueBackgroundEven: 'bg-gray-50',
      valueBackgroundOdd: '',
    },
  };

  // Keeping them all gray for the time being
  // so we can merge and then bikeshed about the colors.
  const colorSchemesByTaxonomy = {
    GMF: 'gray',
    CSETv1: 'gray',
  };

  const colorScheme = colorSchemes[colorSchemesByTaxonomy[taxonomy.namespace]] || colorSchemes.gray;

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
                ${singleColumn ? 'grid-cols-[1fr_3fr]' : 'lg:grid-cols-[repeat(4,_auto)]'}
              `}
              >
                {['dummy-notes']
                  .concat(
                    (showAllClassifications
                      ? taxonomy.classificationsArray
                      : topClassifications.slice(canEdit ? 1 : 0)
                    )
                      .filter(
                        (field) => !(field.renderAs === 'description_toggle' && field.value == 'No')
                      )
                      .map((field) => {
                        if (field.renderAs === 'description_toggle') {
                          return { ...field, value: field.longDescription };
                        }

                        return field;
                      })
                  )
                  .filter((field) => canEdit || field !== 'dummy-notes')
                  .map((field, i) => {
                    const showNotes = field === 'dummy-notes';

                    const isFirst = singleColumn ? i == 0 : i < 2;

                    const isLast = singleColumn
                      ? i == topClassifications.length - 1
                      : i > topClassifications.length - 3;

                    const isEven = singleColumn ? i % 2 : i % 4 > 1;

                    return (
                      <>
                        <div
                          className={`
                          w-[20%] mr-4 ${colorScheme.textColor} font-bold
                          border-1 ${colorScheme.borderColor} w-full pl-4 pr-2 ${
                            colorScheme.keyBackround
                          } 
                          ${isFirst ? 'border-t-0' : ''} 
                          ${isLast ? 'border-b-0' : ''} 
                        `}
                        >
                          {showNotes ? (
                            <p>Notes</p>
                          ) : (
                            <Tooltip content={field.shortDescription}>
                              <p>
                                {field.name} {field.renderAs}
                              </p>
                            </Tooltip>
                          )}
                        </div>
                        <Markdown
                          className={`
                          border-1 ${colorScheme.borderColor} pl-4 pr-2
                          ${
                            isEven
                              ? colorScheme.valueBackgroundEven
                              : colorScheme.valueBackgroundOdd
                          }
                          ${isFirst ? 'border-t-0' : ''}
                          ${isLast ? 'border-b-0' : ''}
                        `}
                        >
                          {showNotes ? taxonomy.notes : field.value}
                        </Markdown>
                      </>
                    );
                  })}
                {taxonomy.classificationsArray.length > topClassifications.length && (
                  <button
                    type="button"
                    className={`btn btn-secondary btn-sm w-100 rounded-t-none ${
                      singleColumn ? 'col-span-2' : 'col-span-2 lg:col-span-4'
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

function getTopClassifications({ taxonomy }) {
  // We want to have a few attributes shown by default.
  // If they're all short, we show six of them in two columns.
  // If any of them are especially long,
  // then it doesn't look good in two columns
  // so we put in a single column and include at most four,
  // but possibly less if the total length is too long.
  const sortedClassificationsArray = taxonomy.classificationsArray.sort(
    (a, b) => a.weight - b.weight
  );

  let topClassifications = sortedClassificationsArray.slice(0, 6);

  const topClassificationsLengths = topClassifications.map((c) => String(c.value).length);

  const hasLong = Math.max(...topClassificationsLengths) > 140;

  if (hasLong) {
    let totalLength = 0;

    let i;

    for (i = 0; i < topClassificationsLengths.length; i++) {
      if ((totalLength += topClassificationsLengths[i] > 200 && i > 0)) {
        break;
      }
    }
    topClassifications = topClassifications.slice(0, Math.min(4, i));
  }

  return { hasLong, topClassifications };
}

export default Taxonomy;
