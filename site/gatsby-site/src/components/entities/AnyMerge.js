import React, { useState } from 'react';
import { Spinner, Button, Card } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { FIND_ENTITIES, MERGE_ENTITIES } from '../../graphql/entities';
import { useQuery, useMutation } from '@apollo/client/react/hooks';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Typeahead } from 'react-bootstrap-typeahead';
import { ExternalLink } from 'react-feather';

export const SelectEntity = ({ id, entities, onChange, selected }) => {
  return (
    <Typeahead
      id={id}
      inputProps={{ id: `${id}-input` }}
      className="Typeahead"
      allowNew={false}
      multiple={false}
      labelKey={(option) => option.name}
      entities={entities}
      selected={selected}
      onChange={onChange}
      options={entities}
    />
  );
};

export default function AnyMerge() {
  const { t } = useTranslation('entities');

  const addToast = useToastContext();

  const keepSide = 'left';

  const { data: allEntitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const [mergeEntities, { loading: merging }] = useMutation(MERGE_ENTITIES);

  const [primary, setPrimary] = useState([]);

  const [secondary, setSecondary] = useState([]);

  const confirmMerge = async () => {
    const primaryId = primary[0]?.entity_id;

    const secondaryId = secondary[0]?.entity_id;

    const keepEntityInt = keepSide === 'left' ? 1 : 2;

    try {
      await mergeEntities({ variables: { primaryId, secondaryId, keepEntity: keepEntityInt } });
      addToast({ message: t('Merged successfully'), severity: SEVERITY.success });
    } catch (error) {
      addToast({ message: t('Error merging entities'), severity: SEVERITY.danger, error });
    }
  };

  const primaryEntityName = primary[0]?.name;

  const secondaryEntityName = secondary[0]?.name;

  const primaryId = primary[0]?.entity_id;

  const secondaryId = secondary[0]?.entity_id;

  const keptEntityName = keepSide === 'left' ? primaryEntityName : secondaryEntityName;

  const deletedEntityName = keepSide === 'left' ? secondaryEntityName : primaryEntityName;

  const handlePrimaryChange = (selected) => {
    setPrimary(selected);
  };

  const handleSecondaryChange = (selected) => {
    setSecondary(selected);
  };

  const handleMergeClick = () => {
    const message = t(
      'Are you sure you want to merge entity "{{deleted}}" into "{{kept}}"? \n\n This operation is not reversible.',
      { deleted: deletedEntityName, kept: keptEntityName }
    );

    if (window.confirm(message)) {
      confirmMerge();
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-0">
        <Trans ns="entities">Merge Any Two Entities</Trans>
      </h2>
      <p className="text-sm text-gray-600 mb-0 mt-0">
        {t(
          'Select two entities to merge. All references to the deleted entity will be updated to use the kept entity.'
        )}
      </p>
      {loadingEntities ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="entity1" className="block mb-1">
                <Trans ns="entities">Primary Entity (Kept)</Trans>
              </label>
              <SelectEntity
                id={'entity1'}
                selected={primary}
                entities={allEntitiesData.entities}
                onChange={handlePrimaryChange}
                placeHolder={t('Select primary entity')}
              />
              {primary.length > 0 && (
                <a
                  href={`/entities/${primary[0].entity_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block text-sm text-blue-600 hover:underline flex items-center"
                >
                  {`/entities/${primary[0].entity_id}`}
                  <ExternalLink className="ml-1" size={14} />
                </a>
              )}
            </div>
            <div>
              <label htmlFor="entity2" className="block mb-1">
                <Trans ns="entities">Secondary Entity (Deleted)</Trans>
              </label>
              <SelectEntity
                id={'entity2'}
                selected={secondary}
                entities={allEntitiesData.entities}
                onChange={handleSecondaryChange}
                placeHolder={t('Select secondary entity')}
              />
              {secondary.length > 0 && (
                <a
                  href={`/entities/${secondary[0].entity_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block text-sm text-blue-600 hover:underline flex items-center"
                >
                  {`/entities/${secondary[0].entity_id}`}
                  <ExternalLink className="ml-1" size={14} />
                </a>
              )}
            </div>
          </div>
          {primary.length > 0 && secondary.length > 0 && (
            <p className="font-medium text-red-600 mt-0">
              {t(
                'Warning: This will delete entity “{{deleted}}” and update all references to use “{{kept}}”.',
                { deleted: deletedEntityName, kept: keptEntityName }
              )}
            </p>
          )}
          <div className="flex space-x-2">
            <Button onClick={handleMergeClick} disabled={!primaryId || !secondaryId || merging}>
              {merging ? <Spinner size="sm" /> : <Trans ns="entities">Merge</Trans>}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
